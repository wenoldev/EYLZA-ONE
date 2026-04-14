/**
 * Normalizes and prefixes a path with a store slug if necessary.
 * 
 * @param path The relative or absolute path (e.g., "/products" or "products")
 * @param slug The store slug to prefix (e.g., "my-store")
 * @returns The normalized, slug-prefixed path
 */
export const getStorePath = (path: string, slug?: string): string => {
    if (!slug) return path;

    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // If the path already includes the slug, don't prepend it again
    if (normalizedPath.startsWith(`/${slug}/`) || normalizedPath === `/${slug}`) {
        return normalizedPath;
    }

    // Don't prefix external links
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:')) {
        return path;
    }

    return `/${slug}${normalizedPath}`;
};
