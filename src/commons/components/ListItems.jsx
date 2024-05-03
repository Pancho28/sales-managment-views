import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, List } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import BarChartIcon from '@mui/icons-material/BarChart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { AccessNames } from "../helpers/enum.ts";

export default function ListItems() {

  const navigate = useNavigate();

  const [accessList, setAccessList] = useState([]);

  useEffect(() => {
    const access = JSON.parse(sessionStorage.getItem('data')) ? JSON.parse(sessionStorage.getItem('data')).access : null;
    if (access){
      const accessNames = access.map( acces => acces.name );
      setAccessList(accessNames)
    }else {
      navigate('/', { replace: true });
      enqueueSnackbar('Vuelva a iniciar sesión',{ variant: 'warning' });
    }
  }, [navigate]);

return(
    <List component="nav">
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
      { accessList && accessList.includes(AccessNames.TOTALS) &&
      <ListItemButton component={RouterLink} to="/menu/totales">
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Totales" />
      </ListItemButton>
      }
      { accessList && accessList.includes(AccessNames.CLOSING) &&
      <ListItemButton component={RouterLink} to="/menu/cierre">
        <ListItemIcon>
          <CurrencyExchangeIcon />
        </ListItemIcon>
        <ListItemText primary="Cierre" />
      </ListItemButton>
      } 
    </List>
  );
}