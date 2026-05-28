export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-[3/4] mb-4" />
      <div className="bg-gray-200 h-3 w-3/4 mb-2" />
      <div className="bg-gray-200 h-3 w-1/3" />
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="animate-pulse border border-gray-100 p-8">
      <div className="flex justify-between mb-6">
        <div>
          <div className="bg-gray-200 h-3 w-16 mb-2" />
          <div className="bg-gray-200 h-3 w-40 mb-2" />
          <div className="bg-gray-200 h-3 w-24" />
        </div>
        <div className="bg-gray-200 h-6 w-24" />
      </div>
      <div className="flex flex-col gap-3 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="bg-gray-200 w-14 h-14 shrink-0" />
            <div className="flex-1">
              <div className="bg-gray-200 h-3 w-32 mb-2" />
              <div className="bg-gray-200 h-3 w-16" />
            </div>
            <div className="bg-gray-200 h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4 flex justify-between">
        <div className="bg-gray-200 h-3 w-20" />
        <div className="bg-gray-200 h-5 w-24" />
      </div>
    </div>
  );
}
