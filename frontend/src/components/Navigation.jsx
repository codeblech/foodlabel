import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material'
import { Insights, History } from '@mui/icons-material'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState(0)

  // Update the selected value based on current route
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setValue(0)
        break
      case '/recents':
        setValue(1)
        break
      default:
        setValue(0)
    }
  }, [location])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    switch (newValue) {
      case 0:
        navigate('/')
        break
      case 1:
        navigate('/recents')
        break
      default:
        navigate('/')
    }
  }

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '& .MuiBottomNavigationAction-root': {
          color: 'text.secondary',
          '&.Mui-selected': {
            color: 'primary.main',
          },
        },
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <BottomNavigationAction
        label="Insights"
        icon={<Insights />}
      />
      <BottomNavigationAction
        label="Recents"
        icon={<History />}
      />
    </BottomNavigation>
  )
}

export default Navigation