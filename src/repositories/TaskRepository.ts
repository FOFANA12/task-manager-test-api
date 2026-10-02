import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

// dueDate devient optionnelle : par défaut, la date du jour
type CreateTaskInput = Omit<Prisma.TaskUncheckedCreateInput, "dueDate"> & {
  dueDate?: Date;
};

export default class TaskRepository {
  static findAll = async () => {
    return prisma.task.findMany({
      include: { project: true },
    });
  };

  static findById = async (id: number) => {
    return prisma.task.findUniqueOrThrow({
      where: { id },
      include: { project: true },
    });
  };

  static create = async (data: CreateTaskInput) => {
    return prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ?? new Date(),
      },
    });
  };

  static update = async (id: number, data: Prisma.TaskUncheckedUpdateInput) => {
    // On s'assure que la tâche existe avant de la modifier
    await prisma.task.findUniqueOrThrow({ where: { id } });

    return prisma.task.update({ where: { id }, data });
  };

  static delete = async (id: number) => {
    await prisma.task.findUniqueOrThrow({ where: { id } });

    return prisma.task.delete({ where: { id } });
  };
}
