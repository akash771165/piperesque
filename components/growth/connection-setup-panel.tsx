"use client";

import { useEffect, useState, useSyncExternalStore, type ChangeEvent } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FileJson,
  Link2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import type {
  ClosedLoopRevenueStore,
  GscPerformanceStore,
  SeoOverridesStore,
} from "@/lib/growth/closed-loop-store";

interface ImportSuccessPayload {
  message?: string;
  revenueStore?: ClosedLoopRevenueStore;
  gscStore?: GscPerformanceStore;
  overrides?: SeoOverridesStore;
}

interface ConnectionSetupPanelProps {
  onGscImported: (payload: ImportSuccessPayload) => void;
}

const SAMPLE_GSC_JSON = JSON.stringify(
  {
    pages: [
      {
        page: "/services/sewer-line-repair",
        topQuery: "sewer line repair houston",
        clicks: 24,
        impressions: 1380,
        ctr: 1.74,
        position: 7.8,
      },
      {
        page: "/services/leak-detection",
        topQuery: "slab leak detection cost houston",
        clicks: 15,
        impressions: 1090,
        ctr: 1.38,
        position: 10.6,
      },
      {
        page: "/services/drain-cleaning",
        topQuery: "hydro jetting cost houston",
        clicks: 11,
        impressions: 840,
        ctr: 1.31,
        position: 12.1,
      },
    ],
  },
  null,
  2
);

