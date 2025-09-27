import React, { useState, useEffect, useRef } from 'react'
import { generateProducts, searchProducts } from '../data/products'
import { Product } from '../types/product'

interface SearchBoxProps {
  onProductSelect?: (product: Product) => void
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onProductSelect }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  
  const allProducts = generateProducts()

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchProducts(query, allProducts)
      setResults(searchResults)
      setIsOpen(searchResults.length > 0)
      setHighlightedIndex(-1)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query, allProducts])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleProductSelect(results[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleProductSelect = (product: Product) => {
    setQuery(product.title)
    setIsOpen(false)
    onProductSelect?.(product)
  }

  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true)
    }
  }

  const handleBlur = () => {
    // Delay closing to allow clicking on results
    setTimeout(() => setIsOpen(false), 150)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedStart MuiAutocomplete-inputRoot mui-style-1k3wlts">
          <svg 
            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium mui-style-hjmalu absolute left-3 top-1/2 transform -translate-y-1/2 z-10" 
            focusable="false" 
            aria-hidden="true" 
            viewBox="0 0 24 24" 
            width="24" 
            height="24" 
            fill="none"
          >
            <path 
              d="M19.9994 20L15.0918 15.1135" 
              stroke="#738A8C" 
              strokeWidth="2" 
              strokeMiterlimit="10" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle 
              cx="10.5" 
              cy="10.5" 
              r="6.5" 
              stroke="#738A8C" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>
          
          <input
            ref={inputRef}
            aria-invalid="false"
            autoComplete="off"
            id="search-field-input"
            placeholder="Suche nach Produkten, Marken usw"
            type="text"
            className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedStart MuiAutocomplete-input mui-style-lywihl w-full pl-12 pr-4 py-3 text-sm border-0 outline-none bg-transparent"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            autoCapitalize="none"
            spellCheck="false"
            role="combobox"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          <fieldset 
            aria-hidden="true" 
            className="MuiOutlinedInput-notchedOutline mui-style-igs3ac absolute inset-0 border border-gray-300 rounded-lg pointer-events-none"
          >
            <legend className="mui-style-ihdtdm">
              <span className="notranslate">&ZeroWidthSpace;</span>
            </legend>
          </fieldset>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {results.map((product, index) => (
            <div
              key={product.id}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                index === highlightedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleProductSelect(product)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {product.brand}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {product.category}
                  </div>
                </div>
                <div className="flex flex-col items-end ml-3">
                  <span className="font-semibold text-blue-600 text-sm">
                    {product.price}
                  </span>
                  <span className="text-xs text-green-600 mt-1">
                    Verfügbar
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {results.length === 20 && (
            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 text-center">
              Weitere Ergebnisse verfügbar - verfeinern Sie Ihre Suche
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-4 py-6 text-center">
          <div className="text-gray-500 text-sm">
            Keine Produkte gefunden für "{query}"
          </div>
        </div>
      )}
    </div>
  )
}