import { z } from 'zod';

// Schéma pour la création/mise à jour de Top
export const topSchema = z.object({
    title: z.string().min(1, {
        message: "Le titre est requis.",
    }),
    description: z.string().min(1, {
        message: "La description est requise.",
    }),
    top1Id: z.string().min(1, {
        message: "Le post numéro 1 est requis.",
    }),
    top1Reason: z.string().min(1, {
        message: "La raison pour le Top 1 est requise.",
    }),
    top2Id: z.string().optional(),
    top2Reason: z.string().min(1, {
        message: "La raison pour le Top 2 est requise.",
    }),
    top3Id: z.string().optional(),
    top3Reason: z.string().min(1, {
        message: "La raison pour le Top 3 est requise.",
    }),
    mainMediaId: z.string().min(1, {
        message: "L'image principale est requise.",
    }),
});