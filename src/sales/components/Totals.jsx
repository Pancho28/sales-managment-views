import { useState, useEffect, useContext } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import { DolarContext } from "../../commons/components/Dashboard";

// ----------------------------------------------------------------------

const productsData = [{ name: 'Perro caliente', price: 5, total: 10}, 
                        { name: 'Refresco', price: 2, total: 20},
                        { name: 'Perro vegano', price: 3, total: 5},
                        { name: 'Perro doble', price: 6, total: 7},
                        { name: 'Papas', price: 3, total: 8},
                        { name: 'Agua', price: 3, total: 9}]

export default function Totals() {

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
        total += item.total * item.price
     })
    return total;
  }

  useEffect(() => {
    setProducts(productsData);
    setTotal(calculoTotal(productsData));
  },[]);

  return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Detalle
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
              <TableRow key={product.name}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.total}</TableCell>
                <TableCell align="right">{product.price}$</TableCell>
                <TableCell align="right">{ccyFormat(product.price*product.total)}$</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={2}>Total bolivares</TableCell>
              {
                total && <TableCell align="right">{ccyFormat(total) * dolarContext.dolar} Bs</TableCell>
              }
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total dolares</TableCell>
              {
                total && <TableCell align="right">{ccyFormat(total)}$</TableCell>
              }
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
  );
}
