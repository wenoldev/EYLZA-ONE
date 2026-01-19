import { Outlet, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../dynamic/Header'
import Footer from '../dynamic/Footer'
import { useStore } from '@/store/useStore'
import ShadeLoader from '../loader/ShadeLoader'
import NotFoundPage from '@/pages/common/NotFoundPage'

const StorefrontLayout = () => {
  const { storeSlug } = useParams()
  const { store, themeData, isLoading, error, fetchStoreId, fetchTheme } = useStore()

  // Determine if we need to show a loader because the current store data 
  // doesn't match the slug in the URL (prevents flash of old data or errors)
  const isWrongStore = storeSlug && store?.slug !== storeSlug;
  const isInitialLoad = !themeData && !error && !isLoading;
  const showLoader = isLoading || isInitialLoad || isWrongStore;

  useEffect(() => {
    if (storeSlug) {
      fetchStoreId(storeSlug)
    } else {
      fetchTheme()
    }
  }, [storeSlug, fetchStoreId, fetchTheme])

  if (showLoader) return <ShadeLoader />

  if (error) {
    return <NotFoundPage showButtons={false} />
  }

  if (!themeData) return <ShadeLoader />

  // Extract configs from themeData
  const headerConfig = themeData.global_config?.header?.props;
  const footerConfig = themeData.global_config?.footer?.props;
  const globalColors = themeData.global_config?.global?.colors || {};

  if (!headerConfig || !footerConfig) return <ShadeLoader />

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <Header config={headerConfig} />
      <main className="flex-1" style={{ backgroundColor: globalColors.background }}>
        <Outlet />
      </main>
      <Footer config={footerConfig} />
    </div>
  )
}

export default StorefrontLayout