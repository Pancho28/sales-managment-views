import { useState, useEffect } from "react";
import { Typography, Paper, Stack, Accordion, AccordionActions, AccordionSummary, AccordionDetails, Button, List,
  ListItem, ListItemIcon, ListItemText, Box} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import moment from "moment-timezone";
import { enqueueSnackbar } from 'notistack';
import { deliverOrder, getOrdersNotDelivered } from "../services/sales";
import useLogout from "../../commons/hooks/useLogout";


export default function NotDeliveredOrders() {

  const { logout } = useLogout();

  const [orders, setOrders] = useState([]);

  const deliveryOrder = async (orderId) => {
    const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
    const tz = JSON.parse(sessionStorage.getItem('data')).tz;
    try {
      const data = {date: moment().tz(tz).format()} ;
      const response = await deliverOrder(token, orderId, data);
      if (response.statusCode === 201) {
        const newOrders = orders.filter(order => order.id !== orderId);
        setOrders(newOrders);
        enqueueSnackbar(response.message,{ variant: 'success' });
      }else if (response.statusCode === 401){
        logout();
      }else {
        enqueueSnackbar(response.message, { variant: 'error' });
        return
      }
    }
    catch (error) {
      enqueueSnackbar('Error al entregar orden',{ variant: 'error' });
    }
  }

  useEffect(() => {
    const getOrders = async () => { 
      try{
        const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
        const ordersResponse = await getOrdersNotDelivered(token);
        if (ordersResponse.statusCode === 200){
          setOrders(ordersResponse.orders);
        }else if(ordersResponse.statusCode === 401){
          logout();
        }else{
          enqueueSnackbar(ordersResponse.message,{ variant: 'error' });
        }
      }
      catch (error) {
        enqueueSnackbar('Error al obtener las ordenes',{ variant: 'error' });
      }
    }
    getOrders();
  }, [logout]);

  return (
    <Paper>
      <Stack>
        <Typography gutterBottom variant="h4" p={2}>Ordenes pendientes: {orders.length}</Typography>
        { orders && orders.length > 0 ? orders.map((order) => (
          <Accordion key={order.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                Orden pendiente desde {moment(order.creationDate).format('h:mm a')}  
              </Typography>
              <AccessTimeIcon color='primary' fontSize='inherit' /> 
            </AccordionSummary>
            <AccordionDetails>
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
              <Typography mt={3} ariant="subtitle2">Pagado {order.totalDl}$ | {order.totalBs}Bs</Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button size="large" onClick={() => deliveryOrder(order.id)}>Entregar pedido</Button>
            </AccordionActions>
          </Accordion>
        ))
        :
        <Box justifyContent="center" textAlign="center">
            <Typography p={2} variant="h4">
            Sin ordenes pendientes
            </Typography>
            <AddShoppingCartIcon fontSize='large'/>
        </Box>        
      }
      </Stack>
    </Paper>
  );
}
