import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
      <p className="font-display text-2xl font-semibold text-mahogany">DatesCrunch</p>
      <h1 className="mt-4 text-xl font-semibold text-coffee">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-stone">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-card bg-mahogany px-5 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark"
      >
        Back to home
      </Link>
    </div>
  );
}
