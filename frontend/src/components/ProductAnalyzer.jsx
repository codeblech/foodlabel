import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  AlertTitle,
  Paper,
  ThemeProvider,
  createTheme,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Grid,
  Chip,
  Collapse,
  IconButton,
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
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Lottie from 'lottie-react'
import analysisAnimation from '@/assets/analysis-animation.json'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLocation } from 'react-router-dom'

// Helper function to normalize keys for case-insensitive lookup
const normalizeKey = (key) => key.toLowerCase().trim();

// Update FDA_DAILY_VALUES to use new structure from Python file
const FDA_DAILY_VALUES = {
  nutrients: [
    {
      name: "Added sugars",
      alternate_names: [
        "Added sugar",
        "Sugars",
        "Refined sugars",
        "Processed sugars",
        "Total sugars",
      ],
      daily_value: "50g",
    },
    {
      name: "Biotin",
      alternate_names: ["Vitamin B7", "Vitamin H", "Coenzyme R"],
      daily_value: "30mcg",
    },
    {
      name: "Calcium",
      alternate_names: ["Ca", "Dietary calcium"],
      daily_value: "1300mg",
    },
    {
      name: "Chloride",
      alternate_names: ["Cl", "Chlorine ion", "Chlorine"],
      daily_value: "2300mg",
    },
    {
      name: "Choline",
      alternate_names: ["Trimethylammonium ethanol", "Choline bitartrate"],
      daily_value: "550mg",
    },
    {
      name: "Cholesterol",
      alternate_names: ["Sterol lipid", "Cholesterol esters"],
      daily_value: "300mg",
    },
    {
      name: "Chromium",
      alternate_names: ["Cr", "Chromium picolinate", "Dietary chromium"],
      daily_value: "35mcg",
    },
    {
      name: "Copper",
      alternate_names: ["Cu", "Dietary copper"],
      daily_value: "0.9mg",
    },
    {
      name: "Dietary Fiber",
      alternate_names: ["Fiber", "Roughage", "Bulk", "Dietary fibres"],
      daily_value: "28g",
    },
    {
      name: "Fat",
      alternate_names: [
        "Lipids",
        "Dietary fat",
        "Fats",
        "Total fat",
        "Total dietary fat",
        "Total fats",
      ],
      daily_value: "78g",
    },
    {
      name: "Folate/Folic Acid",
      alternate_names: [
        "Vitamin B9",
        "Pteroylglutamic acid",
        "Folate (natural)",
        "Folic acid (synthetic)",
        "Folate",
      ],
      daily_value: "400mcg DFE",
    },
    {
      name: "Iodine",
      alternate_names: ["I", "Dietary iodine"],
      daily_value: "150mcg",
    },
    {
      name: "Iron",
      alternate_names: ["Fe", "Dietary iron", "Ferrous sulfate", "Heme iron"],
      daily_value: "18mg",
    },
    {
      name: "Magnesium",
      alternate_names: ["Mg", "Dietary magnesium"],
      daily_value: "420mg",
    },
    {
      name: "Manganese",
      alternate_names: ["Mn", "Dietary manganese"],
      daily_value: "2.3mg",
    },
    {
      name: "Molybdenum",
      alternate_names: ["Mo", "Dietary molybdenum"],
      daily_value: "45mcg",
    },
    {
      name: "Niacin",
      alternate_names: [
        "Vitamin B3",
        "Nicotinic acid",
        "Niacinamide",
        "Niacin equivalents",
      ],
      daily_value: "16mg NE",
    },
    {
      name: "Pantothenic Acid",
      alternate_names: ["Vitamin B5", "Pantothenate"],
      daily_value: "5mg",
    },
    {
      name: "Phosphorus",
      alternate_names: ["P", "Phosphate", "Dietary phosphorus"],
      daily_value: "1250mg",
    },
    {
      name: "Potassium",
      alternate_names: ["K", "Dietary potassium"],
      daily_value: "4700mg",
    },
    {
      name: "Protein",
      alternate_names: ["Polypeptides", "Amino acids", "Dietary protein"],
      daily_value: "50g",
    },
    {
      name: "Riboflavin",
      alternate_names: ["Vitamin B2", "Dietary riboflavin"],
      daily_value: "1.3mg",
    },
    {
      name: "Saturated fat",
      alternate_names: [
        "Saturated fatty acids",
        "Dietary saturated fat",
        "Saturated fats",
      ],
      daily_value: "20g",
    },
    {
      name: "Selenium",
      alternate_names: ["Se", "Dietary selenium"],
      daily_value: "55mcg",
    },
    {
      name: "Sodium",
      alternate_names: ["Na", "Salt", "Dietary sodium"],
      daily_value: "2300mg",
    },
    {
      name: "Thiamin",
      alternate_names: ["Vitamin B1", "Dietary thiamine", "Thiamine"],
      daily_value: "1.2mg",
    },
    {
      name: "Total carbohydrate",
      alternate_names: [
        "Carbohydrate",
        "Carbs",
        "Total carbs",
        "Carbohydrates",
        "Total carbohydrates",
      ],
      daily_value: "275g",
    },
    {
      name: "Vitamin A",
      alternate_names: [
        "Retinol",
        "Beta-carotene",
        "Retinal",
        "Retinol activity equivalents (RAE)",
      ],
      daily_value: "900mcg RAE",
    },
    {
      name: "Vitamin B6",
      alternate_names: [
        "Pyridoxine",
        "Pyridoxal",
        "Pyridoxamine",
        "Vitamin B-6",
      ],
      daily_value: "1.7mg",
    },
    {
      name: "Vitamin B12",
      alternate_names: [
        "Cobalamin",
        "Cyanocobalamin",
        "Methylcobalamin",
        "Vitamin B-12",
      ],
      daily_value: "2.4mcg",
    },
    {
      name: "Vitamin C",
      alternate_names: ["Ascorbic acid", "Vitamin C supplement"],
      daily_value: "90mg",
    },
    {
      name: "Vitamin D",
      alternate_names: [
        "Calciferol",
        "Cholecalciferol (D3)",
        "Ergocalciferol (D2)",
        "Vitamin D2",
        "Vitamin D3",
      ],
      daily_value: "20mcg",
    },
    {
      name: "Vitamin E",
      alternate_names: [
        "Alpha-tocopherol",
        "Tocotrienols",
        "Vitamin E supplement",
      ],
      daily_value: "15mg alpha-tocopherol",
    },
    {
      name: "Vitamin K",
      alternate_names: [
        "Phylloquinone (K1)",
        "Menaquinones (K2)",
        "Vitamin K1",
        "Vitamin K2",
      ],
      daily_value: "120mcg",
    },
    {
      name: "Zinc",
      alternate_names: ["Zn", "Dietary zinc"],
      daily_value: "11mg",
    },
  ]
};

