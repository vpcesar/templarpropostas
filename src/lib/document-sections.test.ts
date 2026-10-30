import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { visibleSections } from "./document-sections";

describe("document visibility and sequence", () => {
  test("disabled sections disappear from the document", () => {
    deepStrictEqual(visibleSections([{ id: "capa", label: "Capa", enabled: false }, { id: "cliente", label: "Cliente", enabled: true }]).map(s => s.id), ["cliente"]);
  });
  test("enabled sections retain the user's order", () => {
    deepStrictEqual(visibleSections([{ id: "valores", label: "Valores", enabled: true }, { id: "objetivo", label: "Objetivo", enabled: true }]).map(s => s.id), ["valores", "objetivo"]);
  });
});