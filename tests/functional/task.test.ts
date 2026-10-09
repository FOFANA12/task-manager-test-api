import { test, describe, expect, beforeAll, afterEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";
import { TaskPriority, TaskStatus } from "../../src/generated/prisma/enums.js";

const buildTaskData = {
  title: "Write integration tests",
  description: "Cover the task CRUD endpoints",
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  due_date: "2026-12-31",
};

describe("Functional Test Task ", () => {
  beforeAll(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
      await tx.$executeRaw`TRUNCATE TABLE projects;`;
      await tx.$executeRaw`TRUNCATE TABLE customers;`;
      await tx.$executeRaw`TRUNCATE TABLE tasks;`;
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    });
  });

  afterEach(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
      await tx.$executeRaw`TRUNCATE TABLE tasks;`;
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    });
  });

  test("Retrieves list of tasks", async () => {
    await request(app).post("/api/v1/tasks").send(buildTaskData);
    await request(app)
      .post("/api/v1/tasks")
      .send({ ...buildTaskData, title: "Second title" });

    const response = await request(app).get("/api/v1/tasks");

    expect(response.status).toBe(200);
    expect(response.body.tasks).toHaveLength(2);
    expect(response.body.tasks[0]).toMatchObject({
      title: "Write integration tests",
      description: "Cover the task CRUD endpoints",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: "2026-12-31T00:00:00.000Z",
    });
  });
});
