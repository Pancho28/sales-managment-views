import { useState } from 'react';
import useProducts from "../../commons/hooks/useProducts";
import { CardActionArea, Card, CardContent, Grid, Typography, Button, Box,
      TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; 
import ClearIcon from '@mui/icons-material/Clear'; 
import { DialogModifyPrice, DialogAddProduct } from '../components';

export default function Prices() {

    const { products, categories, addProduct, modifyProduct, activateProduct, desactivateProduct } = useProducts();

    const [detailsProduct, setDetailsProduct] = useState({});

    const [detailsCategory, setDetailsCategory] = useState({});

    const [openModify, setOpenModify] = useState(false);

    const [openAdd, setOpenAdd] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState(''); 

    const setDetailsNull = () => {
        setDetailsProduct({});
        setDetailsCategory({});
    }

    const openDialogModify = (product,category) => { 
        setDetailsProduct(product);
        setDetailsCategory(category);
        setOpenModify(!openModify);
    }

    const openDialogAdd = () => {
        setOpenAdd(!openAdd);
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button onClick={openDialogAdd} variant="contained">
                    Agregar producto
                </Button>

                <TextField
                    size="small"
                    label="Buscar producto..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
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
            </Box>
            
            <Grid container spacing={2}>
                {filteredProducts && filteredProducts.map((category) => (
                    category.product.length > 0 && 
                    category.product.map((product)=>(
                        <Grid key={product.id} item xs={12} sm={6} md={4} justifyContent="center" textAlign="center">
                            <Card sx={{ opacity: product.status === 'ACTIVE' ? 1 : 0.5, height: '100%' }}>
                            <CardActionArea onClick={ () => openDialogModify(product,category) }>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div">
                                        Precio {product.price}$
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div">
                                        Categoria {category.name}
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div" color={product.status === 'ACTIVE' ? 'primary.main' : 'error.main'}>
                                        Estado {product.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Fecha de creacion {formatDate(product.creationDate)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.updateDate ?
                                        <>
                                            Fecha de actualizacion {formatDate(product.updateDate)}
                                        </>
                                        :
                                        <>
                                            Producto sin actualizaciones
                                        </>
                                        }
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ))}
                {filteredProducts.every(cat => cat.product.length === 0) && searchTerm.length > 0 && (
                    <Grid item xs={12} textAlign="center" mt={3}>
                        <Typography variant="h6" color="text.secondary">
                            No se encontraron productos que coincidan con "{searchTerm}".
                        </Typography>
                    </Grid>
                )}
            </Grid>
            {openModify &&
            <DialogModifyPrice open={openModify} setOpen={setOpenModify} category={detailsCategory} product={detailsProduct} setDetailsNull={setDetailsNull} 
                modifyProduct={modifyProduct} categories={categories} activate={activateProduct} desactivate={desactivateProduct}/>
            }
            {openAdd &&
            <DialogAddProduct open={openAdd} setOpen={setOpenAdd} addProduct={addProduct} categories={categories}/>
            }
        </>
    );
}