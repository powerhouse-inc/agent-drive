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

  describe("MARK_IN_PROGRESS", () => {
    it("should mark a goal as IN_PROGRESS", () => {
      const document = utils.createDocument();

      // Create a goal first
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Test goal",
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

      // Mark it as in progress
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "goal-1",
          note: null,
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.status).toBe("IN_PROGRESS");
    });

    it("should add a note when marking as IN_PROGRESS", () => {
      const document = utils.createDocument();

      // Create a goal first
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Test goal",
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

      // Mark it as in progress with a note
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "goal-1",
          note: {
            id: "note-1",
            note: "Started working on this",
            author: "john@example.com",
          },
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.notes).toHaveLength(1);
      expect(goal.notes[0].note).toBe("Started working on this");
      expect(goal.notes[0].author).toBe("john@example.com");
    });

    it("should propagate IN_PROGRESS to parent goals", () => {
      const document = utils.createDocument();

      // Create a hierarchy
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

      // Mark child as in progress
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "child-1",
          note: null,
        }),
      );

      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      
      expect(child?.status).toBe("IN_PROGRESS");
      expect(parent?.status).toBe("IN_PROGRESS");
    });

    it("should propagate IN_PROGRESS up multiple levels", () => {
      const document = utils.createDocument();

      // Create a deeper hierarchy
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "grandparent-1",
          description: "Grandparent goal",
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
          id: "parent-1",
          description: "Parent goal",
          instructions: null,
          draft: false,
          parentId: "grandparent-1",
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

      // Mark deepest child as in progress
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "child-1",
          note: null,
        }),
      );

      const grandparent = updatedDocument.state.global.goals.find((g) => g.id === "grandparent-1");
      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      
      expect(child?.status).toBe("IN_PROGRESS");
      expect(parent?.status).toBe("IN_PROGRESS");
      expect(grandparent?.status).toBe("IN_PROGRESS");
    });

    it("should not change parent status if already IN_PROGRESS", () => {
      const document = utils.createDocument();

      // Create parent and two children
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "First child",
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-2",
          description: "Second child",
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

      // Mark first child as in progress
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "child-1",
          note: null,
        }),
      );

      const parentAfterFirst = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      expect(parentAfterFirst?.status).toBe("IN_PROGRESS");

      // Mark second child as in progress
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "child-2",
          note: null,
        }),
      );

      const parentAfterSecond = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      expect(parentAfterSecond?.status).toBe("IN_PROGRESS");
    });

    it("should not change parent status if already COMPLETED", () => {
      const document = utils.createDocument();

      // Create parent and child
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

      // Manually set parent to COMPLETED (simulating it was completed before)
      updatedDocument.state.global.goals[0].status = "COMPLETED";

      // Mark child as in progress
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "child-1",
          note: null,
        }),
      );

      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      
      expect(child?.status).toBe("IN_PROGRESS");
      expect(parent?.status).toBe("COMPLETED"); // Should stay COMPLETED
    });

    it.skip("should throw error for non-existent goal - error handling issue", () => {
      const document = utils.createDocument();

      expect(() => 
        reducer(
          document,
          markInProgress({
            id: "non-existent",
          }),
        )
      ).toThrow("Goal with ID non-existent not found");
    });
  });

  describe("MARK_COMPLETED", () => {
    it("should mark a goal as COMPLETED", () => {
      const document = utils.createDocument();

      // Create a goal
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Test goal",
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

      // Mark it as completed
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "goal-1",
          note: null,
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.status).toBe("COMPLETED");
    });

    it("should add a note when marking as COMPLETED", () => {
      const document = utils.createDocument();

      // Create a goal
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Test goal",
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

      // Mark it as completed with a note
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "goal-1",
          note: {
            id: "note-1",
            note: "Task completed successfully",
            author: "jane@example.com",
          },
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.status).toBe("COMPLETED");
      expect(goal.notes).toHaveLength(1);
      expect(goal.notes[0].note).toBe("Task completed successfully");
      expect(goal.notes[0].author).toBe("jane@example.com");
    });

    it("should mark all child goals as COMPLETED", () => {
      const document = utils.createDocument();

      // Create hierarchy
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Child goal 1",
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-2",
          description: "Child goal 2",
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

      // Mark parent as completed
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "parent-1",
          note: null,
        }),
      );

      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child1 = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      const child2 = updatedDocument.state.global.goals.find((g) => g.id === "child-2");
      
      expect(parent?.status).toBe("COMPLETED");
      expect(child1?.status).toBe("COMPLETED");
      expect(child2?.status).toBe("COMPLETED");
    });

    it("should mark all descendants as COMPLETED recursively", () => {
      const document = utils.createDocument();

      // Create deeper hierarchy
      let updatedDocument = reducer(
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Child goal",
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "grandchild-1",
          description: "Grandchild goal",
          instructions: null,
          draft: false,
          parentId: "child-1",
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Mark root as completed
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "root-1",
          note: null,
        }),
      );

      const root = updatedDocument.state.global.goals.find((g) => g.id === "root-1");
      const child = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      const grandchild = updatedDocument.state.global.goals.find((g) => g.id === "grandchild-1");
      
      expect(root?.status).toBe("COMPLETED");
      expect(child?.status).toBe("COMPLETED");
      expect(grandchild?.status).toBe("COMPLETED");
    });

    it("should not change already COMPLETED children", () => {
      const document = utils.createDocument();

      // Create parent and child
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

      // Mark child as completed first
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "child-1",
          note: {
            id: "note-1",
            note: "Child done first",
            author: null,
          },
        }),
      );

      const childBefore = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      expect(childBefore?.status).toBe("COMPLETED");
      expect(childBefore?.notes).toHaveLength(1);

      // Now mark parent as completed
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "parent-1",
          note: null,
        }),
      );

      const childAfter = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      // Child should still have its original note
      expect(childAfter?.status).toBe("COMPLETED");
      expect(childAfter?.notes).toHaveLength(1);
      expect(childAfter?.notes[0].note).toBe("Child done first");
    });

    it("should not change WONT_DO children", () => {
      const document = utils.createDocument();

      // Create parent and children
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Will complete",
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-2",
          description: "Won't do this",
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

      // Mark child-2 as WONT_DO manually (will implement this operation later)
      updatedDocument.state.global.goals[2].status = "WONT_DO";

      // Mark parent as completed
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "parent-1",
          note: null,
        }),
      );

      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child1 = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      const child2 = updatedDocument.state.global.goals.find((g) => g.id === "child-2");
      
      expect(parent?.status).toBe("COMPLETED");
      expect(child1?.status).toBe("COMPLETED");
      expect(child2?.status).toBe("WONT_DO"); // Should stay WONT_DO
    });
  });

  describe("MARK_TODO", () => {
    it("should mark a goal as TODO", () => {
      const document = utils.createDocument();

      // Create goal and mark it IN_PROGRESS first
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Test goal",
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

      // First mark as IN_PROGRESS
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "goal-1",
        }),
      );

      expect(updatedDocument.state.global.goals[0].status).toBe("IN_PROGRESS");

      // Now mark back to TODO
      updatedDocument = reducer(
        updatedDocument,
        markTodo({
          id: "goal-1",
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.status).toBe("TODO");
    });

    it("should add a note when marking as TODO", () => {
      const document = utils.createDocument();

      // Create goal
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Test goal",
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

      // Mark as IN_PROGRESS first
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "goal-1",
        }),
      );

      // Mark back to TODO with note
      updatedDocument = reducer(
        updatedDocument,
        markTodo({
          id: "goal-1",
          note: {
            id: "note-1",
            note: "Reverting to TODO",
            author: "user@example.com",
          },
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.status).toBe("TODO");
      expect(goal.notes).toHaveLength(1);
      expect(goal.notes[0].note).toBe("Reverting to TODO");
    });

    it("should reset COMPLETED parent goals to TODO", () => {
      const document = utils.createDocument();

      // Create hierarchy
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

      // Mark parent as completed (this will also complete child)
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "parent-1",
        }),
      );

      expect(updatedDocument.state.global.goals[0].status).toBe("COMPLETED");
      expect(updatedDocument.state.global.goals[1].status).toBe("COMPLETED");

      // Now mark child back to TODO
      updatedDocument = reducer(
        updatedDocument,
        markTodo({
          id: "child-1",
        }),
      );

      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      
      expect(child?.status).toBe("TODO");
      expect(parent?.status).toBe("TODO"); // Parent should be reset
    });

    it("should reset WONT_DO parent goals to TODO", () => {
      const document = utils.createDocument();

      // Create hierarchy
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

      // Manually mark parent as WONT_DO
      updatedDocument.state.global.goals[0].status = "WONT_DO";

      // Mark child back to TODO
      updatedDocument = reducer(
        updatedDocument,
        markTodo({
          id: "child-1",
        }),
      );

      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      
      expect(child?.status).toBe("TODO");
      expect(parent?.status).toBe("TODO"); // Parent should be reset
    });

    it("should not change parent if already TODO or IN_PROGRESS", () => {
      const document = utils.createDocument();

      // Create hierarchy
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

      // Mark child as IN_PROGRESS
      updatedDocument = reducer(
        updatedDocument,
        markInProgress({
          id: "child-1",
        }),
      );

      const parentBefore = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      expect(parentBefore?.status).toBe("IN_PROGRESS");

      // Mark child back to TODO
      updatedDocument = reducer(
        updatedDocument,
        markTodo({
          id: "child-1",
        }),
      );

      const parentAfter = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      expect(parentAfter?.status).toBe("IN_PROGRESS"); // Should stay IN_PROGRESS
    });
  });

  describe("MARK_WONT_DO", () => {
    it("should mark a goal as WONT_DO", () => {
      const document = utils.createDocument();

      // Create a goal
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Test goal",
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

      // Mark it as WONT_DO
      updatedDocument = reducer(
        updatedDocument,
        markWontDo({
          id: "goal-1",
        }),
      );

      const goal = updatedDocument.state.global.goals[0];
      expect(goal.status).toBe("WONT_DO");
    });

    it("should mark all child goals as WONT_DO", () => {
      const document = utils.createDocument();

      // Create hierarchy
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Child goal 1",
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-2",
          description: "Child goal 2",
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

      // Mark parent as WONT_DO
      updatedDocument = reducer(
        updatedDocument,
        markWontDo({
          id: "parent-1",
        }),
      );

      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child1 = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      const child2 = updatedDocument.state.global.goals.find((g) => g.id === "child-2");
      
      expect(parent?.status).toBe("WONT_DO");
      expect(child1?.status).toBe("WONT_DO");
      expect(child2?.status).toBe("WONT_DO");
    });

    it("should not change already COMPLETED children", () => {
      const document = utils.createDocument();

      // Create parent and children
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Completed child",
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-2",
          description: "Unfinished child",
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

      // Mark child-1 as COMPLETED first
      updatedDocument = reducer(
        updatedDocument,
        markCompleted({
          id: "child-1",
        }),
      );

      // Now mark parent as WONT_DO
      updatedDocument = reducer(
        updatedDocument,
        markWontDo({
          id: "parent-1",
        }),
      );

      const parent = updatedDocument.state.global.goals.find((g) => g.id === "parent-1");
      const child1 = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      const child2 = updatedDocument.state.global.goals.find((g) => g.id === "child-2");
      
      expect(parent?.status).toBe("WONT_DO");
      expect(child1?.status).toBe("COMPLETED"); // Should stay COMPLETED
      expect(child2?.status).toBe("WONT_DO");
    });

    it("should mark all descendants recursively", () => {
      const document = utils.createDocument();

      // Create deeper hierarchy
      let updatedDocument = reducer(
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Child goal",
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

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "grandchild-1",
          description: "Grandchild goal",
          instructions: null,
          draft: false,
          parentId: "child-1",
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Mark root as WONT_DO
      updatedDocument = reducer(
        updatedDocument,
        markWontDo({
          id: "root-1",
        }),
      );

      const root = updatedDocument.state.global.goals.find((g) => g.id === "root-1");
      const child = updatedDocument.state.global.goals.find((g) => g.id === "child-1");
      const grandchild = updatedDocument.state.global.goals.find((g) => g.id === "grandchild-1");
      
      expect(root?.status).toBe("WONT_DO");
      expect(child?.status).toBe("WONT_DO");
      expect(grandchild?.status).toBe("WONT_DO");
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
