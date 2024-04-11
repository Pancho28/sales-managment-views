import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function DialogAddProduct({open, setOpen, products, setProductos}) {

  const handleClose = () => {
    setOpen(!open);
  };

  const handleAdd = (newProduct) => {
    // Colocar validacion de precio negativo
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; 
    // Los meses comienzan en 0, por lo que se suma 1
    const año = fechaActual.getFullYear();
    // Concatenar la fecha en el formato deseado
    const fechaFormateada = `${dia}/${mes}/${año}`;
    newProduct = {...newProduct, fechaCreacion: fechaFormateada, fechaEdicion: fechaFormateada};
    setProductos([...products, newProduct]);
    handleClose();
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
            handleAdd({nombre,precio});
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Agregar</Button>
        </DialogActions>
      </Dialog>
  );
}