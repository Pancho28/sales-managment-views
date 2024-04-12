import { useState } from 'react';
import {Button, Select , Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, InputLabel, Box } from '@mui/material';

export default function DialogPay({open, setOpen, paymentTypes, createOrder}) {

  const handleClose = () => {
    setOpen(!open);
  };

  const handleAdd = (paymentType) => {
    createOrder(paymentType)
    setPaymentType('');
    handleClose();
  }

  const [paymentType, setPaymentType] = useState('');

  const handleChange = (event) => {
    setPaymentType(event.target.value);
  };

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const paymentType = formJson.paymentType;
            handleAdd(paymentType);
          },
        }}
      >
        <DialogTitle>Forma de pago</DialogTitle>
        <DialogContent>
            <Box sx={{ m:1, minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel>Pago</InputLabel>
                    <Select
                      id="paymentType"
                      name="paymentType"
                      value={paymentType}
                      label="Pago"
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value=""> <em>None</em> </MenuItem>
                    { 
                    paymentTypes && paymentTypes.map((paymentType) => (
                        <MenuItem value={paymentType.id}>{paymentType.name}</MenuItem>

                    ))
                    }
                    </Select>
                </FormControl>
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Agregar</Button>
        </DialogActions>
      </Dialog>
  );
}