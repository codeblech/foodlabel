import { useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Paper,
  ThemeProvider,
  createTheme,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from '@mui/material'
import { Analytics, Link as LinkIcon, Assessment, History, Person, Insights } from '@mui/icons-material'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Create Material 3 theme with custom colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#006C51', // A rich teal
      light: '#3E8E7E',
      dark: '#004B37',
    },
    secondary: {
      main: '#FFB649', // Warm amber
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

function ProductAnalyzer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyzeProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setResult(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pb: { xs: 7, sm: 7 }
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            color: 'primary.main', 
            fontWeight: 'bold', 
            mb: { xs: 2, sm: 4 },
            fontSize: { xs: '1.8rem', sm: '2.5rem' }
          }}
        >
          <Analytics sx={{ mr: 1, verticalAlign: 'bottom', fontSize: { xs: '1.8rem', sm: '2.5rem' } }} />
          Product Analyzer
        </Typography>

        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 4, width: '100%' }}>
          <form onSubmit={analyzeProduct}>
            <TextField
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter product URL"
              required
              variant="outlined"
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'primary.light' }} />,
              }}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              type="submit"
              disabled={loading}
              variant="contained"
              size="large"
              sx={{
                height: 48,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
              ) : (
                <Assessment sx={{ mr: 1 }} />
              )}
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </form>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 4, width: '100%' }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ display: 'grid', gap: 3, width: '100%' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '1.4rem', sm: '1.75rem' }, 
                color: 'primary.main' 
              }}
            >
              Results
            </Typography>

            <Tabs defaultValue="extracted" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="extracted" 
                  className="px-2 py-1 text-sm sm:text-base sm:px-4 sm:py-2"
                >
                  Extracted Information
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis"
                  className="px-2 py-1 text-sm sm:text-base sm:px-4 sm:py-2"
                >
                  Nutritional Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="extracted">
                <Card sx={{ width: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Product Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      {Object.entries(result.extracted_data).map(([key, value]) => (
                        <Box key={key}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Typography>
                          <Typography variant="body1">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis">
                <Card sx={{ width: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Nutritional Insights
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      {Object.entries(result.analysis).map(([key, value]) => (
                        <Box key={key}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Typography>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default ProductAnalyzer 