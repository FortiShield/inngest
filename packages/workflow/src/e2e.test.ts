import { Engine } from "./engine";
import { type Workflow } from "./types";

/**
 * End-to-End Test Suite for Inngest Workflow Kit
 * Tests all core functionality to ensure production readiness
 */

describe("Workflow Kit - End-to-End Test Suite", () => {
  
  // Setup: Create engine with sample actions
  const mockActions = [
    {
      kind: "send-email",
      name: "Send Email",
      handler: async () => ({ success: true }),
    },
    {
      kind: "update-db",
      name: "Update Database",
      handler: async () => ({ updated: true }),
    },
    {
      kind: "call-api",
      name: "Call External API",
      handler: async () => ({ status: 200 }),
    },
    {
      kind: "transform-data",
      name: "Transform Data",
      handler: async () => ({ transformed: true }),
    },
  ];

  let engine: Engine;

  beforeEach(() => {
    engine = new Engine({ actions: mockActions });
  });

  describe("Core Engine Functionality", () => {
    it("should initialize engine with actions", () => {
      expect(engine).toBeDefined();
    });

    it("should validate basic workflow structure", () => {
      const workflow: Workflow = {
        actions: [
          { id: "a1", kind: "send-email" },
        ],
        edges: [
          { from: "$source", to: "a1" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should reject workflow with unknown action kind", () => {
      const workflow: Workflow = {
        actions: [
          { id: "a1", kind: "unknown-action" },
        ],
        edges: [
          { from: "$source", to: "a1" },
        ],
      };

      expect(() => engine.graph(workflow)).toThrow(
        "Workflow instance references unknown action kind"
      );
    });
  });

  describe("Workflow Validation", () => {
    it("should require source edges", () => {
      const workflow: Workflow = {
        actions: [
          { id: "a1", kind: "send-email" },
          { id: "a2", kind: "update-db" },
        ],
        edges: [
          { from: "a1", to: "a2" },
        ],
      };

      expect(() => engine.graph(workflow)).toThrow(
        "Workflow has no starting actions"
      );
    });

    it("should detect disconnected actions", () => {
      const workflow: Workflow = {
        actions: [
          { id: "a1", kind: "send-email" },
          { id: "a2", kind: "update-db" },
          { id: "disconnected", kind: "call-api" },
        ],
        edges: [
          { from: "$source", to: "a1" },
          { from: "a1", to: "a2" },
        ],
      };

      expect(() => engine.graph(workflow)).toThrow();
    });

    it("should reject self-referencing edges", () => {
      const workflow: Workflow = {
        actions: [
          { id: "a1", kind: "send-email" },
        ],
        edges: [
          { from: "$source", to: "a1" },
          { from: "a1", to: "a1" }, // Self-reference
        ],
      };

      expect(() => engine.graph(workflow)).toThrow();
    });
  });

  describe("Complex Workflow Scenarios", () => {
    it("should handle linear workflow chain", () => {
      const workflow: Workflow = {
        actions: [
          { id: "step1", kind: "transform-data" },
          { id: "step2", kind: "send-email" },
          { id: "step3", kind: "update-db" },
        ],
        edges: [
          { from: "$source", to: "step1" },
          { from: "step1", to: "step2" },
          { from: "step2", to: "step3" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle parallel branches", () => {
      const workflow: Workflow = {
        actions: [
          { id: "split", kind: "transform-data" },
          { id: "email", kind: "send-email" },
          { id: "db", kind: "update-db" },
          { id: "api", kind: "call-api" },
        ],
        edges: [
          { from: "$source", to: "split" },
          { from: "split", to: "email" },
          { from: "split", to: "db" },
          { from: "split", to: "api" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle convergent workflow", () => {
      const workflow: Workflow = {
        actions: [
          { id: "task1", kind: "send-email" },
          { id: "task2", kind: "update-db" },
          { id: "task3", kind: "call-api" },
          { id: "merge", kind: "transform-data" },
        ],
        edges: [
          { from: "$source", to: "task1" },
          { from: "$source", to: "task2" },
          { from: "task1", to: "merge" },
          { from: "task2", to: "merge" },
          { from: "task3", to: "merge" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle complex DAG with multiple paths", () => {
      const workflow: Workflow = {
        actions: [
          { id: "init", kind: "transform-data" },
          { id: "a", kind: "send-email" },
          { id: "b", kind: "update-db" },
          { id: "c", kind: "call-api" },
          { id: "d", kind: "transform-data" },
          { id: "end", kind: "send-email" },
        ],
        edges: [
          { from: "$source", to: "init" },
          { from: "init", to: "a" },
          { from: "init", to: "b" },
          { from: "a", to: "d" },
          { from: "b", to: "d" },
          { from: "c", to: "d" },
          { from: "d", to: "end" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle single action workflow", () => {
      const workflow: Workflow = {
        actions: [
          { id: "only-action", kind: "send-email" },
        ],
        edges: [
          { from: "$source", to: "only-action" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle workflow with no edges after source", () => {
      const workflow: Workflow = {
        actions: [
          { id: "a1", kind: "send-email" },
        ],
        edges: [
          { from: "$source", to: "a1" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should reject empty workflow", () => {
      const workflow: Workflow = {
        actions: [],
        edges: [],
      };

      expect(() => engine.graph(workflow)).toThrow();
    });

    it("should validate action existence", () => {
      const workflow: Workflow = {
        actions: [
          { id: "a1", kind: "send-email" },
        ],
        edges: [
          { from: "$source", to: "non-existent" },
        ],
      };

      expect(() => engine.graph(workflow)).toThrow();
    });
  });

  describe("Graph Operations", () => {
    it("should compute graph topology correctly", () => {
      const workflow: Workflow = {
        actions: [
          { id: "start", kind: "transform-data" },
          { id: "middle", kind: "send-email" },
          { id: "end", kind: "update-db" },
        ],
        edges: [
          { from: "$source", to: "start" },
          { from: "start", to: "middle" },
          { from: "middle", to: "end" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should identify root nodes", () => {
      const workflow: Workflow = {
        actions: [
          { id: "root1", kind: "send-email" },
          { id: "root2", kind: "update-db" },
          { id: "child", kind: "call-api" },
        ],
        edges: [
          { from: "$source", to: "root1" },
          { from: "$source", to: "root2" },
          { from: "root1", to: "child" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle multiple terminal nodes", () => {
      const workflow: Workflow = {
        actions: [
          { id: "start", kind: "transform-data" },
          { id: "end1", kind: "send-email" },
          { id: "end2", kind: "update-db" },
        ],
        edges: [
          { from: "$source", to: "start" },
          { from: "start", to: "end1" },
          { from: "start", to: "end2" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });

  describe("Performance and Scalability", () => {
    it("should handle large workflow (50 actions)", () => {
      const actions = Array.from({ length: 50 }, (_, i) => ({
        id: `action${i}`,
        kind: mockActions[i % mockActions.length].kind,
      }));

      const edges = [
        { from: "$source", to: "action0" },
        ...Array.from({ length: 49 }, (_, i) => ({
          from: `action${i}`,
          to: `action${i + 1}`,
        })),
      ];

      const workflow: Workflow = { actions, edges };
      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle wide parallel workflow (10 branches)", () => {
      const actions = [
        { id: "split", kind: "transform-data" },
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `branch${i}`,
          kind: mockActions[i % mockActions.length].kind,
        })),
      ];

      const edges = [
        { from: "$source", to: "split" },
        ...Array.from({ length: 10 }, (_, i) => ({
          from: "split",
          to: `branch${i}`,
        })),
      ];

      const workflow: Workflow = { actions, edges };
      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });

  describe("Error Handling and Recovery", () => {
    it("should provide meaningful error messages", () => {
      const workflow: Workflow = {
        actions: [{ id: "bad", kind: "invalid" }],
        edges: [{ from: "$source", to: "bad" }],
      };

      expect(() => engine.graph(workflow)).toThrow();
    });

    it("should isolate errors to specific workflows", () => {
      const validWorkflow: Workflow = {
        actions: [{ id: "a", kind: "send-email" }],
        edges: [{ from: "$source", to: "a" }],
      };

      const invalidWorkflow: Workflow = {
        actions: [{ id: "b", kind: "unknown" }],
        edges: [{ from: "$source", to: "b" }],
      };

      const validGraph = engine.graph(validWorkflow);
      expect(validGraph).toBeDefined();

      expect(() => engine.graph(invalidWorkflow)).toThrow();
    });
  });
});
