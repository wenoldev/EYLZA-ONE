import { createBrowserRouter, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"

// Layout
import StorefrontLayout from "@/components/layout/StorefrontLayout"
import NotFoundPage from "@/pages/common/NotFoundPage"
import ShadeLoader from "@/components/loader/ShadeLoader"
import StorefrontError from "@/components/common/StorefrontError"

const DynamicPageRenderer = lazy(() => import("@/components/engine/DynamicPageRenderer"))
const Checkout = lazy(() => import("@/pages/checkout"))
const Cart = lazy(() => import("@/pages/cart"))
const PolicyPage = lazy(() => import("@/pages/policy"))

// Auth Pages
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"))

// Account Pages
const ProfilePage = lazy(() => import("@/pages/account/ProfilePage"))
const OrdersPage = lazy(() => import("@/pages/account/OrdersPage"))

import { useUserStore } from "@/store/useUserStore"

/**
 * Protected Route Wrapper
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUserStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

/**
 * Common routes shared between root domain and store slug paths
 */
const storefrontRoutes = [
  {
    index: true,
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <DynamicPageRenderer pageKey="home" />
      </Suspense>
    ),
  },
  {
    path: "home",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <DynamicPageRenderer pageKey="home" />
      </Suspense>
    ),
  },
  {
    path: "about",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <DynamicPageRenderer pageKey="about" />
      </Suspense>
    ),
  },
  {
    path: "contact",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <DynamicPageRenderer pageKey="contact" />
      </Suspense>
    ),
  },
  {
    path: "products",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <DynamicPageRenderer pageKey="products" />
      </Suspense>
    ),
  },
  {
    path: "product/:productId",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <DynamicPageRenderer pageKey="product" />
      </Suspense>
    ),
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <Cart />
      </Suspense>
    ),
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: "policy/:policyId",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <PolicyPage />
      </Suspense>
    ),
  },
  // Auth
  {
    path: "login",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "register",
    element: (
      <Suspense fallback={<ShadeLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  // Account (Protected)
  {
    path: "account/profile",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<ShadeLoader />}>
          <ProfilePage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "account/orders",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<ShadeLoader />}>
          <OrdersPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]

export const router = createBrowserRouter([
  {
    // Unified Root using Optional Segment for storeSlug
    // This handles both:
    // 1. /home (Domain Mode, storeSlug is undefined)
    // 2. /test-store/home (Slug Mode, storeSlug is "test-store")
    path: "/:storeSlug?", 
    element: <StorefrontLayout />,
    errorElement: <StorefrontError />,
    children: [
      ...storefrontRoutes,
      { path: "*", element: <NotFoundPage /> }
    ],
  },
  { 
    path: "*", 
    element: <NotFoundPage />,
    errorElement: <StorefrontError />,
  },
])
