import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// ----------------------------------------------------------------------

const totalsData = [{ name: 'Efectivo dolares', total: 55, type: 'dolares'}, 
                        { name: 'Efectivo bolivares', total: 200, type: 'bolivares'},
                        { name: 'Transferencias dolares', total: 78, type: 'dolares'},
                        { name: 'Tramsferencias bolivares', total: 500, type: 'bolivares'},
                        { name: 'Punto de venta', total: 450, type: 'bolivares'},]

export default function Accouting() {

  // states

  const [totals, setTotals] = useState([]);

  const [totalDolar, setTotalDolar] = useState(0);

  const [totalBs, setTotalBs] = useState(0);

  const ccyFormat = (num) => {
    return `${num.toFixed(2)}`;
  }
  
  const calculoTotal = (items) => {
    let totalDolar = 0;
    let totalBs = 0;
    items.forEach((item) => { 
        if (item.type === 'dolares') {
          totalDolar += item.total;
        } else if (item.type === 'bolivares') {
          totalBs += item.total;
        }
     })
    return {totalDolar, totalBs};
  }

  useEffect(() => {
    setTotals(totalsData);
    const {totalDolar, totalBs} = calculoTotal(totalsData);
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
            {totals && totals.map((total) => (
              <TableRow key={total.name}>
                <TableCell>{total.name}</TableCell>
                <TableCell colSpan={2} align="right">{total.total} {total.type === 'bolivares' ? 'Bs' : '$'} </TableCell>
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
