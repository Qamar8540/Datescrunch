"use client";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-lg font-semibold text-coffee">Something went wrong.</h1>
      <p className="mt-2 max-w-sm text-sm text-stone">
        Please try again. If this keeps happening, check your Supabase
        connection and environment variables.
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
