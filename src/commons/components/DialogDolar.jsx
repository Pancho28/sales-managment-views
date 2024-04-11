import {Button, TextField , Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

export default function DialogDolar({open, setOpen, dolar, setDolar}) {

  const handleClose = () => {
    setOpen(!open);
  };

  const handleAdd = (newDolar) => {
    if (newDolar === dolar){
        enqueueSnackbar('No se ha modificado el valor del cambio',{ variant: 'warning' });
        return;
    }
    if (newDolar <= 0){
        enqueueSnackbar('No se puede colocar el cambio menor a 0$',{ variant: 'warning' });
        return;
    }
    setDolar(newDolar)
    handleClose();
    enqueueSnackbar('Se ha modificado la tasa de cambio',{ variant: 'success' });
  }

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
            const dolar = formJson.dolar;
            handleAdd(dolar);
          },
        }}
      >
        <DialogTitle>Tasa de cambio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="dolar"
            name="dolar"
            label="Cambio del dolar"
            type="float"
            fullWidth
            defaultValue={dolar}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Cambiar</Button>
        </DialogActions>
      </Dialog>
  );
}