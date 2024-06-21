import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Avatar, 
  IconButton,
  CssBaseline,
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  InputAdornment
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import Iconify from "../../commons/components/Iconify";
import Footer from "../../commons/components/Footer";
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from '../../commons/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from "../services/authorization";

const defaultTheme = createTheme();

export default function SignIn() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('El usuario es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
  });

  const defaultValues = {
    username: '',
    password: ''
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    try {
      const data = {
        username: values.username,
        password: values.password
      }
      const response = await login(data);
      if ( response.statusCode !== 200 ) {
        enqueueSnackbar(response.message, { variant: 'error' });
        return
      }
      sessionStorage.setItem('data', JSON.stringify(response.data));
      enqueueSnackbar('Ingresando...',{ variant: 'success' });
      navigate('/menu', { replace: true });
    } catch (error) {
      enqueueSnackbar('Usuario o contraseña incorrectos',{ variant: 'error' });
    }
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
            <Typography component="h1" variant="h5" sx={{ m: 2 }}>
              Ingrese a Sales Management
            </Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <RHFTextField name="username" label="Nombre de usuario" />
                <RHFTextField
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                  Ingresar
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Box>
        </Paper>
      </Container>
      <Footer text=''/>
    </ThemeProvider>
  );
}