export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-amber-400"></span>
      <p className="text-slate-400 text-sm tracking-wide">Loading GearGrid...</p>
    </div>
  );
}