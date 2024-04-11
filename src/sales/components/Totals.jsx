import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// ----------------------------------------------------------------------

const productosData = [{ nombre: 'Perro caliente', precio: 5, total: 10}, 
                        { nombre: 'Refresco', precio: 2, total: 20},
                        { nombre: 'Perro vegano', precio: 3, total: 5},
                        { nombre: 'Perro doble', precio: 6, total: 7},
                        { nombre: 'Papas', precio: 3, total: 8},
                        { nombre: 'Agua', precio: 3, total: 9}]

const dolar = 37.36;

export default function Totals() {

  // states

  const [productos, setProductos] = useState([]);

  const [total, setTotal] = useState(0);

  const ccyFormat = (num) => {
    return `${num.toFixed(2)}`;
  }
  
  const calculoTotal = (items) => {
    let total = 0;
    items.forEach((item) => { 
        total += item.total * item.precio
     })
    return total;
  }

  useEffect(() => {
    setProductos(productosData);
    setTotal(calculoTotal(productosData));
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
            {productos && productos.map((producto) => (
              <TableRow key={producto.nombre}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell align="right">{producto.total}</TableCell>
                <TableCell align="right">{producto.precio}$</TableCell>
                <TableCell align="right">{ccyFormat(producto.precio*producto.total)}$</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={3} />
              <TableCell colSpan={2}>Total bolivares</TableCell>
              {
                total && <TableCell align="right">{ccyFormat(total) * dolar} Bs</TableCell>
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
