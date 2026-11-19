"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PrivateRoute from "@/components/PrivateRoute";
import api from "@/lib/axios";
import { CheckCircle2 } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("verifying");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    api
      .post("/payments/confirm", { sessionId })
      .then((res) => {
        setReceipt(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "verifying") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg text-amber-400"></span>
        <p className="text-slate-300">Verifying your Stripe payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-red-400">Payment Verification Failed</h2>
        <p className="text-slate-400 mt-2">We could not verify this transaction. Please check your rentals dashboard.</p>
        <Link href="/dashboard/customer" className="btn bg-amber-500 text-slate-950 border-none mt-6">
          Go to My Rentals
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
        <p className="text-slate-400 text-sm mt-2">
          Your equipment booking has been confirmed and recorded.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Equipment:</span>
            <span className="text-white font-medium">{receipt?.booking?.equipment?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="text-amber-400 font-bold">${receipt?.payment?.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="text-slate-300 text-xs truncate max-w-[180px]">{receipt?.payment?.transactionId}</span>
          </div>
        </div>

        <Link
          href="/dashboard/customer"
          className="btn w-full bg-amber-500 hover:bg-amber-400 text-slate-950 border-none font-semibold mt-6"
        >
          View My Rentals
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <PrivateRoute>
      <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-amber-400"></span></div>}>
        <PaymentSuccessContent />
      </Suspense>
    </PrivateRoute>
  );
}