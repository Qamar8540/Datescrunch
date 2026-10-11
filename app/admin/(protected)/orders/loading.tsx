export default function LoadingOrders() {
  return (
    <div>
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-sand" />
      <div className="mb-4 h-10 w-full max-w-xl animate-pulse rounded bg-sand" />
      <div className="space-y-2 rounded-card border border-sand bg-white p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-full animate-pulse rounded bg-sand/60" />
        ))}
      </div>
    </div>
  );
}
