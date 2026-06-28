import { useMemo } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Button, Grid, Dialog, Box, DialogContent, DialogTitle} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFCheckbox } from '../../commons/hook-form';

export default function DialogAccessUser({open, setOpen, access, userAccess}) {

  //const { mutation: userMutation } = useUserMutationAdd();

  const handleClose = () => {
    setOpen(!open);
  };
  
  // Creamos el schema y los defaultValues dinamicamente con UseMemo para que no se recalculen en cada render
  const { schema, defaultValues } = useMemo(() => {
    const shape = {};
    const defaults = {};

    // Por item dentro de access, creamos un campo boolean en el schema 
    // y buscamos si el usuario tiene ese acceso para colocarlos como default
    access.forEach((item) => {
      shape[item.id] = Yup.boolean();
      defaults[item.id] = userAccess.includes(item.id); 
    });

    return {
      schema: Yup.object().shape(shape),
      defaultValues: defaults
    };
    }, [access,userAccess]);

    // Inicializamos el formulario con los valores calculados
    const methods = useForm({
      resolver: yupResolver(schema),
      defaultValues
    });

    const {
      handleSubmit,
      formState: { isSubmitting },
    } = methods;

    const onSubmit = (values) => {
      //const tz = JSON.parse(sessionStorage.getItem('data')).tz;
      //const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
      console.log(values);
    }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Accessos del usuario</DialogTitle>
        <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ m: 2 }}>
                <Grid container spacing={2}>

                    {access.map((item) => (
                        <Grid item xs={6} key={item.id}>
                          <RHFCheckbox
                            name={item.id}
                            label={item.name}
                          />
                        </Grid>
                    ))}
                  
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