import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, List, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import BarChartIcon from '@mui/icons-material/BarChart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AttributionIcon from '@mui/icons-material/Attribution';
import { AccessNames } from "../helpers/enum.ts";
import DialogPassword from './DialogPassword.jsx';
import useLogout from '../hooks/useLogout';

export default function ListItems() {

  const navigate = useNavigate();

  const { logout } = useLogout();

  const [accessList, setAccessList] = useState(null);

  const [accessVerify, setAccessVerify] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [password, setPassword] = useState('');

  const [url, setUrl] = useState('');

  const verifyAccess = (accesGranted) => {
    if (accesGranted){
      navigate(url);
    }
  }

  const changeView = (url,name) => {
    setUrl(url);
    const access = accessVerify.find( acces => acces.name === name);
    if (access.pass) {
      setPassword(access.pass);
      setOpenDialog(true);
    }else {
      navigate(url);
    }
  }

  useEffect(() => {
    const access = JSON.parse(sessionStorage.getItem('data')) ? JSON.parse(sessionStorage.getItem('data')).access : null;
    if (accessList){
      return;
    }
    if (access){
      const accessNames = access.map( acces => acces.name );
      setAccessList(accessNames);
      setAccessVerify(access);
    }else {
      logout();
    }
  }, [logout,accessList]);

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
        <ListItemButton onClick={() => changeView("/menu/orders", AccessNames.OPEN_ORDERS)} >
          <ListItemIcon>
            <PendingActionsIcon />
          </ListItemIcon>
          <ListItemText primary="Por entregar" />
          { accessVerify.find( acces => acces.name === AccessNames.OPEN_ORDERS).pass &&
            <LockOutlinedIcon fontSize="small"/>
          }
        </ListItemButton>
      </Tooltip>
      }
      { accessList && accessList.includes(AccessNames.TOTALS) &&
      <Tooltip title="Totales">
        <ListItemButton onClick={() => changeView("/menu/totales",AccessNames.TOTALS)}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Totales"/>
          { accessVerify.find( acces => acces.name === AccessNames.TOTALS).pass &&
            <LockOutlinedIcon fontSize="small"/>
          }
        </ListItemButton>
      </Tooltip>
      }
      { accessList && accessList.includes(AccessNames.CLOSING) &&
      <Tooltip title="Cierre">
        <ListItemButton onClick={() => changeView("/menu/cierre",AccessNames.CLOSING)}>
          <ListItemIcon>
            <CurrencyExchangeIcon />
          </ListItemIcon>
          <ListItemText primary="Cierre" />
          { accessVerify.find( acces => acces.name === AccessNames.CLOSING).pass &&
            <LockOutlinedIcon fontSize="small"/>
          }
        </ListItemButton>
      </Tooltip>
      } 
      {
        accessList && accessList.includes(AccessNames.UNPAID) &&
        <Tooltip title="Por cobrar">
          <ListItemButton onClick={() => changeView("/menu/unpaid",AccessNames.UNPAID)}>
            <ListItemIcon>
              <CreditScoreIcon />
            </ListItemIcon>
            <ListItemText primary="Por cobrar" />
          { accessVerify.find( acces => acces.name === AccessNames.UNPAID).pass &&
            <LockOutlinedIcon fontSize="small"/>
          }
          </ListItemButton>
        </Tooltip>

      }
      {
        accessList && accessList.includes(AccessNames.FOR_EMPLOYEE) &&
        <Tooltip title="Empleados">
          <ListItemButton onClick={() => changeView("/menu/foremployee",AccessNames.FOR_EMPLOYEE)}>
            <ListItemIcon>
              <AttributionIcon />
            </ListItemIcon>
            <ListItemText primary="Empleados" />
          { accessVerify.find( acces => acces.name === AccessNames.FOR_EMPLOYEE).pass &&
            <LockOutlinedIcon fontSize="small"/>
          }
          </ListItemButton>
        </Tooltip>
      }
      { openDialog && <DialogPassword open={openDialog} setOpen={setOpenDialog} password={password} 
                          verifyAccess={verifyAccess}/> }
    </List>
  );
}