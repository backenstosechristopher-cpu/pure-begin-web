import React from 'react'
import { SearchBox } from './components/SearchBox'
import { Product } from './types/product'

function App() {
  const handleProductSelect = (product: Product) => {
    console.log('Selected product:', product)
    // Here you can handle the product selection
    // For example, redirect to product page or add to cart
    if (product.slug) {
      // Simulate navigation to product page
      window.location.href = `/desktop/guthaben.de_${product.slug}.html`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Guthaben.de Produktsuche
            </h1>
            <p className="text-muted-foreground">
              Suchen Sie nach Guthabenkarten, Geschenkkarten und mehr
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <SearchBox onProductSelect={handleProductSelect} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">
                Mobile Top-ups
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Telekom, Vodafone, O2, Lebara und mehr
              </p>
              <div className="text-xs text-muted-foreground">
                Verfügbare Beträge: 5€ - 50€
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">
                Gaming Cards
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Steam, PlayStation, Xbox, Nintendo und mehr
              </p>
              <div className="text-xs text-muted-foreground">
                Verfügbare Beträge: 5€ - 250€
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">
                Geschenkkarten
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Amazon, Zalando, H&M, IKEA und mehr
              </p>
              <div className="text-xs text-muted-foreground">
                Verfügbare Beträge: 10€ - 250€
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App