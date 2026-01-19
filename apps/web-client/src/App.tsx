import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useStore } from './store/useStore'

function App() {
     const fetchTheme = useStore(state => state.fetchTheme)

     useEffect(() => {
          fetchTheme()
     }, [fetchTheme])

     return (
          <RouterProvider router={router} />
     )
}

export default App
