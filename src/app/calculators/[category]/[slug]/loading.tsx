export default function CalculatorPageLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-64 bg-border rounded-full mb-6" />
      <div className="h-10 w-80 bg-border rounded-full mb-2" />
      <div className="h-4 w-96 bg-border rounded-full mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-white rounded-3xl border border-border p-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-border rounded-full" />
              <div className="h-12 w-full bg-border rounded-xl" />
            </div>
          ))}
          <div className="h-12 w-full bg-brand/20 rounded-xl" />
        </div>
        <div className="space-y-4">
          <div className="h-36 w-full bg-navy/10 rounded-3xl" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-border rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
