import { useState } from 'react';
import { useUsers } from '../hooks';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
          Paper, IconButton, Tooltip, Typography, Button, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { SkeletonTable } from '../../commons/components';
import { DialogAddUser } from '.'


export default function Users() {

  const [openAdd, setOpenAdd] = useState(false); 

  const { isError, error, isLoading, data: users } = useUsers();

  if (isLoading) {
      return <SkeletonTable rows={6}/>
  }

  if (isError) {
      return <Typography>Error cargando usuarios: {error.message}</Typography>;
  }

  const moreoptions = (id) => {
      console.log('moreoptions', id);
  }

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
              <TableCell>Rol</TableCell>
              <TableCell>Local</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Último acceso</TableCell>
              <TableCell>Zona horaria</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                  <TableCell component="th" scope="row">
                    {user.username}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.local[0].name}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.tz}</TableCell>
                  <TableCell> 
                    <Tooltip title="More options">
                      <IconButton onClick={() => moreoptions(user.id)}>
                        <MoreHorizIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        openAdd && <DialogAddUser open={openAdd} setOpen={setOpenAdd} />
      }
    </>
  );
}