import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'antd/dist/reset.css' // For Ant Design v5

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wix App Creator - AI-Driven App Creation',
  description: 'Create apps using natural language, voice commands, and AI-generated designs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
