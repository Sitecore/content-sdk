/**
 * Next.js instrumentation hook — runs once when the server process starts.
 *
 * Splits on runtime: Node.js-specific startup code (Tailwind compiler registration)
 * lives in `instrumentation-node.ts` so that Turbopack does not attempt to trace
 * Node.js built-ins (`path`, `fs`, `@tailwindcss/node`) for the Edge runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node');
  }
}
