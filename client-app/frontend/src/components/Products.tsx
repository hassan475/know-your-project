import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
  Stack,
  Grid,
} from "@mui/material";
import { IProduct } from "../types";
import { useNavigate } from "react-router-dom";

const dummyProducts: IProduct[] = [
  {
    productID: "P001",
    description: "Wireless Mouse",
    weight: 0.2,
    price: 19.99,
    notes: "Ergonomic design, USB-C charging",
  },
  {
    productID: "P002",
    description: "Mechanical Keyboard",
    weight: 1.0,
    price: 89.99,
    notes: "RGB backlight, blue switches",
  },
  {
    productID: "P003",
    description: "HD Webcam",
    weight: 0.3,
    price: 49.99,
    notes: "1080p resolution, built-in mic",
  },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();    // ← pull navigate from react-router

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulate delay and set dummy data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProducts(dummyProducts);
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
          <Grid item xs={12} md={6} lg={4} key={product.productID}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{product.description}</Typography>
                <Typography color="text.secondary">
                  ID: {product.productID}
                </Typography>
                <Typography>Price: ${product.price.toFixed(2)}</Typography>
                <Typography>Weight: {product.weight} kg</Typography>
                <Typography variant="body2" mt={1}>
                  {product.notes}
                </Typography>
                <Stack direction="row" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/edit-product/${product.productID}`)}
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
