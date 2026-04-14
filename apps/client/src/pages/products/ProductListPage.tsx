import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useCartStore } from '@/store/useCartStore';
import { useProductStore } from '@/store/useProductStore';
import { Filter, Search, ChevronDown, ShoppingBag, Heart, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductListPage: React.FC = () => {
    const { storeId } = useStore();
    const { addItem } = useCartStore();
    const { products, isLoading, fetchProducts, filters, setFilters } = useProductStore();
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Dropdown states
    const [activeDropdown, setActiveDropdown] = useState<'availability' | 'price' | 'sort' | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (storeId) {
            fetchProducts(storeId, { search: searchQuery });
        }
    }, [storeId, searchQuery, fetchProducts, filters.stock_status, filters.sort_by, filters.min_price, filters.max_price]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (name: 'availability' | 'price' | 'sort') => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const handleSortChange = (value: any) => {
        setFilters({ sort_by: value });
        setActiveDropdown(null);
    };

    const handleStockChange = (value: any) => {
        setFilters({ stock_status: value });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold italic mb-3">Our Collection</h1>
                    <p className="text-muted-foreground max-w-lg">
                        Explore our curated selection of handcrafted jewelry, designed to celebrate life's most precious moments.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search articles..."
                            className="pl-10 pr-4 py-2 bg-accent/30 border border-border rounded-full text-sm focus:ring-2 focus:ring-primary outline-none transition-all w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters Bar - Desktop */}
            <div className="hidden lg:flex items-center justify-between py-6 border-y border-border mb-12" ref={dropdownRef}>
                <div className="flex items-center gap-x-12">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/50">Filter:</span>
                        
                        {/* Availability Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('availability')}
                                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                Availability
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'availability' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'availability' && (
                                <div className="absolute top-full left-0 mt-4 w-64 bg-background border border-border shadow-2xl z-50 p-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-4">
                                        {['all', 'in_stock', 'out_of_stock'].map((status) => (
                                            <label key={status} className="flex items-center justify-between cursor-pointer group">
                                                <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
                                                <input 
                                                    type="radio" 
                                                    name="stock" 
                                                    checked={filters.stock_status === status || (!filters.stock_status && status === 'all')}
                                                    onChange={() => handleStockChange(status)}
                                                    className="w-4 h-4 accent-primary" 
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('price')}
                                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                Price
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'price' && (
                                <div className="absolute top-full left-0 mt-4 w-80 bg-background border border-border shadow-2xl z-50 p-8 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            <span>Price Range</span>
                                            <button onClick={() => setFilters({ min_price: undefined, max_price: undefined })} className="underline hover:text-primary">Reset</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Min</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                                    <input 
                                                        type="number" 
                                                        value={filters.min_price || ''}
                                                        onChange={(e) => setFilters({ min_price: e.target.value ? Number(e.target.value) : undefined })}
                                                        className="w-full pl-7 pr-3 py-2 bg-accent/30 border border-border rounded text-sm outline-none" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                                    <input 
                                                        type="number" 
                                                        value={filters.max_price || ''}
                                                        onChange={(e) => setFilters({ max_price: e.target.value ? Number(e.target.value) : undefined })}
                                                        className="w-full pl-7 pr-3 py-2 bg-accent/30 border border-border rounded text-sm outline-none" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 border-l border-border pl-12">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/50">Sort By:</span>
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('sort')}
                                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                {filters.sort_by ? filters.sort_by.replace(/_/g, ' ') : 'Alphabetically, A-Z'}
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                            </button>
                            {activeDropdown === 'sort' && (
                                <div className="absolute top-full left-0 mt-4 w-72 bg-background border border-border shadow-2xl z-50 py-4 animate-in fade-in slide-in-from-top-2">
                                    {[
                                        { label: 'Alphabetically, A-Z', value: 'alphabetical_asc' },
                                        { label: 'Alphabetically, Z-A', value: 'alphabetical_desc' },
                                        { label: 'Price, low to high', value: 'price_low_high' },
                                        { label: 'Price, high to low', value: 'price_high_low' },
                                        { label: 'Date, new to old', value: 'newest' }
                                    ].map((opt) => (
                                        <button 
                                            key={opt.value}
                                            onClick={() => handleSortChange(opt.value)}
                                            className="w-full px-6 py-3 text-left text-sm font-medium hover:bg-accent hover:text-primary transition-all flex items-center justify-between group"
                                        >
                                            {opt.label}
                                            {filters.sort_by === opt.value && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                    {products.length} products
                </div>
            </div>

            {/* Filters Bar - Mobile & Tablet */}
            <div className="lg:hidden flex items-center justify-between py-6 border-y border-border mb-12">
                <button 
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] bg-foreground text-background px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    <Filter className="w-4 h-4" />
                    Filter & Sort
                </button>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {products.length} Products
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {isFilterDrawerOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity animate-in fade-in"
                        onClick={() => setIsFilterDrawerOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background z-[101] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="flex items-center justify-between p-8 border-b">
                            <h2 className="text-2xl font-serif font-bold italic">Filters</h2>
                            <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Availability</h3>
                                <div className="space-y-4">
                                    {['all', 'in_stock', 'out_of_stock'].map((status) => (
                                        <label key={status} className="flex items-center gap-4 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="mobile_stock" 
                                                checked={filters.stock_status === status || (!filters.stock_status && status === 'all')}
                                                onChange={() => handleStockChange(status)}
                                                className="w-5 h-5 accent-primary" 
                                            />
                                            <span className="text-sm font-bold uppercase tracking-widest capitalize">{status.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Price</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <input type="number" placeholder="Min" className="w-full px-4 py-3 bg-accent/30 border border-border rounded-xl text-sm outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <input type="number" placeholder="Max" className="w-full px-4 py-3 bg-accent/30 border border-border rounded-xl text-sm outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Sort By</h3>
                                <select 
                                    value={filters.sort_by || 'alphabetical_asc'}
                                    onChange={(e) => setFilters({ sort_by: e.target.value as any })}
                                    className="w-full px-4 py-4 bg-accent/30 border border-border rounded-xl text-sm font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none transition-all"
                                >
                                    <option value="alphabetical_asc">Alphabetically, A-Z</option>
                                    <option value="alphabetical_desc">Alphabetically, Z-A</option>
                                    <option value="price_low_high">Price: Low to High</option>
                                    <option value="price_high_low">Price: High to Low</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-8 border-t bg-stone-50">
                            <button 
                                onClick={() => setIsFilterDrawerOpen(false)}
                                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Products Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-accent aspect-[3/4] rounded-2xl mb-4" />
                            <div className="h-4 bg-accent rounded w-3/4 mb-2" />
                            <div className="h-4 bg-accent rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product) => {
                        const primaryImage = product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url || "/images/placeholder.jpg";
                        
                        return (
                            <Link key={product.id} to={`/product/${product.id}`} className="group block">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-accent mb-6 shadow-sm border border-border/10">
                                    <img 
                                        src={primaryImage} 
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                        <button 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            className="p-3 bg-white/90 backdrop-blur-md rounded-full text-foreground hover:bg-white hover:text-destructive transition-all shadow-xl"
                                        >
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addItem({
                                                    ...product,
                                                    image_url: primaryImage
                                                });
                                            }}
                                            className="w-full bg-white text-foreground py-4 rounded-2xl font-bold uppercase tracking-[0.1em] text-xs shadow-2xl flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Quick View
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 px-1 text-center sm:text-left">
                                    <p className="text-[10px] text-primary font-bold uppercase tracking-[0.25em] leading-none mb-1">
                                        {product.category_ids?.[0] || 'Aurelian Luxe'}
                                    </p>
                                    <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <span className="text-lg font-bold tabular-nums">₹{product.price.toLocaleString()}</span>
                                        {product.original_price && (
                                            <span className="text-sm text-muted-foreground line-through tabular-nums opacity-60">
                                                ₹{product.original_price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {products.length === 0 && !isLoading && (
                <div className="text-center py-32 space-y-6">
                    <div className="w-24 h-24 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold italic">No results found</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                    <button onClick={() => setFilters({})} className="text-primary font-bold uppercase tracking-widest underline decoration-2 underline-offset-8">Clear all filters</button>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;
