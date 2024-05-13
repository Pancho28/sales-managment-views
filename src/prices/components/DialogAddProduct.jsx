import { useContext } from "react";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Button, Grid, Dialog, Box, DialogContent, DialogTitle} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField, RHFSelect } from '../../commons/hook-form';
import { DolarContext } from "../../commons/components/Dashboard";
import { enqueueSnackbar } from 'notistack';
import { createProduct } from "../services/prices";

export default function DialogAddProduct({open, setOpen, addProduct, categories}) {

  const dolarContext = useContext(DolarContext);

  const handleClose = () => {
    setOpen(!open);
  };

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('El tipo de pago es requerido'),
    price: Yup.number().required('La cantidad es requerida'),
    category: Yup.string().required('La categoría es requerida'),
  });

  const defaultValues = {
    name: '',
    price: 0,
    category: ''
  };
  
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    if (values.price <= 0){
      enqueueSnackbar('No se puede colocar precios menores a 0$',{ variant: 'warning' });
      return;
    }  
    try {
      const localId = dolarContext.dataContext.localId;
      let newProduct = {
        name: values.name,
        price: parseFloat(values.price),
        categoryId: values.category,
        localId
      } 
      const token = dolarContext.dataContext.token;
      const response = await createProduct(token, newProduct);
      if (response.statusCode === 201) {
        const category = categories.find(category => category.id === values.category);
        newProduct = {...newProduct, creationDate: new Date(), updateDate: null, id: response.productId , category: category};
        delete newProduct.categoryId;
        addProduct(newProduct);
        handleClose();
        enqueueSnackbar(response.message,{ variant: 'success' });
      }else if (response.statusCode === 401){
        sessionStorage.clear();
        enqueueSnackbar(response.message,{ variant: 'warning' });
        return
      }else {
        enqueueSnackbar(response.message, { variant: 'error' });
        return
      }
    }catch(error){
      enqueueSnackbar('Error al crear el producto',{ variant: 'error' });
    }
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Datos del producto</DialogTitle>
        <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ m: 2 }}>
                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <RHFTextField
                      required
                      name="name"
                      label="Nombre"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      required
                      name="price"
                      label="Precio"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                  <RHFSelect
                    required
                    name="category"
                    label="Categoria"
                    values={categories}
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