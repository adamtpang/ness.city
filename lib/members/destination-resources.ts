/**
 * Community-built resources for specific "Where next" destinations. "Where
 * next" answers who's going; this answers how to actually get there. When
 * someone's destination matches, the Next tab links out to the resource,
 * credited to whoever built it. Never embedded or reproduced, always a link.
 *
 * To add one: a destination match (case-insensitive substring/regex against
 * the free-text destination people type in), a label, the live URL, and who
 * built it. Keep the match narrow enough that it doesn't false-positive on
 * unrelated text.
 */
export type DestinationResource = {
  match: RegExp;
  label: string;
  url: string;
  credit: string;
};

export const DESTINATION_RESOURCES: DestinationResource[] = [
  {
    match: /kazakh|\bastana\b|\bborovoe\b|\bkz\b/i,
    label: "KZ Move Guide",
    url: "https://kzmoveguide.netlify.app/",
    credit: "built by Megana",
  },
];

/** First matching resource for a destination label, if any. */
export function resourceForDestination(destinationLabel: string): DestinationResource | null {
  return DESTINATION_RESOURCES.find((r) => r.match.test(destinationLabel)) ?? null;
}
