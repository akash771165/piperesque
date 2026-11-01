import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/contact/route";
import { NextRequest } from "next/server";

describe("POST /api/contact", () => {
  it("rejects an empty form submission with 400 status and field errors", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.fieldErrors).toBeDefined();
    expect(json.fieldErrors.name).toBe("Please enter your full name");
    expect(json.fieldErrors.email).toBe("Please enter a valid email");
  });

  it("validates input and returns 503 with transparent unavailability notice and phone option", async () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "8773640861",
      service: "Emergency Plumbing",
      message: "Burst pipe in kitchen spraying water under the sink.",
    };

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify(validData),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.unavailable).toBe(true);
    expect(json.message).toContain("unavailable");
    expect(json.phoneDisplay).toBe("(877) 364-0861");
    expect(json.phone).toBe("+18773640861");
  });
});
