export default function ProfileLoading() {
  return (
    <div className="pt-2 animate-pulse">
      {/* Heading skeleton */}
      <div className="h-8 w-24 bg-gw-bg-mid rounded-lg mb-6" />

      {/* Username card skeleton */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="h-3 w-16 bg-gw-bg-mid rounded mb-2" />
        <div className="h-6 w-40 bg-gw-bg-mid rounded" />
      </div>

      {/* Gout profile skeleton */}
      <div className="bg-white rounded-2xl p-5 mb-4 space-y-3">
        <div className="h-3 w-24 bg-gw-bg-mid rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 bg-gw-bg-mid rounded" />
            <div className="h-4 w-28 bg-gw-bg-mid rounded" />
          </div>
        ))}
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex flex-col items-center gap-1.5">
            <div className="w-5 h-5 bg-gw-bg-mid rounded-full" />
            <div className="h-7 w-10 bg-gw-bg-mid rounded" />
            <div className="h-2.5 w-16 bg-gw-bg-mid rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
