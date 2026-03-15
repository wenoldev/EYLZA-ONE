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
const AdminPlugins = lazy(() => import('@/components/modules/dashboard/admin/plugins'));

// Theme sub-components
const ThemeList = lazy(() => import('@/components/modules/admin/themes/ThemeList'));
const ThemeForm = lazy(() => import('@/components/modules/admin/themes/ThemeForm'));
const ThemePageList = lazy(() => import('@/components/modules/admin/themes/ThemePageList'));
const PageEditor = lazy(() => import('@/components/modules/admin/themes/PageEditor'));

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
        ),
        children: [
          {
            path: '',
            element: (
              <Suspense fallback={<Loader />}>
                <ThemeList />
              </Suspense>
            )
          },
          {
            path: 'create',
            element: (
              <Suspense fallback={<Loader />}>
                <ThemeForm />
              </Suspense>
            )
          },
          {
            path: 'edit/:id',
            element: (
              <Suspense fallback={<Loader />}>
                <ThemeForm />
              </Suspense>
            )
          },
          {
            path: 'pages/:id',
            element: (
              <Suspense fallback={<Loader />}>
                <ThemePageList />
              </Suspense>
            )
          },
          {
            path: 'pages/:id/edit/:pageId',
            element: (
              <Suspense fallback={<Loader />}>
                <PageEditor />
              </Suspense>
            )
          }
        ]
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
      },
      {
        path: 'plugins',
        element: (
          <Suspense fallback={<Loader />}>
            <AdminPlugins />
          </Suspense>
        )
      }
    ]
  },
];

export default adminRoutes;