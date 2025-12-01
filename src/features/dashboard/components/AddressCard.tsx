import { MapPin } from 'lucide-react'

import { Badge } from '@/shared/ui/shadcn/badge'

export interface AddressData {
  addressId: string
  name: string
  number?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  zipCode: string
  country: string
  addressType: string
  isPrimary: boolean
}

interface AddressCardProps {
  address: AddressData
}

/**
 * AddressCard - Displays a single address with type and primary badges
 * Uses consistent foreground colors for visibility in dark theme
 */
export const AddressCard = ({ address }: AddressCardProps) => {
  return (
    <div className="p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-foreground/70" />
          <h3 className="font-medium text-foreground text-sm">{address.name}</h3>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-wider font-medium"
          >
            {address.addressType}
          </Badge>
          {address.isPrimary && (
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            >
              Primary
            </Badge>
          )}
        </div>
      </div>
      <div className="text-muted-foreground text-sm leading-relaxed pl-6">
        <p>
          {address.number && `${address.number} `}
          {address.addressLine1}
        </p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}
          {address.state && `, ${address.state}`} {address.zipCode}
        </p>
        <p>{address.country}</p>
      </div>
    </div>
  )
}
