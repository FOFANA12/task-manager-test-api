import { test, expect, describe } from "vitest";
import {
  generateTaskReference,
  isTaskOverdue,
  validateTaskTitle,
} from "../../src/helpers/task.helper.js";

describe("validateTaskTitle", () => {
  test("accepts a valid title", () => {
    const title = "Create a web app";

    expect(validateTaskTitle(title)).toBe(true);
  });

  test("rejects a title that is too short", () => {
    const title = "Cr";

    expect(validateTaskTitle(title)).toBe(false);
  });
});

describe("generateTaskReference", () => {
  test("generates a reference with the TA prefix", () => {
    expect(generateTaskReference(123)).toBe("TA-123");
  });

  test("keeps IDs longer than 3 digits", () => {
    expect(generateTaskReference(1234)).toBe("TA-1234");
  });
});

describe("isTaskOverdue", () => {
  test("detects an overdue incomplete task", () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - 7);
    const status = "todo";

    expect(isTaskOverdue(dueDate, status)).toBe(true);
  });

  test("ignores a completed task with a past due date", () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - 7);
    const status = "completed";

    expect(isTaskOverdue(dueDate, status)).toBe(false);
  });

  test("ignores a task with a future due date", () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const status = "todo";

    expect(isTaskOverdue(dueDate, status)).toBe(false);
  });
});
