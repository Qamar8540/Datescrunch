export default function LoadingProducts() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="h-8 w-48 animate-pulse rounded bg-sand" />
      <div className="mt-4 h-10 w-full max-w-xs animate-pulse rounded bg-sand" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-card border border-sand">
            <div className="aspect-square animate-pulse bg-sand/60" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-3/4 animate-pulse rounded bg-sand" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-sand" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
