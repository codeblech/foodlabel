import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Grid,
} from '@mui/material'
import { Delete, Analytics } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { FDA_DAILY_VALUES } from '@/components/ProductAnalyzer'

function RecentsPage() {
  const navigate = useNavigate()
  const [recentAnalyses, setRecentAnalyses] = useState([])

  useEffect(() => {
    // Load recent analyses from localStorage
    const loadRecents = () => {
      const items = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('analysis_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key))
            items.push(item)
          } catch (e) {
            console.error('Error parsing stored analysis:', e)
          }
        }
      }
      // Sort by timestamp, most recent first
      items.sort((a, b) => b.timestamp - a.timestamp)
      setRecentAnalyses(items)
    }

    loadRecents()
  }, [])

  const handleDelete = (timestamp) => {
    localStorage.removeItem(`analysis_${timestamp}`)
    setRecentAnalyses(prev => prev.filter(item => item.timestamp !== timestamp))
  }

  const handleCardClick = (analysis) => {
    navigate('/', {
      state: {
        savedAnalysis: {
          data: {
            extracted_data: analysis.data.extracted_data,
            analysis: analysis.data.analysis,
            product_name: analysis.productName
          }
        }
      }
    })
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 8, bgcolor: 'background.default' }}>
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
        <Analytics /> Recent Analyses
      </Typography>

      {recentAnalyses.length === 0 ? (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary'
        }}>
          <Typography variant="h6">No recent analyses</Typography>
          <Typography variant="body2">Analyzed products will appear here</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {recentAnalyses.map((analysis) => (
            <Grid item xs={12} md={6} key={analysis.timestamp}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
                onClick={() => handleCardClick(analysis)}
              >
                <CardContent>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {analysis.productName || 'Unknown Product'}
                    </Typography>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(analysis.timestamp);
                      }}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Analyzed on: {new Date(analysis.timestamp).toLocaleString()}
                  </Typography>

                  {/* Display key analysis points */}
                  {analysis.data?.analysis?.nutritional_summary && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        Overall Rating: {analysis.data.analysis.nutritional_summary.overall_rating}/5
                      </Typography>
                      <Typography variant="body2">
                        {analysis.data.analysis.nutritional_summary.calories_assessment}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default RecentsPage