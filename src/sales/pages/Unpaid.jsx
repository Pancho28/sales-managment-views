import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Stack, Accordion, AccordionActions, AccordionSummary, AccordionDetails, Button, List,
  ListItem, ListItemIcon, ListItemText, Box,
  Grid} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import moment from "moment-timezone";
import { enqueueSnackbar } from 'notistack';
import { getUnpaidOrders } from "../services/sales";


export default function Unpaid() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [total, setTotal] = useState(0);

  const payOrder = async (orderId) => {
    const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
    const tz = JSON.parse(sessionStorage.getItem('data')).tz;
    const newOrders = orders.filter(order => order.id !== orderId);
    setOrders(newOrders);
    calculateTotal(newOrders);
    console.log(orderId,token,tz);
  }

  const calculateTotal = (orders) => {
    let total = 0;
    orders.forEach((order) => {
      total += Number(order.totalDl);
    });
    console.log(total)
    setTotal(total);
  }

  useEffect(() => {
    const getOrders = async () => { 
      try{
        const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
        const ordersResponse = await getUnpaidOrders(token);
        console.log(ordersResponse.orders);
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
        <Typography gutterBottom variant="h4" p={2}>Ordenes no pagadas: {orders.length}</Typography>
        {
          total > 0 && <Typography gutterBottom variant="h4" p={2}>Total no pagado: {total}</Typography>
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
              <Button size="large" onClick={() => payOrder(order.id)}>Pagar pedido</Button>
            </AccordionActions>
          </Accordion>
        ))
        :
        <Box justifyContent="center" textAlign="center">
            <Typography p={2} variant="h4">
            Sin ordenes por pagar
            </Typography>
            <AddShoppingCartIcon fontSize='large'/>
        </Box>        
      }
      </Stack>
    </Paper>
  );
}
