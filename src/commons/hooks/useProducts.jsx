import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { getPaymentsTypes, getProducts, getCategories, getOrdersNotDelivered } from "../../sales/services/sales";
import { AccessNames } from "../helpers/enum.ts";

export default function useProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [paymentTypes, setPaymentTypes] = useState([]);

    const [categories, setCategories] = useState([]);

    const [orders, setOrders] = useState([]);

    const addProduct = (newProduct) => {
        const newProducts = [...products];
        newProducts.push(newProduct);
        setProducts(newProducts);
        sessionStorage.setItem('products', JSON.stringify(newProducts));
    }

    const modifyProduct = (newProducts) => {
        setProducts(newProducts);
        sessionStorage.setItem('products', JSON.stringify(newProducts));
    }

    const popOrder = (orderId) => {
        const newOrders = orders.filter(order => order.id !== orderId);
        setOrders(newOrders);
        sessionStorage.setItem('orders', JSON.stringify(newOrders));
    }

    const addOrder = (newOrder) => {
        const newOrders = [...orders];
        newOrders.push(newOrder);
        setOrders(newOrders);
        sessionStorage.setItem('orders', JSON.stringify(newOrders));
    }

    useEffect(() => {
        const getData = async () => { 
        try{
            const loadedProducts = JSON.parse(sessionStorage.getItem('products')) ? 
                                    JSON.parse(sessionStorage.getItem('products')) : null;
            const loadedPaymentTypes = JSON.parse(sessionStorage.getItem('paymentTypes')) ?
                                    JSON.parse(sessionStorage.getItem('paymentTypes')) : null;
            const loadedCategories = JSON.parse(sessionStorage.getItem('categories')) ?
                                    JSON.parse(sessionStorage.getItem('categories')) : null;
            const loadedOrders = JSON.parse(sessionStorage.getItem('orders')) ?
                                    JSON.parse(sessionStorage.getItem('orders')) : null;
            if (loadedProducts && loadedPaymentTypes && loadedCategories && loadedOrders){
                setProducts(loadedProducts);
                setPaymentTypes(loadedPaymentTypes);
                setCategories(loadedCategories);
                setOrders(loadedOrders);
                return;
            }
            const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
            const productsResponse = await getProducts(token);
            const paymentTypesResponse = await getPaymentsTypes(token);
            const categoriesResponse = await getCategories(token);
            // Si se tiene el acceso a ordenes no entregadas se hace la peticion
            const access = JSON.parse(sessionStorage.getItem('data')) ? JSON.parse(sessionStorage.getItem('data')).access : null;
            const accessOrders = access.find(acces => acces.name === AccessNames.OPEN_ORDERS);
            let ordersResponse = { statusCode: 200, orders: [] };
            if (accessOrders){
                ordersResponse = await getOrdersNotDelivered(token);
            }
            if (productsResponse.statusCode === 200 && paymentTypesResponse.statusCode === 200 
                    && categoriesResponse.statusCode === 200 && ordersResponse.statusCode === 200){
                const normalizedPaymentTypes = paymentTypesResponse.paymentTypes.map(paymentType => {
                    paymentType.name = paymentType.name + ' ' + paymentType.currency;
                    delete paymentType.currency;
                    return paymentType;
                });
                sessionStorage.setItem('products', JSON.stringify(productsResponse.products));
                sessionStorage.setItem('paymentTypes', JSON.stringify(normalizedPaymentTypes));
                sessionStorage.setItem('categories', JSON.stringify(categoriesResponse.categories));
                sessionStorage.setItem('orders', JSON.stringify(ordersResponse.orders));
                setProducts(productsResponse.products);
                setPaymentTypes(normalizedPaymentTypes);
                setCategories(categoriesResponse.categories);
                setOrders(ordersResponse.orders);
            }else if(productsResponse.statusCode === 401 || paymentTypesResponse.statusCode === 401 
                    || categoriesResponse.statusCode === 401 || ordersResponse.statusCode === 401){
                sessionStorage.clear();
                navigate('/', { replace: true });
                enqueueSnackbar('Vuelva a iniciar sesión',{ variant: 'warning' });
            }else{
                enqueueSnackbar(productsResponse.message,{ variant: 'error' });
            }
        }catch(error){
            enqueueSnackbar('Error al obtener los datos',{ variant: 'error' });
        }
    }
    getData();
    }, [navigate]);

    return { products, paymentTypes, categories, orders, modifyProduct, addProduct, popOrder, addOrder };

}