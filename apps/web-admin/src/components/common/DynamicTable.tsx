/* eslint-disable @typescript-eslint/no-explicit-any */
import { MoreHorizontal, Trash2, ArrowUpDown, Eye, ChevronDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Column, TableConfig } from "@/types"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DynamicTableProps {
  data: any[]
  columns: Column[]
  onDelete: (id: any) => void
  onPageChange: (page: number) => void
  currentPage: number
  totalCount: number
  itemsPerPage: number
  selectedRows: Set<any>
  toggleRowSelection: (id: any) => void
  toggleAllRows: (selectedRows: Set<any>) => void
  onSort: (column: string, direction: "asc" | "desc") => void
  sortColumn?: string
  sortDirection?: "asc" | "desc"
  /* Added config prop for generic status/badge/action handling */
  config?: TableConfig
  /* Removed statusConfig, now using config.badges instead */
  statusConfig?: { [key: string]: string[] }
  onRowClick?: (row: any) => void
  /* Added onChangeStatus callback for generic status changes */
  onChangeStatus?: (row: any, field: string, newStatus: string) => void
}

const formatValue = (
  value: any,
  column: Column,
  row: any,
  config?: TableConfig,
  statusConfig?: { [key: string]: string[] },
  onChangeStatus?: (row: any, field: string, newStatus: string) => void,
) => {
  /* Support custom render first */
  if (column.render) {
    return column.render(row)
  }

  if (column.type === "date") {
    return new Date(value).toLocaleDateString()
  }

  /* Support generic badge type using config */
  if (column.type === "badge" && config?.badges?.[column.value]) {
    const badgeConfig = config.badges[column.value]
    const badgeStyle = badgeConfig[value.toString().toLowerCase()]
    return (
      <Badge className={badgeStyle?.className || "bg-gray-100 text-gray-800"}>
        {badgeStyle?.label || value}
      </Badge>
    )
  }

  /* Support status type with optional status changes */
  if (column.type === "status") {
    const statusColors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
      unpaid: "bg-yellow-100 text-yellow-800"
    }

    /* Only show dropdown if status change handler exists */
    if (!onChangeStatus || !statusConfig?.[column.value]) {
      return (
        <Badge className={`${statusColors[value.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
          {value}
        </Badge>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 px-2 hover:bg-transparent">
            <Badge
              className={`${statusColors[value.toLowerCase()] || "bg-gray-100 text-gray-800"}`}
            >
              {value}
            </Badge>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statusConfig[column.value].map((status) => (
            <DropdownMenuItem key={status} onClick={() => onChangeStatus(row, column.value, status)}>
              <Badge className={`${statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
                {status}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return value || "-"
}

const getNestedValue = (obj: any, column: Column) => {
  let value = column.value.split(".").reduce((acc, part) => acc && acc[part], obj) || "-"
  if (column.prefix) {
    value = `${column.prefix}${value}`
  }
  if (column.trim) {
    value = value.toString().slice(0, column.trim)
  }
  return value
}

export function DynamicTable({
  data,
  columns,
  onDelete,
  onPageChange,
  currentPage,
  totalCount,
  itemsPerPage,
  selectedRows,
  toggleRowSelection,
  toggleAllRows,
  onSort,
  sortColumn,
  sortDirection,
  config,
  statusConfig,
  onRowClick,
  onChangeStatus,
}: DynamicTableProps) {
  /* Removed hardcoded MoreDetailsDialog - now managed by parent */

  const handlePageChange = (page: number) => {
    onPageChange(page)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map((item) => item.id))
      toggleAllRows(allIds)
    } else {
      toggleAllRows(new Set())
    }
  }

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-end gap-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <select
            className="h-8 w-16 rounded-md border border-input bg-background px-2"
            value={itemsPerPage}
            onChange={(e) => {
              const newItemsPerPage = Number.parseInt(e.target.value, 10)
              onPageChange(newItemsPerPage)
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= totalCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={data.length > 0 && selectedRows.size === data.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.value}>
                  {column.isSort ? (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        onSort(column.value, column.value === sortColumn && sortDirection === "asc" ? "desc" : "asc")
                      }
                      className="h-8 flex items-center gap-1 -ml-4 hover:bg-transparent"
                    >
                      {column.name}
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  ) : (
                    column.name
                  )}
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                onDoubleClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer" : ""}
              >
                <TableCell>
                  <Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => toggleRowSelection(row.id)} />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.value}>
                    {formatValue(
                      getNestedValue(row, column),
                      column,
                      row,
                      config,
                      statusConfig,
                      onChangeStatus,
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-transparent">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                      {onRowClick && (
                        <DropdownMenuItem onClick={() => onRowClick(row)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(row.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {renderPagination()}
    </div>
  )
}
