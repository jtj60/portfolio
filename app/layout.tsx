import type { Metadata } from 'next'
import { Montserrat, Open_Sans } from 'next/font/google'
import './styles/globals.css'
import LayoutProvider from '@/components/providers/LayoutProvider' // ✅ Import the Client Component
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-header',
})

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: "Jacob Johnson's portfolio",
  description:
    'Web app to display my skills and experience.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${openSans.variable}`}
    >
      <body className="bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          <LayoutProvider>{children}</LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
