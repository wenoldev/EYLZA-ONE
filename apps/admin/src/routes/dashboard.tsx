import Loader from '@/components/common/Loader';
import CategoriesPage from '@/components/modules/dashboard/category';
import ProductsPage from '@/components/modules/dashboard/products';
import { HelpPage } from '@/components/modules/dashboard/help';
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
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
import PluginsPage from '@/components/modules/dashboard/plugins';
import GalleryPage from '@/components/modules/dashboard/gallery';
import CMSListPage from '@/components/modules/dashboard/cms';
import CMSEditorPage from '@/components/modules/dashboard/cms/CMSEditor';

// Lazy-load the Dashboard component
const Dashboard = lazy(() => import('@/components/modules/dashboard'));
const VendorTickets = lazy(() => import('@/components/modules/dashboard/tickets'));
const TicketList = lazy(() => import('@/components/modules/dashboard/tickets/TicketList'));
const CreateTicket = lazy(() => import('@/components/modules/dashboard/tickets/CreateTicket'));
const TicketDetail = lazy(() => import('@/components/modules/dashboard/tickets/TicketDetail'));
const PaymentsPage = lazy(() => import('@/components/modules/dashboard/billing/PaymentsPage'));

const dashboardRoutes = [
  {
    path: 'dashboard',
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
        element: <Navigate to="main" replace />
      },
      {
        path: 'main',
        element: <DashboardPage />
      },
      {
        path: 'cms',
        element: <CMSListPage />
      },
      {
        path: 'cms/:id',
        element: <CMSEditorPage />
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
        path: 'payments',
        element: (
          <Suspense fallback={<Loader />}>
            <PaymentsPage />
          </Suspense>
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
        ),
        children: [
          {
            path: '',
            element: <TicketList />
          },
          {
            path: 'create',
            element: <CreateTicket />
          },
          {
            path: ':id',
            element: <TicketDetail />
          }
        ]
      },
      {
        path: 'testimonials',
        element: <TestimonialsPage />
      },
      {
        path: 'gallery',
        element: <GalleryPage />
      },
      {
        path: 'plugins',
        element: <PluginsPage />
      }
    ]
  }
];

export default dashboardRoutes;
