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
  createGoal,
  CreateGoalInputSchema,
  delegateGoal,
  DelegateGoalInputSchema,
  reportOnGoal,
  ReportOnGoalInputSchema,
  markInProgress,
  MarkInProgressInputSchema,
  markCompleted,
  MarkCompletedInputSchema,
  markTodo,
  MarkTodoInputSchema,
  reportBlocked,
  ReportBlockedInputSchema,
  unblockGoal,
  UnblockGoalInputSchema,
  markWontDo,
  MarkWontDoInputSchema,
} from "powerhouse-agent/document-models/work-breakdown-structure";

describe("Workflow Operations", () => {
  describe("CREATE_GOAL", () => {
    it("should create a root goal with TODO status when no assignee", () => {
      const document = utils.createDocument();

      const updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Build a house",
          instructions: "Step by step instructions",
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      expect(updatedDocument.state.global.goals).toHaveLength(1);
      const goal = updatedDocument.state.global.goals[0];
      expect(goal.id).toBe("goal-1");
      expect(goal.description).toBe("Build a house");
      expect(goal.status).toBe("TODO");
      expect(goal.parentId).toBeNull();
      expect(goal.assignee).toBeNull();
      expect(goal.instructions).toBe("Step by step instructions");
      expect(goal.isDraft).toBe(false);
      expect(goal.dependencies).toEqual([]);
      expect(goal.notes).toEqual([]);
    });

    it("should create a goal with DELEGATED status when assignee is provided", () => {
      const document = utils.createDocument();

      const updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Design the architecture",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: "john.doe@example.com",
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.status).toBe("DELEGATED");
      expect(goal.assignee).toBe("john.doe@example.com");
    });

    it("should create a child goal with parent relationship", () => {
      const document = utils.createDocument();

      // Create parent first
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "parent-1",
          description: "Parent goal",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Create child
      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Child goal",
          instructions: null,
          draft: false,
          parentId: "parent-1",
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      expect(updatedDocument.state.global.goals).toHaveLength(2);
      const childGoal = updatedDocument.state.global.goals.find(
        (g) => g.id === "child-1",
      );
      expect(childGoal).toBeDefined();
      expect(childGoal?.parentId).toBe("parent-1");
    });

    it("should add initial note when provided", () => {
      const document = utils.createDocument();

      const updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Goal with note",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: {
            id: "note-1",
            note: "This is an initial note",
            author: "Alice",
          },
          metaData: null,
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.notes).toHaveLength(1);
      expect(goal.notes[0].id).toBe("note-1");
      expect(goal.notes[0].note).toBe("This is an initial note");
      expect(goal.notes[0].author).toBe("Alice");
    });

    it("should handle dependencies when provided", () => {
      const document = utils.createDocument();

      // Create dependency goals first
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "First goal",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "goal-2",
          description: "Second goal",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Create goal with dependencies
      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "goal-3",
          description: "Dependent goal",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: ["goal-1", "goal-2"],
          initialNote: null,
          metaData: null,
        }),
      );

      const goal = updatedDocument.state.global.goals.find(
        (g) => g.id === "goal-3",
      );
      expect(goal?.dependencies).toEqual(["goal-1", "goal-2"]);
    });

    it("should insert goal before specified position", () => {
      const document = utils.createDocument();

      // Create initial goals
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "First goal",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "goal-3",
          description: "Third goal",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Insert goal-2 before goal-3
      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "goal-2",
          description: "Second goal",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: "goal-3",
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      expect(updatedDocument.state.global.goals).toHaveLength(3);
      expect(updatedDocument.state.global.goals[0].id).toBe("goal-1");
      expect(updatedDocument.state.global.goals[1].id).toBe("goal-2");
      expect(updatedDocument.state.global.goals[2].id).toBe("goal-3");
    });

    it("should handle draft status correctly", () => {
      const document = utils.createDocument();

      const updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Draft goal",
          instructions: null,
          draft: true,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.isDraft).toBe(true);
    });

    it("should create complex hierarchy with multiple levels", () => {
      let document = utils.createDocument();

      // Create root goal
      document = reducer(
        document,
        createGoal({
          id: "root-1",
          description: "Root goal",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Create child goal
      document = reducer(
        document,
        createGoal({
          id: "child-1",
          description: "Child of root",
          instructions: null,
          draft: false,
          parentId: "root-1",
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Create grandchild goal
      document = reducer(
        document,
        createGoal({
          id: "grandchild-1",
          description: "Grandchild of root",
          instructions: null,
          draft: false,
          parentId: "child-1",
          insertBefore: null,
          assignee: "bob@example.com",
          dependsOn: [],
          initialNote: {
            id: "note-1",
            note: "Starting work on this",
            author: "Bob",
          },
          metaData: null,
        }),
      );

      expect(document.state.global.goals).toHaveLength(3);

      const root = document.state.global.goals.find((g) => g.id === "root-1");
      const child = document.state.global.goals.find((g) => g.id === "child-1");
      const grandchild = document.state.global.goals.find(
        (g) => g.id === "grandchild-1",
      );

      expect(root?.parentId).toBeNull();
      expect(child?.parentId).toBe("root-1");
      expect(grandchild?.parentId).toBe("child-1");
      expect(grandchild?.status).toBe("DELEGATED");
      expect(grandchild?.assignee).toBe("bob@example.com");
      expect(grandchild?.notes).toHaveLength(1);
    });
  });
  it.skip("should handle delegateGoal operation", () => {
    const document = utils.createDocument();
    const input = generateMock(DelegateGoalInputSchema());

    const updatedDocument = reducer(document, delegateGoal(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELEGATE_GOAL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle reportOnGoal operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ReportOnGoalInputSchema());

    const updatedDocument = reducer(document, reportOnGoal(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REPORT_ON_GOAL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle markInProgress operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkInProgressInputSchema());

    const updatedDocument = reducer(document, markInProgress(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "MARK_IN_PROGRESS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle markCompleted operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkCompletedInputSchema());

    const updatedDocument = reducer(document, markCompleted(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "MARK_COMPLETED",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle markTodo operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkTodoInputSchema());

    const updatedDocument = reducer(document, markTodo(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("MARK_TODO");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle reportBlocked operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ReportBlockedInputSchema());

    const updatedDocument = reducer(document, reportBlocked(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REPORT_BLOCKED",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle unblockGoal operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UnblockGoalInputSchema());

    const updatedDocument = reducer(document, unblockGoal(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UNBLOCK_GOAL",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle markWontDo operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkWontDoInputSchema());

    const updatedDocument = reducer(document, markWontDo(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "MARK_WONT_DO",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
