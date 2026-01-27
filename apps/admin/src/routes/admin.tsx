import Loader from '@/components/common/Loader';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { lazy, Suspense } from 'react';

// Lazy-load the Admin Layout and Pages
const AdminLayout = lazy(() => import('@/components/modules/admin/layout'));
const AdminStores = lazy(() => import('@/components/modules/admin/stores'));
const AdminStoreDetails = lazy(() => import('@/components/modules/admin/stores/details'));
const AdminThemes = lazy(() => import('@/components/modules/admin/themes'));
const AdminTickets = lazy(() => import('@/components/modules/admin/tickets'));
const AdminPlans = lazy(() => import('@/components/modules/admin/plans'));
const AdminUsers = lazy(() => import('@/components/modules/admin/users'));

const adminRoutes = [
  {
    path: 'admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Suspense fallback={<Loader />}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'stores',
        element: (
          <Suspense fallback={<Loader />}>
            <AdminStores />
          </Suspense>
        )
      },
      {
        path: 'stores/:id',
        element: (
          <Suspense fallback={<Loader />}>
            <AdminStoreDetails />
          </Suspense>
        )
      },
      {
        path: 'themes',
        element: (
          <Suspense fallback={<Loader />}>
            <AdminThemes />
          </Suspense>
        )
      },
      {
        path: 'tickets',
        element: (
          <Suspense fallback={<Loader />}>
            <AdminTickets />
          </Suspense>
        )
      },
      {
        path: 'plans',
        element: (
          <Suspense fallback={<Loader />}>
            <AdminPlans />
          </Suspense>
        )
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<Loader />}>
            <AdminUsers />
          </Suspense>
        )
      }
    ]
  },
];

export default adminRoutes;