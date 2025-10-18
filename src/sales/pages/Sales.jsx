import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useProducts from "../../commons/hooks/useProducts";
import { Paper, Grid, Card, CardActionArea, CardContent, Typography, Stack, 
        IconButton, Button, Accordion, AccordionSummary, AccordionDetails, 
        TextField, InputAdornment } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/Search'; 
import ClearIcon from '@mui/icons-material/Clear';
import { DialogPay } from "../components";
import { enqueueSnackbar } from 'notistack';
import { DolarContext } from "../../commons/components/Dashboard";
import { createOrder } from "../services/sales";
import moment from "moment-timezone";

export default function Sales(){

    const [total, setTotal] = useState(0);

    const [order, setOrder] = useState([]);

    const [open, setOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    const dolarContext = useContext(DolarContext);

    const { products, paymentTypes, accessToOrders } = useProducts();

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

    const completeOrder = async (payments,delivered) => {
        const items = order.map((item) => {
            return {   
                quantity: item.quantity,
                price: parseFloat(item.price),
                productId: item.id
            }
        });
        const localId = dolarContext.dataContext.localId;
        const tz = JSON.parse(sessionStorage.getItem('data')).tz;
        const newOrder = {
            creationDate: moment().tz(tz).format(),
            localId,
            totalDl: total,
            totalBs: total * dolarContext.dataContext.dolar,
            delivered,
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
    
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    
    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const getFilteredProducts = () => {

        if (!searchTerm) {
            return products;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return products.map(category => {
            
            const filteredProducts = category.product.filter(product =>
                product.name.toLowerCase().includes(lowerCaseSearchTerm)
            );
            
            return {
                ...category,
                product: filteredProducts
            };
        }).filter(category => category.product.length > 0);
    };

    const filteredProducts = getFilteredProducts();

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
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Buscar Producto"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    searchTerm && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClearSearch}
                                                edge="end"
                                                size="small"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                ),
                            }}
                        />
                        {
                            filteredProducts && filteredProducts.map((category) => (
                                category.product.length > 0 &&
                                <Accordion key={category.id}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">
                                        {category.name}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={1}>
                                    {
                                        category.product.map((product)=>(
                                            (product.status === 'ACTIVE') &&
                                            <Grid item xs={6} justifyContent="center" textAlign="center" key={product.id}>
                                                <Card>
                                                <CardActionArea onClick={() => addProduct(product)}>
                                                    <CardContent
                                                    sx={{ 
                                                        minHeight: 120, 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        justifyContent: 'center' 
                                                    }}
                                                    >
                                                        <Typography 
                                                            gutterBottom 
                                                            component="div"
                                                            variant="h6" 
                                                            sx={{ 
                                                                overflow: 'hidden',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 3,
                                                                WebkitBoxOrient: 'vertical',
                                                                lineHeight: '1.2em'
                                                            }}
                                                        >
                                                            {product.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {product.price}$
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))
                                    }
                                    </Grid>
                                </AccordionDetails>
                                </Accordion>
                            ))
                        }
                    </Stack>
                </Grid>
            </Grid>
            {
                open && <DialogPay open={open} setOpen={setOpen} paymentTypes={paymentTypes} 
                    completeOrder={completeOrder} total={total} accessToOrders={accessToOrders} withUnPaid={true}/>
            }
        </>
    );
}