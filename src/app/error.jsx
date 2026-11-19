"use client";
export default function Error({ error, reset }) {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold text-red-400">Something went wrong!</h2>
      <p className="text-slate-400 mt-2 max-w-md">{error?.message || "An unexpected error occurred."}</p>
      <button onClick={() => reset()} className="btn bg-amber-500 text-slate-950 border-none mt-6">
        Try Again
      </button>
    </div>
  );
}