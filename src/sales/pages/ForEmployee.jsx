import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { getSummaryForEmployee } from "../services/sales";
import moment from "moment-timezone";

export default function ForEmployee() {

  // states

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
      const localId = JSON.parse(sessionStorage.getItem('data')).local.id;
      const tz = JSON.parse(sessionStorage.getItem('data')).tz;
      const data = {date: moment().tz(tz).format()};
      const response = await getSummaryForEmployee(token, localId, data);
      if (response.statusCode === 200) {
        setProducts(response.summary);
      }else if (response.statusCode === 401){
        sessionStorage.clear();
        enqueueSnackbar(response.message,{ variant: 'warning' });
        return
      } else {
        enqueueSnackbar(response.message,{ variant: 'error' });
        return
      }
    }
    getData();
  },[]);

  return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Consumido por empleados
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Cantidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products && products.map((product) => (
              <TableRow key={product.name+product.price}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}
