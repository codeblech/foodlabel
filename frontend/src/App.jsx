import { ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductAnalyzer from './components/ProductAnalyzer'
import Navigation from './components/Navigation'
import ProfilePage from './pages/ProfilePage'
import RecentsPage from './pages/RecentsPage'
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from 'react'

// Move theme creation here from ProductAnalyzer
const theme = createTheme({
  palette: {
    primary: {
      main: '#006C51',
      light: '#3E8E7E',
      dark: '#004B37',
    },
    secondary: {
      main: '#FFB649',
      light: '#FFD449',
      dark: '#CC8A00',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.8rem',
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
})

function App() {
  // Lift state up
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProductAnalyzer
              result={analysisResult}
              setResult={setAnalysisResult}
              loading={analysisLoading}
              setLoading={setAnalysisLoading}
              error={analysisError}
              setError={setAnalysisError}
            />
          } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recents" element={<RecentsPage />} />
        </Routes>
        <Navigation />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
