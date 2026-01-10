import { Skeleton } from "@/components/ui/skeleton";

const ScooterCarouselSkeleton = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full -translate-x-12 lg:-translate-x-20">
      {/* Arc Background */}
      <div className="absolute inset-0 arc-gradient pointer-events-none" />

      {/* Main Image Skeleton */}
      <div className="relative z-10 w-full max-w-md lg:max-w-lg flex items-center justify-center">
        <Skeleton className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-muted/30" />
      </div>

      {/* Navigation Dots Skeleton */}
      <div className="flex gap-2 mt-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-2 h-2 rounded-full bg-muted/30" />
        ))}
      </div>

      {/* Model Info Skeleton */}
      <div className="mt-6 text-center space-y-2">
        <Skeleton className="h-4 w-20 mx-auto bg-muted/30" />
        <Skeleton className="h-8 w-32 mx-auto bg-muted/30" />
        <Skeleton className="h-4 w-24 mx-auto bg-muted/30" />
      </div>

      {/* Button Skeleton */}
      <Skeleton className="mt-4 h-10 w-48 bg-muted/30" />
    </div>
  );
};

export default ScooterCarouselSkeleton;
