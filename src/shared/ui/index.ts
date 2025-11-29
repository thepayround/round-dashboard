/**
 * Shared UI surface area - SHADCN ONLY
 *
 * IMPORTANT: Most components have been deleted to force pure Shadcn usage.
 * Import directly from shadcn instead:
 *
 * import { Button } from '@/shared/ui/shadcn/button'
 * import { Input } from '@/shared/ui/shadcn/input'
 * import { Dialog } from '@/shared/ui/shadcn/dialog'
 * etc.
 */

// Keep only these specialized components
export { AddressFormGroup, type Address } from './AddressFormGroup'
export { AuthLogo } from './AuthLogo'
export { WhiteLogo } from './WhiteLogo'
export { DataTable } from './DataTable/DataTable'
export { EmptyState, type EmptyStateProps } from './EmptyState'
export { FileInput, type FileInputProps } from './FileInput'
export { LoadingSpinner, type LoadingSpinnerProps } from './LoadingSpinner'
export { PageHeader, type PageHeaderProps } from './PageHeader'
export { Pagination } from './Pagination'
export { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
export { PhoneInput } from './PhoneInput'
export { PhoneDisplay, type PhoneDisplayProps, type CountryInfo } from './PhoneDisplay'
export { Toast } from './Toast'

// Re-export commonly used Shadcn components for convenience
export { Button } from './shadcn/button'
export { Input } from './shadcn/input'
export { Badge, type BadgeProps } from './shadcn/badge'
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './shadcn/card'
export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './shadcn/dialog'
export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './shadcn/select'
export { Switch } from './shadcn/switch'
export { Checkbox } from './shadcn/checkbox'
export { Label } from './shadcn/label'
export { Textarea } from './shadcn/textarea'
export { Avatar, AvatarImage, AvatarFallback } from './shadcn/avatar'
export { Skeleton } from './shadcn/skeleton'
export { Alert, AlertTitle, AlertDescription } from './shadcn/alert'
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from './shadcn/table'
export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from './shadcn/form'

// Type exports for compatibility
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'
