import { Search, X } from 'lucide-react';
import type { HeaderConfig } from '../../types/Header';

interface SearchComponentProps {
    config: HeaderConfig;
    searchKeyword: string;
    setSearchKeyword: (val: string) => void;
    isSearchExpanded: boolean;
    setIsSearchExpanded: (val: boolean) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
}

const SearchComponent = ({ config, searchKeyword, setSearchKeyword, isSearchExpanded, setIsSearchExpanded }: Omit<SearchComponentProps, 'selectedCategory' | 'setSelectedCategory'>) => {
    const mainConfig = config?.mainBar;

    if (!mainConfig) return null;


    const roundedClass =
        config.general?.borderRadiusStyle === 'sharpe' ? 'rounded-none' :
            config.general?.borderRadiusStyle === 'smooth' ? 'rounded-lg' : 'rounded-full';

    // Normal mode or Expanded Icon mode
    return (
        <div className={`relative flex items-center transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-full' : 'max-w-md'}`}>
            <div className={`flex items-center w-full bg-gray-100 ${roundedClass} overflow-hidden border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all`}>
                <div className="pl-4">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    autoFocus={isSearchExpanded}
                    type="text"
                    placeholder="Search for products..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-sm placeholder:text-gray-500"
                />
                {isSearchExpanded && (
                    <button
                        onClick={() => setIsSearchExpanded(false)}
                        className="p-3 hover:bg-black/5 transition-colors border-l"
                        title="Close Search"
                    >
                        <X size={18} className="text-gray-500" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchComponent;
export type { SearchComponentProps };
