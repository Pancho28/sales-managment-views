import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function DialogModifyPrice({open, setOpen, product, setDetailsProduct, products, setProductos}) {

  const handleClose = () => {
    setOpen(!open);
    setDetailsProduct({})
  };

  const handleModify = (newProduct) => {
    // Colocar validacion de precio negativo
    if (newProduct.nombre === product.nombre && newProduct.precio === product.precio) {
      console.log('No se ha modificado el producto'); //Cambiar por snackbar
    } else {
      products.forEach((oldProduct) => {
        if (oldProduct.id === product.id){
          oldProduct.nombre = newProduct.nombre;
          oldProduct.precio = newProduct.precio;
          const fechaActual = new Date();
          const dia = fechaActual.getDate();
          const mes = fechaActual.getMonth() + 1; 
          const año = fechaActual.getFullYear();
          const fechaFormateada = `${dia}/${mes}/${año}`;
          oldProduct.fechaEdicion = fechaFormateada;
        }
      });
      setProductos(products);
      handleClose();
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
            const nombre = formJson.nombre;
            const precio = Number(formJson.precio);
            handleModify({nombre,precio});
          },
        }}
      >
        <DialogTitle>Datos del producto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nombre"
            name="nombre"
            label="Nombre del producto"
            type="text"
            fullWidth
            defaultValue={product.nombre}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="precio"
            name="precio"
            label="Precio del producto"
            type="number"
            fullWidth
            defaultValue={product.precio}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Modificar</Button>
        </DialogActions>
      </Dialog>
  );
}