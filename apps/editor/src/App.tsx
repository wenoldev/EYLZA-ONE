import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RootProvider } from '@/components/root-provider'
import Entry from './components/Entry'

function App() {
  return (
    <RootProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Entry />} />
        </Routes>
      </Router>
    </RootProvider>
  )
}

export default App
