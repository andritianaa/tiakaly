// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tiakaly.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/admin/',
                '/dashboard/',
                '/settings',
                '/bookmarks',
                '/private/',
                '/*?*', // Bloquer les URLs avec des paramètres de requête
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}