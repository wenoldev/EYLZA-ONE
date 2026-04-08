import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NotFound from '@/components/modules/404';
import dashboardRoutes from './dashboard';
import adminRoutes from './admin';
import Loader from '@/components/common/Loader';
import { AuthCallback } from '@/components/modules/auth/callback';
import { Unauthorized } from '@/components/common/Unauthorized';
import StoreSetupWizard from '@/components/modules/store-setup';
import PricingPage from '@/components/modules/dashboard/billing/PricingPage';
import {CheckoutPage} from '@/components/modules/dashboard/billing/CheckoutPage';
import ErrorPage from '@/components/common/ErrorPage';

// Lazy-load components
const AuthPages = lazy(() => import('@/components/modules/auth/index'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: 'login',
    element: (
      <Suspense fallback={<Loader />}>
        <AuthPages page="login" />
      </Suspense>
    ),
  },
    {
    path: 'forget-password',
    element: (
      <Suspense fallback={<Loader />}>
        <AuthPages page="forgot" />
      </Suspense>
    ),
  },
  {
    path: 'register',
    element: (
      <Suspense fallback={<Loader />}>
        <AuthPages page="register" />
      </Suspense>
    ),
  },
  {
    path: 'forgot-password',
    element: (
      <Suspense fallback={<Loader />}>
        <AuthPages page="forgot" />
      </Suspense>
    ),
  },
  {
    path: 'update-password',
    element: (
      <Suspense fallback={<Loader />}>
        <AuthPages page="change" />
      </Suspense>
    ),
  },
  {
    path: 'auth',
    children: [
      { path: 'callback', element: <AuthCallback /> }
    ]
  },
  {
    path: 'unauthorized',
    element: <Unauthorized />,
  },
  {
    path: 'store-setup',
    element: <StoreSetupWizard />
  },
  {
    path: 'pricing',
    element: <PricingPage />
  },
  {
    path: 'checkout',
    element: <CheckoutPage />
  },
  {
    path: 'error',
    element: <ErrorPage />
  },
  ...dashboardRoutes,
  ...adminRoutes,
  {
    path: '*',
    element: <NotFound />,
  },

]);