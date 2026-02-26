export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-14 bg-gw-bg-mid rounded mt-2 mb-4" />
      <div className="h-7 w-40 bg-gw-bg-mid rounded mb-4" />

      {/* Streak card skeleton */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gw-bg-mid rounded-full" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gw-bg-mid rounded" />
            <div className="h-3 w-32 bg-gw-bg-mid rounded" />
          </div>
        </div>
        <div className="mt-3 h-2.5 w-full bg-gw-bg-mid rounded-full" />
      </div>

      {/* Grid skeleton */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="h-4 w-24 bg-gw-bg-mid rounded mb-3" />
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-7 h-7 bg-gw-bg-mid rounded-lg" />
          ))}
        </div>
      </div>

      {/* Correlation skeleton */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="h-4 w-36 bg-gw-bg-mid rounded mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-gw-bg-mid rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
