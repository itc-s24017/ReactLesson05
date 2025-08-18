import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'エレベーターシミュレーター',
  description: 'インタラクティブなエレベーターシミュレーター',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  )
}