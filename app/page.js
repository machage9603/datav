import { Suspense } from 'react'
import { Analytics } from '@/components/analytics'
import { Header } from '@/components/header'

export default function AnalyticsPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Analytics />
        </Suspense>
      </main>
    </>
  )
}

