import {Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { enqueueSnackbar } from 'notistack';

export default function DialogAddProduct({open, setOpen, products, setProducts}) {

  const handleClose = () => {
    setOpen(!open);
  };

  const handleAdd = (newProduct) => {
    if (newProduct.price <= 0){
      enqueueSnackbar('No se puede colocar precios menores a 0$',{ variant: 'warning' });
      return;
    }
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;    
    newProduct = {...newProduct, creationDate: formattedDate, updateDate: formattedDate, id: uuidv4()};
    setProducts([...products, newProduct]);
    handleClose();
    enqueueSnackbar('Se ha creado el producto',{ variant: 'success' });
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
            const name = formJson.name;
            const price = Number(formJson.price);
            handleAdd({name,price});
          },
        }}
      >
        <DialogTitle>Datos del producto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Nombre del producto"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="price"
            name="price"
            label="Precio del producto"
            type="float"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Agregar</Button>
        </DialogActions>
      </Dialog>
  );
}