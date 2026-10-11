"use client";

export default function CustomerError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-xl font-semibold">Something went wrong.</h1>
      <p className="mt-2 max-w-md text-sm text-stone">
        Please try again, or contact us on WhatsApp if the problem continues.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-card bg-mahogany px-5 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark"
      >
        Try again
      </button>
    </div>
  );
}
