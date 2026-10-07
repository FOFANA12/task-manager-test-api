import { afterEach, beforeAll, describe, expect, test } from "vitest";
import { prisma } from "../../src/lib/prisma.js";
import CustomerRepository from "../../src/repositories/CustomerRepository.js";

describe("CustomerRepository - Integration Tests", () => {
  const buildCustomerData = () => ({
    name: "Acme Corp",
    email: "contact@acme.test",
    phone: "0102030405",
    address: "1 rue de la Paix, Paris",
  });

  const truncateTables = async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
      await tx.$executeRaw`TRUNCATE TABLE projects;`;
      await tx.$executeRaw`TRUNCATE TABLE customers;`;
      await tx.$executeRaw`TRUNCATE TABLE tasks;`;
      await tx.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
    });
  };

  beforeAll(truncateTables);
  afterEach(truncateTables);

  test("creates a customer", async () => {
    const data = buildCustomerData();

    const customer = await CustomerRepository.create(data);

    expect(customer).toMatchObject(data);
    expect(customer.id).toBeDefined();
  });

  test("rejects a duplicate email", async () => {
    await CustomerRepository.create(buildCustomerData());

    await expect(
      CustomerRepository.create(buildCustomerData()),
    ).rejects.toThrow();
  });

  test("retrieves an existing customer", async () => {
    const createdCustomer = await CustomerRepository.create(buildCustomerData());

    const customer = await CustomerRepository.findById(createdCustomer.id);

    expect(customer).toMatchObject(createdCustomer);
  });

  test("rejects an invalid customer id", async () => {
    await expect(CustomerRepository.findById(-1)).rejects.toThrow();
  });

  test("updates a customer with valid data", async () => {
    const data = {
      ...buildCustomerData(),
      name: "New name",
    };

    const createdCustomer = await CustomerRepository.create(buildCustomerData());

    const updatedCustomer = await CustomerRepository.update(
      createdCustomer.id,
      data,
    );

    expect(updatedCustomer).toMatchObject(data);
    expect(updatedCustomer.name).toEqual(data.name);
  });

  test("rejects an update with an invalid customer id", async () => {
    const data = {
      ...buildCustomerData(),
      name: "New name",
    };

    await expect(CustomerRepository.update(-1, data)).rejects.toThrow();
  });

  test("deletes a customer", async () => {
    const createdCustomer = await CustomerRepository.create(buildCustomerData());

    await CustomerRepository.delete(createdCustomer.id);

    const customer = await prisma.customer.findUnique({
      where: { id: createdCustomer.id },
    });

    expect(customer).toBeNull();
  });

  test("rejects a delete with an invalid customer id", async () => {
    await expect(CustomerRepository.delete(-1)).rejects.toThrow();
  });

  test("rejects a delete of a customer with projects", async () => {
    const createdCustomer = await CustomerRepository.create(buildCustomerData());

    await prisma.project.create({
      data: {
        name: "Task Manager API",
        dueDate: new Date("2026-12-31T00:00:00.000Z"),
        customerId: createdCustomer.id,
      },
    });

    await expect(
      CustomerRepository.delete(createdCustomer.id),
    ).rejects.toThrow();
  });
});
