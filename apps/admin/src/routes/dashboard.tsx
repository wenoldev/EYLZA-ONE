import Loader from '@/components/common/Loader';
import CategoriesPage from '@/components/modules/dashboard/category';
import ProductsPage from '@/components/modules/dashboard/products';
import { HelpPage } from '@/components/modules/dashboard/help';
import { lazy, Suspense } from 'react';
import SettingsPage from '@/components/modules/dashboard/settings';
import QueryPage from '@/components/modules/dashboard/queries';
import OrdersPage from '@/components/modules/dashboard/orders';
import Analytics from '@/components/modules/dashboard/analytics';
import DashboardPage from '@/components/modules/dashboard/main';
import ThemeSelection from '@/components/modules/dashboard/themes/select-theme';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { StoreRequiredRoute } from '@/components/common/StoreRequiredRoute';
import EditTheme from '@/components/modules/dashboard/themes/edit-theme';
import TestimonialsPage from '@/components/modules/dashboard/testimonials';

// Lazy-load the Dashboard component
// Lazy-load the Dashboard component
const Dashboard = lazy(() => import('@/components/modules/dashboard'));
const VendorTickets = lazy(() => import('@/components/modules/dashboard/tickets'));

const dashboardRoutes = [
  {
    path: '',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'vendor']}>
        <StoreRequiredRoute>
          <Dashboard />
        </StoreRequiredRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <DashboardPage />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<Loader />}>
            <ProductsPage />
          </Suspense>
        )
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<Loader />}>
            <CategoriesPage />
          </Suspense>
        )
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<Loader />}>
            <OrdersPage />
          </Suspense>
        )
      },
      {
        path: 'help',
        element: (
          <HelpPage />
        )
      },
      {
        path: 'settings',
        element: (
          <SettingsPage />
        )
      },
      {
        path: 'queries',
        element: (
          <QueryPage />
        )
      },
      {
        path: 'select-theme',
        element: (
          <ThemeSelection />
        )
      },
      {
        path: 'edit-theme',
        element: (
          <EditTheme />
        )
      },
      {
        path: 'tickets',
        element: (
          <Suspense fallback={<Loader />}>
            <VendorTickets />
          </Suspense>
        )
      },
      {
        path: 'testimonials',
        element: <TestimonialsPage />
      }
    ]
  }
];

export default dashboardRoutes;
