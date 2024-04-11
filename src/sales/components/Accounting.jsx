import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// ----------------------------------------------------------------------

const CantidadesData = [{ nombre: 'Efectivo dolares', total: 55, tipo: 'dolares'}, 
                        { nombre: 'Efectivo bolivares', total: 200, tipo: 'bolivares'},
                        { nombre: 'Transferencias dolares', total: 78, tipo: 'dolares'},
                        { nombre: 'Tramsferencias bolivares', total: 500, tipo: 'bolivares'},
                        { nombre: 'Punto de venta', total: 450, tipo: 'bolivares'},]

export default function Accouting() {

  // states

  const [cantidades, setCantidades] = useState([]);

  const [totalDolar, setTotalDolar] = useState(0);

  const [totalBs, setTotalBs] = useState(0);

  const ccyFormat = (num) => {
    return `${num.toFixed(2)}`;
  }
  
  const calculoTotal = (items) => {
    let totalDolar = 0;
    let totalBs = 0;
    items.forEach((item) => { 
        if (item.tipo === 'dolares') {
          totalDolar += item.total;
        } else if (item.tipo === 'bolivares') {
          totalBs += item.total;
        }
     })
    return {totalDolar, totalBs};
  }

  useEffect(() => {
    setCantidades(CantidadesData);
    const {totalDolar, totalBs} = calculoTotal(CantidadesData);
    setTotalDolar(totalDolar);
    setTotalBs(totalBs);
  },[]);

  return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Cierre
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Forma de pago</TableCell>
              <TableCell colSpan={2} align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cantidades && cantidades.map((cantidad) => (
              <TableRow key={cantidad.nombre}>
                <TableCell>{cantidad.nombre}</TableCell>
                <TableCell colSpan={2} align="right">{cantidad.total} {cantidad.tipo === 'bolivares' ? 'Bs' : '$'} </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={2} />
              <TableCell >Total de bolivares</TableCell>
              {
                totalBs && <TableCell align="right">{ccyFormat(totalBs)} Bs</TableCell>
              }
            </TableRow>
            <TableRow>
              <TableCell >Total de dolares</TableCell>
              {
                totalDolar && <TableCell align="right">{ccyFormat(totalDolar)}$</TableCell>
              }
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
  );
}
