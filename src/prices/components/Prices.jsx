import { useState, useEffect } from 'react';
import { CardActionArea, Card, CardContent, Grid, Typography, Button, Box } from '@mui/material';
import DialogModifyPrice from './DialogModifyPrice';
import DialogAddProduct from './DialogAddProduct';

// ----------------------------------------------------------------------

const productosData = [{id: 1, nombre: 'Perro caliente', precio: 5, fechaCreacion: '10/01/2024', fechaEdicion: '20/01/2024'},
                      {id: 2, nombre: 'Refresco', precio: 2, fechaCreacion: '10/01/2024', fechaEdicion: '20/01/2024'},
                      {id: 3, nombre: 'Perro vegano', precio: 3, fechaCreacion: '10/01/2024', fechaEdicion: '20/01/2024'},
                      {id: 4, nombre: 'Perro Doble', precio: 6, fechaCreacion: '10/01/2024', fechaEdicion: '20/01/2024'},
                      {id: 5, nombre: 'Papas', precio: 4, fechaCreacion: '10/01/2024', fechaEdicion: '20/01/2024'},
                      {id: 6, nombre: 'Agua', precio: 3, fechaCreacion: '10/01/2024', fechaEdicion: '20/01/2024'}]

export default function Prices() {

  // states

  const [products, setProductos] = useState([]);

  const [detailsProduct, setDetailsProduct] = useState({});

  const [openModify, setOpenModify] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  const openDialogModify = (producto) => { 
    setDetailsProduct(producto);
    setOpenModify(!openModify);
  }

  const openDialogAdd = () => {
    setOpenAdd(!openAdd);
  }

  useEffect(() => {
    setProductos(productosData);
  },[]);

  return (
    <>
      <Box align="right" mb={2}>
        <Button onClick={openDialogAdd} >Agregar producto</Button>
      </Box>
      <Grid container spacing={2}>
        {products && products.map((producto) => (
        <Grid key={producto.id} item xs={4} justifyContent="center" textAlign="center">
          <Card>
          <CardActionArea onClick={ () => openDialogModify(producto) }>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {producto.nombre}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                Precio {producto.precio}$
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha de creacion {producto.fechaCreacion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha de actualizacion {producto.fechaEdicion}
              </Typography>
            </CardContent>
          </CardActionArea>
          </Card>
        </Grid>
        ))
        }
      </Grid>
      <DialogModifyPrice open={openModify} setOpen={setOpenModify} product={detailsProduct} setDetailsProduct={setDetailsProduct} products={products} setProductos={setProductos}/>
      <DialogAddProduct open={openAdd} setOpen={setOpenAdd} products={products} setProductos={setProductos}/>
    </>
  );
}
