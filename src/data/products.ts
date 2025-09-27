import { ProductDatabase, Product } from '../types/product'

// Product mapping based on guthaben.de analysis
export const productDatabase: ProductDatabase = {
  // Mobile Top-ups
  'telekom': { brand: 'Deutsche Telekom', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
  'vodafone': { brand: 'Vodafone', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
  'o2': { brand: 'O2', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
  'lebara': { brand: 'Lebara', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '30€', '40€', '50€'] },
  'lycamobile': { brand: 'Lycamobile', category: 'Mobile Top-up', prices: ['5€', '10€', '20€', '30€', '40€', '50€'] },
  'congstar': { brand: 'congstar', category: 'Mobile Top-up', prices: ['15€', '30€', '50€'] },
  'aldi-talk': { brand: 'ALDI TALK', category: 'Mobile Top-up', prices: ['15€', '20€', '30€'] },
  'ay-yildiz': { brand: 'Ay Yildiz', category: 'Mobile Top-up', prices: ['15€', '20€'] },
  'blau': { brand: 'Blau', category: 'Mobile Top-up', prices: ['15€', '25€'] },
  'e-plus': { brand: 'E-Plus', category: 'Mobile Top-up', prices: ['15€', '20€', '30€'] },
  'klarmobil': { brand: 'klarmobil', category: 'Mobile Top-up', prices: ['15€', '30€', '50€'] },
  'fonic': { brand: 'fonic', category: 'Mobile Top-up', prices: ['20€', '30€'] },
  
  // Gift Cards
  'amazon': { brand: 'Amazon', category: 'Shopping Gift Cards', prices: ['10€', '15€', '25€', '40€', '50€', '75€', '100€', '150€', '200€', '250€'] },
  'apple': { brand: 'Apple', category: 'Tech Gift Cards', prices: ['15€', '25€', '50€', '100€'] },
  'google-play': { brand: 'Google Play', category: 'Digital Content', prices: ['15€', '25€', '50€', '100€'] },
  'microsoft': { brand: 'Microsoft', category: 'Tech Gift Cards', prices: ['10€', '15€', '25€', '50€'] },
  'h-m': { brand: 'H&M', category: 'Fashion Gift Cards', prices: ['15€', '25€', '50€', '75€', '100€', '125€', '150€'] },
  'mediamarkt': { brand: 'MediaMarkt', category: 'Electronics Gift Cards', prices: ['10€', '50€', '100€'] },
  'ikea': { brand: 'IKEA', category: 'Home & Living Gift Cards', prices: ['10€', '25€', '50€', '100€', '150€'] },
  'douglas': { brand: 'Douglas', category: 'Beauty Gift Cards', prices: ['20€', '30€', '50€'] },
  'lieferando': { brand: 'Lieferando', category: 'Food Delivery Gift Cards', prices: ['20€', '25€', '30€', '40€', '50€', '100€'] },
  'zalando': { brand: 'Zalando', category: 'Fashion Gift Cards', prices: ['10€', '15€', '20€', '25€', '30€', '35€', '40€', '50€', '75€', '100€', '125€', '150€'] },
  'nike': { brand: 'Nike', category: 'Fashion Gift Cards', prices: ['15€', '20€', '25€', '40€', '50€', '75€', '100€', '125€', '150€'] },
  'otto': { brand: 'Otto', category: 'Shopping Gift Cards', prices: ['10€', '20€', '50€', '100€'] },
  'tchibo': { brand: 'Tchibo', category: 'Shopping Gift Cards', prices: ['10€', '25€', '50€', '100€'] },
  'tk-maxx': { brand: 'TK Maxx', category: 'Fashion Gift Cards', prices: ['15€', '25€', '50€', '100€'] },
  
  // Gaming
  'steam': { brand: 'Steam', category: 'Gaming Cards', prices: ['5€', '10€', '20€', '25€', '35€', '50€', '100€'] },
  'xbox': { brand: 'Xbox', category: 'Gaming Cards', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€', '75€', '80€', '100€'] },
  'playstation': { brand: 'PlayStation', category: 'Gaming Cards', prices: ['5€', '10€', '20€', '25€', '30€', '40€', '50€', '60€', '75€', '80€', '100€', '120€', '150€', '200€', '250€'] },
  'nintendo': { brand: 'Nintendo', category: 'Gaming Cards', prices: ['15€', '25€', '50€', '75€', '100€'] },
  'roblox': { brand: 'Roblox', category: 'Gaming Cards', prices: ['10€', '20€', '30€', '40€', '50€', '70€', '80€', '100€', '125€', '150€', '175€', '200€'] },
  'fortnite': { brand: 'Fortnite V-Bucks', category: 'Gaming Cards', prices: ['10€', '25€', '50€', '75€', '100€', '125€', '150€'] },
  'league-of-legends': { brand: 'League of Legends', category: 'Gaming Cards', prices: ['10€', '20€'] },
  'valorant': { brand: 'Valorant', category: 'Gaming Cards', prices: ['10€', '20€'] },
  'battlenet': { brand: 'Battle.net', category: 'Gaming Cards', prices: ['20€', '50€'] },
  'wow': { brand: 'World of Warcraft', category: 'Gaming Cards', prices: ['20€', '50€'] },
  'ea': { brand: 'EA Sports', category: 'Gaming Cards', prices: ['15€'] },
  'twitch': { brand: 'Twitch', category: 'Gaming Cards', prices: ['15€', '25€', '50€', '75€', '100€', '125€', '150€'] },
  
  // Entertainment
  'netflix': { brand: 'Netflix', category: 'Streaming Gift Cards', prices: ['25€', '50€', '75€', '100€', '125€', '150€'] },
  'disney-plus': { brand: 'Disney Plus', category: 'Streaming Gift Cards', prices: ['27€', '54€', '90€'] },
  'spotify': { brand: 'Spotify', category: 'Music Streaming', prices: ['10€', '30€', '60€', '120€'] },
  'dazn': { brand: 'DAZN', category: 'Sports Streaming', prices: ['45€'] },
  'tinder-gold': { brand: 'Tinder Gold', category: 'Dating Apps', prices: ['13€'] },
  'tinder-plus': { brand: 'Tinder Plus', category: 'Dating Apps', prices: ['10€'] },
  'eventim': { brand: 'Eventim', category: 'Entertainment Gift Cards', prices: ['25€'] },
  'cineplex': { brand: 'Cineplex', category: 'Cinema Gift Cards', prices: ['10€', '15€', '20€', '25€'] },
  'jochen-schweizer': { brand: 'Jochen Schweizer', category: 'Experience Gift Cards', prices: ['50€', '100€'] },
  
  // Payment Cards
  'paysafecard': { brand: 'paysafecard', category: 'Prepaid Payment Cards', prices: ['10€', '25€', '50€', '100€'] },
  'cashlib': { brand: 'CashLib', category: 'Prepaid Payment Cards', prices: ['5€', '10€', '20€', '50€', '100€', '150€'] },
  'jeton-cash': { brand: 'Jeton Cash', category: 'Prepaid Payment Cards', prices: ['5€', '10€', '25€', '50€', '100€', '150€'] },
  'transcash': { brand: 'Transcash', category: 'Prepaid Payment Cards', prices: ['20€', '50€', '100€', '160€'] },
  'bitsa': { brand: 'Bitsa', category: 'Prepaid Payment Cards', prices: ['15€', '25€', '50€', '100€'] },
  'a-bon': { brand: 'A-BON', category: 'Prepaid Payment Cards', prices: ['5€', '10€', '20€', '25€', '50€'] },
  'pcs': { brand: 'PCS', category: 'Prepaid Payment Cards', prices: ['20€', '50€', '100€', '150€'] },
  'mifinity': { brand: 'MiFinity', category: 'E-wallet Cards', prices: ['10€', '25€', '50€', '100€'] },
  'flexepin': { brand: 'Flexepin', category: 'Prepaid Payment Cards', prices: ['10€', '20€', '30€', '50€', '100€', '150€'] },
  'toneo-first': { brand: 'Toneo First', category: 'Prepaid Payment Cards', prices: ['7.50€', '15€', '30€', '50€', '100€', '150€'] },
  'mint-prepaid': { brand: 'Mint Prepaid', category: 'Prepaid Payment Cards', prices: ['10€', '20€', '50€', '100€'] },
  'aplauz': { brand: 'Aplauz', category: 'Loyalty Cards', prices: ['10€', '25€', '50€', '100€'] },
}

// Generate comprehensive product list
export const generateProducts = (): Product[] => {
  const products: Product[] = []
  
  Object.entries(productDatabase).forEach(([key, data]) => {
    data.prices.forEach(price => {
      products.push({
        id: `${key}-${price.replace('€', 'eur').replace('.', '-')}`,
        brand: data.brand,
        category: data.category,
        price: price,
        title: `${data.brand} ${price} Guthaben`,
        available: ['Desktop', 'Mobile'],
        slug: key
      })
    })
  })
  
  return products
}

export const searchProducts = (query: string, products: Product[]): Product[] => {
  if (!query.trim()) return []
  
  const searchTerm = query.toLowerCase().trim()
  
  return products.filter(product => 
    product.brand.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.title.toLowerCase().includes(searchTerm) ||
    product.price.includes(searchTerm) ||
    (product.slug && product.slug.includes(searchTerm))
  ).slice(0, 20) // Limit to 20 results for performance
}

export const getCategories = (): string[] => {
  const categories = new Set<string>()
  Object.values(productDatabase).forEach(product => {
    categories.add(product.category)
  })
  return Array.from(categories).sort()
}

export const getBrands = (): string[] => {
  const brands = new Set<string>()
  Object.values(productDatabase).forEach(product => {
    brands.add(product.brand)
  })
  return Array.from(brands).sort()
}