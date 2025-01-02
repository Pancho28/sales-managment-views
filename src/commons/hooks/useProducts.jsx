import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { getPaymentsTypes, getProducts, getCategories } from "../../sales/services/sales";
import { AccessNames } from "../helpers/enum.ts";
import moment from "moment-timezone";

export default function useProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [paymentTypes, setPaymentTypes] = useState([]);

    const [categories, setCategories] = useState([]);

    const [accessToOrders, setAccessToOrders] = useState();

    const addProduct = (newProduct) => {
        const newProducts = [...products];
        const existCategory = products.find(category => category.id === newProduct.category.id);
        if (existCategory){
            newProducts.forEach(category => {
                if (category.id === newProduct.category.id){
                    category.product.push(newProduct);
                }
            });
        }
        else {
            const newCategory = {
                id: newProduct.category.id,
                name: newProduct.category.name,
                product: [newProduct]
            }
            newProducts.push(newCategory);
        }
        setProducts(newProducts);
        sessionStorage.setItem('products', JSON.stringify(newProducts));
    }

    const modifyProduct = (newProduct, product, newPrice, category) => {
        const newProducts = [...products];
        const tz = JSON.parse(sessionStorage.getItem('data')).tz;
        if (category.id === newProduct.category) { //Si el producto sigue en la misma categoria
          products.forEach((oldCategory) => {
            if (oldCategory.id === category.id){
              category.product.forEach((oldProduct) => {
                if (oldProduct.id === product.id){
                  oldProduct.name = newProduct.name;
                  oldProduct.price = newPrice;
                  oldProduct.updateDate = moment().tz(tz).format();
                }
              })
            }
          });
        }else {
          const existCategory = products.find(category => category.id === newProduct.category);
          if (existCategory){ //Si el producto se va a otra categoria y en esa categoria se tienen productos
            products.forEach((oldCategory) => {
              if (oldCategory.id === category.id){
                category.product.forEach((oldProduct) => {
                  if (oldProduct.id === product.id){
                    category.product.splice(category.product.indexOf(oldProduct),1);
                  }
                })
              }
              if (oldCategory.id === newProduct.category){
                oldCategory.product.push({id: product.id, name: newProduct.name, 
                                          price: newPrice, 
                                          creationDate: product.creationDate, 
                                          updateDate: moment().tz(tz).format()
                                        });
              }
            });
          }else { //Si el producto se va a otra categoria y en esa categoria no se tienen productos
            const newCategory = {
              id: newProduct.category,
              name: categories.find(category => category.id === newProduct.category).name,
              product: [{id: product.id, name: newProduct.name, price: newPrice, creationDate: product.creationDate, updateDate: moment().tz(tz).format()}]
            }
            products.forEach((oldCategory) => {
              if (oldCategory.id === category.id){
                category.product.forEach((oldProduct) => {
                  if (oldProduct.id === product.id){
                    category.product.splice(category.product.indexOf(oldProduct),1);
                  }
                })
              }
            });
            products.push(newCategory);
          }
        }
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
            const accessToOrders = JSON.parse(sessionStorage.getItem('access')) ?
                                    JSON.parse(sessionStorage.getItem('access')) : null;
            if (loadedProducts && loadedPaymentTypes && loadedCategories){
                setProducts(loadedProducts);
                setPaymentTypes(loadedPaymentTypes);
                setCategories(loadedCategories);
                setAccessToOrders(accessToOrders);
                return;
            }
            const token = JSON.parse(sessionStorage.getItem('data')).accessToken;
            const productsResponse = await getProducts(token);
            const paymentTypesResponse = await getPaymentsTypes(token);
            const categoriesResponse = await getCategories(token);
            // Si se tiene el acceso a ordenes no entregadas se hace la peticion
            const access = JSON.parse(sessionStorage.getItem('data')) ? JSON.parse(sessionStorage.getItem('data')).access : null;
            const accessOrders = access.find(acces => acces.name === AccessNames.OPEN_ORDERS) ? true : false;
            if (productsResponse.statusCode === 200 && paymentTypesResponse.statusCode === 200 
                    && categoriesResponse.statusCode === 200){
                sessionStorage.setItem('products', JSON.stringify(productsResponse.products));
                sessionStorage.setItem('paymentTypes', JSON.stringify(paymentTypesResponse.paymentTypes));
                sessionStorage.setItem('categories', JSON.stringify(categoriesResponse.categories));
                sessionStorage.setItem('access', JSON.stringify(accessOrders));
                setProducts(productsResponse.products);
                setPaymentTypes(paymentTypesResponse.paymentTypes);
                setCategories(categoriesResponse.categories);
                setAccessToOrders(accessOrders);
            }else if(productsResponse.statusCode === 401 || paymentTypesResponse.statusCode === 401 
                    || categoriesResponse.statusCode === 401){
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
    }, []);

    return { products, paymentTypes, categories, accessToOrders, modifyProduct, addProduct };

}