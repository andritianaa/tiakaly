"use server";

import { SA } from "@/lib/safe-ation";
import { prisma } from "@/prisma";
import { TaskWithRelations } from "@/types/task";
import { Task, TaskPriority, TaskType } from "@prisma/client";

export const createTask = SA(
  async (
    session,
    type: TaskType,
    title: string,
    description: string,
    priority: TaskPriority,
    isFromFeedback: boolean
  ) => {
    await prisma.task.create({
      data: {
        type,
        title,
        description,
        priority,
        isFromFeedback,
        userId: session.userId,
      },
    });
  }
);

export const moderateTask = SA(
  async (
    session,
    id: string,
    isHidden: boolean,
    moderationReason: string
  ): Promise<Task> => {
    if (!session || !session.user.permissions.includes("MODERATOR")) {
      throw new Error("Unauthorized");
    }

    return await prisma.task.update({
      where: { id },
      data: {
        isHidden,
        moderationReason,
        moderatedAt: new Date(),
        moderatedBy: session.user.id,
      },
    });
  }
);

export const commentTask = SA(
  async (session, taskId: string, comment: string) => {
    await prisma.taskComment.create({
      data: {
        taskId: taskId,
        userId: session.userId,
        content: comment,
      },
    });
  }
);

// Update task status (for drag and drop functionality)
export const updateTaskStatus = SA(
  async (session, id: string, status: string) => {
    if (!session || !session.user.permissions.includes("ADMIN")) {
      throw new Error("Unauthorized");
    }

    return await prisma.task.update({
      where: { id },
      data: { status },
    });
  }
);

// Add comment to task
export const addTaskComment = SA(
  async (session, taskId: string, content: string) => {
    if (!session) {
      throw new Error("Unauthorized");
    }

    return await prisma.taskComment.create({
      data: {
        taskId,
        userId: session.user.id,
        content,
      },
      include: {
        user: true,
      },
    });
  }
);

// get tasks status list
export const TaskStatus = SA(async (): Promise<string[]> => {
  const list = await prisma.taskStatus.findMany({
    orderBy: {
      order: "asc",
    },
  });
  return list.map((status) => status.status);
});

export const createTaskStatus = SA(async (session, status: string) => {
  const count = await prisma.taskStatus.count();
  await prisma.taskStatus.create({
    data: {
      status,
      order: count + 1,
    },
  });
});

export const sortTaskStatus = SA(
  async (session, status: string, newOrder: number): Promise<null> => {
    try {
      console.log("status ==> ", status);
      console.log("newOrder ==> ", newOrder);

      // Vérifier si le statut existe
      const statusRecord = await prisma.taskStatus.findUnique({
        where: { status },
      });

      if (!statusRecord) {
        throw new Error("Status not found");
      }

      console.log("statusRecord found:", statusRecord);

      const oldOrder = statusRecord.order;

      // Obtenir tous les statuts pour mettre à jour leurs ordres individuellement
      const allStatuses = await prisma.taskStatus.findMany({
        orderBy: { order: "asc" },
      });

      console.log(
        "Current status order:",
        allStatuses.map((s) => `${s.status}: ${s.order}`)
      );

      // Utiliser des transactions individuelles pour chaque mise à jour
      return await prisma.$transaction(async (tx) => {
        // Mettre d'abord à jour le statut cible à un ordre temporaire négatif
        // pour éviter les conflits d'unicité
        await tx.taskStatus.update({
          where: { status },
          data: { order: -1 }, // Valeur temporaire
        });

        // Réorganiser les autres statuts
        if (oldOrder < newOrder) {
          // Déplacer vers le bas
          for (const s of allStatuses) {
            if (
              s.order > oldOrder &&
              s.order <= newOrder &&
              s.status !== status
            ) {
              await tx.taskStatus.update({
                where: { status: s.status },
                data: { order: s.order - 1 },
              });
            }
          }
        } else {
          // Déplacer vers le haut
          for (const s of allStatuses) {
            if (
              s.order >= newOrder &&
              s.order < oldOrder &&
              s.status !== status
            ) {
              await tx.taskStatus.update({
                where: { status: s.status },
                data: { order: s.order + 1 },
              });
            }
          }
        }

        // Mettre à jour le statut cible avec son nouvel ordre
        await tx.taskStatus.update({
          where: { status },
          data: { order: newOrder },
        });

        // Vérifier l'ordre final pour débogage
        const finalStatuses = await tx.taskStatus.findMany({
          orderBy: { order: "asc" },
        });
        console.log(
          "Final status order:",
          finalStatuses.map((s) => `${s.status}: ${s.order}`)
        );

        return null;
      });
    } catch (error) {
      console.log("Error details:", error);
      throw new Error(`Error sorting task status: ${error || String(error)}`);
    }
  }
);

export const renameTaskStatus = SA(
  async (session, currentName: string, newName: string) => {
    if (!session || !session.user.permissions.includes("ADMIN")) {
      throw new Error("Unauthorized");
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.taskStatus.update({
        where: { status: currentName },
        data: { status: newName },
      });

      await prisma.task.updateMany({
        where: { status: currentName },
        data: { status: newName },
      });
    });
  }
);

export const getTasks = async (
  page: number,
  limit: number,
  sortBy: string = "createdAt",
  sortDirection: "asc" | "desc" = "desc",
  where: any = {}
): Promise<TaskWithRelations[]> => {
  // Get paginated and sorted data
  const prismaResults = await prisma.task.findMany({
    where,
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
      attachments: true,
      moderator: true,
      assignedTo: true, // Make sure to include this relation
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortDirection,
    },
  });

  // Transform the Prisma result to match your interface
  const tasks: TaskWithRelations[] = prismaResults.map((task) => ({
    ...task,
    // Make sure nested objects have all required fields from your interface
    user: {
      id: task.user.id,
      username: task.user.username,
      firstname: task.user.firstname,
      fullname: task.user.fullname,
      image: task.user.image,
    },
    assignedTo: task.assignedTo
      ? {
          id: task.assignedTo.id,
          username: task.assignedTo.username,
          firstname: task.assignedTo.firstname,
          fullname: task.assignedTo.fullname,
          image: task.assignedTo.image,
        }
      : undefined,
    moderator: task.moderator
      ? {
          id: task.moderator.id,
          username: task.moderator.username,
          image: task.moderator.image,
          fullname: task.moderator.fullname,
        }
      : undefined,
    comments: task.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        firstname: comment.user.firstname,
        fullname: comment.user.fullname,
        image: comment.user.image,
      },
    })),
  }));

  return tasks;
};
