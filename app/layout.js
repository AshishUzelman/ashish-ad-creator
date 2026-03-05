import './globals.css'

export const metadata = {
  title: 'Ad Creator',
  description: 'Create ad creatives fast',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
