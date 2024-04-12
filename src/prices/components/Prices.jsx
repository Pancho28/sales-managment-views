import { useState, useEffect } from 'react';
import { CardActionArea, Card, CardContent, Grid, Typography, Button, Box } from '@mui/material';
import DialogModifyPrice from './DialogModifyPrice';
import DialogAddProduct from './DialogAddProduct';

// ----------------------------------------------------------------------

const productsData = [{id: 1, name: 'Perro caliente', price: 5, creationDate: '10/01/2024', updateDate: '20/01/2024'},
                      {id: 2, name: 'Refresco', price: 2, creationDate: '10/01/2024', updateDate: '20/01/2024'},
                      {id: 3, name: 'Perro vegano', price: 3, creationDate: '10/01/2024', updateDate: '20/01/2024'},
                      {id: 4, name: 'Perro Doble', price: 6, creationDate: '10/01/2024', updateDate: '20/01/2024'},
                      {id: 5, name: 'Papas', price: 4, creationDate: '10/01/2024', updateDate: '20/01/2024'},
                      {id: 6, name: 'Agua', price: 3, creationDate: '10/01/2024', updateDate: '20/01/2024'}]

export default function Prices() {

  // states

  const [products, setProducts] = useState([]);

  const [detailsProduct, setDetailsProduct] = useState({});

  const [openModify, setOpenModify] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  const openDialogModify = (product) => { 
    setDetailsProduct(product);
    setOpenModify(!openModify);
  }

  const openDialogAdd = () => {
    setOpenAdd(!openAdd);
  }

  useEffect(() => {
    setProducts(productsData);
  },[]);

  return (
    <>
      <Box align="right" mb={2}>
        <Button onClick={openDialogAdd} >Agregar producto</Button>
      </Box>
      <Grid container spacing={2}>
        {products && products.map((product) => (
        <Grid key={product.id} item xs={4} justifyContent="center" textAlign="center">
          <Card>
          <CardActionArea onClick={ () => openDialogModify(product) }>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                Precio {product.price}$
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha de creacion {product.creationDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha de actualizacion {product.updateDate}
              </Typography>
            </CardContent>
          </CardActionArea>
          </Card>
        </Grid>
        ))
        }
      </Grid>
      {openModify &&
      <DialogModifyPrice open={openModify} setOpen={setOpenModify} product={detailsProduct} setDetailsProduct={setDetailsProduct} products={products} setProducts={setProducts}/>
      }
      {openAdd &&
      <DialogAddProduct open={openAdd} setOpen={setOpenAdd} products={products} setProducts={setProducts}/>
      }
    </>
  );
}
