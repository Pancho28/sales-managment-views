import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Button, Grid, Dialog, Box, DialogContent, DialogTitle} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField, RHFSelect } from '../../commons/hook-form';
import { useUserMutationModify } from "../hooks";
import { timezones } from '../../commons/helpers/timezones.js';
import { enqueueSnackbar } from 'notistack';

export default function DialogModifyUser({open, setOpen, user}) {

  const { mutation: userMutation } = useUserMutationModify();

  const handleClose = () => {
    setOpen(!open);
  };

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('El nombre del usuario es requerido'),
    localName: Yup.string().required('El nombre del local es requerido'),
    dolar: Yup.number().positive('El valor del dolar es requerido'),
    tz: Yup.string().required('La zona horaria es requerida'),
    email: Yup.string().email('El email debe ser válido'),
  });

  const defaultValues = {
    username: user.username,
    localName: user.local[0].name,
    dolar: parseInt(user.local[0].dolar),
    tz: user.tz,
    email: user.email ? user.email : '',
  };
  
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Verifica si se modifico algun campo
  const verifyChanges = (values) => {
    for (const key in values) {
      if (values[key] !== defaultValues[key]) {
        return true;
      }
    }
    return false;
  }

  const onSubmit = (values) => {
    const verify = verifyChanges(values);
    if (!verify) {
      enqueueSnackbar('No se realizaron cambios en el usuario', { variant: 'warning' });
      return;
    }
    userMutation.mutate({ 
        username: values.username,
        localName: values.localName,
        dolar: parseFloat(values.dolar),
        tz: values.tz,
        email: values.email === '' ? null : values.email,
        userId: user.id,
    });
    handleClose();
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Datos del usuario</DialogTitle>
        <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ m: 2 }}>
                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <RHFTextField
                      name="username"
                      label="Nombre del usuario"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="email"
                      label="Email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="localName"
                      label="Nombre del local"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="dolar"
                      label="Precio del dolar"
                      type="number"
                    />
                  </Grid>
                    <Grid item xs={12}>
                    <RHFSelect
                      name="tz"
                      label="Zona horaria"
                      values={timezones}
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