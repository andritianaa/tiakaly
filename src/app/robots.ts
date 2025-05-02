import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tiakaly.com';

    return {
        rules: [
            {
                // Règle par défaut: autoriser tout
                userAgent: '*',
                allow: '/',
            },
            {
                // Règle spécifique pour bloquer certains chemins sensibles
                userAgent: '*',
                disallow: [
                    '/api/',     // Bloquer uniquement les API privées
                    '/admin/',           // Zone d'administration
                    '/dashboard/',        // Tableau de bord utilisateur
                    '/settings',          // Paramètres utilisateur
                    '/bookmarks',         // Signets personnels
                    '/private/',          // Contenu privé
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}