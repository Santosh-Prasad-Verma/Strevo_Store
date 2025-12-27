import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; isPositive: boolean }
}

export function KpiCard({ title, value, icon: Icon, trend }: KpiCardProps) {
  return (
    <Card className="p-6 rounded-none">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "+" : ""}{trend.value}% from last period
            </p>
          )}
        </div>
        <div className="p-3 bg-black text-white">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}
