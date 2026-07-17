'use client'

import { useState } from 'react'
import { useAppContext } from '@/app/context'

interface Product {
  id: string
  name: string
  price: number
  category: 'apparel' | 'accessories' | 'stickers'
  funds: string
}

const products: Product[] = [
  {
    id: 'tee',
    name: 'Outline Tee',
    price: 28,
    category: 'apparel',
    funds: 'one lesson',
  },
  {
    id: 'hoodie',
    name: 'Vibe Hoodie',
    price: 54,
    category: 'apparel',
    funds: 'one week',
  },
  {
    id: 'glowtee',
    name: 'Glow Tee',
    price: 30,
    category: 'apparel',
    funds: 'one lesson',
  },
  {
    id: 'cap',
    name: 'Coden Cap',
    price: 24,
    category: 'accessories',
    funds: 'a mentor hour',
  },
  {
    id: 'mug',
    name: 'Dev Mug',
    price: 18,
    category: 'accessories',
    funds: 'a study kit',
  },
  {
    id: 'tote',
    name: 'Tote Bag',
    price: 20,
    category: 'accessories',
    funds: 'a workbook',
  },
  {
    id: 'stickers',
    name: 'Sticker Pack',
    price: 9,
    category: 'stickers',
    funds: 'supplies',
  },
  {
    id: 'laptopset',
    name: 'Laptop Set',
    price: 12,
    category: 'stickers',
    funds: 'supplies',
  },
]

const categoryColors: Record<string, string> = {
  apparel: 'bg-violet-accent/20 text-violet-accent border border-violet-accent/50',
  accessories: 'bg-violet-accent/20 text-violet-accent border border-violet-accent/50',
  stickers: 'bg-orange-primary/20 text-orange-primary border border-orange-primary/50',
}

export default function Shop() {
  const { cart, addToCart, clearCart, cartTotal } = useAppContext()
  const [filter, setFilter] = useState<'ALL' | 'APPAREL' | 'STICKERS' | 'ACCESSORIES'>('ALL')

  const filteredProducts = products.filter((p) => {
    if (filter === 'ALL') return true
    if (filter === 'APPAREL') return p.category === 'apparel'
    if (filter === 'STICKERS') return p.category === 'stickers'
    if (filter === 'ACCESSORIES') return p.category === 'accessories'
    return true
  })

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-16">
      {/* Hero + Cart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left - Hero */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="eyebrow mb-4">◆ OFFICIAL MERCH · 100% FUNDS SCHOLARSHIPS</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-chakra font-bold text-white leading-tight">
                Wear the Vibe.{' '}
                <span className="text-orange-primary">Fund the Mission.</span>
              </h1>
            </div>
            <p className="text-base sm:text-lg text-lavender-muted max-w-xl">
              Every purchase funds scholarships for students who can't afford it. 100% of profits go directly to our
              scholarship fund.
            </p>
          </div>

          {/* Right - Cart Card */}
          <div className="card p-8 space-y-6 h-fit sticky top-24">
            <div>
              <h3 className="font-chakra font-bold text-lg text-white mb-2">YOUR CART</h3>
              <p className="text-sm text-lavender-dim">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="bg-panel-deep rounded p-4 border border-violet-border">
              <p className="text-sm text-lavender-dim mb-1">TOTAL</p>
              <p className="text-3xl font-chakra font-bold text-white">${cartTotal.toFixed(2)}</p>
            </div>

            <button className="w-full px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
              CHECKOUT →
            </button>

            <p className="text-xs text-lavender-dim text-center">
              100% goes to scholarships
            </p>

            {cartItemCount > 0 && (
              <button
                onClick={clearCart}
                className="w-full text-orange-primary font-mono text-xs uppercase hover:text-orange-bright transition-colors"
              >
                CLEAR CART
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex gap-4 border-b border-violet-border pb-4 mb-12">
          {['ALL', 'APPAREL', 'STICKERS', 'ACCESSORIES'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as typeof filter)}
              className={`font-mono text-sm uppercase transition-colors ${
                filter === tab
                  ? 'text-orange-primary border-b-2 border-orange-primary'
                  : 'text-lavender-muted/70 hover:text-lavender-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-chakra font-bold text-white">THE DROP</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id)
            const quantity = cartItem?.quantity || 0

            return (
              <div key={product.id} className="card overflow-hidden group">
                {/* Image Placeholder */}
                <div className="relative bg-stripe-violet h-48 flex items-center justify-center overflow-hidden">
                  <span className="text-lavender-dim text-sm font-mono text-center px-4">
                    {product.name}
                  </span>
                  {quantity > 0 && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-panel-deep rounded border-2 border-orange-primary flex items-center justify-center text-xs font-bold text-orange-primary">
                      ×{quantity}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-chakra font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-sm text-lavender-muted mb-3">Funds {product.funds}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded font-mono font-bold ${categoryColors[product.category]}`}>
                      {product.category.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="text-xl font-chakra font-bold text-orange-primary mb-4">
                      ${product.price}
                    </p>
                    <button
                      onClick={() => addToCart(product.id, product.name, product.price)}
                      className="w-full px-4 py-2 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
                    >
                      {quantity > 0 ? 'ADD MORE +' : 'ADD TO CART +'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  )
}
