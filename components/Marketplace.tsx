import { CanvasElement, CanvasStory, BriefItem } from '@/types/canvas'
import React, { ReactNode } from 'react'


export const MarketplaceContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <div className="relative w-[1100px] h-[960px] bg-white border border-gray-300">
        {children}
      </div>
    </div>
  )
}

export const MarketplaceDemo: {
  design: CanvasElement[];
  brief: BriefItem[];
  stories: CanvasStory[];
} = {
  design: [
    {
      id: 'app-header',
      type: 'header',
      x: 50,
      y: 50,
      width: 1000,
      height: 40,
      label: 'LocalMarket',
      notes: [
        'Clean, minimal header design to maximize content space',
        'Logo uses gradient to create modern, trustworthy feel',
        'Search, notifications, and profile are easily accessible',
        'Sticky header maintains navigation context while scrolling',
        'Responsive design adjusts for different screen sizes'
      ],
      hasComments: true,
      render: () => (
        <div className="absolute flex items-center justify-between px-4 py-2 bg-white shadow-sm rounded-lg"
          style={{ left: 0, top: 0, width: 1000, height: 80 }}>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            LocalMarket
          </div>
          <div className="relative flex items-center flex-1 mx-4">
            <div className="absolute left-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search items nearby..."
              className="w-full pl-10 pr-24 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
            <div className="absolute right-2 flex items-center space-x-1">
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
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Sarah W."
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            <div className="absolute flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full"
              style={{ right: -10, top: -10, width: 20, height: 20 }}>
              3
            </div>
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
      notes: [
        'Horizontally scrollable with smooth momentum',
        'Categories ordered by popularity and relevance',
        'Visual indicators for new items in each category',
        'Customizable category order for users',
        'Subcategories expand on long press'
      ],
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
      notes: [
        'Dynamic content based on user preferences',
        'A/B testing different promotional layouts',
        'Personalized deals based on browsing history',
        'Time-sensitive offers with countdown',
        'Share deals functionality built-in'
      ],
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
      height: 250,
      label: '📥 Recently Added',
      notes: [
        'Infinite scroll with lazy loading',
        'Optimized image loading for fast rendering',
        'Smart sorting based on relevance and distance',
        'Pull to refresh with loading animation',
        'Grid/List view toggle option',
        'Skeleton loading state for better UX'
      ],
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
      notes: ['Product card with verified seller badge and rating'],
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
      notes: ['Product with multiple images and condition badge'],
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
      notes: ['Product with video preview and quick chat button'],
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
      notes: [
        'Interactive clustering for dense areas',
        'Price indicators on map markers',
        'AR view for nearby item discovery',
        'Safe meeting spot suggestions',
        'Real-time location updates',
        'Custom map styling for better contrast'
      ],
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
      notes: [
        'Smart filter combinations based on usage',
        'Save filter presets for quick access',
        'Price range with histogram visualization',
        'Distance radius with visual preview on map',
        'Condition filters with detailed descriptions'
      ],
      hasComments: false,
      render: () => (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span>💰</span>
              <input type="range" className="w-full" min="0" max="1000" />
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
      notes: [
        'One-tap photo listing creation',
        'AI-powered item recognition',
        'Quick price suggestions',
        'Draft saves automatically',
        'Multi-photo upload support',
        'Location auto-detection'
      ],
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
      notes: [
        'Haptic feedback on navigation',
        'Badges update in real-time',
        'Customizable tab order',
        'Gesture shortcuts for quick actions',
        'Adaptive layout for different devices',
        'Accessibility labels for screen readers'
      ],
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
  brief: [
    {
      id: 'overview',
      title: 'Project Overview',
      content: 'LocalMarket is a community-focused marketplace app that connects local buyers and sellers, emphasizing trust, convenience, and sustainability in neighborhood commerce.',
      priority: 'high'
    },
    {
      id: 'core-goals',
      title: 'Core Goals',
      content: [
        'Simplify the process of buying and selling items locally',
        'Build trust and safety in peer-to-peer transactions',
        'Reduce environmental impact by promoting local reuse',
        'Create a strong sense of community through commerce'
      ],
      priority: 'high'
    },
    {
      id: 'target-audience',
      title: 'Target Audience',
      content: [
        'Primary: Urban and suburban residents aged 25-45',
        'Secondary: College students and young professionals',
        'Tech-savvy users comfortable with mobile payments',
        'Environmentally conscious consumers',
        'Local small business owners and artisans'
      ],
      priority: 'medium'
    },
    {
      id: 'key-features',
      title: 'Key Features',
      content: [
        'AI-powered quick listing with photo recognition',
        'Multi-modal search (text, voice, image)',
        'Real-time location-based item discovery',
        'Secure in-app messaging and payment',
        'Community trust scoring system',
        'AR view for nearby items'
      ],
      priority: 'high'
    },
    {
      id: 'technical-requirements',
      title: 'Technical Requirements',
      content: [
        'Native mobile performance with React Native',
        'Real-time location services and mapping',
        'Secure payment gateway integration',
        'Push notifications for messages and alerts',
        'Image recognition and AR capabilities',
        'Offline-first data architecture'
      ],
      priority: 'medium'
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics',
      content: [
        'User acquisition and retention rates',
        'Average time to list/sell items',
        'Message response rates',
        'Transaction completion rates',
        'User trust scores',
        'Community engagement levels'
      ],
      priority: 'medium'
    },
    {
      id: 'design-principles',
      title: 'Design Principles',
      content: [
        'Simplicity: Minimize steps for core actions',
        'Trust: Visual cues for safety and verification',
        'Local: Emphasize proximity and community',
        'Speed: Quick access to key features',
        'Accessibility: Universal design for all users'
      ],
      priority: 'high'
    },
    {
      id: 'future-considerations',
      title: 'Future Considerations',
      content: [
        'Integration with local business directories',
        'Community events and meetups feature',
        'Sustainable packaging initiatives',
        'Group buying and bulk deals',
        'Local service exchange platform'
      ],
      priority: 'low'
    }
  ],
  stories: [
    {
      id: 'quick-listing',
      title: 'Quick Item Listing',
      description: 'As a seller, I want to quickly list an item by taking a photo, so I can start selling with minimal effort',
      acceptance: [
        'Camera opens immediately when tapping the "Sell" button',
        'AI automatically suggests item category and title from the photo',
        'Price suggestion based on similar items in the area',
        'Option to add multiple photos with drag-to-reorder',
        'Location is auto-filled based on current position'
      ]
    },
    {
      id: 'item-search',
      title: 'Smart Item Search',
      description: 'As a buyer, I want to search for items using various methods including text, voice, and image recognition',
      acceptance: [
        'Search by typing with real-time suggestions',
        'Voice search with natural language processing',
        'Camera scan to find similar items',
        'Results filtered by distance and relevance',
        'Search history is saved for quick access'
      ]
    },
    {
      id: 'safe-messaging',
      title: 'Secure Communication',
      description: 'As a user, I want to safely communicate with other users about items without sharing personal contact information',
      acceptance: [
        'In-app messaging with read receipts',
        'Ability to share location for meetup',
        'Quick responses and saved phrases',
        'Report inappropriate messages',
        'Built-in identity verification system'
      ]
    },
    {
      id: 'location-browse',
      title: 'Location-Based Browsing',
      description: 'As a buyer, I want to browse items near me and see them on a map to plan my purchases efficiently',
      acceptance: [
        'Interactive map showing item locations',
        'Distance-based filtering options',
        'Price clusters for dense areas',
        'AR view for nearby items',
        'Save favorite locations for frequent checking'
      ]
    },
    {
      id: 'trust-safety',
      title: 'Trust and Safety Features',
      description: 'As a user, I want to feel secure when buying and selling items with strangers',
      acceptance: [
        'Verified user badges with ID verification',
        'User ratings and detailed reviews',
        'Secure payment integration',
        'Safe meeting spot suggestions',
        'Transaction protection program'
      ]
    }
  ]
} as const
