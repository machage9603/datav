import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-xl font-bold tracking-tight">
            Spotify Analytics
          </span>
        </Link>
        <nav className="space-x-4">
          <Link
            href="/"
            className="hover:bg-green-700 px-3 py-2 rounded-md transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className="hover:bg-green-700 px-3 py-2 rounded-md transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}