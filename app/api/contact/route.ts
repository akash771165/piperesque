import { NextRequest, NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validators/contact";
import { siteConfig } from "@/lib/config/site";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = ContactSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      return NextResponse.json(
        {
          success: false,
          error: "Please correct the highlighted errors.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    // Server-side validation succeeded.
    // Online email/message submission is currently unavailable.
    // Transparently inform the user and provide the direct phone contact option.
    return NextResponse.json(
      {
        success: false,
        unavailable: true,
        message: `Online form submissions are currently unavailable. For immediate assistance or to schedule plumbing services, please call our 24/7 hotline directly at ${siteConfig.phoneDisplay}.`,
        phone: siteConfig.phone,
        phoneDisplay: siteConfig.phoneDisplay,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Contact form processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `An unexpected error occurred. Please call us directly at ${siteConfig.phoneDisplay}.`,
      },
      { status: 500 }
    );
  }
}
