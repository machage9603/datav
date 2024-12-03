import { Suspense } from 'react'
import { Analytics } from '@/components/analytics'
import { Header } from '@/components/header'
import SpotifyLoader from '@/components/SpotifyLoader'

export default function AnalyticsPage() {
  return (
    <>
      <main className="container mx-auto p-4">
        <Suspense fallback={<SpotifyLoader />}>
          <Analytics />
        </Suspense>
      </main>
    </>
  )
}