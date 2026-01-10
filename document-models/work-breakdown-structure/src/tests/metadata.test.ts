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
  setReferences,
  SetReferencesInputSchema,
  setMetaData,
  SetMetaDataInputSchema,
} from "powerhouse-agent/document-models/work-breakdown-structure";

describe("Metadata Operations", () => {
  it.skip("should handle setReferences operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetReferencesInputSchema());

    const updatedDocument = reducer(document, setReferences(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_REFERENCES",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle setMetaData operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetMetaDataInputSchema());

    const updatedDocument = reducer(document, setMetaData(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_META_DATA",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
