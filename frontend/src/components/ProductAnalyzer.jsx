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
  Grid,
  Chip,
} from '@mui/material'
import {
  Analytics,
  Link as LinkIcon,
  Assessment,
  History,
  Person,
  Insights,
  HealthAndSafety,
  Warning,
  Check,
  Close,
  CloudUpload,
  PhotoCamera,
  InfoOutlined,
  SecurityOutlined,
  GppMaybeOutlined,
} from '@mui/icons-material'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Lottie from 'lottie-react'
import analysisAnimation from '@/assets/analysis-animation.json'

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

  const LoadingAnimation = () => (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 1000
    }}>
      <Lottie
        animationData={analysisAnimation}
        loop={true}
        style={{
          width: 250,
          height: 250,
          margin: '0 auto'
        }}
      />
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: 'primary.main',
          textAlign: 'center'
        }}
      >
        Analyzing your product...
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', mt: 1 }}
      >
        This may take a few moments
      </Typography>
    </Box>
  )

  const SafetyClassification = ({ ingredient, classifications }) => {
    if (!ingredient || !classifications) return null;

    const getChipColor = (classification) => {
      if (!classification) return 'default';
      if (classification.includes('GRAS')) return 'success';
      if (classification.includes('Known')) return 'error';
      if (classification.includes('RAHC')) return 'warning';
      return 'default';
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {ingredient}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {classifications.map((classification, index) => (
            <Chip
              key={index}
              label={classification}
              size="small"
              color={getChipColor(classification)}
              icon={<GppMaybeOutlined />}
            />
          ))}
        </Box>
      </Box>
    )
  }

  const tabs = [
    {
      value: 'extracted',
      label: 'Information',
      icon: <Insights />,
      content: (
        result?.extracted_data && (
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
              {result.extracted_data.ingredients?.length > 0 && (
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
              )}

              {/* Nutrition Section */}
              {result.extracted_data['nutritional label'] && (
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
              )}
            </CardContent>
          </Card>
        )
      )
    },
    {
      value: 'analysis',
      label: 'Analysis',
      icon: <Assessment />,
      content: (
        result?.analysis && (
          <Card>
            <CardContent>
              {/* Nutritional Summary Section */}
              {result.analysis.nutritional_summary && (
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
              )}

              {/* Key Nutrients & Ingredients Analysis */}
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  {result.analysis.nutritional_summary?.key_nutrients && (
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
                  )}

                  {result.analysis.ingredient_analysis?.concerning_ingredients && (
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
                  )}
                </Grid>
              </Box>

              {/* Health Considerations */}
              {result.analysis.health_considerations && (
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
              )}

              {/* Diet Compatibility */}
              {result.analysis.health_considerations?.suitable_diets && (
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

                    {result.analysis.health_considerations?.unsuitable_diets && (
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
                    )}
                  </Grid>
                </Box>
              )}

              {/* Detailed Analysis */}
              {result.analysis.detailed_analysis && (
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
              )}

              {/* Safety Information */}
              {result.analysis.safety_information && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    <SecurityOutlined /> Safety Information
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
                      {result.analysis.safety_information}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        )
      )
    },
    {
      value: 'safety',
      label: 'Safety Information',
      icon: <SecurityOutlined />,
      content: (
        result?.extracted_data?.safety_classifications && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingredient Safety Classifications
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Safety information from FDA GRAS, IARC Monographs, and Report on Carcinogens databases.
              </Typography>

              {Object.entries(result.extracted_data.safety_classifications).map(([ingredient, classifications]) => (
                <SafetyClassification
                  key={ingredient}
                  ingredient={ingredient}
                  classifications={classifications}
                />
              ))}

              <Alert severity="info" sx={{ mt: 2 }}>
                <AlertTitle>Note</AlertTitle>
                This safety information is compiled from official databases but should not be considered medical advice.
                Always consult with healthcare professionals about specific dietary needs.
              </Alert>
            </CardContent>
          </Card>
        )
      )
    }
  ]

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
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={uploadType}
              onValueChange={setUploadType}
              defaultValue="url"
              className="w-full"
            >
              <TabsList
                className="grid w-full grid-cols-2"
                style={{
                  padding: '4px',
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 108, 81, 0.08)',
                  minHeight: '48px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
                }}
              >
                <TabsTrigger
                  value="url"
                  style={{
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    flex: 1,
                    minWidth: '120px',
                    backgroundColor: uploadType === 'url' ? '#006C51' : 'transparent',
                    color: uploadType === 'url' ? '#ffffff' : '#006C51',
                    boxShadow: uploadType === 'url' ? '0 2px 4px rgba(0, 108, 81, 0.1)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    width: '100%',
                    py: 0.5,
                    opacity: uploadType === 'url' ? 1 : 0.7
                  }}>
                    <LinkIcon sx={{ fontSize: '1.1rem' }} />
                    <span>URL</span>
                  </Box>
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  style={{
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    flex: 1,
                    minWidth: '120px',
                    backgroundColor: uploadType === 'image' ? '#006C51' : 'transparent',
                    color: uploadType === 'image' ? '#ffffff' : '#006C51',
                    boxShadow: uploadType === 'image' ? '0 2px 4px rgba(0, 108, 81, 0.1)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    width: '100%',
                    py: 0.5,
                    opacity: uploadType === 'image' ? 1 : 0.7
                  }}>
                    <CloudUpload sx={{ fontSize: '1.1rem' }} />
                    <span>Image</span>
                  </Box>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Box>

            <form onSubmit={analyzeProduct}>
            <Box sx={{
              width: '100%',
              height: '140px', // Fixed height container for inputs
              mb: 2
            }}>
              {uploadType === 'url' ? (
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
                  sx={{
                    height: '56px',
                    '& .MuiOutlinedInput-root': {
                      height: '56px'
                    }
                  }}
                />
              ) : (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  height: '100%'
                }}>
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
                  <label htmlFor="image-upload" style={{ width: '100%' }}>
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<CloudUpload />}
                      sx={{
                        height: '56px',
                        width: '100%'
                      }}
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
                    sx={{
                      height: '56px',
                      width: '100%'
                    }}
                  >
                    Take Photo
                  </Button>
                </Box>
              )}
            </Box>

            {selectedFile && (
              <Box sx={{ mb: 2 }}>
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

            <Button
              fullWidth
              type="submit"
              disabled={loading}
              variant="contained"
              sx={{
                py: 1,
                height: '56px'  // Consistent height
              }}
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
          {loading ? (
            <LoadingAnimation />
          ) : (
            result && (
              <Box sx={{ width: '100%' }}>
                <Tabs defaultValue="extracted">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="extracted">Information</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  </TabsList>

                  {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                      {tab.content}
                    </TabsContent>
                  ))}
                </Tabs>
              </Box>
            )
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default ProductAnalyzer