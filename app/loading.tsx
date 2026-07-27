export default function Loading() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50">

            <div className="text-center">

                <div className="mx-auto flex h-28 w-28 animate-spin items-center justify-center rounded-full border-[8px] border-slate-200 border-t-blue-600">

                    <span className="text-5xl">
                        🔧
                    </span>

                </div>

                <h2 className="mt-10 text-4xl font-black text-slate-900">
                    Piperesque
                </h2>

                <p className="mt-4 text-lg text-slate-600">
                    Loading...
                </p>

                <div className="mx-auto mt-10 h-2 w-72 overflow-hidden rounded-full bg-slate-200">

                    <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />

                </div>

                <p className="mt-8 text-sm font-medium text-slate-500">
                    Please wait while we prepare your page...
                </p>

            </div>

        </main>
    );
}

