import { test, expect } from "@playwright/test";

test("redirects anonymous users to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("shows invitation-only registration", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Create your work account" })).toBeVisible();
  await expect(page.getByLabel("Invitation key")).toBeVisible();
});
test("super admin can sign in", async ({ page }) => {
  const email = process.env.E2E_SUPER_ADMIN_EMAIL;
  const password = process.env.E2E_SUPER_ADMIN_PASSWORD;
  test.skip(!email || !password, "Local bootstrap credentials are required");
  await page.goto("/login");
  await page.getByLabel("Work email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Operations overview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Platform administration" })).toBeVisible();
  await expect(page.getByText("Total games")).toBeVisible();
  await page.getByRole("tab", { name: "API keys" }).click();
  await expect(page.getByRole("heading", { name: "API keys", exact: true })).toBeVisible();
  const tenantSelect = page.getByRole("combobox", { name: "Tenant" });
  await tenantSelect.click();
  await expect(page.getByRole("option", { name: "Atlas Publishing" })).toBeVisible();
  await page.getByRole("option", { name: "Atlas Publishing" }).click();
  await expect(tenantSelect).toContainText("Atlas Publishing");
});
test("hydrates on the loopback IP origin", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForTimeout(300);
  await expect(page).toHaveURL("http://127.0.0.1:3000/login");
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
});

test("renders the theme bootstrap script without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  expect(errors).toEqual([]);
});
