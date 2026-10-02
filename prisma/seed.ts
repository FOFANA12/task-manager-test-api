import { prisma } from "../src/lib/prisma.js";
import {
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "../src/generated/prisma/client.js";

// Date relative à aujourd'hui (ex. : inDays(-7) = il y a une semaine)
const inDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const main = async () => {
  // Ordre imposé par les relations : tâches, puis projets, puis clients (onDelete: Restrict)
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.customer.deleteMany({});

  const customer = await prisma.customer.create({
    data: {
      name: "Acme Corp",
      email: "contact@acme.test",
      phone: "0102030405",
      address: "12 rue de la Paix, 75002 Paris",
    },
  });

  // Création imbriquée : le projet et ses tâches en une seule requête
  const project = await prisma.project.create({
    data: {
      name: "Task Manager",
      description: "Application de gestion de projets et de tâches",
      status: ProjectStatus.IN_PROGRESS,
      amountExclTax: 15000,
      vatRate: 20,
      startDate: inDays(-14),
      dueDate: inDays(30),
      customerId: customer.id,
      tasks: {
        create: [
          {
            title: "Créer la base de données",
            description: "Créer les tables principales du projet",
            status: TaskStatus.COMPLETED,
            priority: TaskPriority.HIGH,
            dueDate: inDays(-7),
          },
          {
            title: "Créer les modèles",
            description: "Créer les classes métier en TypeScript",
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.HIGH,
            dueDate: inDays(3),
          },
          {
            title: "Créer les repositories",
            description: "Centraliser les accès aux données",
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            dueDate: inDays(10),
          },
        ],
      },
    },
  });

  // Même règle que ProjectRepository.create : la référence dépend de l'id
  await prisma.project.update({
    where: { id: project.id },
    data: { reference: `PRJ-${String(project.id).padStart(4, "0")}` },
  });
};

main()
  .then(async () => {
    console.log("Seed is successfully executed");
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("Seed failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
