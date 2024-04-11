import { useNavigate } from 'react-router-dom';
import { 
  Avatar, 
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Paper
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from "../../commons/components/Footer";
import { enqueueSnackbar } from 'notistack';

const defaultTheme = createTheme();

export default function SignIn() {

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    });
    enqueueSnackbar('Ingresando...',{ variant: 'success' });
    navigate('/menu', { replace: true });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={1}>
          <Box
            mx={2}
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Ingrese a Sales Management
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                label="Usuario"
                name="username"
                variant="outlined"
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                variant="outlined"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Ingresar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer text=''/>
    </ThemeProvider>
  );
}