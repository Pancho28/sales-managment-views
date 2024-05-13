import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { getPaymentsTypes, getProducts, getCategories } from "../../sales/services/sales";

export default function useProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [paymentTypes, setPaymentTypes] = useState([]);

    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        const getData = async () => { 
        try{
            const loadedProducts = JSON.parse(sessionStorage.getItem('products')) ? 
                                    JSON.parse(sessionStorage.getItem('products')) : null;
            const loadedPaymentTypes = JSON.parse(sessionStorage.getItem('paymentTypes')) ?
                                    JSON.parse(sessionStorage.getItem('paymentTypes')) : null;
            const loadedCategories = JSON.parse(sessionStorage.getItem('categories')) ?
                                    JSON.parse(sessionStorage.getItem('categories')) : null;
            if (loadedProducts && loadedPaymentTypes && loadedCategories){
                setProducts(loadedProducts);
                setPaymentTypes(loadedPaymentTypes);
                setCategories(loadedCategories);
                return;
            }
            const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
            const productsResponse = await getProducts(token);
            const paymentTypesResponse = await getPaymentsTypes(token);
            const categoriesResponse = await getCategories(token);
            if (productsResponse.statusCode === 200 && paymentTypesResponse.statusCode === 200 && categoriesResponse.statusCode === 200){
                const normalizedPaymentTypes = paymentTypesResponse.paymentTypes.map(paymentType => {
                    paymentType.name = paymentType.name + ' ' + paymentType.currency;
                    delete paymentType.currency;
                    return paymentType;
                });
                sessionStorage.setItem('products', JSON.stringify(productsResponse.products));
                sessionStorage.setItem('paymentTypes', JSON.stringify(normalizedPaymentTypes));
                sessionStorage.setItem('categories', JSON.stringify(categoriesResponse.categories));
                setProducts(productsResponse.products);
                setPaymentTypes(normalizedPaymentTypes);
                setCategories(categoriesResponse.categories);
            }else if(productsResponse.statusCode === 401 || paymentTypesResponse.statusCode === 401 || categoriesResponse.statusCode === 401){
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

    return { products, paymentTypes, categories, modifyProduct, addProduct };

}