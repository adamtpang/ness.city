/**
 * lib/exam-deck.ts
 *
 * Community-made flashcard deck for the Network School Exam's PUBLISHED
 * topic list (source: https://ns.com/exam). Every card is a standard,
 * verifiable textbook fact for the published topics. These are NOT real
 * or leaked exam questions: nobody outside NS has those. Unaffiliated
 * with Network School.
 */

export type Card = {
  id: string;
  front: string;
  back: string;
};

export type Topic = {
  slug: string;
  name: string;
  scope: string;
  schaums: string;
  cards: Card[];
};

export const TOPICS: Topic[] = [
  {
    slug: "systems",
    name: "Systems",
    scope: "Operating systems, caches, memory",
    schaums: "Schaum's Outline of Computer Architecture",
    cards: [
      {
        id: "sys-1",
        front: "What does a CPU cache exploit to speed up memory access?",
        back: "Locality of reference: temporal (recently used data is reused) and spatial (nearby data is used next).",
      },
      {
        id: "sys-2",
        front: "Order the memory hierarchy from fastest to slowest.",
        back: "Registers, cache (L1/L2/L3), main memory (RAM), disk/SSD.",
      },
      {
        id: "sys-3",
        front: "What is virtual memory?",
        back: "An abstraction that gives each process its own address space by mapping virtual addresses to physical ones, using disk to extend RAM.",
      },
      {
        id: "sys-4",
        front: "What is a page fault?",
        back: "An access to a virtual page not currently in physical memory; the OS must load the page from disk before the program continues.",
      },
      {
        id: "sys-5",
        front: "What is the TLB?",
        back: "The Translation Lookaside Buffer: a small hardware cache of recent virtual-to-physical address translations.",
      },
      {
        id: "sys-6",
        front: "What is the difference between a process and a thread?",
        back: "A process has its own address space; threads within a process share that address space but have their own stacks and registers.",
      },
      {
        id: "sys-7",
        front: "What is a context switch?",
        back: "Saving the state of one process or thread and restoring another's so the CPU can switch between them.",
      },
      {
        id: "sys-8",
        front: "What is a deadlock?",
        back: "A set of processes each waiting for a resource held by another in the set, so none can ever proceed.",
      },
      {
        id: "sys-9",
        front: "Name the four necessary conditions for deadlock (Coffman conditions).",
        back: "Mutual exclusion, hold and wait, no preemption, circular wait.",
      },
      {
        id: "sys-10",
        front: "Write-through vs write-back cache: what is the difference?",
        back: "Write-through updates main memory on every write; write-back updates memory only when the modified block is evicted.",
      },
      {
        id: "sys-11",
        front: "What are the three classic categories of cache miss (the 3 Cs)?",
        back: "Compulsory (first access), capacity (cache too small), conflict (blocks map to the same set).",
      },
      {
        id: "sys-12",
        front: "What does a mutex guarantee?",
        back: "Mutual exclusion: at most one thread executes the protected critical section at a time.",
      },
      {
        id: "sys-13",
        front: "What is DMA (Direct Memory Access)?",
        back: "Hardware that transfers data between devices and memory without the CPU handling each byte, freeing the CPU during I/O.",
      },
      {
        id: "sys-14",
        front: "What is an interrupt?",
        back: "A signal to the CPU that an event needs attention; the CPU suspends current work and runs an interrupt handler.",
      },
    ],
  },
  {
    slug: "dsa",
    name: "Data Structures and Algorithms",
    scope: "Core structures, complexity, classic algorithms",
    schaums: "Schaum's Outline of Data Structures with C++",
    cards: [
      {
        id: "dsa-1",
        front: "Time complexity of binary search?",
        back: "O(log n), and it requires the array to be sorted.",
      },
      {
        id: "dsa-2",
        front: "Average and worst-case lookup time in a hash table?",
        back: "O(1) average, O(n) worst case (when many keys collide).",
      },
      {
        id: "dsa-3",
        front: "Stack vs queue: what orders do they serve elements in?",
        back: "Stack is LIFO (last in, first out); queue is FIFO (first in, first out).",
      },
      {
        id: "dsa-4",
        front: "What does an in-order traversal of a binary search tree produce?",
        back: "The keys in sorted (ascending) order.",
      },
      {
        id: "dsa-5",
        front: "Quicksort: average and worst-case time complexity?",
        back: "Average O(n log n); worst case O(n squared), for example on already-sorted input with a bad pivot choice.",
      },
      {
        id: "dsa-6",
        front: "Mergesort: worst-case time, stability, and extra space?",
        back: "O(n log n) worst case, stable, and uses O(n) extra space in the standard array version.",
      },
      {
        id: "dsa-7",
        front: "What is a binary heap and what do insert and extract-min cost?",
        back: "A complete binary tree satisfying the heap property; both insert and extract-min (or max) run in O(log n).",
      },
      {
        id: "dsa-8",
        front: "Array vs linked list: what is each one's key advantage?",
        back: "Array: O(1) random access by index. Linked list: O(1) insertion or deletion at a known node, no shifting.",
      },
      {
        id: "dsa-9",
        front: "Which data structure drives BFS, and which drives DFS?",
        back: "BFS uses a queue; DFS uses a stack (explicitly, or implicitly via recursion).",
      },
      {
        id: "dsa-10",
        front: "What restriction on edge weights does Dijkstra's algorithm require?",
        back: "All edge weights must be non-negative.",
      },
      {
        id: "dsa-11",
        front: "What is the lower bound for comparison-based sorting?",
        back: "Omega(n log n) comparisons in the worst case.",
      },
      {
        id: "dsa-12",
        front: "What does f(n) = O(g(n)) mean?",
        back: "For large enough n, f(n) is at most a constant multiple of g(n): f grows no faster than g up to a constant factor.",
      },
      {
        id: "dsa-13",
        front: "What is dynamic programming?",
        back: "Solving a problem by combining solutions to overlapping subproblems, storing each subproblem's answer so it is computed once.",
      },
      {
        id: "dsa-14",
        front: "Which structure gives O(log n) search, insert, delete, AND ordered iteration?",
        back: "A balanced binary search tree, such as an AVL tree or a red-black tree.",
      },
    ],
  },
  {
    slug: "linear-algebra",
    name: "Linear Algebra",
    scope: "Vectors and matrices",
    schaums: "Schaum's Outline of Linear Algebra",
    cards: [
      {
        id: "la-1",
        front: "What is the dot product of two orthogonal vectors?",
        back: "Zero.",
      },
      {
        id: "la-2",
        front: "When is the matrix product AB defined?",
        back: "When the number of columns of A equals the number of rows of B.",
      },
      {
        id: "la-3",
        front: "What is the identity matrix and what does it do in multiplication?",
        back: "Ones on the diagonal, zeros elsewhere; AI = IA = A for any compatible A.",
      },
      {
        id: "la-4",
        front: "What does determinant equal to zero tell you about a square matrix?",
        back: "The matrix is singular: it has no inverse, and its rows (and columns) are linearly dependent.",
      },
      {
        id: "la-5",
        front: "What is the rank of a matrix?",
        back: "The number of linearly independent rows, which always equals the number of linearly independent columns.",
      },
      {
        id: "la-6",
        front: "Define eigenvector and eigenvalue.",
        back: "A nonzero vector v with Av = lambda v: multiplying by A only scales v, and the scale factor lambda is the eigenvalue.",
      },
      {
        id: "la-7",
        front: "What is the transpose of a product, (AB) transpose?",
        back: "B transpose times A transpose: the order reverses.",
      },
      {
        id: "la-8",
        front: "When does a square matrix have an inverse, and what is (AB) inverse?",
        back: "It has an inverse exactly when its determinant is nonzero; (AB) inverse = B inverse times A inverse.",
      },
      {
        id: "la-9",
        front: "Geometric formula for the dot product of a and b?",
        back: "The product of their magnitudes times the cosine of the angle between them.",
      },
      {
        id: "la-10",
        front: "What is the span of a set of vectors?",
        back: "The set of all linear combinations of those vectors.",
      },
      {
        id: "la-11",
        front: "Determinant of the 2x2 matrix with rows (a, b) and (c, d)?",
        back: "ad minus bc.",
      },
      {
        id: "la-12",
        front: "What does the cross product of two 3D vectors give you?",
        back: "A vector perpendicular to both, with magnitude equal to the product of their magnitudes times the sine of the angle between them.",
      },
      {
        id: "la-13",
        front: "What is the trace of a square matrix, and what does it equal?",
        back: "The sum of the diagonal entries; it equals the sum of the eigenvalues.",
      },
    ],
  },
  {
    slug: "probability-statistics",
    name: "Probability and Statistics",
    scope: "Probability rules, distributions, descriptive stats",
    schaums: "Schaum's Outline: Probability and Statistics",
    cards: [
      {
        id: "ps-1",
        front: "Formula for P(A or B) for any two events?",
        back: "P(A) + P(B) minus P(A and B).",
      },
      {
        id: "ps-2",
        front: "When are two events independent, in terms of probabilities?",
        back: "When P(A and B) = P(A) times P(B).",
      },
      {
        id: "ps-3",
        front: "State Bayes' theorem.",
        back: "P(A given B) = P(B given A) times P(A), divided by P(B).",
      },
      {
        id: "ps-4",
        front: "Expected value of one roll of a fair six-sided die?",
        back: "3.5 (the average of 1 through 6).",
      },
      {
        id: "ps-5",
        front: "Define variance and standard deviation.",
        back: "Variance is the expected squared deviation from the mean, E[(X minus mu) squared]; standard deviation is its square root.",
      },
      {
        id: "ps-6",
        front: "Binomial(n, p): what does it model, and what are its mean and variance?",
        back: "The number of successes in n independent trials with success probability p; mean np, variance np(1 minus p).",
      },
      {
        id: "ps-7",
        front: "What does the law of large numbers say?",
        back: "As the number of independent trials grows, the sample mean converges to the true expected value.",
      },
      {
        id: "ps-8",
        front: "What does the central limit theorem say?",
        back: "The sum (or mean) of many independent, identically distributed variables with finite variance is approximately normally distributed.",
      },
      {
        id: "ps-9",
        front: "Shortcut for P(at least one success)?",
        back: "1 minus P(no successes).",
      },
      {
        id: "ps-10",
        front: "Formulas for permutations nPr and combinations nCr?",
        back: "nPr = n! / (n minus r)!; nCr = n! / (r! times (n minus r)!). Order matters for permutations only.",
      },
      {
        id: "ps-11",
        front: "Definition of conditional probability P(A given B)?",
        back: "P(A and B) divided by P(B), for P(B) greater than 0.",
      },
      {
        id: "ps-12",
        front: "Mean vs median: which is robust to outliers, and why?",
        back: "The median: it is the middle value by position, so a few extreme values shift it far less than the mean.",
      },
      {
        id: "ps-13",
        front: "Mean of the uniform distribution on the interval from a to b?",
        back: "(a + b) / 2.",
      },
    ],
  },
  {
    slug: "discrete-math",
    name: "Discrete Math",
    scope: "Permutations, graph theory, modular arithmetic",
    schaums: "Schaum's Outline of Discrete Mathematics",
    cards: [
      {
        id: "dm-1",
        front: "How many ways can n distinct objects be arranged in a row?",
        back: "n factorial (n!).",
      },
      {
        id: "dm-2",
        front: "How many subsets does a set with n elements have?",
        back: "2 to the power n (including the empty set and the set itself).",
      },
      {
        id: "dm-3",
        front: "Handshaking lemma: what does the sum of all vertex degrees equal?",
        back: "Twice the number of edges.",
      },
      {
        id: "dm-4",
        front: "Define a tree in graph theory. How many edges does one with n vertices have?",
        back: "A connected acyclic graph; it has exactly n minus 1 edges.",
      },
      {
        id: "dm-5",
        front: "What does a is congruent to b (mod m) mean?",
        back: "m divides a minus b: a and b leave the same remainder on division by m.",
      },
      {
        id: "dm-6",
        front: "State Fermat's little theorem.",
        back: "If p is prime and a is not divisible by p, then a to the power (p minus 1) is congruent to 1 mod p.",
      },
      {
        id: "dm-7",
        front: "State the pigeonhole principle.",
        back: "If more than n items are placed into n boxes, at least one box contains two or more items.",
      },
      {
        id: "dm-8",
        front: "When does a connected graph have an Euler circuit?",
        back: "Exactly when every vertex has even degree.",
      },
      {
        id: "dm-9",
        front: "How many edges does the complete graph on n vertices have?",
        back: "n times (n minus 1), divided by 2.",
      },
      {
        id: "dm-10",
        front: "What is the contrapositive of 'if P then Q', and is it equivalent?",
        back: "'If not Q then not P', and yes, it is logically equivalent to the original.",
      },
      {
        id: "dm-11",
        front: "State De Morgan's laws.",
        back: "not(A and B) = (not A) or (not B); not(A or B) = (not A) and (not B).",
      },
      {
        id: "dm-12",
        front: "What is a bipartite graph, and which cycles can it never contain?",
        back: "A graph whose vertices split into two sets with edges only between the sets; it contains no odd-length cycles.",
      },
      {
        id: "dm-13",
        front: "What is the key step of Euclid's algorithm for gcd(a, b)?",
        back: "gcd(a, b) = gcd(b, a mod b), repeated until the remainder is 0.",
      },
      {
        id: "dm-14",
        front: "Closed form for 1 + 2 + ... + n?",
        back: "n times (n plus 1), divided by 2.",
      },
    ],
  },
  {
    slug: "calculus",
    name: "Calculus",
    scope: "Limits, derivatives, integrals",
    schaums: "Schaum's Outline of Calculus",
    cards: [
      {
        id: "calc-1",
        front: "What is a derivative, geometrically?",
        back: "The slope of the tangent line to the curve at a point.",
      },
      {
        id: "calc-2",
        front: "Power rule: derivative of x to the n?",
        back: "n times x to the (n minus 1).",
      },
      {
        id: "calc-3",
        front: "Derivatives of sin x and cos x?",
        back: "d/dx sin x = cos x; d/dx cos x = negative sin x.",
      },
      {
        id: "calc-4",
        front: "State the product rule.",
        back: "(fg)' = f'g + fg'.",
      },
      {
        id: "calc-5",
        front: "State the chain rule.",
        back: "The derivative of f(g(x)) is f'(g(x)) times g'(x).",
      },
      {
        id: "calc-6",
        front: "State the fundamental theorem of calculus (evaluation form).",
        back: "The integral of f from a to b equals F(b) minus F(a), where F is any antiderivative of f.",
      },
      {
        id: "calc-7",
        front: "What does a definite integral represent geometrically?",
        back: "The signed area between the curve and the x-axis over the interval.",
      },
      {
        id: "calc-8",
        front: "What is the limit of sin(x)/x as x approaches 0?",
        back: "1.",
      },
      {
        id: "calc-9",
        front: "Derivatives of e to the x and of ln x?",
        back: "d/dx of e to the x is e to the x; d/dx of ln x is 1/x (for x greater than 0).",
      },
      {
        id: "calc-10",
        front: "What is a critical point, and what does the second derivative test say?",
        back: "A point where f' is zero or undefined; if f' is 0 there and f'' is positive it is a local minimum, if f'' is negative a local maximum.",
      },
      {
        id: "calc-11",
        front: "Antiderivative of x to the n (n not equal to negative 1)?",
        back: "x to the (n plus 1), divided by (n plus 1), plus a constant C.",
      },
      {
        id: "calc-12",
        front: "What does L'Hopital's rule let you do?",
        back: "For limits of the form 0/0 or infinity/infinity, replace the limit of f/g with the limit of f'/g' (when the latter exists).",
      },
      {
        id: "calc-13",
        front: "State the quotient rule.",
        back: "(f/g)' = (f'g minus fg') divided by g squared.",
      },
      {
        id: "calc-14",
        front: "What does the sign of the second derivative tell you about a curve?",
        back: "Concavity: f'' positive means concave up, f'' negative means concave down.",
      },
    ],
  },
  {
    slug: "algebra",
    name: "Algebra",
    scope: "Basic algebra and equations",
    schaums: "Schaum's Outline of College Algebra",
    cards: [
      {
        id: "alg-1",
        front: "State the quadratic formula.",
        back: "x = (negative b, plus or minus the square root of (b squared minus 4ac)), all divided by 2a.",
      },
      {
        id: "alg-2",
        front: "What does the discriminant b squared minus 4ac tell you?",
        back: "Positive: two distinct real roots. Zero: one repeated real root. Negative: no real roots (two complex conjugates).",
      },
      {
        id: "alg-3",
        front: "Exponent laws: x^a times x^b, and (x^a)^b?",
        back: "x^a times x^b = x^(a+b); (x^a)^b = x^(ab).",
      },
      {
        id: "alg-4",
        front: "Logarithm laws for log(ab) and log(a^b)?",
        back: "log(ab) = log a + log b; log(a^b) = b times log a.",
      },
      {
        id: "alg-5",
        front: "Factor a squared minus b squared.",
        back: "(a minus b)(a plus b): the difference of squares.",
      },
      {
        id: "alg-6",
        front: "Slope of the line through (x1, y1) and (x2, y2)?",
        back: "(y2 minus y1) divided by (x2 minus x1).",
      },
      {
        id: "alg-7",
        front: "Factor x squared plus 5x plus 6.",
        back: "(x plus 2)(x plus 3).",
      },
      {
        id: "alg-8",
        front: "Solve the inequality: absolute value of x less than a (for positive a).",
        back: "Negative a less than x less than a.",
      },
      {
        id: "alg-9",
        front: "Sum of an infinite geometric series with first term a and ratio r, absolute value of r less than 1?",
        back: "a divided by (1 minus r).",
      },
      {
        id: "alg-10",
        front: "x-coordinate of the vertex of y = ax squared + bx + c?",
        back: "Negative b divided by 2a.",
      },
      {
        id: "alg-11",
        front: "Expand (a + b) squared.",
        back: "a squared plus 2ab plus b squared.",
      },
      {
        id: "alg-12",
        front: "Definition of the logarithm: log base b of x equals y means what?",
        back: "b to the power y equals x.",
      },
      {
        id: "alg-13",
        front: "For x squared + bx + c = 0, what are the sum and product of the roots?",
        back: "Sum = negative b, product = c (Vieta's formulas).",
      },
      {
        id: "alg-14",
        front: "Sum of an arithmetic series with n terms?",
        back: "n divided by 2, times (first term plus last term).",
      },
    ],
  },
];

export const TOTAL_CARDS = TOPICS.reduce((n, t) => n + t.cards.length, 0);
