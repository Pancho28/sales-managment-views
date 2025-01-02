import { useState } from 'react';
import {Button, TextField , Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, IconButton } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import Iconify from "../../commons/components/Iconify";

export default function DialogPassword({open, setOpen, password,verifyAccess}) {

  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleAccess = async (pass) => {
    if (pass === password){
      enqueueSnackbar('Clave correcta',{ variant: 'success' });
      setOpen(!open);
      verifyAccess(true);
    }
    else {
      enqueueSnackbar('Clave incorrecta',{ variant: 'error' });
      setOpen(!open);
      verifyAccess(false);
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
            const pass = formJson.password;
            handleAccess(pass);
          },
        }}
      >
        <DialogTitle>Tasa de cambio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="password"
            name="password"
            label="Clave de acceso"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Acceder</Button>
        </DialogActions>
      </Dialog>
  );
}