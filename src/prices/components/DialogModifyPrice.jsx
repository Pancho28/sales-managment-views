import { useContext } from "react";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Button, Grid, Dialog, Box, DialogContent, DialogTitle} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField, RHFSelect } from '../../commons/hook-form';
import { DolarContext } from "../../commons/components/Dashboard";
import { enqueueSnackbar } from 'notistack';
import { updateProduct, activateProduct, desactivateProduct } from "../services/prices";
import moment from "moment-timezone";

export default function DialogModifyPrice({open, setOpen, category, product, setDetailsNull, modifyProduct, categories, activate, desactivate}) {

  const dolarContext = useContext(DolarContext);

  const handleClose = () => {
    setOpen(!open);
    setDetailsNull()
  };

  const activeProduct = (prodcutId) => {
    const token = dolarContext.dataContext.token;
    const localId = dolarContext.dataContext.localId;
    activateProduct(token,localId,prodcutId);
    activate(prodcutId);
    enqueueSnackbar('Producto activado',{ variant: 'success' });
    handleClose();
  }

  const desactiveProduct = (prodcutId) => {
    const token = dolarContext.dataContext.token;
    const localId = dolarContext.dataContext.localId;
    desactivateProduct(token,localId,prodcutId);
    desactivate(prodcutId);
    enqueueSnackbar('Producto desactivado',{ variant: 'success' });
    handleClose();
  }

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('El tipo de pago es requerido'),
    price: Yup.number().required('La cantidad es requerida'),
    category: Yup.string().required('La categoría es requerida'),
  });

  const defaultValues = {
    name: product.name,
    price: product.price,
    category: category.id
  };
  
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const modificationProduct = async (values) => {
    const token = dolarContext.dataContext.token;
    const localId = dolarContext.dataContext.localId;
    const tz = JSON.parse(sessionStorage.getItem('data')).tz;
    const newProduct = {
      productId: product.id,
      name: values.name === product.name ? null : values.name,
      price: parseFloat(values.price) === parseFloat(product.price) ? null : values.price,
      updateDate: moment().tz(tz).format(),
      categoryId: values.category === category.id ? null : values.category,
    }
    try {
      const response = await updateProduct(token, newProduct, localId);
      if (response.statusCode === 201) {
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
      enqueueSnackbar('Error al modificar el producto',{ variant: 'error' });
    }
  }

  const onSubmit = async (values) => {
    if (values.name === product.name && parseFloat(values.price) === parseFloat(product.price) 
                                    && values.category === category.id){ 
      enqueueSnackbar('No se ha modificado el producto',{ variant: 'warning' });
      return;
    }
    const newPrice = parseFloat(values.price).toFixed(2);
    if (newPrice <= 0){
      enqueueSnackbar('No se puede colocar precios menores a 0$',{ variant: 'warning' });
      return;
    }
    await modificationProduct(values);
    modifyProduct(values,product,newPrice,category);
    handleClose();
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
            <Box sx={{ m: 2 }}>
              <Box>
                {
                  product.status === 'ACTIVE' ?
                  <Button color="secondary" onClick={() => desactiveProduct(product.id)} >Desactivar producto</Button>
                  :
                  <Button color="secondary" onClick={() =>  activeProduct(product.id)} >Activar producto</Button>
                }
              </Box>
              <Box justifyContent="end" textAlign="end">
                <Button onClick={handleClose}>Cancelar</Button>
                <LoadingButton sx={{ml: 1}} size="large" type="submit" variant="contained" loading={isSubmitting}>
                  Actualizar
                </LoadingButton>
              </Box>
            </Box>
          </FormProvider>
        </DialogContent>
      </Dialog>
  );
}