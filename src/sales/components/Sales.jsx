import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useProducts from "../../commons/hooks/useProducts";
import { Paper, Grid, Card, CardActionArea, CardContent, Typography, Stack, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DialogPay from "./DialogPay";
import { enqueueSnackbar } from 'notistack';
import { DolarContext } from "../../commons/components/Dashboard";
import { createOrder } from "../services/sales";

export default function Sales(){

    const [total, setTotal] = useState(0);

    const [order, setOrder] = useState([]);

    const [open, setOpen] = useState(false);

    const dolarContext = useContext(DolarContext);

    const { products, paymentTypes } = useProducts();

    const navigate = useNavigate();

    const calculateTotal = () => {
        let total = 0;
        order.map((product) => (
            total += product.price * product.quantity
        ))
        setTotal(total);
    };

    const addProduct = (productData) => {
        let productExist = false;
        order.forEach((product) => {
            if (product.id === productData.id){
                productExist = true;
                product.quantity += 1
            }
        });
        if (!productExist) {
            order.push({...productData, quantity: 1});
        }
        calculateTotal();
    }

    const decreaseQuantity = (idProduct) => {
        order.forEach((product) => {
            if (product.quantity > 1) {
                if (product.id === idProduct){
                    product.quantity -= 1
                }
            } else {
                if (product.id === idProduct){
                    order.splice(order.indexOf(product), 1)
                }
            }
        })
        calculateTotal();
    }

    const openDialog = () => {
      setOpen(!open);
    }

    const completeOrder = async (payments) => {
        const items = order.map((item) => {
            return {   
                quantity: item.quantity,
                price: parseFloat(item.price),
                productId: item.id
            }
        });
        const localId = dolarContext.dataContext.localId;
        const newOrder = {
            localId,
            totalDl: total,
            totalBs: total * dolarContext.dataContext.dolar,
            items,
            payments
        }
        try {
            const token = dolarContext.dataContext.token;
            const response = await createOrder(token, newOrder);
            if (response.statusCode === 201){
                enqueueSnackbar(response.message,{ variant: 'success' });
                setOrder([]);
                setTotal(0);
            }else if(response.statusCode === 401){
                sessionStorage.clear();
                navigate('/', { replace: true });
                enqueueSnackbar(response.message,{ variant: 'warning' });
                return
            }else {
                enqueueSnackbar(response.message, { variant: 'error' });
                return
            }
        } catch (error) {
            enqueueSnackbar('Error al crear la orden',{ variant: 'error' });
        }
    }


  return (
    <>
        <Grid container spacing={1}>
            <Grid item xs={7}>
                <Stack spacing={2}>
                    <Paper>
                        <Grid container>
                            <Grid item xs={5} justifyContent="center" textAlign="center">
                                <Typography gutterBottom variant="h6">
                                    Producto
                                </Typography>
                            </Grid>
                            <Grid item xs={3} justifyContent="center" textAlign="center">
                                <Typography variant="h6" color="text.secondary">
                                    Total
                                </Typography>
                            </Grid>
                            <Grid item xs={3} justifyContent="center" textAlign="center">
                                <Typography variant="h6" color="text.secondary">
                                    Cantidad
                                </Typography>
                            </Grid>
                            <Grid item xs={1} justifyContent="center" >

                            </Grid>
                        </Grid>
                        {order && order.length > 0 ? order.map((item) => (
                            <Grid key={item.id} container>
                                <Grid item xs={5} justifyContent="center" textAlign="center">
                                    <Typography gutterBottom variant="h6">
                                        {item.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} justifyContent="center" textAlign="center">
                                    <Typography variant="h6" color="text.secondary">
                                        {item.price * item.quantity}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} justifyContent="center" textAlign="center">
                                    <Typography variant="h6" color="text.secondary">
                                        {item.quantity}
                                    </Typography>
                                </Grid>
                                <Grid item xs={1} justifyContent="center" >
                                    <IconButton aria-label="delete" color="primary" onClick={() => decreaseQuantity(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))
                        :
                        <Grid item xs={12} justifyContent="center" textAlign="center">
                            <Typography variant="h4">
                                Sin pedidos aún
                            </Typography>
                            <AddShoppingCartIcon fontSize='large'/>
                        </Grid>
                        }
                        <Grid container>
                            <Grid item xs={6} justifyContent="center" textAlign="end">
                                <Typography gutterBottom variant="h6">
                                    Total compra
                                </Typography>
                            </Grid>
                            <Grid item xs={3} justifyContent="center" textAlign="center">
                                <Typography variant="h6" color="text.secondary">
                                    {Number(total).toFixed(2)}$
                                </Typography>
                            </Grid>
                            <Grid item xs={3} justifyContent="center" textAlign="center">
                                <Typography variant="h6" color="text.secondary">
                                    {Number(total * dolarContext.dataContext.dolar).toFixed(2)}Bs
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Button size="large" disabled={order.length === 0} onClick={ () => openDialog()}>
                        Ordenar
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={5}>
                <Grid container spacing={1}>
                    {products && products.map((product) => (
                        <Grid item xs={6} justifyContent="center" textAlign="center" key={product.id}>
                            <Card sx={{ maxWidth: '100%' }}>
                            <CardActionArea onClick={() => addProduct(product)}>
                              <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.price}$
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
        {
            open && <DialogPay open={open} setOpen={setOpen} paymentTypes={paymentTypes} completeOrder={completeOrder} total={total}/>
        }
    </>
  );
}