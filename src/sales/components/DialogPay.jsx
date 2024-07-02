import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Button, Dialog, DialogContent, Grid, DialogTitle, Box, Tooltip, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField, RHFSelect, RHFCheckbox } from '../../commons/hook-form';
import { enqueueSnackbar } from 'notistack';

export default function DialogPay({open, setOpen, paymentTypes, completeOrder, total, accessToOrders}) {

  const [payments, setPayments] = useState(1);

  const RegisterSchema = Yup.object().shape({
    paymenType: Yup.string().required('El tipo de pago es requerido'),
    amount: Yup.number().required('La cantidad es requerida'),
    delivered: Yup.boolean().optional(),
    paymenType2: Yup.string().optional(),
    amount2: Yup.number().optional(),
  });

  const defaultValues = {
    paymenType: '',
    amount: 0,
    delivered: false,
    paymenType2: '',
    amount2: 0
  };
  
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const addPayment = () => {
    setPayments(payments + 1);
  }

  const removePayment = () => {
    setPayments(payments - 1);
  }

  const handleClose = () => {
    setOpen(!open);
  };

  const onSubmit = async (values) => {
    let payment;
    if (payments === 1){
      payment = [{paymentTypeId: values.paymenType, amount: total}]
    }else {
      if (values.amount <= 0 || values.amount2 <= 0){
        enqueueSnackbar('La cantidad debe ser mayor a 0',{ variant: 'warning' });
        return;
      }
      if (values.amount + values.amount2 !== total){
        enqueueSnackbar('La suma de los pagos no es igual al total',{ variant: 'warning' });
        return;
      }
      if (values.paymenType === values.paymenType2){
        enqueueSnackbar('Los tipos de pago no pueden ser iguales',{ variant: 'warning' });
        return;
      }
      payment = [{paymentTypeId: values.paymenType, amount: values.amount},
                 {paymentTypeId: values.paymenType2, amount: values.amount2}]
    }
    completeOrder(payment,values.delivered)
    handleClose();
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>
          Forma de pago <br/>
          Total {total}$
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            { payments === 1 ?
            <Tooltip title="Agregar pago">
              <IconButton color="primary" size="large" onClick={addPayment}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
            :
            <Tooltip title="Eliminar pago">
              <IconButton color="secondary" size="large" onClick={removePayment}>
                <RemoveCircleIcon />
              </IconButton>
            </Tooltip>
            }
          </Box>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ m: 2 }}>
                <Grid container spacing={2}>

                  <Grid item xs={ payments > 1 ? 7 : 12}>
                    <RHFSelect
                      required
                      name="paymenType"
                      label="Tipo de pago"
                      values={paymentTypes}
                    />
                  </Grid>

                  { payments > 1 &&
                  <>
                    <Grid item xs={5}>
                      <RHFTextField
                        required
                        name="amount"
                        label="Cantidad"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={7}>
                    <RHFSelect
                      required
                      name="paymenType2"
                      label="Tipo de pago"
                      values={paymentTypes}
                    />
                    </Grid>
                    <Grid item xs={5}>
                      <RHFTextField
                        required
                        name="amount2"
                        label="Cantidad"
                        type="number"
                      />
                    </Grid>
                  </>
                  }

                  { accessToOrders &&
                  <Grid item xs={12}>
                    <RHFCheckbox name="delivered" label="Orden entregada"/>
                  </Grid>
                  }

                </Grid>
            </Box>
            <Box sx={{ m: 2 }} justifyContent="end" textAlign="end">
              <Button onClick={handleClose}>Cancelar</Button>
              <LoadingButton sx={{ml: 1}} size="large" type="submit" variant="contained" loading={isSubmitting}>
                Ingresar
              </LoadingButton>
            </Box>
          </FormProvider>
        </DialogContent>
      </Dialog>
  );
}