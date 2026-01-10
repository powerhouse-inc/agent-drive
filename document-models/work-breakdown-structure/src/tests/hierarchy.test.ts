/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isWorkBreakdownStructureDocument,
  reorder,
  ReorderInputSchema,
  addDependencies,
  AddDependenciesInputSchema,
  removeDependencies,
  RemoveDependenciesInputSchema,
} from "powerhouse-agent/document-models/work-breakdown-structure";

describe("Hierarchy Operations", () => {
  it.skip("should handle reorder operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ReorderInputSchema());

    const updatedDocument = reducer(document, reorder(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("REORDER");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it.skip("should handle addDependencies operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddDependenciesInputSchema());

    const updatedDocument = reducer(document, addDependencies(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_DEPENDENCIES",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it.skip("should handle removeDependencies operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveDependenciesInputSchema());

    const updatedDocument = reducer(document, removeDependencies(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_DEPENDENCIES",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
