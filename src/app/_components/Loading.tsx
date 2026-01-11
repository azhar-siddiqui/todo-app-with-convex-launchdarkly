import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen pt-4 w-full mx-auto max-w-xl px-4">
      <div className="flex items-center gap-x-4 w-full">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-32" />
      </div>
      <div className="w-full max-w-xl sm:mx-auto border h-[calc(100vh-8rem)] mt-4 overflow-y-auto flex flex-col gap-y-2 p-4 rounded-md">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`${_}-loading-${index}`}
            className="border py-2 px-4 flex items-center justify-between gap-x-4 rounded-md"
          >
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-48 flex-1" />
            <div className="flex gap-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
