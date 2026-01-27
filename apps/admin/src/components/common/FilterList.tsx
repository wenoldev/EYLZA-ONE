/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FilterProps {
    currentFilter?: string;
    onFilterChange: (filter: any) => void;
    filterList: any[] | undefined;
}

const FilterList: React.FC<FilterProps> = ({ filterList, currentFilter, onFilterChange }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    { currentFilter || 'All'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => onFilterChange(null)}>All</DropdownMenuItem>
                {filterList && filterList.map((item,index) => (
                    <DropdownMenuItem key={index} onSelect={() => onFilterChange(item)}>
                        {item?.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FilterList
