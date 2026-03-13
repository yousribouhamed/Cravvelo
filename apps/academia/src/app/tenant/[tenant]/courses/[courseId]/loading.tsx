export default function CourseDetailsLoading() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 my-8 animate-pulse">
      <div className="col-span-1 lg:col-span-2 space-y-4">
        <div className="h-8 w-2/3 rounded-md bg-muted" />
        <div className="h-[280px] w-full rounded-lg bg-muted" />
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-4/6 rounded bg-muted" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 h-[360px]" />
    </div>
  );
}
