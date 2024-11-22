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
  Grid,
  Chip,
} from '@mui/material'
import { Analytics, Link as LinkIcon, Assessment, History, Person, Insights, HealthAndSafety, Warning, Check, Close } from '@mui/icons-material'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Update theme for better responsiveness
const theme = createTheme({
  palette: {
    primary: { main: '#006C51' },
    secondary: { main: '#FFB649' },
    background: { default: '#F8F9FA', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    allVariants: { letterSpacing: -0.2 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
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
      <Box sx={{ 
        width: '100%',
        minHeight: '100vh',
        maxWidth: '100%',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}>
        <Container 
          maxWidth={false}
          disableGutters 
          sx={{ 
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 1, sm: 2 },
            width: '100%',
            maxWidth: { sm: '600px', md: '900px', lg: '1200px' },
            mx: 'auto'
          }}
        >
          {/* Header */}
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 3,
              color: 'primary.main',
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            <Analytics /> Product Analyzer
          </Typography>

          {/* Input Form */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 3,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <form onSubmit={analyzeProduct}>
              <TextField
                fullWidth
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter product URL"
                size="small"
                required
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />,
                }}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                type="submit"
                disabled={loading}
                variant="contained"
                sx={{ py: 1 }}
              >
                {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : <Assessment sx={{ mr: 1 }} />}
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </form>
          </Paper>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Results */}
          {result && (
            <Box sx={{ width: '100%' }}>
              <Tabs defaultValue="extracted" className="w-full">
                <TabsList className="grid w-full grid-cols-2 px-1">
                  <TabsTrigger value="extracted">Information</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="extracted">
                  <Card sx={{ 
                    width: '100%',
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}>
                    <CardContent sx={{ 
                      p: { xs: 1.5, sm: 2 },
                      '&:last-child': { pb: { xs: 1.5, sm: 2 } }
                    }}>
                      {/* Ingredients Section */}
                      <Box sx={{ mb: 2.5 }}>
                        <Typography 
                          variant="subtitle1"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            mb: 1.5,
                            color: 'primary.main',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 600
                          }}
                        >
                          <Insights sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />
                          Ingredients
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 0.75,
                          width: '100%'
                        }}>
                          {result.extracted_data.ingredients.map((ingredient, index) => (
                            <Chip
                              key={index}
                              label={ingredient}
                              size="small"
                              sx={{
                                maxWidth: '100%',
                                height: 'auto',
                                '& .MuiChip-label': {
                                  whiteSpace: 'normal',
                                  px: 1,
                                  py: 0.5,
                                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                  lineHeight: 1.3
                                },
                                borderColor: 'primary.light',
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white'
                                }
                              }}
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Nutrition Section */}
                      <Box>
                        <Typography 
                          variant="subtitle1"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            mb: 1.5,
                            color: 'primary.main',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 600
                          }}
                        >
                          <Assessment sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem' } }} />
                          Nutrition Facts
                        </Typography>
                        <Grid 
                          container 
                          spacing={1}
                          sx={{ 
                            width: '100%',
                            margin: 0,
                            '& .MuiGrid-item': {
                              paddingLeft: '2px',
                              paddingRight: '2px',
                              paddingTop: '2px',
                              paddingBottom: '2px'
                            }
                          }}
                        >
                          {Object.entries(result.extracted_data['nutritional label']).map(([key, value]) => (
                            <Grid item xs={6} sm={4} md={3} key={key}>
                              <Box
                                sx={{
                                  p: { xs: 0.75, sm: 1.25 },
                                  border: '1px solid',
                                  borderColor: 'primary.light',
                                  borderRadius: 1,
                                  textAlign: 'center',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  '&:hover': {
                                    bgcolor: 'primary.50'
                                  }
                                }}
                              >
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    mb: 0.5,
                                    lineHeight: 1.2,
                                    display: 'block'
                                  }}
                                >
                                  {key}
                                </Typography>
                                <Typography 
                                  variant="body2"
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                    lineHeight: 1.2
                                  }}
                                >
                                  {value}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis">
                  <Card sx={{ 
                    width: '100%',
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      {/* Nutritional Summary Section */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                          <Assessment /> Nutritional Summary
                        </Typography>
                        <Grid container spacing={2}>
                          {/* Overall Rating */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'primary.light',
                              borderRadius: 2,
                              bgcolor: 'background.paper'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>Overall Rating</Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 1 
                              }}>
                                <Box sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5
                                }}>
                                  {[1,2,3,4,5].map((star) => (
                                    <Box
                                      key={star}
                                      sx={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: star <= result.analysis.nutritional_summary.overall_rating 
                                          ? 'primary.main' 
                                          : 'grey.100',
                                        color: star <= result.analysis.nutritional_summary.overall_rating 
                                          ? 'white' 
                                          : 'grey.400',
                                        transition: 'all 0.2s ease',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      {star}
                                    </Box>
                                  ))}
                                </Box>
                                <Typography 
                                  variant="h4" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {result.analysis.nutritional_summary.overall_rating}/5
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Calories Assessment */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.light', borderRadius: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>Calories Assessment</Typography>
                              <Typography variant="body1">{result.analysis.nutritional_summary.calories_assessment}</Typography>
                            </Box>
                          </Grid>

                          {/* Macronutrient Balance */}
                          <Grid item xs={12}>
                            <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.light', borderRadius: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>Macronutrient Balance</Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 2, 
                                flexWrap: 'wrap' 
                              }}>
                                {['Protein', 'Carbs', 'Fat'].map((macro) => (
                                  <Box 
                                    key={macro}
                                    sx={{
                                      flex: 1,
                                      minWidth: '150px',
                                      p: 1.5,
                                      bgcolor: 'primary.50',
                                      borderRadius: 1,
                                      textAlign: 'center'
                                    }}
                                  >
                                    <Typography variant="h6" color="primary.main">{macro}</Typography>
                                  </Box>
                                ))}
                              </Box>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {result.analysis.nutritional_summary.macronutrient_balance}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Key Nutrients & Ingredients Analysis */}
                      <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.light', borderRadius: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                <Insights /> Key Nutrients
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.analysis.nutritional_summary.key_nutrients.map((nutrient, index) => (
                                  <Chip
                                    key={index}
                                    label={nutrient}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.light', borderRadius: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                <Warning /> Concerning Ingredients
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.analysis.ingredient_analysis.concerning_ingredients.map((ingredient, index) => (
                                  <Chip
                                    key={index}
                                    label={ingredient}
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Health Considerations */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                          <HealthAndSafety /> Health Considerations
                        </Typography>
                        <Grid container spacing={2}>
                          {/* Overconsumption Risk */}
                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'primary.light',
                              borderRadius: 2,
                              textAlign: 'center'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>Risk Level</Typography>
                              <Chip
                                label={result.analysis.health_considerations.overconsumption_risk}
                                color={
                                  result.analysis.health_considerations.overconsumption_risk === 'Low' ? 'success' :
                                  result.analysis.health_considerations.overconsumption_risk === 'Medium' ? 'warning' : 'error'
                                }
                                sx={{ width: '100%', height: '36px' }}
                              />
                            </Box>
                          </Grid>

                          {/* Consumption Frequency */}
                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'primary.light',
                              borderRadius: 2,
                              textAlign: 'center'
                            }}>
                              <Typography variant="subtitle2" gutterBottom>Recommended Frequency</Typography>
                              <Chip
                                label={result.analysis.recommendations.consumption_frequency}
                                color="primary"
                                sx={{ width: '100%', height: '36px' }}
                              />
                            </Box>
                          </Grid>

                          {/* Portion Guidance */}
                          <Grid item xs={12} sm={6} md={6}>
                            <Box sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'primary.light',
                              borderRadius: 2
                            }}>
                              <Typography variant="subtitle2" gutterBottom>Portion Guidance</Typography>
                              <Typography variant="body2">
                                {result.analysis.recommendations.portion_guidance}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Diet Compatibility */}
                      <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, border: '1px solid', borderColor: 'success.light', borderRadius: 2 }}>
                              <Typography variant="subtitle2" color="success.main" gutterBottom>
                                <Check /> Suitable Diets
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.analysis.health_considerations.suitable_diets.map((diet, index) => (
                                  <Chip
                                    key={index}
                                    label={diet}
                                    color="success"
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, border: '1px solid', borderColor: 'error.light', borderRadius: 2 }}>
                              <Typography variant="subtitle2" color="error.main" gutterBottom>
                                <Close /> Unsuitable Diets
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {result.analysis.health_considerations.unsuitable_diets.map((diet, index) => (
                                  <Chip
                                    key={index}
                                    label={diet}
                                    color="error"
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Detailed Analysis */}
                      <Box>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                          <Analytics /> Detailed Analysis
                        </Typography>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            bgcolor: 'grey.50',
                            border: '1px solid',
                            borderColor: 'grey.200',
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                            {result.analysis.detailed_analysis}
                          </Typography>
                        </Paper>
                      </Box>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default ProductAnalyzer 