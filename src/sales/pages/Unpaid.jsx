import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Stack, Accordion, AccordionActions, AccordionSummary, AccordionDetails, Button, List,
  ListItem, ListItemIcon, ListItemText, Box, Grid} from '@mui/material';
import { DialogPay } from "../components";
import useProducts from "../../commons/hooks/useProducts";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import moment from "moment-timezone";
import { enqueueSnackbar } from 'notistack';
import { getUnpaidOrders, paidOrder } from "../services/sales";


export default function Unpaid() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [total, setTotal] = useState(0);

  const [orderId, setOrderId] = useState(0);

  const [totalOrder, setTotalOrder] = useState(0);

  const [open, setOpen] = useState(false);

  const { paymentTypes } = useProducts();

  const payOrder = async (id,total) => {
    setOrderId(id);
    setTotalOrder(Number(total));
    setOpen(!open);
  }

  const calculateTotal = (orders) => {
    let total = 0;
    orders.forEach((order) => {
      total += Number(order.totalDl);
    });
    setTotal(total);
  }

  const completeOrder = async (data) => {
    const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
    const tz = JSON.parse(sessionStorage.getItem('data')).tz;
    data.forEach(async (payment) => {
      delete payment.isPaid;
    });
    const newPaidOrder = {
      date: moment().tz(tz).format(),
      payments: data,
    }
    try{
      const response = await paidOrder(token, orderId, newPaidOrder);
      if (response.statusCode === 201){
        enqueueSnackbar('Orden pagada con éxito',{ variant: 'success' });
        const newOrders = orders.filter(order => order.id !== orderId);
        setOrders(newOrders);
        calculateTotal(newOrders);
      }else if(response.statusCode === 401){
        sessionStorage.clear();
        navigate('/', { replace: true });
        enqueueSnackbar('Vuelva a iniciar sesión',{ variant: 'warning' });
      }else{
        enqueueSnackbar(response.message,{ variant: 'error' });
        return
      }
    }
    catch (error) {
      enqueueSnackbar('Error al pagar la orden',{ variant: 'error' });
    }
  }

  useEffect(() => {
    const getOrders = async () => { 
      try{
        const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
        const ordersResponse = await getUnpaidOrders(token);
        if (ordersResponse.statusCode === 200){
          setOrders(ordersResponse.orders);
          calculateTotal(ordersResponse.orders);
        }else if(ordersResponse.statusCode === 401){
          sessionStorage.clear();
          navigate('/', { replace: true });
          enqueueSnackbar('Vuelva a iniciar sesión',{ variant: 'warning' });
        }else{
          enqueueSnackbar(ordersResponse.message,{ variant: 'error' });
        }
      }
      catch (error) {
        enqueueSnackbar('Error al obtener las ordenes',{ variant: 'error' });
      }
    }
    getOrders();
  }, [navigate]);

  return (
    <Paper>
      <Stack>
        {
          total > 0 && <Typography gutterBottom variant="h4" p={2}> {orders.length} orden(es) no pagadas, {total}$ por cobrar</Typography>
        }
        { 
        orders && orders.length > 0 ? orders.map((order) => (
          <Accordion key={order.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Orden pendiente de pago desde {moment(order.creationDate).format('DD/MM/YYYY h:mm a')}  
              </Typography>
              <AccessTimeIcon color='primary' fontSize='inherit' /> 
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item xs={6}>
                  <PersonPinIcon color='primary'/>
                  <Typography variant="h6">
                    {order.paymentOrder[0].customerInformation[0].name}
                    { order.paymentOrder[0].customerInformation[0].lastName ? ' ' + order.paymentOrder[0].customerInformation[0].lastName : null }
                  </Typography> 
                </Grid>
                <Grid item xs={6}>
                  <List>
                      {order.orderItem.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemIcon>
                            <ShoppingCartCheckoutIcon color='primary'/>
                          </ListItemIcon>
                          <ListItemText
                            primary={item.quantity+' '+item.product.name}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Grid>
              </Grid>
              <Typography mt={3} ariant="subtitle2">Por pagar {order.totalDl}$ | {order.totalBs}Bs</Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button size="large" onClick={() => payOrder(order.id, order.totalDl)}>Pagar pedido</Button>
            </AccordionActions>
            { open &&
              <DialogPay open={open} setOpen={setOpen} paymentTypes={paymentTypes} 
              completeOrder={completeOrder} total={totalOrder} accessToOrders={null} withUnPaid={false}/>
            }
          </Accordion>
        ))
        :
        <Box justifyContent="center" textAlign="center">
            <Typography p={2} variant="h4">
            Sin ordenes por cobrar
            </Typography>
            <AddShoppingCartIcon fontSize='large'/>
        </Box>        
      }
      </Stack>
    </Paper>
  );
}
