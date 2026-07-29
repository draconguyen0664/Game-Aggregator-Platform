import { describe, expect, it } from "@jest/globals";
import { useOpsStore } from "./use-ops-store";

describe("operations navigation store", () => {
  it("switches to the incident response workspace", () => {
    useOpsStore.getState().setTab("incidents");
    expect(useOpsStore.getState().tab).toBe("incidents");
  });
});
