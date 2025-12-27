"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: Array<{
    key: string
    label: string
    options: Array<{ value: string; label: string }>
    value: string
    onChange: (value: string) => void
  }>
  onReset?: () => void
}

export function FilterBar({ searchValue, onSearchChange, filters, onReset }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rounded-none"
        />
      </div>

      {filters?.map((filter) => (
        <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="w-[180px] rounded-none">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {onReset && (
        <Button variant="outline" size="icon" onClick={onReset} className="rounded-none">
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
