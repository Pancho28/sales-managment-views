import { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DolarContext } from "../../commons/components/Dashboard";
import { enqueueSnackbar } from 'notistack';
import { getSummaryByPrice } from "../services/sales";
import moment from "moment-timezone";
import useLogout from '../../commons/hooks/useLogout';

export default function Totals() {

  const { logout } = useLogout();

  // states

  const [products, setProducts] = useState([]);

  const [total, setTotal] = useState(0);

  const dolarContext = useContext(DolarContext);

  const ccyFormat = (num) => {
    return `${num.toFixed(2)}`;
  }
  
  const calculoTotal = (items) => {
    let total = 0;
    items.forEach((item) => { 
        total += item.quantity * item.price
     })
    return total;
  }

  useEffect(() => {
    const getData = async () => {
      const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
      const localId = JSON.parse(sessionStorage.getItem('data')).local.id;
      const tz = JSON.parse(sessionStorage.getItem('data')).tz;
      const data = {date: moment().tz(tz).format()};
      const response = await getSummaryByPrice(token, localId, data);
      if (response.statusCode === 200) {
        setProducts(response.summary);
        setTotal(calculoTotal(response.summary));
      }else if (response.statusCode === 401){
        logout();
      } else {
        enqueueSnackbar(response.message,{ variant: 'error' });
        return
      }
    }
    getData();
  },[logout]);

  return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Totales vendidos
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products && products.map((product) => (
              <TableRow key={product.name+product.price}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">{product.price}$</TableCell>
                <TableCell align="right">{ccyFormat(product.price*product.quantity)}$</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={2}>Total dolares</TableCell>
              {
                total ? <TableCell align="right">{ccyFormat(total)}$</TableCell> : null
              }
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total bolivares</TableCell>
              {
                total ? <TableCell align="right">{ccyFormat(total * dolarContext.dataContext.dolar)} Bs</TableCell> : null 
              }
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
  );
}
