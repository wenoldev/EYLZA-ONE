import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useStoreUrl } from '../../hooks/useStoreUrl';

/**
 * A wrapper around React Router's Link component that automatically
 * prepends the current store slug to the destination URL.
 */
export const StoreLink: React.FC<LinkProps> = ({ to, children, ...props }) => {
    const { getStoreUrl } = useStoreUrl();
    
    const resolveTo = (target: LinkProps['to']): LinkProps['to'] => {
        if (typeof target === 'string') {
            return getStoreUrl(target);
        }
        // If it's an object (Partial<Path>), we don't easily prefix it without more complex logic,
        // but for most theme components, 'to' is a string link.
        return target;
    };

    return (
        <Link to={resolveTo(to)} {...props}>
            {children}
        </Link>
    );
};
