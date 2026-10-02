import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

export default class ProjectRepository {
  static findAll = async () => {
    return prisma.project.findMany({
      include: {
        customer: true,
        tasks: true,
      },
    });
  };

  static findById = async (id: number) => {
    return prisma.project.findUniqueOrThrow({
      where: { id },
      include: {
        customer: true,
        tasks: true,
      },
    });
  };

  static create = async (data: Prisma.ProjectUncheckedCreateInput) => {
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({ data });

      // La référence dépend de l'id, elle est donc générée après la création
      return tx.project.update({
        where: { id: project.id },
        data: {
          reference: `PRJ-${String(project.id).padStart(4, "0")}`,
        },
      });
    });
  };

  static update = async (
    id: number,
    data: Prisma.ProjectUncheckedUpdateInput
  ) => {
    // On s'assure que le projet existe avant de le modifier
    await prisma.project.findUniqueOrThrow({ where: { id } });

    return prisma.project.update({ where: { id }, data });
  };

  static delete = async (id: number) => {
    // Les tâches liées sont supprimées en cascade (onDelete: Cascade)
    await prisma.project.findUniqueOrThrow({ where: { id } });

    return prisma.project.delete({ where: { id } });
  };
}