export function ConnectionSetupPanel({
  onGscImported,
}: ConnectionSetupPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin || "https://www.piperesque.com",
    () => "https://www.piperesque.com"
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync Real GSC JSON modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSubmitting) {
        setIsModalOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, isSubmitting]);

  const leadSmartPostUrl = `${origin}/api/webhooks/leadsmart?token=YOUR_SECRET`;
  const leadSmartGetPostbackUrl = `${origin}/api/webhooks/leadsmart?token=YOUR_SECRET&type=call&payout=65&status=sold&city=Houston&service=Emergency+Plumbing`;
  const gscSyncApiUrl = `${origin}/api/sync/gsc?token=YOUR_GSC_SYNC_SECRET`;

  async function handleCopy(key: string, value: string) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr));
      }, 2000);
    } catch {
      setCopiedKey(null);
    }
  }

  function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setModalError(null);
    if (file.size > 500_000) {
      setModalError("File exceeds the 500KB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setJsonText(reader.result);
      }
    };
    reader.onerror = () => {
      setModalError("Unable to read the selected JSON file.");
    };
    reader.readAsText(file);
  }

  async function handleSubmitGscImport() {
    if (isSubmitting) return;
    const trimmed = jsonText.trim();
    if (!trimmed) {
      setModalError("Paste Google Search Console JSON or upload a .json file first.");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const response = await fetch("/api/growth/closed-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          action: "import_gsc",
          jsonText: trimmed,
          replace: replaceExisting,
        }),
      });

      const rawText = await response.text();
      let payload: ImportSuccessPayload & { success?: boolean; error?: string };
      try {
        payload = JSON.parse(rawText) as ImportSuccessPayload & {
          success?: boolean;
          error?: string;
        };
      } catch {
        setModalError(
          `Server returned an unexpected response (HTTP ${response.status}). Please retry.`
        );
        return;
      }

      if (!response.ok || !payload.success) {
        setModalError(
          payload.error || "Unable to import GSC JSON. Verify the JSON structure."
        );
        return;
      }

      onGscImported(payload);
      setIsModalOpen(false);
      setJsonText("");
      setModalError(null);
    } catch {
      setModalError(
        "Unable to reach /api/growth/closed-loop while importing GSC JSON. Please retry."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      data-testid="connection-setup-card"
      className="rounded-xl bg-slate-900/70 border border-slate-700/80 overflow-hidden"
    >
      {/* Collapsible Header Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          data-testid="connection-setup-toggle"
          className="flex items-center gap-2.5 text-left min-w-0 flex-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md"
        >
          <Link2 className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">
              Connection &amp; Webhook Setup
            </div>
            <div className="text-xs text-slate-400 truncate">
              Live Leads Smart GET/POST Postback URL · Free GSC JSON Sync &amp; Paste Tool
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="open-gsc-import-modal-button"
            onClick={() => {
              setModalError(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
            <span>Paste / Sync GSC JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="inline-flex items-center justify-center gap-1 min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>{isExpanded ? "Hide Setup" : "Show Setup"}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div
          data-testid="connection-setup-body"
          className="border-t border-slate-800 px-5 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* Left: Live Leads Smart Webhook / Postback URL */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-white">
                Leads Smart Live Postback &amp; Webhook URL (GET &amp; POST)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Replace <code className="text-slate-200">YOUR_SECRET</code> with your{" "}
                <code className="text-slate-200">LEADSMART_WEBHOOK_SECRET</code> environment variable. Both{" "}
                <strong className="text-slate-200">GET postbacks</strong> and{" "}
                <strong className="text-slate-200">POST JSON webhooks</strong> update{" "}
                <code className="text-slate-200">data/revenue-store.json</code> in real time.
              </p>
            </div>

            {/* Base POST / Webhook URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>Webhook Endpoint (POST JSON or GET Query)</span>
                <button
                  type="button"
                  data-testid="copy-leadsmart-url-button"
                  onClick={() => handleCopy("leadsmart-base", leadSmartPostUrl)}
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap cursor-pointer"
                >
                  {copiedKey === "leadsmart-base" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-nowrap">
                {leadSmartPostUrl}
              </div>
            </div>

            {/* Full GET Postback URL Example */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>GET Postback Template (Affiliate Networks)</span>
                <button
                  type="button"
                  data-testid="copy-leadsmart-get-button"
                  onClick={() => handleCopy("leadsmart-get", leadSmartGetPostbackUrl)}
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap cursor-pointer"
                >
                  {copiedKey === "leadsmart-get" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy GET Postback</span>
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-nowrap">
                {leadSmartGetPostbackUrl}
              </div>
            </div>

            {/* Supported Parameters Reference */}
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-800/70 text-slate-300 border-b border-slate-800">
                    <th className="py-2 px-3 font-semibold">Parameter</th>
                    <th className="py-2 px-3 font-semibold">Values / Format</th>
                    <th className="py-2 px-3 font-semibold">Effect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr>
                    <td className="py-1.5 px-3 font-mono text-blue-300">type</td>
                    <td className="py-1.5 px-3 font-mono">call | form</td>
                    <td className="py-1.5 px-3 text-slate-400">Increments Sold Calls or Sold Forms</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-mono text-blue-300">payout</td>
                    <td className="py-1.5 px-3 font-mono">65.00</td>
                    <td className="py-1.5 px-3 text-slate-400">USD payout added to Verified Revenue</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-mono text-blue-300">status</td>
                    <td className="py-1.5 px-3 font-mono">sold | rejected</td>
                    <td className="py-1.5 px-3 text-slate-400">Non-rejected entries count toward Daily Lead Goal</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-mono text-blue-300">city / service</td>
                    <td className="py-1.5 px-3 font-mono">Katy / Sewer Line Repair</td>
                    <td className="py-1.5 px-3 text-slate-400">Drives Homepage Trending Service highlight</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Free GSC API Push & Paste JSON Import */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 lg:border-l lg:border-slate-800 lg:pl-5">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Sync Real Google Search Console Data (100% Free)
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Push GSC performance metrics from a free Python/GitHub Action script via{" "}
                  <code className="text-slate-200">/api/sync/gsc</code> or paste/upload exported GSC JSON right here.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>Automated GSC Sync Endpoint (POST)</span>
                  <button
                    type="button"
                    data-testid="copy-gsc-api-url-button"
                    onClick={() => handleCopy("gsc-api", gscSyncApiUrl)}
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap cursor-pointer"
                  >
                    {copiedKey === "gsc-api" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 font-mono text-[11px] text-blue-300 overflow-x-auto whitespace-nowrap">
                  {gscSyncApiUrl}
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-3.5 space-y-2 text-xs text-slate-300">
                <div className="font-medium text-white">
                  No Server Script? Paste or Upload GSC JSON Directly
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Accepts page arrays (<code className="text-slate-300">{"{ pages: [...] }"}</code>), query rows (
                  <code className="text-slate-300">{"{ rows: [...] }"}</code>), or raw Search Console API responses. Updates{" "}
                  <code className="text-slate-300">data/gsc-store.json</code> and{" "}
                  <code className="text-slate-300">content/growth/gsc-opportunities.json</code> immediately.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setModalError(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 min-h-[40px] w-full px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <Upload className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Open GSC JSON Importer</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Auth headers supported: <code className="text-slate-300">?token=</code> or{" "}
              <code className="text-slate-300">Authorization: Bearer</code>
            </div>
          </div>
        </div>
      )}

      {/* Sync Real GSC JSON / Paste GSC Data Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gsc-import-modal-title"
            data-testid="gsc-import-modal"
            className="w-full max-w-2xl rounded-xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                <h3
                  id="gsc-import-modal-title"
                  className="text-sm font-semibold text-white"
                >
                  Sync Real GSC JSON / Paste Search Console Data
                </h3>
              </div>
              <button
                type="button"
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                aria-label="Close GSC JSON importer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>
                  Paste JSON with <code className="text-slate-200">page</code>,{" "}
                  <code className="text-slate-200">query</code>/<code className="text-slate-200">topQuery</code>,{" "}
                  <code className="text-slate-200">clicks</code>,{" "}
                  <code className="text-slate-200">impressions</code>,{" "}
                  <code className="text-slate-200">ctr</code>,{" "}
                  <code className="text-slate-200">position</code>.
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    data-testid="load-sample-gsc-json-button"
                    onClick={() => {
                      setJsonText(SAMPLE_GSC_JSON);
                      setModalError(null);
                    }}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 whitespace-nowrap cursor-pointer"
                  >
                    Load Example Format
                  </button>
                  <span className="text-slate-600" aria-hidden="true">
                    ·
                  </span>
                  <label className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 whitespace-nowrap cursor-pointer">
                    <Upload className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Upload .json</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <textarea
                data-testid="gsc-json-textarea"
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  if (modalError) setModalError(null);
                }}
                rows={10}
                spellCheck={false}
                placeholder='{"pages": [{"page": "/services/sewer-line-repair", "topQuery": "sewer line repair houston", "clicks": 18, "impressions": 1190, "ctr": 1.51, "position": 8.4}]}'
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3.5 py-3 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-500"
                />
                <span>
                  Replace all existing pages in{" "}
                  <code className="text-slate-200">data/gsc-store.json</code> (unchecked merges new rows)
                </span>
              </label>

              {modalError && (
                <div
                  role="alert"
                  data-testid="gsc-import-error"
                  className="flex items-start gap-2 rounded-lg bg-rose-950/60 border border-rose-500/40 px-3.5 py-2.5 text-xs text-rose-200"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{modalError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-800 bg-slate-900/90">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="min-h-[40px] px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                data-testid="submit-gsc-import-button"
                onClick={handleSubmitGscImport}
                className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                ) : (
                  <Upload className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
                <span>{isSubmitting ? "Importing..." : "Sync GSC Data Now"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
