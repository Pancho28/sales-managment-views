import { useState, useEffect, useContext } from 'react';
import { Paper, Grid, Card, CardActionArea, CardContent, Typography, Stack, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DialogPay from "./DialogPay";
import { enqueueSnackbar } from 'notistack';
import { DolarContext } from "../../commons/components/Dashboard";

const productsData = [{id:1, name:'producto 1', price: 100}, {id:2, name:'producto 2', price: 200}, 
                        {id:3, name:'producto 3', price: 300}, {id:4, name:'producto 4', price: 400}, 
                        {id:5, name:'producto 5', price: 150}, {id:6, name:'producto 6', price: 40}]

const paymentTypesData = [{ id:1, name: 'Dolares' }, { id:2, name:'Bolivares' }, { id:3, name: 'Transferencia' }, { id:4, name: 'Punto de venta' }];

// ----------------------------------------------------------------------

export default function Sales(){

    const [total, setTotal] = useState(0);

    const [products, setProducts] = useState([]);

    const [order, setOrder] = useState([]);

    const [paymentTypes, setPaymentTypes] = useState([]);

    const [open, setOpen] = useState(false);

    const dolarContext = useContext(DolarContext);

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

    const createOrder = (paymentType) => {
        console.log(paymentType);
        console.log(order);
        console.log(total);
        setOrder([]);
        setTotal(0);
        enqueueSnackbar('Se ha creado la orden',{ variant: 'success' });
    }

    useEffect(() => {
        setProducts(productsData);
        setPaymentTypes(paymentTypesData);
    }, []);

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
            open && <DialogPay open={open} setOpen={setOpen} paymentTypes={paymentTypes} createOrder={createOrder}/>
        }
    </>
  );
}