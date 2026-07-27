import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayoutDashboard } from "lucide-react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./index";

const navigation = [{ label: "Overview", href: "/", icon: <LayoutDashboard />, active: true }];
describe("responsive application shell", () => {
  it("opens mobile navigation and command palette accessibly", async () => {
    const user = userEvent.setup();
    render(<AppShell portalLabel="Platform operations" navigation={navigation}><p>Dashboard content</p></AppShell>);
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getAllByRole("navigation", { name: "Main navigation" })).toHaveLength(2);
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
  });
});