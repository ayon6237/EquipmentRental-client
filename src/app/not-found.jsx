import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-extrabold text-amber-400">404</h1>
      <h2 className="text-2xl font-bold text-white mt-3">Page Not Found</h2>
      <p className="text-slate-400 mt-2 max-w-md">
        The equipment or page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn bg-amber-500 hover:bg-amber-400 text-slate-950 border-none mt-6">
        Back to Home
      </Link>
    </div>
  );
}