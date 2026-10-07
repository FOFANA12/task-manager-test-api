import { afterEach, beforeAll, describe, expect, test } from "vitest";
import { prisma } from "../../src/lib/prisma.js";
import {
  Customer,
  ProjectStatus,
} from "../../src/generated/prisma/client.js";
import ProjectRepository from "../../src/repositories/ProjectRepository.js";

describe("ProjectRepository - Integration Tests", () => {
  let customer: Customer;

  const buildProjectData = (customerId = customer.id) => ({
    name: "Task Manager API",
    description: "Project used for project integration tests",
    status: ProjectStatus.IN_PROGRESS,
    startDate: new Date("2026-10-01T00:00:00.000Z"),
    dueDate: new Date("2026-12-31T00:00:00.000Z"),
    customerId,
  });

  beforeAll(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
      await tx.$executeRaw`TRUNCATE TABLE projects;`;
      await tx.$executeRaw`TRUNCATE TABLE customers;`;
      await tx.$executeRaw`TRUNCATE TABLE tasks;`;
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    });

    customer = await prisma.customer.create({
      data: {
        name: "Acme Corp",
        email: "contact@acme.test",
        phone: "0102030405",
        address: "1 rue de la Paix, Paris",
      },
    });
  });

  afterEach(async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
      await tx.$executeRaw`TRUNCATE TABLE projects;`;
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    });
  });

  test("creates a project", async () => {
    const data = buildProjectData();

    const project = await ProjectRepository.create(data);

    expect(project).toMatchObject(data);
    expect(project.id).toBeDefined();
  });

  test("generates a reference on creation", async () => {
    const project = await ProjectRepository.create(buildProjectData());

    expect(project.reference).toEqual(
      `PRJ-${String(project.id).padStart(4, "0")}`,
    );
  });

  test("rejects an invalid customer id", async () => {
    const data = buildProjectData(-1);

    await expect(ProjectRepository.create(data)).rejects.toThrow();
  });

  test("retrieves an existing project", async () => {
    const createdProject = await ProjectRepository.create(buildProjectData());

    const project = await ProjectRepository.findById(createdProject.id);

    expect(project).toMatchObject(createdProject);
  });

  test("rejects an invalid project id", async () => {
    await expect(ProjectRepository.findById(-1)).rejects.toThrow();
  });

  test("updates a project with valid data", async () => {
    const data = {
      ...buildProjectData(),
      name: "New name",
    };

    const createdProject = await ProjectRepository.create(buildProjectData());

    const updatedProject = await ProjectRepository.update(
      createdProject.id,
      data,
    );

    expect(updatedProject).toMatchObject(data);
    expect(updatedProject.name).toEqual(data.name);
  });

  test("rejects an update with an invalid project id", async () => {
    const data = {
      ...buildProjectData(),
      name: "New name",
    };

    await expect(ProjectRepository.update(-1, data)).rejects.toThrow();
  });

  test("deletes a project", async () => {
    const createdProject = await ProjectRepository.create(buildProjectData());

    await ProjectRepository.delete(createdProject.id);

    const project = await prisma.project.findUnique({
      where: { id: createdProject.id },
    });

    expect(project).toBeNull();
  });

  test("rejects a delete with an invalid project id", async () => {
    await expect(ProjectRepository.delete(-1)).rejects.toThrow();
  });
});
