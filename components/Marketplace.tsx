import { CanvasElement } from '@/types/canvas'
import React, { ReactNode } from 'react'

interface MarketplaceElement extends CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  notes: string;
  hasComments: boolean;
  render?: () => JSX.Element
}

export const MarketplaceContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      {/* Box frame */}
      <div className="relative w-[1100px] h-[960px] bg-white border border-gray-300 overflow-hidden">
        {/* Content container with scrolling */}
        <div className="h-full overflow-y-auto bg-gray-50 relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export const MarketplaceDemo: {
  prototype: MarketplaceElement[];
  logic: any[];
  stories: any[];
} = {
  prototype: [
    { 
      id: 'app-header', 
      type: 'header', 
      x: 50,
      y: 50,
      width: 1000,
      height: 40,
      label: 'LocalMarket',
      notes: 'Clean header with logo, search, notifications (3), and profile picture',
      hasComments: true,
      render: () => (
        <div className="flex items-center justify-between px-4 py-2 bg-white shadow-sm rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LocalMarket
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'notifications-badge',
      type: 'badge',
      x: 880,
      y: 60,
      width: 20,
      height: 20,
      label: '3',
      notes: 'Notification counter showing unread messages',
      hasComments: false,
      render: () => (
        <div className="absolute flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
          3
        </div>
      )
    },
    {
      id: 'profile-picture',
      type: 'avatar',
      x: 920,
      y: 55,
      width: 40,
      height: 40,
      label: 'Sarah W.',
      notes: 'Circular profile picture with online status indicator',
      hasComments: false,
      render: () => (
        <div className="relative">
          <img 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="Sarah W."
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
      )
    },
    {
      id: 'search-bar',
      type: 'searchInput',
      x: 300,
      y: 53,
      width: 400,
      height: 20,
      label: '🔍 Search items nearby...',
      notes: 'Search with voice input and camera scan options',
      hasComments: false,
      render: () => (
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search items nearby..."
            className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </button>
          </div>
        </div>
      )
    },
    { 
      id: 'categories-nav', 
      type: 'tabBar', 
      x: 50, 
      y: 140, 
      width: 1000, 
      height: 60, 
      label: '📱 Electronics • 🪑 Furniture • 👕 Fashion • ⚽ Sports • 📚 Books • 🎨 Art • ➕ More',
      notes: 'Scrollable categories with visual indicators',
      hasComments: false,
      render: () => (
        <div className="flex space-x-4 px-4 py-2 overflow-x-auto">
          {['Electronics', 'Furniture', 'Fashion', 'Sports', 'Books', 'Art', 'More'].map((category, i) => (
            <button key={i} className="flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <span className="mr-2">{
                ['📱', '🪑', '👕', '⚽', '📚', '🎨', '➕'][i]
              }</span>
              {category}
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'featured-section',
      type: 'banner',
      x: 50,
      y: 220,
      width: 650,
      height: 200,
      label: '🌟 Weekend Deals\nUp to 50% off on Electronics',
      notes: 'Promotional banner with dynamic background and CTA',
      hasComments: true,
      render: () => (
        <div className="relative p-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <h2 className="text-2xl font-bold mb-2">🌟 Weekend Deals</h2>
          <p className="text-xl mb-4">Up to 50% off on Electronics</p>
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium">
            Shop Now
          </button>
        </div>
      )
    },
    { 
      id: 'item-feed', 
      type: 'grid', 
      x: 50, 
      y: 410, 
      width: 650, 
      height: 380, 
      label: '📥 Recently Added',
      notes: 'Responsive grid with lazy loading and smooth animations',
      hasComments: true,
      render: () => (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">📥 Recently Added</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Grid items will be rendered by individual item cards */}
          </div>
        </div>
      )
    },
    {
      id: 'item-card-1',
      type: 'productCard',
      x: 70,
      y: 470,
      width: 180,
      height: 250,
      label: 'iPhone 13 Pro\n$649 • 2.3mi\n⭐️ 4.9 • Sarah W.',
      notes: 'Product card with verified seller badge and rating',
      hasComments: false,
      render: () => (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">📱</span>
            <h3 className="font-medium">iPhone 13 Pro</h3>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="font-bold">$649</span>
            <span className="text-gray-500">2.3mi</span>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-yellow-500">⭐️ 4.9</span>
            <span className="ml-2 text-gray-600">Sarah W.</span>
          </div>
        </div>
      )
    },
    {
      id: 'item-card-2',
      type: 'productCard',
      x: 280,
      y: 470,
      width: 180,
      height: 250,
      label: 'IKEA Standing Desk\n$95 • 0.8mi\n⭐️ 4.7 • Mike T.',
      notes: 'Product with multiple images and condition badge',
      hasComments: false,
      render: () => (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">🪑</span>
            <h3 className="font-medium">IKEA Standing Desk</h3>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="font-bold">$95</span>
            <span className="text-gray-500">0.8mi</span>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-yellow-500">⭐️ 4.7</span>
            <span className="ml-2 text-gray-600">Mike T.</span>
          </div>
        </div>
      )
    },
    {
      id: 'item-card-3',
      type: 'productCard',
      x: 490,
      y: 470,
      width: 180,
      height: 250,
      label: 'Sony WH-1000XM4\n$220 • 1.5mi\n⭐️ 4.8 • Alex K.',
      notes: 'Product with video preview and quick chat button',
      hasComments: false,
      render: () => (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">🎧</span>
            <h3 className="font-medium">Sony WH-1000XM4</h3>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="font-bold">$220</span>
            <span className="text-gray-500">1.5mi</span>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-yellow-500">⭐️ 4.8</span>
            <span className="ml-2 text-gray-600">Alex K.</span>
          </div>
        </div>
      )
    },
    { 
      id: 'map-view', 
      type: 'map', 
      x: 720, 
      y: 220, 
      width: 330, 
      height: 400, 
      label: '📍 Items Near You\n15 items within 3 miles',
      notes: 'Interactive map with price clusters and AR view option',
      hasComments: true,
      render: () => (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 h-full p-4">
            <h3 className="font-medium mb-2">📍 Items Near You</h3>
            <p className="text-sm text-gray-600">15 items within 3 miles</p>
            {/* Map implementation would go here */}
          </div>
        </div>
      )
    },
    { 
      id: 'filters', 
      type: 'filterPanel', 
      x: 720, 
      y: 340, 
      width: 330, 
      height: 180, 
      label: '💰 $0-$1000 • 📍 5mi\n✨ Like New • 🔄 Available\n🏷️ On Sale',
      notes: 'Smart filters with recent searches and saved filters',
      hasComments: false,
      render: () => (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span>💰</span>
              <input type="range" className="w-full" min="0" max="1000"/>
            </div>
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <select className="form-select rounded border-gray-200">
                <option>5mi</option>
                <option>10mi</option>
                <option>15mi</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">✨ Like New</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">🔄 Available</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">🏷️ On Sale</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'add-listing-button',
      type: 'actionButton',
      x: 1030,
      y: 680,
      width: 60,
      height: 60,
      label: '📸 Sell',
      notes: 'Quick listing creation with AI item recognition',
      hasComments: false,
      render: () => (
        <button className="absolute bottom-20 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700">
          <span>📸</span>
        </button>
      )
    },
    { 
      id: 'bottom-nav',
      type: 'navigation',
      x: 0,
      y: 680,
      width: 1100,
      height: 80,
      label: '🏠 Home • ❤️ Saved (5) • 💬 Chat (3) • 👤 Profile',
      notes: 'Navigation with haptic feedback and notification badges',
      hasComments: true,
      render: () => (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2">
          <div className="flex justify-between items-center max-w-[1100px] mx-auto">
            {[
              { icon: '🏠', label: 'Home' },
              { icon: '❤️', label: 'Saved', badge: '5' },
              { icon: '💬', label: 'Chat', badge: '3' },
              { icon: '👤', label: 'Profile' }
            ].map((item, i) => (
              <button key={i} className="flex flex-col items-center relative">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )
    }
  ],
  logic: [
    // ... existing logic elements
  ],
  stories: [
    // ... existing stories elements
  ]
} as const
