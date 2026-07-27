import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider, ThemeSwitcher } from "./theme";

describe("shared color theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("persists dark mode and applies it to the document", async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeSwitcher /></ThemeProvider>);
    await user.click(screen.getByRole("combobox", { name: "Color theme" }));
    await user.click(screen.getByRole("option", { name: /Dark/ }));
    await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
    expect(localStorage.getItem("ga_theme")).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });
});
