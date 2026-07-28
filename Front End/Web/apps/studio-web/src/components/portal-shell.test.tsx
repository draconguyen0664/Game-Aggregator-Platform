import { describe, expect, it } from "vitest";
import { studioNavigation } from "./portal-shell";

describe("Studio Portal navigation", () => {
  it("maps every sidebar item to a distinct working view", () => {
    const navigation = studioNavigation("builds");
    expect(new Set(navigation.map((item) => item.href)).size).toBe(navigation.length);
    expect(navigation.find((item) => item.label === "Builds")).toMatchObject({ href: "/#builds", active: true });
    expect(navigation.find((item) => item.label === "Games")).toMatchObject({ href: "/#games", active: false });
    expect(navigation.map((item) => item.label)).toContain("Developer integration");
  });
});