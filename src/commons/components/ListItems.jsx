import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, List, Tooltip } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import BarChartIcon from '@mui/icons-material/BarChart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
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
      <Tooltip title="Ventas">
        <ListItemButton component={RouterLink} to="/menu">
          <ListItemIcon>
            <PointOfSaleIcon />
          </ListItemIcon>
          <ListItemText primary="Ventas" />
        </ListItemButton>
      </Tooltip>
      <Tooltip title="Precios">
        <ListItemButton component={RouterLink} to="/menu/precios">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Precios" />
        </ListItemButton>
      </Tooltip>
      { accessList && accessList.includes(AccessNames.OPEN_ORDERS) &&
      <Tooltip title="Por entregar">
        <ListItemButton component={RouterLink} to="/menu/orders">
          <ListItemIcon>
            <PendingActionsIcon />
          </ListItemIcon>
          <ListItemText primary="Por entregar" />
        </ListItemButton>
      </Tooltip>
      }
      { accessList && accessList.includes(AccessNames.TOTALS) &&
      <Tooltip title="Totales">
        <ListItemButton component={RouterLink} to="/menu/totales">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Totales" />
        </ListItemButton>
      </Tooltip>
      }
      { accessList && accessList.includes(AccessNames.CLOSING) &&
      <Tooltip title="Cierre">
        <ListItemButton component={RouterLink} to="/menu/cierre">
          <ListItemIcon>
            <CurrencyExchangeIcon />
          </ListItemIcon>
          <ListItemText primary="Cierre" />
        </ListItemButton>
      </Tooltip>
      } 
      {
        accessList && accessList.includes(AccessNames.UNPAID) &&
        <Tooltip title="Por cobrar">
          <ListItemButton component={RouterLink} to="/menu/unpaid">
            <ListItemIcon>
              <CreditScoreIcon />
            </ListItemIcon>
            <ListItemText primary="Por cobrar" />
          </ListItemButton>
        </Tooltip>

      }
    </List>
  );
}