import { describe, expect, it } from "vitest";
import { calculateLeadSourceRatio } from "@/lib/growth/lead-source-ratio";

describe("lead source ratio (Phone Click vs Form Submission)", () => {
  it("returns zero baseline when no clicks or submissions exist", () => {
    expect(calculateLeadSourceRatio(0, 0)).toEqual({
      phoneClicks: 0,
      formSubmissions: 0,
      totalInteractions: 0,
      phoneSharePercent: 0,
      formSharePercent: 0,
      formattedPhoneShare: "0.0%",
      formattedFormShare: "0.0%",
      formattedRatio: "0:0",
      hasData: false,
    });
  });

  it("computes simplified ratio and percentage split for mixed channels", () => {
    const result = calculateLeadSourceRatio(6, 4);

    expect(result.hasData).toBe(true);
    expect(result.totalInteractions).toBe(10);
    expect(result.formattedPhoneShare).toBe("60.0%");
    expect(result.formattedFormShare).toBe("40.0%");
    expect(result.formattedRatio).toBe("3:2");
  });

  it("handles single-channel traffic cleanly without division errors", () => {
    const phoneOnly = calculateLeadSourceRatio(5, 0);
    expect(phoneOnly.formattedPhoneShare).toBe("100.0%");
    expect(phoneOnly.formattedFormShare).toBe("0.0%");
    expect(phoneOnly.formattedRatio).toBe("1:0");

    const formOnly = calculateLeadSourceRatio(0, 3);
    expect(formOnly.formattedPhoneShare).toBe("0.0%");
    expect(formOnly.formattedFormShare).toBe("100.0%");
    expect(formOnly.formattedRatio).toBe("0:1");
  });

  it("ensures repeating decimal percentages sum cleanly to 100.0%", () => {
    const result = calculateLeadSourceRatio(1, 2);

    expect(result.phoneSharePercent).toBe(33.3);
    expect(result.formSharePercent).toBe(66.7);
    expect(result.phoneSharePercent + result.formSharePercent).toBe(100);
    expect(result.formattedRatio).toBe("1:2");
  });

  it("sanitizes negative or non-finite counts safely", () => {
    const result = calculateLeadSourceRatio(-5, Number.NaN);

    expect(result.phoneClicks).toBe(0);
    expect(result.formSubmissions).toBe(0);
    expect(result.formattedRatio).toBe("0:0");
    expect(result.hasData).toBe(false);
  });
});
