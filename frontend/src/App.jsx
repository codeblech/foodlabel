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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

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

  // New state for drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState(null)

  const handleIngredientClick = (ingredient) => {
    setSelectedIngredient(ingredient)
    setDrawerOpen(true)
  }

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
              onIngredientClick={handleIngredientClick}
            />
          } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recents" element={<RecentsPage />} />
        </Routes>
        <Navigation />

        {/* Ingredient Details Drawer */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold text-primary">
                {selectedIngredient?.name}
              </DrawerTitle>
              <DrawerDescription>
                Health Analysis Results
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="h-[70vh] px-4">
              {selectedIngredient && analysisResult?.extracted_data?.ingredient_search_results?.[selectedIngredient.name]?.map((result, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {result.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {result.snippet}
                  </p>
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
            </ScrollArea>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
