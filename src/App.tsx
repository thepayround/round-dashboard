import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { routes } from '@/routes'
import { FullScreenLoader } from '@/shared/components/FullScreenLoader'
import { AuthProvider } from '@/shared/contexts/AuthContext'
import { ToastProvider } from '@/shared/contexts/ToastContext'
import { useMobileOptimizations } from '@/shared/hooks/useMobileOptimizations'
import { ErrorBoundary } from '@/shared/layout/ErrorBoundary'

const router = createBrowserRouter(routes)

const App = () => {
  useMobileOptimizations()

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<FullScreenLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
