/**
 * Company Size API types
 */

export interface CompanySizeResponse {
  code: string
  name: string
  description: string
  minEmployees: number
  maxEmployees: number | null
}