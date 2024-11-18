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
  CircularProgress
} from '@mui/material'
import { Analytics, Link as LinkIcon, Assessment } from '@mui/icons-material'
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
        fontSize: '2rem',
      },
    },
  },
  shape: {
    borderRadius: 16,
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center"
          sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
          <Analytics sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Product Analyzer
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
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
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Typography variant="h2" sx={{ fontSize: '1.75rem', color: 'primary.main' }}>
              Results
            </Typography>

            <Tabs defaultValue="extracted" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="extracted">Extracted Information</TabsTrigger>
                <TabsTrigger value="analysis">Nutritional Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="extracted">
                <Card>
                  <CardContent sx={{ p: 3 }}>
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
                <Card>
                  <CardContent sx={{ p: 3 }}>
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