import { createBrowserRouter, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"

// Layout
import StorefrontLayout from "@/components/layout/StorefrontLayout"
import NotFoundPage from "@/pages/common/NotFoundPage"
import ShadeLoader from "@/components/loader/ShadeLoader"

const DynamicPageRenderer = lazy(() => import("@/components/engine/DynamicPageRenderer"))
// const ProductList = lazy(() => import("@/pages/productlist"))
// const ProductDetail = lazy(() => import("@/pages/productdetail"))
const Checkout = lazy(() => import("@/pages/checkout"))
const Cart = lazy(() => import("@/pages/cart"))
const PolicyPage = lazy(() => import("@/pages/policy"))

export const router = createBrowserRouter([
  // ----------- CUSTOM DOMAIN MODE (OR PLATFORM ROOT) -----------
  // No vendorId in URL — resolved by hostname
  {
    path: "/",
    element: <StorefrontLayout />,
    children: [
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
      {
        path: "*",
        element: <NotFoundPage />
      }
    ],
  },

  // ----------- STORE SLUG MODE -----------
  {
    path: "/:storeSlug",
    element: <StorefrontLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />,
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
      {
        path: "*",
        element: <NotFoundPage />
      }
    ],
  },

  { path: "*", element: <NotFoundPage /> },
])
