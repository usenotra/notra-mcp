import { expect, test, vi } from "vitest";
import { readOrganizationIdEnv, readOrganizationIdHeader } from "../src/utils/organization.ts";

test("the workspace header prefers X-Notra-Organization-Id over its alias and ignores blanks", () => {
  expect(readOrganizationIdHeader({})).toBeUndefined();
  expect(readOrganizationIdHeader({ "x-notra-organization-id": "  " })).toBeUndefined();
  expect(readOrganizationIdHeader({ "x-organization-id": " org-b " })).toBe("org-b");
  expect(readOrganizationIdHeader({ "x-notra-organization-id": "org-a", "x-organization-id": "org-b" })).toBe("org-a");
  expect(readOrganizationIdHeader({ "x-notra-organization-id": " ", "x-organization-id": "org-b" })).toBe("org-b");
});

test("NOTRA_ORGANIZATION_ID selects the stdio workspace when set", () => {
  vi.stubEnv("NOTRA_ORGANIZATION_ID", "");
  expect(readOrganizationIdEnv()).toBeUndefined();
  vi.stubEnv("NOTRA_ORGANIZATION_ID", " org-a ");
  expect(readOrganizationIdEnv()).toBe("org-a");
});
