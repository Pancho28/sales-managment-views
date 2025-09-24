import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Drawer as MuiDrawer, Box, Toolbar ,Typography,
  Divider, IconButton, Container, AppBar as MuiAppBar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItems from './ListItems';
import { enqueueSnackbar } from 'notistack';
import MenuRoutes from "../routes/MenuRoutes";
import DialogDolar from "./DialogDolar";

export const DolarContext = createContext(0);

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [local, setLocal] = useState('');

  const [dataContext, setDataContext] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const setDolar = (dolar) => {
    dataContext.dolar = dolar;
    const data = JSON.parse(sessionStorage.getItem('data'));
    data.local.dolar = dolar;
    sessionStorage.setItem('data', JSON.stringify(data));
  }

  const logout = () => {
    sessionStorage.clear();
    navigate('/', { replace: true });
    enqueueSnackbar('Sesión cerrada',{ variant: 'success' });
  }

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('data')) ? JSON.parse(sessionStorage.getItem('data')) : null;
    if (Object.keys(dataContext).length !== 0){
      return;
    }
    if (data){
      setDataContext({
        dolar: data.local ? data.local.dolar : 0,
        userId: data.id,
        localId: data.local ? data.local.id : null,
        token: data.accessToken
      });
      setLocal(data.local);
    }else {
      sessionStorage.clear();
      navigate('/', { replace: true });
      enqueueSnackbar('Vuelva a iniciar sesión',{ variant: 'warning' });
    }
  }, [navigate,dataContext]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard { local && local.name.toUpperCase()}
            </Typography>
            <IconButton color="inherit" onClick={() => setOpenDialog(!openDialog)}>
              <Tooltip title="Precio dolar">
                <Typography variant="subtitle1">
                  {dataContext && dataContext.dolar}$
                </Typography>
              </Tooltip>
            </IconButton>
            <IconButton color="inherit" onClick={logout}>
              <Tooltip title="Salir">
                <ExitToAppIcon />
              </Tooltip>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
           <ListItems/>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xlg" sx={{ mt: 4, mb: 4 }}>
            <DolarContext.Provider value={{dataContext}}>
              <MenuRoutes/>
            </DolarContext.Provider>
          </Container>
        </Box>
      </Box>
      {
        openDialog && <DialogDolar open={openDialog} setOpen={setOpenDialog} dataContext={dataContext} setDolar={setDolar}/>
      }
    </ThemeProvider>
  );
}