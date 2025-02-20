import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })


export default function Layout({ children }) {
  return (
      <div className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
      </div>
  )
}