export interface Theme {
  id: number | string
  name: string
  category: string
  preview: string
  isFavorite?: boolean
  isPaidTheme?: boolean
  price?: number
}