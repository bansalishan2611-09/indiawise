export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="py-24 flex flex-col items-center gap-6">
        <div className="h-6 w-48 bg-border rounded-full" />
        <div className="h-16 w-3/4 bg-border rounded-2xl" />
        <div className="h-5 w-1/2 bg-border rounded-full" />
        <div className="h-14 w-full max-w-2xl bg-border rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="md:col-span-2 h-64 bg-border rounded-3xl" />
        <div className="h-32 bg-border rounded-3xl" />
        <div className="h-32 bg-border rounded-3xl" />
        <div className="md:col-span-2 h-32 bg-border rounded-3xl" />
      </div>
    </div>
  );
}
