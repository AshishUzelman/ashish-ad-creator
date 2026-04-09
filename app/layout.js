import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Ad Creator',
  description: 'Create ad creatives fast',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
