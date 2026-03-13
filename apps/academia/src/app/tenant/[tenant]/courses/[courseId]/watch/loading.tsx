export default function CourseWatchLoading() {
  return (
    <div className="min-h-screen p-4 lg:p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="hidden lg:block w-80 rounded-md border border-border bg-card h-[70vh]" />
        <div className="flex-1 space-y-4">
          <div className="rounded-md border border-border bg-muted/50 h-[55vh]" />
          <div className="rounded-md border border-border bg-card h-24" />
          <div className="rounded-md border border-border bg-card h-36" />
        </div>
      </div>
    </div>
  );
}
