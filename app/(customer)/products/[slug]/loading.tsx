export default function LoadingProduct() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-card bg-sand/60" />
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-sand" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-sand" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-sand" />
          <div className="h-24 w-full animate-pulse rounded bg-sand" />
        </div>
      </div>
    </div>
  );
}
