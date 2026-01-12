import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Button, Grid, Dialog, Box, DialogContent, DialogTitle} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField } from '../../commons/hook-form/index.js';
import { useUserResetPassword } from "../hooks";

export default function DialogResetPassword({open, setOpen, user}) {

  const { mutation: userResetPasswordMutation } = useUserResetPassword();

  const handleClose = () => {
    setOpen(!open);
  };

  const RegisterSchema = Yup.object().shape({
    password: Yup.string().required('La contraseña es requerida')
  });

  const defaultValues = {
    password: ''
  };
  
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (values) => {
    const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
    const newPasswordRequest = {...values, user, token};
    userResetPasswordMutation.mutate(newPasswordRequest);
    handleClose();
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Reestablecer clave para el usuario {user.username}</DialogTitle>
        <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ m: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="password"
                      label="Contraseña"
                    />
                  </Grid>
                </Grid>
            </Box>
            <Box sx={{ m: 2 }} justifyContent="end" textAlign="end">
              <Button onClick={handleClose}>Cancelar</Button>
              <LoadingButton sx={{ml: 1}} size="large" type="submit" variant="contained" loading={isSubmitting}>
                Actualizar
              </LoadingButton>
            </Box>
          </FormProvider>
        </DialogContent>
      </Dialog>
  );
}