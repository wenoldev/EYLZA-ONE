import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface FilterProps {
    config?: {
        showFilters?: boolean;
        showSort?: boolean;
        options?: ('availability' | 'price')[];
    };
    totalProducts: number;
    onFilterChange: (filters: any) => void;
    onSortChange: (sort: string) => void;
}

const ProductFilters: React.FC<FilterProps> = ({ config, totalProducts, onFilterChange, onSortChange }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
    const [availability, setAvailability] = useState<string[]>([]);
    const [currentSort, setCurrentSort] = useState('alphabetical-az');

    const toggleDropdown = (id: string) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const handleSort = (val: string) => {
        setCurrentSort(val);
        onSortChange(val);
        setActiveDropdown(null);
    };

    const clearFilters = () => {
        setAvailability([]);
        setPriceRange({ min: 0, max: 5000 });
        onFilterChange({ availability: [], priceRange: { min: 0, max: 5000 } });
    };

    return (
        <div className="w-full border-t border-b border-[#eee] py-4 bg-white mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Left: Filters */}
                <div className="flex flex-wrap items-center gap-6">
                    <span className="text-[12px] uppercase tracking-widest text-[#888] font-medium">Filter:</span>
                    
                    {/* Availability Dropdown */}
                    {config?.options?.includes('availability') && (
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('availability')}
                                className="flex items-center gap-2 text-[13px] text-[#222] hover:underline"
                            >
                                Availability <ChevronDown className="w-3 h-3" />
                            </button>
                            {activeDropdown === 'availability' && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#eee] shadow-xl z-[100] p-4">
                                    <div className="flex justify-between items-center mb-4 border-b border-[#f5f5f5] pb-2">
                                        <span className="text-[12px] font-medium uppercase tracking-widest">0 selected</span>
                                        <button className="text-[11px] underline">Reset</button>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 border-[#ddd] rounded-none focus:ring-0" />
                                            <span className="text-[13px] group-hover:underline">In stock (11)</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group opacity-50">
                                            <input type="checkbox" disabled className="w-4 h-4 border-[#ddd] rounded-none focus:ring-0" />
                                            <span className="text-[13px] group-hover:underline">Out of stock (0)</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Price Dropdown */}
                    {config?.options?.includes('price') && (
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('price')}
                                className="flex items-center gap-2 text-[13px] text-[#222] hover:underline"
                            >
                                Price <ChevronDown className="w-3 h-3" />
                            </button>
                            {activeDropdown === 'price' && (
                                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#eee] shadow-xl z-[100] p-6">
                                    <div className="flex justify-between items-center mb-6 border-b border-[#f5f5f5] pb-2">
                                        <span className="text-[12px] font-medium uppercase tracking-widest">Highest price: Rs. 5,000</span>
                                        <button className="text-[11px] underline">Reset</button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[#999]">Rs.</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="From"
                                                    className="w-full border border-[#ddd] pl-9 pr-3 py-2 text-[13px] focus:outline-none" 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[#999]">Rs.</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="To"
                                                    className="w-full border border-[#ddd] pl-9 pr-3 py-2 text-[13px] focus:outline-none" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Sorting & Count */}
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-4">
                        <span className="text-[12px] uppercase tracking-widest text-[#888] font-medium">Sort by:</span>
                        <div className="relative">
                            <button 
                                onClick={() => toggleDropdown('sort')}
                                className="flex items-center gap-2 text-[13px] text-[#222] hover:underline whitespace-nowrap"
                            >
                                {currentSort === 'alphabetical-az' ? 'Alphabetically, A-Z' : 
                                 currentSort === 'alphabetical-za' ? 'Alphabetically, Z-A' :
                                 currentSort === 'price-low-high' ? 'Price, Low to High' :
                                 currentSort === 'price-high-low' ? 'Price, High to Low' : 
                                 'Best selling'}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            
                            {activeDropdown === 'sort' && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#eee] shadow-xl z-[100] py-2">
                                    {[
                                        { val: 'best-selling', label: 'Best selling' },
                                        { val: 'alphabetical-az', label: 'Alphabetically, A-Z' },
                                        { val: 'alphabetical-za', label: 'Alphabetically, Z-A' },
                                        { val: 'price-low-high', label: 'Price, Low to High' },
                                        { val: 'price-high-low', label: 'Price, High to Low' }
                                    ].map(option => (
                                        <button
                                            key={option.val}
                                            className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#f9f9f9] ${currentSort === option.val ? 'font-bold' : 'font-light'}`}
                                            onClick={() => handleSort(option.val)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="text-[12px] text-[#888] font-light">{totalProducts} products</span>
                </div>
            </div>
            
            {/* Backdrop for active dropdown */}
            {activeDropdown && (
                <div 
                    className="fixed inset-0 z-[90]" 
                    onClick={() => setActiveDropdown(null)}
                />
            )}
        </div>
    );
};

export default ProductFilters;
