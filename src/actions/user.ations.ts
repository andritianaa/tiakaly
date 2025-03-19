"use server";

import { randomBytes } from 'crypto';

import { trackAction } from '@/actions/tracking.actions';
import { hashPassword } from '@/lib/auth';
import { sendResetEmail } from '@/lib/mail';
import { SA } from '@/lib/safe-ation';
import { prisma } from '@/prisma';
import { Actions } from '@prisma/client';

export const editUser = SA(
  async (
    session,
    firstname: string,
    lastname: string,
    username: string,
    description: string
  ) => {
    // Check if the new username is different from the current one
    if (username !== session.user.username) {
      // Check if the new username is already taken
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        throw new Error("Username already taken");
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { firstname, lastname, username, description },
    });
  }
);

export const editImage = SA(async (session, image: string) => {
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image },
  });
  await trackAction(Actions.EDIT_IMAGE, {
    prev: session.user.image,
    new: image,
  });
});

export const editTheme = SA(async (session, theme: string) => {
  await prisma.user.update({
    where: { id: session.user.id },
    data: { theme },
  });
  await trackAction(Actions.EDIT_THEME, {
    prev: session.user.theme,
    new: theme,
  });
});

export const editLangange = SA(async (session, language: string) => {
  await prisma.user.update({
    where: { id: session.user.id },
    data: { language },
  });
  await trackAction(Actions.EDIT_LANGAGE, {
    prev: session.user.language,
    new: language,
  });
});

export const editPassword = SA(
  async (
    session,
    newPassword: string,
    currentPassword: string
  ): Promise<boolean> => {
    const hashedCurrentPassword = await hashPassword(currentPassword);
    const hashedNewPassword = await hashPassword(newPassword);
    const userWithPassword = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (hashedCurrentPassword != userWithPassword!.password) {
      throw new Error("Wrong password");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedNewPassword,
      },
    });
    await trackAction(Actions.EDIT_PASSWORD, {
      new: hashedNewPassword,
    });
    return true;
  }
);

export const resetPassword = SA(
  async (session, token: string, password: string): Promise<boolean> => {
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRequest || resetRequest.expires < new Date()) {
      throw new Error("Invalid or expired token");
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { email: resetRequest.email },
      data: { password: hashedPassword },
    });

    // Supprimer le token utilisé
    await prisma.passwordReset.delete({
      where: { token },
    });
    await trackAction(Actions.RESET_PASSWORD);
    return true;
  }
);

export const forgotPassword = async (email: string) => {
  // Vérifier si l'utilisateur existe

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("If this address exists, an email has been sent.");
  }

  // Générer un token unique
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 heure

  // Supprimer les anciens tokens
  await prisma.passwordReset.deleteMany({
    where: { email },
  });

  // Créer un nouveau token
  await prisma.passwordReset.create({
    data: {
      email,
      token,
      expires,
    },
  });

  await trackAction(Actions.FORGOT_PASSWORD, {
    token,
  });

  // Envoyer l'email
  await sendResetEmail(email, token);
};

export const getUserIdByEmail = async (email: string): Promise<string> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (user) {
    return user.id;
  } else throw new Error("User not found");
};

export const EditUserTourDone = SA(async (user, tourName: string) => {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      tourOnboarding: {
        push: tourName,
      },
    },
  });
});
