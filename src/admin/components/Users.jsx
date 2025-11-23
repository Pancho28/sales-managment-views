import { useState } from 'react';
import { useUsers, useUserMutationStatus } from '../hooks';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
        IconButton, Typography, Button, Box, Chip, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { SkeletonTable } from '../../commons/components';
import { DialogAddUser, DialogResetPassword, DialogModifyUser } from '.';
import { Status, Roles } from '../../commons/helpers/enum.ts';
import moment from "moment-timezone";


export default function Users() {

  const { mutation: userStatusMutation } = useUserMutationStatus();

  const [openAdd, setOpenAdd] = useState(false); 

  const [openResetPassword, setOpenResetPassword] = useState(false);

  const [openModify, setOpenModify] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClickMoreOptions = (event, userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMoreOptions = () => {
    setAnchorEl(null);
  };

  const { isError, error, isLoading, data: users } = useUsers();

  if (isLoading) {
      return <SkeletonTable rows={6}/>
  }

  if (isError) {
      return <Typography>Error cargando usuarios: {error.message}</Typography>;
  }

  const openDialogModification = () => {
      setOpenModify(!openModify);
      handleCloseMoreOptions();
  }

  const openDialogResetPassword = () => {
      setOpenResetPassword(!openResetPassword);
      handleCloseMoreOptions();
  }

  const handlerChangeStatus = () => {
    const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
    const { id, status } = selectedUser;
    if (status === Status.ACTIVE) {
        userStatusMutation.mutate({ userId: id, currentStatus: Status.ACTIVE, token });
    } else {
        userStatusMutation.mutate({ userId: id, currentStatus: Status.INACTIVE, token });
    }
    handleCloseMoreOptions();
  }

  const handlerAccess = () => {
    console.log('Gestionar accesos');
    handleCloseMoreOptions();
  };

  const openDialogAdd = () => {
      setOpenAdd(!openAdd);
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" onClick={openDialogAdd}>
          Agregar usuario
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Local</TableCell>
              <TableCell>Dolar</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Último acceso</TableCell>
              <TableCell>Zona horaria</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map((user) => (
              <TableRow
                key={user.id}
              >
                  <TableCell component="th" scope="row">
                    {user.username}
                  </TableCell>
                  <TableCell>
                    {user.email ? user.email : 'Sin email'}
                  </TableCell>
                  <TableCell>
                    {user.role === Roles.SELLER ? 'Vendedor' : 'Rol desconocido'}
                  </TableCell>
                  <TableCell>{user.local[0].name}</TableCell>
                  <TableCell>{parseFloat(user.local[0].dolar).toFixed(2) + '$'}</TableCell>
                  <TableCell> 
                    <Chip label={user.status === Status.ACTIVE ? 'Activo' : user.status === Status.INACTIVE ? 'Inactivo' : 'Estado desconocido'} 
                      color={user.status === Status.ACTIVE ? 'success' : user.status === Status.INACTIVE ? 'warning' : 'default'} 
                    />
                  </TableCell>
                  <TableCell>{moment(user.creationDate).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{user.lastLogin ? moment(user.lastLogin).format('DD/MM/YYYY HH:mm') : 'No ha iniciado sesión'}</TableCell>
                  <TableCell>{user.tz}</TableCell>
                  <TableCell> 
                    <IconButton onClick={(event) => handleClickMoreOptions(event,user.id)}>
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleCloseMoreOptions}
                    >
                      <MenuItem onClick={openDialogModification}>Editar</MenuItem>
                      <MenuItem onClick={handlerChangeStatus}>Cambiar estado</MenuItem>
                      <MenuItem onClick={handlerAccess}>Gestionar accesos</MenuItem>
                      <MenuItem onClick={openDialogResetPassword}>Reestablecer clave</MenuItem>
                    </Menu>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        openAdd && <DialogAddUser open={openAdd} setOpen={setOpenAdd} />
      }
      {
        openResetPassword && <DialogResetPassword open={openResetPassword} setOpen={setOpenResetPassword} user={selectedUser} />
      }
      {
        openModify && <DialogModifyUser open={openModify} setOpen={setOpenModify} user={selectedUser} />
      }
    </>
  );
}