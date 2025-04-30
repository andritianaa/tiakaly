import { MetadataRoute } from 'next';

// app/sitemap.ts
import { prisma } from '@/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tiakaly.com';

    // 1. Récupérer tous les lieux publiés
    const places = await prisma.place.findMany({
        where: {
            status: 'published', // Uniquement les lieux publiés
        },
        select: {
            id: true,
            updatedAt: true,
        },
    });

    // 2. Récupérer tous les posts Instagram
    const postInstas = await prisma.postInsta.findMany({
        select: {
            id: true,
            date: true,
        },
    });

    // 3. Récupérer tous les tops
    const tops = await prisma.top.findMany({
        select: {
            id: true,
            createdAt: true,
        },
    });

    // Créer les URLs pour les lieux
    const placeUrls = places.map((place) => ({
        url: `${baseUrl}/place/${place.id}`,
        lastModified: place.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Créer les URLs pour les posts Instagram
    const postInstaUrls = postInstas.map((post) => ({
        url: `${baseUrl}/post/${post.id}`,
        lastModified: post.date,
        changeFrequency: 'daily' as const,
        priority: 0.6,
    }));

    // Créer les URLs pour les tops
    const topUrls = tops.map((top) => ({
        url: `${baseUrl}/top/${top.id}`,
        lastModified: top.createdAt,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // Ajouter les pages statiques
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/places`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/post-instas`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tops`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/map`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },

        // Ajoutez d'autres pages statiques importantes ici
    ];

    // Combiner toutes les URLs
    return [...staticPages, ...placeUrls, ...postInstaUrls, ...topUrls];
}