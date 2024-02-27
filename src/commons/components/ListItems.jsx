import { Link as RouterLink } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import BarChartIcon from '@mui/icons-material/BarChart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

export const mainListItems = (

  <>
    <ListItemButton component={RouterLink} to="/menu">
      <ListItemIcon>
        <PointOfSaleIcon />
      </ListItemIcon>
      <ListItemText primary="Ventas" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/menu/precios">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Precios" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/menu/totales">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Totales" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/menu/cierre">
      <ListItemIcon>
        <CurrencyExchangeIcon />
      </ListItemIcon>
      <ListItemText primary="Cierre" />
    </ListItemButton>
  </>
  )