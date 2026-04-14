const API_BASE_URL = ((import.meta as any).env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '') + '/api/v1';

export async function getProductListItems(storeId?: string) {
    const effectiveStoreId = storeId || (globalThis as any).__EYLZA_STORE_ID__;
    try {
        const url = new URL(`${API_BASE_URL}/public/products`);
        if (effectiveStoreId) {
            url.searchParams.append('store_id', effectiveStoreId);
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const result = await response.json();
        const products = result.data?.products || [];
        
        if (products.length === 0) return getHardcodedProducts();

        return products.map((p: any) => ({
            imageUrl: p.images?.[0]?.url || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop",
            id: p.id,
            title: p.name,
            subtitle: p.description ? (p.description.slice(0, 100) + (p.description.length > 100 ? '...' : '')) : "",
            price: `Rs. ${p.price?.toLocaleString()}`,
            category: p.category_ids?.[0] || "General",
            oldPrice: p.compare_at_price ? `Rs. ${p.compare_at_price.toLocaleString()}` : undefined,
            onSale: !!(p.compare_at_price && p.compare_at_price > p.price),
            soldOut: p.stock_status === 'out_of_stock' || p.inventory_quantity === 0,
            href: `/product/${p.id}`
        }));
    } catch (error) {
        console.error('API Error, falling back to hardcoded data:', error);
        return getHardcodedProducts();
    }
}

function getHardcodedProducts() {
    return [
        {
            imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop",
            title: "ADJUSTABLE RING",
            subtitle: "Rs. 1,099.00",
            price: "Rs. 1,099.00",
            category: "Rings"
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
            title: "Hidden Message Curved Bar Bracelet",
            subtitle: "Rs. 1,299.00",
            price: "Rs. 1,299.00",
            oldPrice: "Rs. 1,699.00",
            category: "Bracelets",
            onSale: true
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop",
            title: "Initials Birthstone Necklace",
            subtitle: "From Rs. 1,499.00",
            price: "Rs. 1,499.00",
            category: "Necklaces",
            variants: true
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b1a308c021?q=80&w=1974&auto=format&fit=crop",
            title: "NAME ENGRAVED BRACELET",
            subtitle: "Rs. 1,499.00",
            price: "Rs. 1,499.00",
            oldPrice: "Rs. 1,999.00",
            category: "Bracelets",
            onSale: true
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1599643446500-7584cd57ca0b?q=80&w=1974&auto=format&fit=crop",
            title: "Personalised Birthstone Necklace",
            subtitle: "From Rs. 1,499.00",
            price: "Rs. 1,499.00",
            oldPrice: "Rs. 2,299.00",
            category: "Necklaces",
            onSale: true
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1573408302185-9127fe5a9200?q=80&w=2072&auto=format&fit=crop",
            title: "Personalised Family Birthstone Bracelet",
            subtitle: "Rs. 1,499.00",
            price: "Rs. 1,499.00",
            category: "Bracelets",
            soldOut: true
        }
    ];
}

export async function getSliderItems() {
    return getProductListItems();
}

export async function getHeaderMenus() {
    return {
        mainSection: [
            { title: 'Home', link: '/' },
            { title: 'Shop', link: '/shop' },
            { title: 'About', link: '/about' },
            { title: 'Contact', link: '/contact' },
        ],
        categoryBar: [
            { title: 'Electronics', link: '/category/electronics' },
            { title: 'Fashion', link: '/category/fashion' },
            { title: 'Home & Living', link: '/category/home-living' },
        ]
    };
}

export function getHeaderActions() {
    return {};
}

export async function getFooterMenus() {
    return {
        quickLinks: [
            { label: 'Products', href: '/products' },
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
        ],
        supportLinks: [
            { label: 'Contact', href: '/contact' },
            { label: 'Shipping', href: '/shipping' },
        ],
        policyLinks: [
            { label: 'Privacy', href: '/policy/privacy-policy' },
            { label: 'Terms and Condition', href: '/policy/terms-conditions' },
            { label: 'Refund Policy', href: '/policy/refund-policy' },
        ],
    };
}

export async function getFooterCompanyInfo() {
    return {
        companyInfo: {
            name: 'Your Store Name',
            logoUrl: '/logo.png',
            description: 'We provide the best quality products for our customers.',
            tagline: 'Your tagline goes here',
            address: '123 Store St, City, Country',
            phone: '+1 234 567 890',
            email: 'support@example.com',
        },
        socialLinks: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            linkedin: '#',
            youtube: '#',
        },
    };
}
