import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Button, Grid, Dialog, Box, DialogContent, DialogTitle} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField, RHFSelect } from '../../commons/hook-form';
import { useUserMutation } from "../hooks";
import moment from "moment-timezone";

export default function DialogAddUser({open, setOpen}) {

  const { mutation: userMutation } = useUserMutation();

  const handleClose = () => {
    setOpen(!open);
  };

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('El nombre del usuario es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
    local: Yup.string().required('El nombre del local es requerido'),
    dolar: Yup.number().required('El valor del dolar es requerido'),
    tz: Yup.string().required('La zona horaria es requerida')
  });

  const defaultValues = {
    name: '',
    password: '',
    local: '',
    dolar: 0,
    tz: ''
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
    const tz = JSON.parse(sessionStorage.getItem('data')).tz;
    const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
    userMutation.mutate({
        username: values.name,
        password: values.password,
        name: values.local,
        dolar: parseFloat(values.dolar),
        tz: values.tz,
        creationDate: moment().tz(tz).format(),
        token,
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
                      required
                      name="name"
                      label="Nombre del usuario"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      required
                      name="password"
                      label="Contraseña"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      required
                      name="local"
                      label="Nombre del local"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      required
                      name="dolar"
                      label="Precio del dolar"
                      type="number"
                    />
                  </Grid>
                    <Grid item xs={12}>
                    <RHFSelect
                      required
                      name="tz"
                      label="Zona horaria"
                      values={[{id: 'America/Caracas', name: 'America/Caracas'},{id: 'America/Santiago', name: 'America/Santiago'},
                                {id: 'America/New_York', name: 'America/New_York'},{id: 'America/Los_Angeles', name: 'America/Los_Angeles'}]}
                    />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ m: 2 }} justifyContent="end" textAlign="end">
              <Button onClick={handleClose}>Cancelar</Button>
              <LoadingButton sx={{ml: 1}} size="large" type="submit" variant="contained" loading={isSubmitting}>
                Crear
              </LoadingButton>
            </Box>
          </FormProvider>
        </DialogContent>
      </Dialog>
  );
}