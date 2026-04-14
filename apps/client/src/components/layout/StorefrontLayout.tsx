/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { ComponentRegistry } from '@eylza/dynamic-components'
import { useStore } from '@/store/useStore'
import SideCart from '../cart/SideCart'
import StorefrontError from '../common/StorefrontError'
import { useUIStore } from '@/store/useUIStore'
import { useCartStore } from '@/store/useCartStore'
import Loader from '@eylza/dynamic-components/src/components/theme-support/Loader'

const StorefrontLayout = () => {
  const { storeSlug } = useParams()
  const { store, themeData, isLoading, error, fetchStoreId, fetchTheme } = useStore()
  const { isCartOpen, closeCart, toggleCart } = useUIStore()
  const { getTotalItems } = useCartStore()

  // Determine if we need to show a loader because the current store data 
  // doesn't match the slug in the URL (prevents flash of old data or errors)
  const useLocalData = import.meta.env.VITE_USE_LOCAL_DATA === 'true';

  // Only consider it a "wrong store" if we have finished loading, 
  // and the slug still doesn't match the URL.
  // In local mode, we ignore this check to allow testing with any URL slug.
  const isWrongStore = !useLocalData && !isLoading && storeSlug && store?.slug && store?.slug !== storeSlug;
  const isInitialLoad = !themeData && !error;
  
  // Only show the full-page loader if we don't have themeData yet.
  // Once themeData is loaded, we want to keep the layout (header/footer) 
  // stable even during internal loading states.
  const showLoader = (!themeData && (isLoading || isInitialLoad)) || (isWrongStore && !themeData);

  useEffect(() => {
    if (storeSlug) {
      console.log(`[Storefront] Entry: Slug Mode (${storeSlug})`);
      fetchStoreId(storeSlug)
    } else {
      console.log(`[Storefront] Entry: Domain Mode`);
      fetchTheme()
    }
  }, [storeSlug, fetchStoreId, fetchTheme])

  if (showLoader) return <Loader />

  const handleRetry = () => {
    if (storeSlug) {
      fetchStoreId(storeSlug)
    } else {
      fetchTheme()
    }
  }

  if (error) {
    return <StorefrontError message={error} onRetry={handleRetry} />
  }

  if (!themeData) return <Loader />

  // Extract configs from themeData
  const headerConfig = themeData.config?.header?.props;
  const footerConfig = themeData.config?.footer?.props;
  // If we have themeData but no header/footer props, we still want to show something 
  // rather than a stuck loader.
  const hasGlobalConfig = themeData.config;

  if (!hasGlobalConfig && isLoading) return <Loader />

  // Resolve Dynamic Header/Footer from Registry
  const HeaderComponent = themeData.config?.header?.selector 
    ? (ComponentRegistry as any)[themeData.config.header.selector] 
    : (ComponentRegistry as any)?.['primary-header'];

  const FooterComponent = themeData.config?.footer?.selector 
    ? (ComponentRegistry as any)[themeData.config.footer.selector] 
    : (ComponentRegistry as any)?.['primary-footer'];

  return (
    <div className="flex flex-col h-screen">
      <Suspense fallback={<Loader />}>
        {HeaderComponent && (
          <HeaderComponent 
            config={headerConfig} 
            cartItemCount={getTotalItems()}
            onCartClick={toggleCart}
          />
        )}
        <main className="flex-1 client-bg">
          <Outlet />
        </main>
        {FooterComponent && (
          <FooterComponent config={footerConfig} />
        )}
      </Suspense>
      
      <SideCart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  )
}

export default StorefrontLayout