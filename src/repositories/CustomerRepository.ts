import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

export default class CustomerRepository {
  static findAll = async () => {
    return prisma.customer.findMany({
      orderBy: { name: "asc" },
    });
  };

  static findById = async (id: number) => {
    return prisma.customer.findUniqueOrThrow({
      where: { id },
      include: { projects: true },
    });
  };

  static create = async (data: Prisma.CustomerCreateInput) => {
    return prisma.customer.create({ data });
  };

  static update = async (id: number, data: Prisma.CustomerUpdateInput) => {
    // On s'assure que le client existe avant de le modifier
    await prisma.customer.findUniqueOrThrow({ where: { id } });

    return prisma.customer.update({ where: { id }, data });
  };

  static delete = async (id: number) => {
    // Un client ayant des projets ne peut pas être supprimé (onDelete: Restrict)
    await prisma.customer.findUniqueOrThrow({ where: { id } });

    return prisma.customer.delete({ where: { id } });
  };
}
