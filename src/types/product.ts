export interface Product {
  id: string
  brand: string
  category: string
  price: string
  title: string
  available: string[]
  slug?: string
}

export interface ProductDatabase {
  [key: string]: {
    brand: string
    category: string
    prices: string[]
  }
}