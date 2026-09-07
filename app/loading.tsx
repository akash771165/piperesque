import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex w-full max-w-sm flex-col items-center text-center">

        {/* Loading Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <Loader2
            size={30}
            className="animate-spin text-blue-600"
            aria-hidden="true"
          />
        </div>

        {/* Brand */}
        <h1 className="mt-6 text-2xl font-black tracking-tight text-slate-900">
          Piperesque
        </h1>

        {/* Status */}
        <p className="mt-2 text-sm font-medium text-slate-500">
          Loading your page...
        </p>

        {/* Progress Indicator */}
        <div
          className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
          aria-hidden="true"
        >
          <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
        </div>

        {/* Supporting Text */}
        <p className="mt-5 text-xs leading-5 text-slate-400">
          Please wait while we prepare your plumbing assistance information.
        </p>
      </div>
    </main>
  );
}