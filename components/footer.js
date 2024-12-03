import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} Spotify Analytics Dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <span className="text-sm">Data sourced from</span>
          <Link
            href="https://www.kaggle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-green-600 transition-colors"
          >
            <span className="text-sm font-medium">Kaggle</span>
            <Heart className="w-4 h-4 fill-current text-red-500" />
          </Link>
        </div>
      </div>
    </footer>
  )
}