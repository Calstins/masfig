'use client'

import {
  UtensilsCrossed, Flame, ChefHat, Loader, Package, Zap,
  Truck, CheckCircle, MapPin, Clock, Shield,
  Settings, Droplets, Wind, Wrench, Award, Star, Gauge, Thermometer,
  type LucideIcon,
} from 'lucide-react'

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  UtensilsCrossed, Flame, ChefHat, Loader, Package, Zap,
  Truck, CheckCircle, MapPin, Clock, Shield,
  Settings, Droplets, Wind, Wrench, Award, Star, Gauge, Thermometer,
}

export function IconPreview({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_REGISTRY[name] || Zap
  return <Icon className={className || 'w-5 h-5'} />
}

export function IconPicker({ value, onChange, options }: { value: string; onChange: (name: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            title={opt}
            className={`flex flex-col items-center gap-1 w-[72px] px-2 py-2.5 rounded-lg border transition-all ${
              selected
                ? 'border-primary bg-brand-50 ring-2 ring-primary/30'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
            }`}
          >
            <IconPreview name={opt} className={`w-5 h-5 ${selected ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-[9px] leading-tight text-center break-all ${selected ? 'text-primary font-semibold' : 'text-gray-400'}`}>
              {opt}
            </span>
          </button>
        )
      })}
    </div>
  )
}
