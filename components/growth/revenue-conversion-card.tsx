import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  FileText,
  PhoneCall,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  evaluateDailyLeadGoal,
  getDailyLeadGoalTheme,
  getProgressWidthClass,
} from "@/lib/growth/daily-lead-goal";
import { calculateLeadSourceRatio } from "@/lib/growth/lead-source-ratio";
import {
  buildLast30DaysRevenueTrend,
  type DailyRevenueSnapshot,
  type RevenueTransactionRecord,
} from "@/lib/growth/revenue-trend";
import { RevenueTrendChart } from "@/components/growth/revenue-trend-chart";

export interface RevenueConversionSummary {
  totalPhoneClicks: number;
  totalFormSubmissions: number;
  totalQualifiedLeads: number;
  totalReferralsDispatched?: number;
  totalVerifiedReferralRevenue?: string;
  totalPendingReferralRevenue?: string;
}

interface RevenueConversionCardProps {
  summary: RevenueConversionSummary;
  dailyLeadTarget: number;
  transactions?: RevenueTransactionRecord[];
  dailyRevenueHistory?: DailyRevenueSnapshot[];
}

export function RevenueConversionCard({
  summary,
  dailyLeadTarget,
  transactions,
  dailyRevenueHistory,
}: RevenueConversionCardProps) {
  const goal = evaluateDailyLeadGoal(summary.totalQualifiedLeads, dailyLeadTarget);
  const theme = getDailyLeadGoalTheme(goal.status);
  const goalWidthClass = getProgressWidthClass(goal.progressPercent);
  const sourceRatio = calculateLeadSourceRatio(
    summary.totalPhoneClicks,
    summary.totalFormSubmissions
  );
  const revenueTrend = buildLast30DaysRevenueTrend({
    transactions,
    dailyRevenueHistory,
  });
  const phoneShareWidthClass = getProgressWidthClass(sourceRatio.phoneSharePercent);
  const formShareWidthClass = getProgressWidthClass(sourceRatio.formSharePercent);
  const verifiedRevenue = summary.totalVerifiedReferralRevenue || "$0.00";
  const hasVerifiedRevenue = verifiedRevenue !== "$0.00";

  const StatusIcon =
    goal.status === "on_target"
      ? CheckCircle2
      : goal.status === "approaching"
        ? TrendingUp
        : AlertTriangle;

  return (
    <div
      className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4"
      data-testid="revenue-conversion-card"
    >
      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          Referral Conversion Funnel
        </h2>
        <span className="text-xs text-slate-400">Zero-PII</span>
      </div>

      {/* Daily Lead Goal Progress Indicator */}
      <div
        className={`rounded-lg border p-3.5 space-y-2.5 transition-colors ${theme.containerClass}`}
        data-testid="daily-lead-goal-indicator"
        data-goal-status={goal.status}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
            <Target className={`w-4 h-4 shrink-0 ${theme.iconClass}`} />
            <span>Daily Lead Goal</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${theme.badgeClass}`}
          >
            <StatusIcon className="w-3 h-3 shrink-0" />
            {goal.statusLabel}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2 text-xs">
          <div className="font-mono">
            <span className={`text-sm font-bold ${theme.valueTextClass}`}>
              {goal.qualifiedLeads}
            </span>
            <span className="text-slate-400">
              {" "}
              / {goal.dailyTarget} qualified leads
            </span>
          </div>
          <span className={`font-mono font-bold ${theme.valueTextClass}`}>
            {goal.progressPercent}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-label="Daily qualified lead goal progress"
          aria-valuenow={goal.qualifiedLeads}
          aria-valuemin={0}
          aria-valuemax={goal.dailyTarget}
          aria-valuetext={`${goal.qualifiedLeads} of ${goal.dailyTarget} qualified leads (${goal.statusLabel})`}
          className={`w-full h-2.5 rounded-full overflow-hidden ${theme.trackClass}`}
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${theme.barFillClass} ${goalWidthClass}`}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>0</span>
          <span>Target: {goal.dailyTarget}/day</span>
        </div>

        <p className="text-[11px] leading-relaxed text-slate-300 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dotClass}`} />
          <span>{goal.helperText}</span>
        </p>
      </div>

      {/* 4-Stage Conversion Funnel */}
      <div className="space-y-3 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>1. Phone CTA Clicks</span>
            <span className="font-mono font-bold">{summary.totalPhoneClicks} clicks</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className={`bg-blue-500 h-full ${summary.totalPhoneClicks > 0 ? "w-full" : "w-0"}`}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>2. Referral Form Inquiries</span>
            <span className="font-mono font-bold">
              {summary.totalFormSubmissions} inquiries
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className={`bg-indigo-500 h-full ${summary.totalFormSubmissions > 0 ? "w-full" : "w-0"}`}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>3. Qualified Houston Leads</span>
            <span className={`font-mono font-bold ${theme.valueTextClass}`}>
              {summary.totalQualifiedLeads} / {goal.dailyTarget} leads
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${theme.barFillClass} ${goalWidthClass}`} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>4. Verified Revenue Settlements</span>
            <span className="font-mono font-bold text-emerald-400">
              {verifiedRevenue}
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className={`bg-emerald-400 h-full ${hasVerifiedRevenue ? "w-full" : "w-0"}`}
            />
          </div>
        </div>
      </div>

      {/* Lead Source Mix: Phone Click vs. Form Submission */}
      <div
        className="rounded-lg bg-slate-900/60 border border-slate-700/80 p-3.5 space-y-3"
        data-testid="lead-source-ratio"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold text-slate-200">
            Lead Source Ratio
          </h3>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-semibold text-slate-300">
            Ratio {sourceRatio.formattedRatio}
          </span>
        </div>

        {/* Proportional Split Bar */}
        <div
          className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex"
          aria-label={`Lead source split: ${sourceRatio.formattedPhoneShare} Phone Click, ${sourceRatio.formattedFormShare} Form Submission`}
        >
          {sourceRatio.hasData && (
            <>
              <div className={`bg-blue-500 h-full ${phoneShareWidthClass}`} />
              <div className={`bg-indigo-500 h-full ${formShareWidthClass}`} />
            </>
          )}
        </div>

        {/* Compact Source Breakdown Table */}
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
              <th scope="col" className="text-left font-medium pb-1.5">
                Channel
              </th>
              <th scope="col" className="text-right font-medium pb-1.5">
                Count
              </th>
              <th scope="col" className="text-right font-medium pb-1.5">
                Share
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            <tr>
              <td className="py-1.5 text-slate-200">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
                  Phone Click
                </span>
              </td>
              <td className="py-1.5 text-right font-mono font-semibold text-slate-200">
                {sourceRatio.phoneClicks}
              </td>
              <td className="py-1.5 text-right font-mono font-semibold text-blue-400">
                {sourceRatio.formattedPhoneShare}
              </td>
            </tr>
            <tr>
              <td className="py-1.5 text-slate-200">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
                  Form Submission
                </span>
              </td>
              <td className="py-1.5 text-right font-mono font-semibold text-slate-200">
                {sourceRatio.formSubmissions}
              </td>
              <td className="py-1.5 text-right font-mono font-semibold text-indigo-400">
                {sourceRatio.formattedFormShare}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 30-Day Qualified Lead Revenue ROI Trend */}
      <RevenueTrendChart trend={revenueTrend} />

      <div className="pt-2 text-slate-400 text-xs">
        <span className="text-amber-400 font-medium">Business Integrity</span>: PipeResque is strictly a referral platform. Revenue is only booked upon verified provider payment settlement.
      </div>
    </div>
  );
}
