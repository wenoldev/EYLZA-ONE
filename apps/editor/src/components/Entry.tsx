"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Loader } from "./ui/loader"
import TokenInvalidScreen from "./common/token-invalid"
import { WebBuilder } from "./main/web-builder"
import StoreInactiveScreen from "./common/store-inactive"
import api from "@/lib/api"
import { useEditorStore } from "@/store/useEditorStore"
import { setCookie, getCookie } from "@/utils/cookies"

export default function Entry() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setStoreData = useEditorStore(state => state.setStoreData)
  const storeData = useEditorStore(state => state.storeData)
  const setActiveThemeId = useEditorStore(state => state.setActiveThemeId)
  const [state, setState] = useState("loading")

  useEffect(() => {    
    const token = searchParams.get("access_token")
    const refresh = searchParams.get("refresh_token")
    const expires = searchParams.get("expires_at")
    const uid = searchParams.get("uid")
    const themeId = searchParams.get("themeId") || searchParams.get("draftId")

    // If params exist → set cookies
    if (token || refresh || expires) {
      if (token && token !== "") setCookie('access', token)
      if (refresh && refresh !== "") setCookie('refresh', refresh)
      if (expires && expires !== "") setCookie('expires', expires)
      if (uid && uid !== "") setCookie('uid', uid)
      if (themeId && themeId !== "") {
        setCookie('theme', themeId)
        setActiveThemeId(themeId)
      }

      // Remove params from URL instantly
      navigate(window.location.pathname, { replace: true })
    } else {
      // Try to get themeId from cookie if not in URL
      const cookieTheme = getCookie('theme')
      if (cookieTheme) setActiveThemeId(cookieTheme)
    }

    const fetchStoreData = async () => {
      try {
        const response = await api.get('/stores')
        const apiResponse = response.data
        
        const stores = apiResponse.data?.stores

        if (!stores || stores.length === 0) {
          return setState("token-invalid") // Or a specific "no-store" state
        }

        const currentStore = stores[0]

        if (currentStore.status !== "active") {
          return setState("store-inactive")
        }
        setStoreData(currentStore)

        // If no activeThemeId, fetch latest or published theme for this store
        const currentThemeId = getCookie('theme')
        if (!currentThemeId) {
          const themesRes = await api.get(`/stores/${currentStore.id}/themes`)
          const themes = themesRes.data.data.themes

          if (themes && themes.length > 0) {
            // Prefer published one
            const published = themes.find((t: any) => t.status === 'published')
            const latestThemeId = published ? published.id : themes[0].id

            setActiveThemeId(latestThemeId)
            setCookie('theme', latestThemeId)
          } else {
            // Create a default theme/draft if none exists
            const createRes = await api.post(`/stores/${currentStore.id}/themes`, { name: 'Main Draft' })
            const newThemeId = createRes.data.data.theme.id
            setActiveThemeId(newThemeId)
            setCookie('theme', newThemeId)
          }
        }

        setState("success")
      } catch (e: any) {
        console.error(e)
        if (e.response?.status === 401) {
          setState("token-invalid")
        } else {
          setState("error")
        }
      }
    }

    fetchStoreData()
  }, [searchParams, navigate, setStoreData, setActiveThemeId])

  if (state === "loading") return <Loader />
  if (state === "token-invalid") return <TokenInvalidScreen />
  if (state === "store-inactive") return <StoreInactiveScreen />
  if (state === "success" && storeData) return <WebBuilder />
  return <TokenInvalidScreen />
}

