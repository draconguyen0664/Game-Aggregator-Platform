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