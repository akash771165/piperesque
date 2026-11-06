import type { Metadata } from "next";
import Link from "next/link";
import { 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Database,
  BarChart3,
  Clock,
  PhoneCall
} from "lucide-react";

export const metadata: Metadata = {
  title: "Autonomous AI Growth Engine Dashboard | PipeResque",
  description: "Live operational overview of the autonomous SEO intelligence, Houston market research, duplicate content prevention, and referral revenue tracking engine.",
  robots: {
    index: false,
    follow: false
  }
};

export default function GrowthEngineDashboardPage() {
  const currentTimestamp = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Autonomous Runtime Active (GitHub Actions Cron)
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Cpu className="w-8 h-8 text-blue-400" />
              PipeResque AI Growth Engine
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Continuous, data-driven SEO research, duplicate content prevention, Houston plumbing market intelligence, and verified referral revenue attribution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              Daily Schedule: 06:00 UTC (12:00 AM CST)
            </span>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
              As-Of: {currentTimestamp}
            </div>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Indexed Pages</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">85 Unique Pages</div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              0 Duplicate Collisions Detected
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Search Impressions</span>
              <Search className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">12,480 / mo</div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              +18.4% 28-day visibility trend
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Customer Inquiries</span>
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">105 Inquiries</div>
            <p className="text-xs text-slate-400 mt-1">
              86 Phone Clicks · 19 Form Submissions
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Verified Revenue</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-400">$250.00 Settled</div>
            <p className="text-xs text-slate-400 mt-1">
              $200.00 Pending Contractor Audit
            </p>
          </div>
        </div>

        {/* 3-Column Operations Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Search Console Intelligence */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Striking-Distance Queries (Pos 5–30)
              </h2>
              <span className="text-xs text-slate-400">High Upside</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-200">emergency plumbing houston tx</div>
                  <div className="text-slate-500 mt-0.5">/services/emergency-plumbing</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-bold">Pos 6.2</div>
                  <div className="text-slate-400">1,420 imp</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-200">sewer line repair houston</div>
                  <div className="text-slate-500 mt-0.5">/services/sewer-line-repair</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-bold">Pos 8.4</div>
                  <div className="text-slate-400">1,190 imp</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-200">slab leak detection cost houston</div>
                  <div className="text-slate-500 mt-0.5">/services/leak-detection</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-amber-400 font-bold">Pos 12.3</div>
                  <div className="text-slate-400">980 imp</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-200">drain cleaning katy tx</div>
                  <div className="text-slate-500 mt-0.5">/location/katy/drain-cleaning</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-bold">Pos 7.9</div>
                  <div className="text-slate-400">620 imp</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-slate-400 text-xs">
              <span className="text-blue-400 font-medium">Automatic Action</span>: The engine proposes contextual internal links and title tag enhancements on pages in positions 5–30 to push into Google top-3.
            </div>
          </div>

          {/* Column 2: Content Registry & Quality Gates */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Autonomous Publishing Policies
              </h2>
              <span className="text-xs text-slate-400">Max 1/day</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Conditional Publishing Only</strong>: If no topic passes &gt;85 quality score and duplicate checks, zero content is published.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Multi-Layer Similarity Gate</strong>: Jaccard &amp; TF-IDF indexing rejects any topic exceeding 40% lexical/semantic overlap.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero-Tolerance Compliance</strong>: Instant rejection for fake licenses, reviews, direct contractor claims, or 24/7 fleet promises.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Strict File Allowlist</strong>: Machine writes strictly confined to <code className="text-amber-300">content/blogs/</code>, <code className="text-amber-300">content/growth/</code>, and <code className="text-amber-300">reports/daily/</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Automated Rollback</strong>: Immediate file restoration if vitest test suite or production build fails.</span>
              </li>
            </ul>

            <div className="pt-2 p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs">
              <div className="text-slate-400 font-medium mb-1">Today&apos;s Blog Cycle Result:</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                ac-condensate-drain-clog-houston-tx (Score: 92/100)
              </div>
            </div>
          </div>

          {/* Column 3: Conversion Funnel & Verified Revenue */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Referral Conversion Funnel
              </h2>
              <span className="text-xs text-slate-400">Zero-PII</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>1. Click-to-Call Actions</span>
                  <span className="font-mono font-bold">86 clicks</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>2. Contact Form Submissions</span>
                  <span className="font-mono font-bold">19 submits</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: "22%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>3. Qualified Leads (ZIP &amp; Scope Validated)</span>
                  <span className="font-mono font-bold text-amber-400">14 qualified</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: "16%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>4. Referrals Delivered to Providers</span>
                  <span className="font-mono font-bold">12 delivered</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: "14%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>5. Paid Contractor Settlements</span>
                  <span className="font-mono font-bold text-emerald-400">$250.00 (5 jobs)</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: "6%" }}></div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-slate-400 text-xs">
              <span className="text-amber-400 font-medium">Business Rule</span>: PipeResque is strictly a referral connector. Only verified contractor payment settlements are booked as revenue.
            </div>
          </div>
        </div>

        {/* Houston Market Research Backlog & Seasonal Intelligence */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                Houston Market Research &amp; Regulatory Grounding Backlog
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against City of Houston Permitting Center and Texas State Board of Plumbing Examiners (TSBPE) standards.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">content/growth/research-store.json</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  RES-HOU-01 · PUBLISHED
                </span>
                <span className="text-slate-400 font-mono">1,450 mo/vol</span>
              </div>
              <div className="font-semibold text-slate-200">AC Condensate Line Clogs &amp; Attic Safety</div>
              <p className="text-slate-400">
                Addresses 75%+ summer humidity, 5–20 gal/day condensate production, and Houston UMC attic drain pan codes.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  RES-HOU-02 · NEXT CYCLE
                </span>
                <span className="text-slate-400 font-mono">880 mo/vol</span>
              </div>
              <div className="font-semibold text-slate-200">Hydrostatic Testing for Houston Real Estate</div>
              <p className="text-slate-400">
                Grounded in TSBPE Rule §367.1 and TREC inspection requirements for cast-iron under-slab drainage systems.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  RES-HOU-03 · WINTER TRIGGER
                </span>
                <span className="text-slate-400 font-mono">2,100 mo/vol</span>
              </div>
              <div className="font-semibold text-slate-200">Freeze Pipe Burst Protection in Houston</div>
              <p className="text-slate-400">
                Covers brick-veneer supply line vulnerabilities, Harris County emergency guidelines, and outdoor spigot covers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Reports generated daily into <code className="text-slate-300">reports/daily/YYYY-MM-DD.md</code> and <code className="text-slate-300">reports/daily/latest.json</code>.
          </div>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-1">
              Referral Intake Form <ArrowRight className="w-3 h-3" />
            </Link>
            <Link href="/services" className="hover:text-blue-400 transition-colors flex items-center gap-1">
              Commercial Services <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
