export interface LeadSourceRatioResult {
  phoneClicks: number;
  formSubmissions: number;
  totalInteractions: number;
  phoneSharePercent: number;
  formSharePercent: number;
  formattedPhoneShare: string;
  formattedFormShare: string;
  formattedRatio: string;
  hasData: boolean;
}

function sanitizeCount(value: unknown): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return Math.floor(num);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x || 1;
}

/**
 * Calculates the ratio and percentage split between Phone Clicks and Form Submissions
 * from revenue-store.json summary metrics.
 */
export function calculateLeadSourceRatio(
  rawPhoneClicks: number,
  rawFormSubmissions: number
): LeadSourceRatioResult {
  const phoneClicks = sanitizeCount(rawPhoneClicks);
  const formSubmissions = sanitizeCount(rawFormSubmissions);
  const totalInteractions = phoneClicks + formSubmissions;

  if (totalInteractions === 0) {
    return {
      phoneClicks: 0,
      formSubmissions: 0,
      totalInteractions: 0,
      phoneSharePercent: 0,
      formSharePercent: 0,
      formattedPhoneShare: "0.0%",
      formattedFormShare: "0.0%",
      formattedRatio: "0:0",
      hasData: false,
    };
  }

  const phoneSharePercent = Number(
    ((phoneClicks / totalInteractions) * 100).toFixed(1)
  );
  const formSharePercent = Number((100 - phoneSharePercent).toFixed(1));
  const divisor = gcd(phoneClicks, formSubmissions);
  const formattedRatio = `${phoneClicks / divisor}:${formSubmissions / divisor}`;

  return {
    phoneClicks,
    formSubmissions,
    totalInteractions,
    phoneSharePercent,
    formSharePercent,
    formattedPhoneShare: `${phoneSharePercent.toFixed(1)}%`,
    formattedFormShare: `${formSharePercent.toFixed(1)}%`,
    formattedRatio,
    hasData: true,
  };
}
