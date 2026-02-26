export default function NotificationsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between pt-2 mb-4">
        <div className="h-7 w-36 bg-gw-bg-mid rounded" />
        <div className="h-4 w-24 bg-gw-bg-mid rounded" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 bg-gw-bg-mid rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full bg-gw-bg-mid rounded" />
              <div className="h-3 w-16 bg-gw-bg-mid rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
