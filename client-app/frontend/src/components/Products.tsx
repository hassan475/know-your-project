import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material";
import { IProduct } from "../types";

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://localhost:5001/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
        //   <Grid item xs={12} md={6} lg={4} key={product.productID}>

<Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{product.description}</Typography>
                <Typography color="text.secondary">ID: {product.productID}</Typography>
                <Typography>Price: ${product.price.toFixed(2)}</Typography>
                <Typography>Weight: {product.weight} kg</Typography>
                <Typography variant="body2" mt={1}>
                  {product.notes}
                </Typography>
                <Stack direction="row" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      // Navigate to edit form or open modal
                      console.log("Edit", product.productID);
                    }}
                  >
                    Edit
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
