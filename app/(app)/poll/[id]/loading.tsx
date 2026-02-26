export default function PollDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 w-14 bg-gw-bg-mid rounded mt-2 mb-4" />

      {/* Poll skeleton */}
      <div className="bg-white rounded-2xl p-5 space-y-3">
        <div className="h-5 w-16 bg-gw-bg-mid rounded-full" />
        <div className="h-6 w-3/4 bg-gw-bg-mid rounded" />
        <div className="space-y-2 pt-2">
          <div className="h-11 w-full bg-gw-bg-mid rounded-xl" />
          <div className="h-11 w-full bg-gw-bg-mid rounded-xl" />
          <div className="h-11 w-full bg-gw-bg-mid rounded-xl" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-3 w-20 bg-gw-bg-mid rounded" />
          <div className="h-3 w-12 bg-gw-bg-mid rounded" />
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gw-border" />

      {/* Comments header skeleton */}
      <div className="h-4 w-24 bg-gw-bg-mid rounded mb-3" />

      {/* Comment skeletons */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 mb-3 space-y-2">
          <div className="h-4 w-full bg-gw-bg-mid rounded" />
          <div className="h-4 w-4/5 bg-gw-bg-mid rounded" />
          <div className="flex items-center gap-3 pt-1">
            <div className="h-3 w-16 bg-gw-bg-mid rounded" />
            <div className="h-3 w-10 bg-gw-bg-mid rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
