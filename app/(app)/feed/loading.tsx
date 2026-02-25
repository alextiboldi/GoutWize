export default function FeedLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Greeting skeleton */}
      <div className="pt-2">
        <div className="h-8 w-36 bg-gw-bg-mid rounded-lg" />
      </div>

      {/* Check-in card skeleton */}
      <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gw-bg-mid rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-gw-bg-mid rounded" />
          <div className="h-3 w-56 bg-gw-bg-mid rounded" />
        </div>
      </div>

      {/* Insight card skeleton */}
      <div className="bg-white rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-gw-bg-mid rounded shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full bg-gw-bg-mid rounded" />
          <div className="h-3 w-24 bg-gw-bg-mid rounded" />
        </div>
      </div>

      {/* Discussions header skeleton */}
      <div className="h-6 w-28 bg-gw-bg-mid rounded-lg" />

      {/* Post card skeletons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
          <div className="h-4 w-24 bg-gw-bg-mid rounded-full" />
          <div className="h-5 w-3/4 bg-gw-bg-mid rounded" />
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-gw-bg-mid rounded" />
            <div className="h-3 w-2/3 bg-gw-bg-mid rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-20 bg-gw-bg-mid rounded" />
            <div className="h-3 w-12 bg-gw-bg-mid rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
