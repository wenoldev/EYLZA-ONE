import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index';
// import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
