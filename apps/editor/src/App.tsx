import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RootProvider } from '@/components/root-provider'
import Entry from './components/Entry'

function EditorRuntimeBridge() {
  useEffect(() => {
    ;(globalThis as any).__EYLZA_RUNTIME__ = 'editor'
    ;(globalThis as any).__EYLZA_BRIDGE__ = {}

    return () => {
      delete (globalThis as any).__EYLZA_BRIDGE__
    }
  }, [])

  return null
}

function App() {
  return (
    <RootProvider>
      <EditorRuntimeBridge />
      <Router>
        <Routes>
          <Route path="/" element={<Entry />} />
        </Routes>
      </Router>
    </RootProvider>
  )
}

export default App
