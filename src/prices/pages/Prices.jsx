import { useState } from 'react';
import useProducts from "../../commons/hooks/useProducts";
import { CardActionArea, Card, CardContent, Grid, Typography, Button, Box } from '@mui/material';
import { DialogModifyPrice, DialogAddProduct } from '../components';

export default function Prices() {

  const { products, categories, addProduct, modifyProduct } = useProducts();

  const [detailsProduct, setDetailsProduct] = useState({});
  
  const [detailsCategory, setDetailsCategory] = useState({});

  const [openModify, setOpenModify] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

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

  return (
    <>
      <Box align="right" mb={2}>
        <Button onClick={openDialogAdd} >Agregar producto</Button>
      </Box>
      <Grid container spacing={2}>
        {products && products.map((category) => (
          category.product.map((product)=>(
          <Grid key={product.id} item xs={4} justifyContent="center" textAlign="center">
            <Card>
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
        ))
        }
      </Grid>
      {openModify &&
      <DialogModifyPrice open={openModify} setOpen={setOpenModify} category={detailsCategory} product={detailsProduct} setDetailsNull={setDetailsNull} products={products} modifyProduct={modifyProduct} categories={categories}/>
      }
      {openAdd &&
      <DialogAddProduct open={openAdd} setOpen={setOpenAdd} addProduct={addProduct} categories={categories}/>
      }
    </>
  );
}
