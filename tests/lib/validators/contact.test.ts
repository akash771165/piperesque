import { describe, expect, it } from "vitest";

import { ContactSchema } from "@/lib/validators/contact";

const valid = {
  name: "Akash Parmar",
  email: "akash@example.com",
  phone: "8773640861",
  service: "Drain cleaning",
  message: "Kitchen sink is completely blocked since this morning.",
};

function errorFor(field: string, payload: Record<string, unknown>) {
  const result = ContactSchema.safeParse(payload);

  if (result.success) return undefined;

  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe("ContactSchema", () => {
  it("accepts a complete submission", () => {
    const result = ContactSchema.safeParse(valid);

    expect(result.success).toBe(true);
    expect(result.success && result.data).toEqual(valid);
  });

  it("rejects a short name", () => {
    expect(errorFor("name", { ...valid, name: "A" })).toBe(
      "Please enter your full name"
    );
  });

  it("rejects a malformed email", () => {
    expect(errorFor("email", { ...valid, email: "akash@" })).toBe(
      "Please enter a valid email"
    );
  });

  it("rejects a short phone number", () => {
    expect(errorFor("phone", { ...valid, phone: "877364" })).toBe(
      "Please enter a valid phone number"
    );
  });

  it("rejects a short service", () => {
    expect(errorFor("service", { ...valid, service: "x" })).toBe(
      "Please enter the required service"
    );
  });

  it("rejects a short message", () => {
    expect(errorFor("message", { ...valid, message: "leaking" })).toBe(
      "Please describe the plumbing problem"
    );
  });

  it("reports every missing field at once", () => {
    const result = ContactSchema.safeParse({});

    expect(result.success).toBe(false);
    expect(result.success === false && result.error.issues).toHaveLength(5);
  });

  it("rejects non string values", () => {
    const result = ContactSchema.safeParse({ ...valid, phone: 8773640861 });

    expect(result.success).toBe(false);
  });
});