// New helper function to find nutrient by name or alternate name
const findNutrientDailyValue = (searchName) => {
  const normalizedSearch = normalizeKey(searchName);

  return FDA_DAILY_VALUES.nutrients.find(nutrient =>
    normalizeKey(nutrient.name) === normalizedSearch ||
    nutrient.alternate_names.some(alt => normalizeKey(alt) === normalizedSearch)
  )?.daily_value;
};

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

// Add this near the top with other constants
const FOOD_FACTS = [
  {
    title: "Turmeric: India's golden spice of health!",
    description: "Turmeric contains curcumin, a powerful anti-inflammatory and antioxidant compound, widely used in Indian curries and healing remedies like haldi doodh (turmeric milk)."
  },
  {
    title: "Ragi (Finger Millet): The ancient grain of strength.",
    description: "Ragi, a staple in many South Indian dishes, is packed with calcium, iron, and amino acids. It's excellent for bone health and is gluten-free."
  },
  {
    title: "Amla (Indian Gooseberry): The immunity booster.",
    description: "Amla is a seasonal winter fruit high in vitamin C, helping to strengthen the immune system and improve skin health. It's used in chutneys, pickles, and Ayurvedic medicines."
  },
  {
    title: "Indian spices: More than just flavor.",
    description: "Cumin (jeera), coriander (dhaniya), and fenugreek (methi) are staples in Indian kitchens and are great for digestion, blood sugar regulation, and detoxification."
  },
  {
    title: "Seasonal guavas: A winter immunity booster.",
    description: "Guavas are rich in vitamin C, fiber, and potassium. Consuming this fruit in winter improves immunity and aids digestion."
  }
];

