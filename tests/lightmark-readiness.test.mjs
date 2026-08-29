import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import nextConfig from "../next.config.mjs";

test("enforces the production security headers", async () => {
  const rules = await nextConfig.headers();
  const headers = Object.fromEntries(
    rules.flatMap((rule) => rule.headers).map(({ key, value }) => [key, value]),
  );

  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.match(headers["Content-Security-Policy"], /default-src 'self'/);
  assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
  assert.match(headers["Content-Security-Policy"], /object-src 'none'/);
  assert.doesNotMatch(headers["Content-Security-Policy"], /(?:^|\s)\*(?:\s|;|$)/);
});

test("keeps the public member shell cacheable and truthful", async () => {
  const page = await readFile(new URL("../app/members/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(page, /force-dynamic/);
  assert.match(page, /export const revalidate = 60/);
  assert.match(page, /free to use during its anonymous beta/);
  assert.match(page, /There is no paid\s+plan or trial/);
  assert.match(page, /operated by Adam Pang/);
});

test("publishes linked trust and agent guidance routes", async () => {
  const [layout, about, contact, privacy, llms] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/contact/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
  ]);

  for (const href of ["/about", "/contact", "/privacy"]) {
    assert.match(layout, new RegExp(`href=["']${href}["']`));
  }
  for (const page of [about, contact, privacy]) {
    assert.match(page, /operat(?:ed|or)/i);
  }
  for (const fact of ["Adam Pang", "Anthropic", "Postgres", "privacy"]) {
    assert.match(`${privacy}\n${llms}`, new RegExp(fact, "i"));
  }
  assert.ok(llms.length > 20);
});
