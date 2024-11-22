import { useState, useEffect } from 'react'
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
  Tabs,
  Tab,
} from '@mui/material'
import { Analytics, Link as LinkIcon, Assessment, History, Person, Insights, CloudUpload, PhotoCamera } from '@mui/icons-material'

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
  const [uploadType, setUploadType] = useState('url') // 'url' or 'image'
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [activeTab, setActiveTab] = useState('extracted')

  const analyzeProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let response;
      
      if (uploadType === 'url') {
        response = await fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });
      } else {
        // Get the file input element
        const fileInput = document.getElementById('image-upload');
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        
        response = await fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          // Remove the Content-Type header to let the browser set it with the boundary
          body: formData,
        });     
      }

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

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
          <Box sx={{ mb: 2 }}>
            <Tabs value={uploadType} onChange={(e, v) => setUploadType(v)}>
              <Tab value="url" label="URL" icon={<LinkIcon />} />
              <Tab value="image" label="Image" icon={<CloudUpload />} />
            </Tabs>
          </Box>

          <form onSubmit={analyzeProduct}>
            {uploadType === 'url' ? (
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
            ) : (
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  name="image"
                  required
                  capture="environment"
                  onChange={handleFileSelect}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<CloudUpload />}
                    sx={{ mb: 1, height: 56 }}
                  >
                    Upload Image
                  </Button>
                </label>
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<PhotoCamera />}
                  onClick={() => {
                    document.getElementById('image-upload').click()
                  }}
                  sx={{ height: 56 }}
                >
                  Take Photo
                </Button>

                {selectedFile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Selected: {selectedFile.name}
                    </Typography>
                    {previewUrl && (
                      <Box
                        component="img"
                        src={previewUrl}
                        alt="Preview"
                        sx={{
                          width: '100%',
                          maxHeight: 200,
                          objectFit: 'contain',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            )}

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

            <Box sx={{ width: '100%' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab label="Extracted Information" value="extracted" />
                <Tab label="Nutritional Analysis" value="analysis" />
              </Tabs>

              {activeTab === 'extracted' && (
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
              )}

              {activeTab === 'analysis' && (
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
              )}
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default ProductAnalyzer 