// Add this near the top of the file, after other imports
const saveToRecents = (productName, analysisData) => {
  const timestamp = Date.now()
  const key = `analysis_${timestamp}`
  const data = {
    timestamp,
    productName,
    data: analysisData
  }
  localStorage.setItem(key, JSON.stringify(data))
}

function ProductAnalyzer({
  result,
  setResult,
  loading,
  setLoading,
  error,
  setError,
  onIngredientClick
}) {
  const [url, setUrl] = useState('')
  const [uploadType, setUploadType] = useState('url')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [activeTab, setActiveTab] = useState('extracted')
  const [expandedSections, setExpandedSections] = useState({
    nutritional: false,
    keyNutrients: false,
    health: false,
    diet: false,
    detailed: false,
    safety: false,
    overallRating: false,
    calories: false,
    macronutrients: false,
  });

  // Add this to handle saved analysis data
  const location = useLocation()

  useEffect(() => {
    if (location.state?.savedAnalysis?.data) {
      const savedData = location.state.savedAnalysis.data;
      // Ensure we're setting the complete data structure
      setResult({
        extracted_data: savedData.extracted_data,
        analysis: savedData.analysis,
        product_name: savedData.product_name
      });
    }
  }, [location.state, setResult]);

  // 1. Define LoadingAnimation component first
  const LoadingAnimation = () => {
    const [currentFactIndex, setCurrentFactIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentFactIndex((prevIndex) => (prevIndex + 1) % FOOD_FACTS.length);
      }, 10000);

      return () => clearInterval(interval);
    }, []);

    return (
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
        zIndex: 1000,
        padding: 3
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
          sx={{ textAlign: 'center', mt: 1, mb: 4 }}
        >
          This may take a few moments
        </Typography>

        {/* Food Facts Card */}
        <Card sx={{
          maxWidth: 600,
          width: '100%',
          bgcolor: 'primary.50',
          border: '1px solid',
          borderColor: 'primary.100',
          transition: 'all 0.5s ease-in-out',
          animation: 'fadeInOut 10s infinite'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                mb: 1,
                fontWeight: 600
              }}
            >
              {FOOD_FACTS[currentFactIndex].title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                lineHeight: 1.6
              }}
            >
              {FOOD_FACTS[currentFactIndex].description}
            </Typography>
          </CardContent>
        </Card>

        {/* Add keyframes for fade animation */}
        <style>
          {`
            @keyframes fadeInOut {
              0% { opacity: 0; transform: translateY(20px); }
              10% { opacity: 1; transform: translateY(0); }
              90% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-20px); }
            }
          `}
        </style>
      </Box>
    );
  }

  // 2. Define SafetyClassification component
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

  // 3. Define IngredientChip component
  const IngredientChip = ({ ingredient }) => {
    // Split ingredient string by commas and clean up whitespace
    const ingredients = ingredient.split(',').map(i => i.trim());

    return ingredients.map((singleIngredient, index) => (
      <Chip
        key={`${singleIngredient}-${index}`}
        label={singleIngredient}
        onClick={() => onIngredientClick({ name: singleIngredient })}
        sx={{
          maxWidth: '100%',
          height: 'auto',
          cursor: 'pointer',
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
    ))
  }

  // 4. Define handler functions
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
    }
  }

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const analyzeProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let response;
      const API_URL = "http://127.0.0.1:5000"

      if (uploadType === 'url') {
        response = await fetch(`${API_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://foodxray.netlify.app',
            'Accept': 'application/json',
          },
          credentials: 'omit',
          body: JSON.stringify({ url }),
        });
      } else {
        const fileInput = document.getElementById('image-upload');
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        response = await fetch(`${API_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Origin': 'https://foodxray.netlify.app',
            'Accept': 'application/json',
          },
          credentials: 'omit',
          body: formData,
        });
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      // Save to localStorage with product name
      const productName = data.data.product_name || `Analysis ${new Date().toLocaleString()}`
      saveToRecents(productName, data.data)

      setResult(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 5. Define tabs array after all component definitions
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
              {/* Add Product Name Section */}
              {result.product_name && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      mb: 1.5,
                      color: 'primary.main',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      fontWeight: 600
                    }}
                  >
                    {result.product_name}
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                </Box>
              )}

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
                      <IngredientChip key={index} ingredient={ingredient} />
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
                        <Popover>
                          <PopoverTrigger asChild>
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
                                cursor: 'pointer',
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
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">Daily Value</h4>
                                <p className="text-sm text-muted-foreground">
                                  {findNutrientDailyValue(key)
                                    ? `Recommended daily value: ${findNutrientDailyValue(key)}`
                                    : "No daily value recommendation available"}
                                </p>
                              </div>
                              {findNutrientDailyValue(key) && (
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <span className="text-sm">Current</span>
                                    <span className="text-sm font-semibold col-span-2">{value}</span>
                                  </div>
                                  <div className="grid grid-cols-3 items-center gap-4">
                                    <span className="text-sm">Daily Value</span>
                                    <span className="text-sm font-semibold col-span-2">{findNutrientDailyValue(key)}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
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
              {/* Analysis Sections */}
              <Grid container spacing={2}>
                {/* Nutritional Summary Button */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    onClick={() => handleSectionToggle('nutritional')}
                    sx={{
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: expandedSections.nutritional ? 'primary.main' : 'white',
                      color: expandedSections.nutritional ? 'white' : 'primary.main',
                      border: '1px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: expandedSections.nutritional ? 'primary.dark' : 'primary.50',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assessment />
                      Nutritional Summary
                    </Box>
                    {expandedSections.nutritional ? <ExpandLess /> : <ExpandMore />}
                  </Button>
                  <Collapse in={expandedSections.nutritional} timeout="auto">
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      {result.analysis.nutritional_summary && (
                        <Box sx={{ mb: 3 }}>
                          <Grid container spacing={2}>
                            {/* Overall Rating Section */}
                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                onClick={() => handleSectionToggle('overallRating')}
                                sx={{
                                  justifyContent: 'space-between',
                                  p: 1.5,
                                  bgcolor: expandedSections.overallRating ? 'primary.light' : 'white',
                                  color: 'primary.main',
                                  border: '1px solid',
                                  borderColor: 'primary.light',
                                  '&:hover': {
                                    bgcolor: expandedSections.overallRating ? 'primary.light' : 'primary.50',
                                  },
                                }}
                              >
                                <Typography variant="subtitle2">Overall Rating</Typography>
                                {expandedSections.overallRating ? <ExpandLess /> : <ExpandMore />}
                              </Button>
                              <Collapse in={expandedSections.overallRating} timeout="auto">
                                <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.light', borderTop: 0, borderRadius: '0 0 8px 8px' }}>
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
                                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                      {result.analysis.nutritional_summary.overall_rating}/5
                                    </Typography>
                                  </Box>
                                </Box>
                              </Collapse>
                            </Grid>

                            {/* Calories Assessment Section */}
                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                onClick={() => handleSectionToggle('calories')}
                                sx={{
                                  justifyContent: 'space-between',
                                  p: 1.5,
                                  bgcolor: expandedSections.calories ? 'primary.light' : 'white',
                                  color: 'primary.main',
                                  border: '1px solid',
                                  borderColor: 'primary.light',
                                  '&:hover': {
                                    bgcolor: expandedSections.calories ? 'primary.light' : 'primary.50',
                                  },
                                }}
                              >
                                <Typography variant="subtitle2">Calories Assessment</Typography>
                                {expandedSections.calories ? <ExpandLess /> : <ExpandMore />}
                              </Button>
                              <Collapse in={expandedSections.calories} timeout="auto">
                                <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.light', borderTop: 0, borderRadius: '0 0 8px 8px' }}>
                                  <Typography variant="body1">
                                    {result.analysis.nutritional_summary.calories_assessment}
                                  </Typography>
                                </Box>
                              </Collapse>
                            </Grid>

                            {/* Macronutrient Balance Section */}
                            <Grid item xs={12}>
                              <Button
                                fullWidth
                                onClick={() => handleSectionToggle('macronutrients')}
                                sx={{
                                  justifyContent: 'space-between',
                                  p: 2,
                                  bgcolor: expandedSections.macronutrients ? 'primary.main' : 'white',
                                  color: expandedSections.macronutrients ? 'white' : 'primary.main',
                                  border: '1px solid',
                                  borderColor: 'primary.main',
                                  '&:hover': {
                                    bgcolor: expandedSections.macronutrients ? 'primary.dark' : 'primary.50',
                                  },
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Person />
                                  Macronutrient Balance
                                </Box>
                                {expandedSections.macronutrients ? <ExpandLess /> : <ExpandMore />}
                              </Button>
                              <Collapse in={expandedSections.macronutrients} timeout="auto">
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Typography variant="body2" sx={{ mb: 2 }}>
                                    {result.analysis.nutritional_summary.macronutrient_balance}
                                  </Typography>
                                </Box>
                              </Collapse>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Grid>

                {/* Key Nutrients Button */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    onClick={() => handleSectionToggle('keyNutrients')}
                    sx={{
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: expandedSections.keyNutrients ? 'primary.main' : 'white',
                      color: expandedSections.keyNutrients ? 'white' : 'primary.main',
                      border: '1px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: expandedSections.keyNutrients ? 'primary.dark' : 'primary.50',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Insights />
                      Key Nutrients & Ingredients
                    </Box>
                    {expandedSections.keyNutrients ? <ExpandLess /> : <ExpandMore />}
                  </Button>
                  <Collapse in={expandedSections.keyNutrients} timeout="auto">
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
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
                    </Box>
                  </Collapse>
                </Grid>

                {/* Health Considerations Button */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    onClick={() => handleSectionToggle('health')}
                    sx={{
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: expandedSections.health ? 'primary.main' : 'white',
                      color: expandedSections.health ? 'white' : 'primary.main',
                      border: '1px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: expandedSections.health ? 'primary.dark' : 'primary.50',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HealthAndSafety />
                      Health Considerations
                    </Box>
                    {expandedSections.health ? <ExpandLess /> : <ExpandMore />}
                  </Button>
                  <Collapse in={expandedSections.health} timeout="auto">
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      {/* Health Considerations */}
                      {result.analysis.health_considerations && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            <HealthAndSafety /> Health Considerations
                          </Typography>
                          <Grid container spacing={2}>
                            {/* Risk Level Card */}
                            <Grid item xs={12} sm={6} md={3}>
                              <Box sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'primary.light',
                                borderRadius: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'white'
                              }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Risk Level
                                </Typography>
                                <Chip
                                  label={result.analysis.health_considerations.overconsumption_risk}
                                  color={
                                    result.analysis.health_considerations.overconsumption_risk === 'Low' ? 'success' :
                                    result.analysis.health_considerations.overconsumption_risk === 'Medium' ? 'warning' : 'error'
                                  }
                                  sx={{
                                    width: '100%',
                                    height: '36px',
                                    '& .MuiChip-label': {
                                      fontSize: '1rem',
                                      fontWeight: 600
                                    }
                                  }}
                                />
                              </Box>
                            </Grid>

                            {/* Recommended Frequency Card */}
                            <Grid item xs={12} sm={6} md={3}>
                              <Box sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'primary.light',
                                borderRadius: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'white'
                              }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Recommended Frequency
                                </Typography>
                                <Chip
                                  label={result.analysis.recommendations.consumption_frequency}
                                  color="primary"
                                  sx={{
                                    width: '100%',
                                    height: '36px',
                                    '& .MuiChip-label': {
                                      fontSize: '0.9rem',
                                      fontWeight: 500,
                                      whiteSpace: 'normal',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden'
                                    }
                                  }}
                                />
                              </Box>
                            </Grid>

                            {/* Portion Guidance Card */}
                            <Grid item xs={12} sm={12} md={6}>
                              <Box sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'primary.light',
                                borderRadius: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                bgcolor: 'white'
                              }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Portion Guidance
                                </Typography>
                                <Box sx={{
                                  flex: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  bgcolor: 'primary.50',
                                  borderRadius: 1,
                                  p: 2
                                }}>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      color: 'primary.main',
                                      fontWeight: 500,
                                      lineHeight: 1.5
                                    }}
                                  >
                                    {result.analysis.recommendations.portion_guidance}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Grid>

                {/* Diet Compatibility Button */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    onClick={() => handleSectionToggle('diet')}
                    sx={{
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: expandedSections.diet ? 'primary.main' : 'white',
                      color: expandedSections.diet ? 'white' : 'primary.main',
                      border: '1px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: expandedSections.diet ? 'primary.dark' : 'primary.50',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person />
                      Diet Compatibility
                    </Box>
                    {expandedSections.diet ? <ExpandLess /> : <ExpandMore />}
                  </Button>
                  <Collapse in={expandedSections.diet} timeout="auto">
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
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
                    </Box>
                  </Collapse>
                </Grid>

                {/* Detailed Analysis Button */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    onClick={() => handleSectionToggle('detailed')}
                    sx={{
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: expandedSections.detailed ? 'primary.main' : 'white',
                      color: expandedSections.detailed ? 'white' : 'primary.main',
                      border: '1px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: expandedSections.detailed ? 'primary.dark' : 'primary.50',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Analytics />
                      Detailed Analysis
                    </Box>
                    {expandedSections.detailed ? <ExpandLess /> : <ExpandMore />}
                  </Button>
                  <Collapse in={expandedSections.detailed} timeout="auto">
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
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
                    </Box>
                  </Collapse>
                </Grid>
              </Grid>
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
            py: { xs: 4, sm: 5 },
            width: '100%',
            maxWidth: { sm: '600px', md: '900px', lg: '1200px' },
            mx: 'auto',
            overflow: 'hidden',
            mt: '64px'
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
              <Box sx={{
                width: '100%',
                mb: 4,
                '& .tab-content': {
                  width: '100%',
                  maxWidth: '100%',
                  mx: 'auto',
                  pb: 4
                }
              }}>
                <Tabs
                  defaultValue="extracted"
                  className="w-full"
                  style={{
                    maxWidth: '100%',
                    overflow: 'hidden'
                  }}
                >
                  <TabsList
                    className="grid w-full grid-cols-2"
                    style={{
                      padding: '4px',
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 108, 81, 0.08)',
                      minHeight: '48px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                      marginBottom: '16px'
                    }}
                  >
                    <TabsTrigger
                      value="extracted"
                      style={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        border: 'none',
                        flex: 1,
                        minWidth: '120px',
                        backgroundColor: activeTab === 'extracted' ? '#006C51' : 'transparent',
                        color: activeTab === 'extracted' ? '#ffffff' : '#006C51',
                        boxShadow: activeTab === 'extracted' ? '0 2px 4px rgba(0, 108, 81, 0.1)' : 'none',
                        cursor: 'pointer',
                        opacity: activeTab === 'extracted' ? 1 : 0.7
                      }}
                      onClick={() => setActiveTab('extracted')}
                    >
                      Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis"
                      style={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        border: 'none',
                        flex: 1,
                        minWidth: '120px',
                        backgroundColor: activeTab === 'analysis' ? '#006C51' : 'transparent',
                        color: activeTab === 'analysis' ? '#ffffff' : '#006C51',
                        boxShadow: activeTab === 'analysis' ? '0 2px 4px rgba(0, 108, 81, 0.1)' : 'none',
                        cursor: 'pointer',
                        opacity: activeTab === 'analysis' ? 1 : 0.7
                      }}
                      onClick={() => setActiveTab('analysis')}
                    >
                      Analysis
                    </TabsTrigger>
                  </TabsList>

                  {tabs.map((tab) => (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      className="tab-content"
                      style={{
                        margin: 0,
                        padding: 0
                      }}
                    >
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