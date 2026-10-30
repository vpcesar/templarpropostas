import { describe, expect, test } from "bun:test";
import { visibleSections } from "./document-sections";

describe("document visibility and sequence", () => {
  test("disabled sections disappear from the document", () => {
    expect(visibleSections([{ id: "capa", label: "Capa", enabled: false }, { id: "cliente", label: "Cliente", enabled: true }]).map(s => s.id)).toEqual(["cliente"]);
  });
  test("enabled sections retain the user's order", () => {
    expect(visibleSections([{ id: "valores", label: "Valores", enabled: true }, { id: "objetivo", label: "Objetivo", enabled: true }]).map(s => s.id)).toEqual(["valores", "objetivo"]);
  });
});