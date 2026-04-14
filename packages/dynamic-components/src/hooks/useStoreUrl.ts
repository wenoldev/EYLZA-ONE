import { useParams } from 'react-router-dom';
import { getStorePath } from '../utils/route';

/**
 * Hook to handle store-relative URL generation
 */
export const useStoreUrl = () => {
    const { storeSlug } = useParams();

    /**
     * Prepends the current store slug to a given path
     * @param path The relative path (e.g. '/products')
     * @returns The store-relative path (e.g. '/my-slug/products')
     */
    const getStoreUrl = (path: string) => {
        return getStorePath(path, storeSlug);
    };

    return {
        storeSlug,
        getStoreUrl
    };
};
