import { afterEach, beforeAll, describe, expect, test } from "vitest";
import { prisma } from "../../src/lib/prisma.js";
import {
  Project,
  TaskPriority,
  TaskStatus,
} from "../../src/generated/prisma/client.js";
import TaskRepository from "../../src/repositories/TaskRepository.js";

describe("TaskRepository - Integration Tests", () => {
  let project: Project;

  const buildTaskData = (projectId = project.id) => ({
    title: "Write integration tests",
    description: "Cover the task CRUD endpoints",
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    dueDate: new Date("2026-12-31T00:00:00.000Z"),
    projectId,
  });

  beforeAll(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
      await tx.$executeRaw`TRUNCATE TABLE projects;`;
      await tx.$executeRaw`TRUNCATE TABLE customers;`;
      await tx.$executeRaw`TRUNCATE TABLE tasks;`;
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    });

    project = await prisma.project.create({
      data: {
        reference: "Ref-001",
        name: "Task Manager API",
        description: "Project used for task integration tests",
        status: "IN_PROGRESS",
        amountExclTax: 1500,
        vatRate: 20,
        startDate: new Date("2026-10-01"),
        dueDate: new Date("2026-12-31"),
        customer: {
          create: {
            name: "Acme Corp",
            email: "contact@acme.test",
            phone: "0102030405",
            address: "1 rue de la Paix, Paris",
          },
        },
      },
    });
  });

  afterEach(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
      await tx.$executeRaw`TRUNCATE TABLE tasks;`;
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    });
  });

  test("creates a task", async () => {
    const data = buildTaskData();

    const task = await TaskRepository.create(data);
    expect(task).toMatchObject(data);
    expect(task.id).toBeDefined();
  });

  test("rejects an invalid project id", async () => {
    const data = buildTaskData(-1);

    await expect(TaskRepository.create(data)).rejects.toThrow();
  });

  test("retrieves an existing task", async () => {
    const data = buildTaskData();

    const createdTask = await TaskRepository.create(data);

    const task = await prisma.task.findFirstOrThrow({
      where: { id: createdTask.id },
    });

    expect(task).toMatchObject(createdTask);
    expect(task.id).toBeDefined();
  });

  test("rejects an invalid task id", async () => {
    const data = buildTaskData();

    await TaskRepository.create(data);

    await expect(
      prisma.task.findFirstOrThrow({
        where: { id: -1 },
      }),
    ).rejects.toThrow();
  });

  test("updates a task with valid data", async () => {
    const data = {
      ...buildTaskData(),
      title: "New title",
    };

    const createdTask = await TaskRepository.create(buildTaskData());

    const updatedTask = await TaskRepository.update(createdTask.id, data);

    expect(updatedTask).toMatchObject(data);
    expect(updatedTask.title).toEqual(data.title);
  });

  test("rejects an update with an invalid task id", async () => {
    const data = {
      ...buildTaskData(),
      title: "New title",
    };

    await TaskRepository.create(buildTaskData());

    await expect(TaskRepository.update(-1, data)).rejects.toThrow();
  });

  test("deletes a task", async () => {
    const createdTask = await TaskRepository.create(buildTaskData());

    await TaskRepository.delete(createdTask.id);

    const task = await prisma.task.findUnique({
      where: { id: createdTask.id },
    });

    expect(task).toBeNull();
  });

  test("rejects a delete with an invalid task id", async () => {
    await TaskRepository.create(buildTaskData());

    await expect(TaskRepository.delete(-1)).rejects.toThrow();
  });
});
