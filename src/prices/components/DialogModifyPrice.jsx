import {Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import { enqueueSnackbar } from 'notistack';

export default function DialogModifyPrice({open, setOpen, product, setDetailsProduct, products, setProducts}) {

  const handleClose = () => {
    setOpen(!open);
    setDetailsProduct({})
  };

  const handleModify = (newProduct) => {
    if (newProduct.name === product.name && newProduct.price === product.price) {
      enqueueSnackbar('No se ha modificado el producto',{ variant: 'warning' });
      return;
    }
    if (newProduct.price <= 0){
      enqueueSnackbar('No se puede colocar precios menores a 0$',{ variant: 'warning' });
      return;
    }
    products.forEach((oldProduct) => {
      if (oldProduct.id === product.id){
        oldProduct.name = newProduct.name;
        oldProduct.price = newProduct.price;
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        oldProduct.updateDate = formattedDate;
      }
    });
    setProducts(products);
    handleClose();
    enqueueSnackbar('Se ha modificado el producto',{ variant: 'success' });
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
            handleModify({name,price});
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
            defaultValue={product.name}
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
            defaultValue={product.price}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Modificar</Button>
        </DialogActions>
      </Dialog>
  );
}