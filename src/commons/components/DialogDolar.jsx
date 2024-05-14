import { useNavigate } from 'react-router-dom';
import {Button, TextField , Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { updateDolar } from "../services/commons";

export default function DialogDolar({open, setOpen, dataContext, setDolar}) {

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(!open);
  };

  const handleAdd = async (dolar) => {
    if (dolar === dataContext.dolar){
        enqueueSnackbar('No se ha modificado el valor del cambio',{ variant: 'warning' });
        return;
    }
    if (dolar <= 0){
        enqueueSnackbar('No se puede colocar el cambio menor a 0$',{ variant: 'warning' });
        return;
    }
    try{
      const newDolar = parseFloat(dolar).toFixed(2);
      const response = await updateDolar(dataContext.localId,newDolar,dataContext.token);
      if (response.statusCode === 201){
        setDolar(newDolar)
        handleClose();
        enqueueSnackbar(response.message,{ variant: 'success' });
      }else if(response.statusCode === 401){
        sessionStorage.clear();
        navigate('/', { replace: true });
        enqueueSnackbar(response.message,{ variant: 'warning' });
        return
      }else {
        enqueueSnackbar(response.message, { variant: 'error' });
        return
      }
    }catch(error){
        enqueueSnackbar('Error al modificar el cambio',{ variant: 'error' });
    }
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
            defaultValue={dataContext.dolar}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Cambiar</Button>
        </DialogActions>
      </Dialog>
  );
}