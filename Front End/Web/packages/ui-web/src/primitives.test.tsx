import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, Input, PortalOverview, Select } from "./index";

describe("web design system foundation", () => {
  it("exposes accessible form controls", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<div><Input label="Search" name="search" /><Select label="Environment" name="environment" options={[{label:"Sandbox",value:"sandbox"}]} /><Button onClick={onClick}>Apply</Button></div>);
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(screen.getByLabelText("Environment")).toHaveValue("sandbox");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders the shared portal composition", () => {
    render(<PortalOverview eyebrow="Operations" title="Admin" description="Foundation" actionLabel="Create" metrics={[{label:"Tenants",value:"12",change:"Healthy",tone:"success"}]} activities={[]} />);
    expect(screen.getByRole("heading", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
  });
});
