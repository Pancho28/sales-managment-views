import { useState, useEffect } from 'react';
import { Paper, Grid, Card, CardActionArea, CardContent, Typography, Stack, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const productosData = [{id:1, nombre:'producto 1', precio: 100}, {id:2, nombre:'producto 2', precio: 200}, 
                        {id:3, nombre:'producto 3', precio: 300}, {id:4, nombre:'producto 4', precio: 400}, 
                        {id:5, nombre:'producto 5', precio: 150}, {id:6, nombre:'producto 6', precio: 40}]

const pedidoData = []

const dolar = 35.51

// ----------------------------------------------------------------------

export default function Sales(){

    const [total, setTotal] = useState(0);

    const [productos, setProductos] = useState(productosData);

    const [pedido, setPedido] = useState(pedidoData);

    const calculoTotal = () => {
        let total = 0;
        pedido.map((producto) => (
            total += producto.precio * producto.cantidad
        ))
        setTotal(total);
    };

    const agregarProducto = (productoData) => {
        const existe = pedido.find((producto) => producto.id === productoData.id)
        if (existe){
            pedido.forEach((producto) => {
                if (producto.id === productoData.id){
                    producto.cantidad += 1
                }
            })
        } else {
            pedido.push({...productoData, cantidad: 1})
        }
        calculoTotal();
    }

    const disminuirCantidad = (idProducto) => {
        pedido.forEach((producto) => {
            if (producto.cantidad > 1) {
                if (producto.id === idProducto){
                    producto.cantidad -= 1
                }
            } else {
                if (producto.id === idProducto){
                    pedido.splice(pedido.indexOf(producto), 1)
                }
            }
        })
        calculoTotal();
    }

    useEffect(() => {
        setPedido(pedidoData);
        setProductos(productosData);
    }, []);

  return (
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
                    {pedido.length > 0 ? pedido.map((pedido) => (
                        <Grid key={pedido.id} container>
                            <Grid item xs={5} justifyContent="center" textAlign="center">
                                <Typography gutterBottom variant="h6">
                                    {pedido.nombre}
                                </Typography>
                            </Grid>
                            <Grid item xs={3} justifyContent="center" textAlign="center">
                                <Typography variant="h6" color="text.secondary">
                                    {pedido.precio * pedido.cantidad}
                                </Typography>
                            </Grid>
                            <Grid item xs={3} justifyContent="center" textAlign="center">
                                <Typography variant="h6" color="text.secondary">
                                    {pedido.cantidad}
                                </Typography>
                            </Grid>
                            <Grid item xs={1} justifyContent="center" >
                                <IconButton aria-label="delete" color="primary" onClick={() => disminuirCantidad(pedido.id)}>
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
                                {Number(total * dolar).toFixed(2)}Bs
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <Button size="large" disabled={pedido.length === 0}>
                    Ordenar
                </Button>
            </Stack>
        </Grid>
        <Grid item xs={5}>
            <Grid container spacing={1}>
                {productos && productos.map((producto) => (
                    <Grid item xs={6} justifyContent="center" textAlign="center" key={producto.id}>
                        <Card sx={{ maxWidth: '100%' }}>
                        <CardActionArea onClick={() => agregarProducto(producto)}>
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {producto.nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {producto.precio}$
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    </Grid>
  );
}