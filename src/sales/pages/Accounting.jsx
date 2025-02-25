import { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DolarContext } from "../../commons/components/Dashboard";
import { enqueueSnackbar } from 'notistack';
import { getSummaryByPaymentType } from "../services/sales";
import moment from "moment-timezone";


export default function Accounting() {

  // states

  const [totals, setTotals] = useState([]);

  const [totalDolar, setTotalDolar] = useState(0);

  const [totalBs, setTotalBs] = useState(0);

  const dolarContext = useContext(DolarContext);

  const ccyFormat = (num) => {
    return `${num.toFixed(2)}`;
  }
  
  const calculoTotal = (items) => {
    let totalDolar = 0;
    let totalBs = 0;
    items.forEach((item) => { 
        if (item.currency === 'Dolares') {
          totalDolar += Number(item.total);
        } else if (item.currency === 'Bolivares') {
          totalBs += Number(item.total);
        }
     })
    return {totalDolar, totalBs};
  }

  useEffect(() => {
    const getData = async () => {
      const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
      const localId = JSON.parse(sessionStorage.getItem('data')).local.id;
      const tz = JSON.parse(sessionStorage.getItem('data')).tz;
      const data = {date: moment().tz(tz).format()};
      const response = await getSummaryByPaymentType(token, localId,data);
      if (response.statusCode === 200) {
        setTotals(response.summary);
        const {totalDolar, totalBs} = calculoTotal(response.summary);
        setTotalDolar(totalDolar);
        setTotalBs(totalBs);
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
              <TableRow key={total.name+total.currency}>
                <TableCell>{(total.name+' '+total.currency).replace(/(\b\w+\b)\s+\1/, "$1")/*expresion regular para eliminar palabras repetidas*/}</TableCell>
                { total.currency === 'Bolivares' ?
                <TableCell colSpan={2} align="right">{total.total * dolarContext.dataContext.dolar}Bs </TableCell>
                :
                <TableCell colSpan={2} align="right">{total.total}$ </TableCell>
                }
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={2} />
              <TableCell >Total de dolares</TableCell>
              {
                totalDolar ? <TableCell align="right">{ccyFormat(totalDolar)}$</TableCell> : null
              }
            </TableRow>
            <TableRow>
              <TableCell >Total de bolivares</TableCell>
              {
                totalBs ? <TableCell align="right">{ccyFormat(totalBs * dolarContext.dataContext.dolar)}Bs</TableCell> : null
              }
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
  );
}
