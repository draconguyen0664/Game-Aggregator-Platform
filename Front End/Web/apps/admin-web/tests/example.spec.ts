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
});