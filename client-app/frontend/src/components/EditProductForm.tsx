import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Stack,
} from "@mui/material";
import { IProduct } from "../types";

// Dummy data for editing before API is ready
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

const EditProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate fetching existing product details using dummy data
  useEffect(() => {
    const fetchProduct = async () => {
      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const found = dummyProducts.find((p) => p.productID === id);
      if (found) {
        setProduct(found);
      } else {
        console.warn("Product not found in dummy data");
        setProduct({ productID: id || "", description: "", weight: 0, price: 0, notes: "" });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) =>
      prev && {
        ...prev,
        [name]: name === "weight" || name === "price" ? parseFloat(value) : value,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log updated product
    console.log("Updated product (dummy):", product);
    alert("Product updated locally (dummy data)");
    navigate("/products");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Edit Product (Dummy)
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product ID"
                  name="productID"
                  value={product.productID}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={product.weight}
                  onChange={handleChange}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Price ($)"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleChange}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  multiline
                  rows={4}
                  value={product.notes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button variant="outlined" onClick={() => navigate("/products")}>Cancel</Button>
              <Button type="submit" variant="contained">
                Update
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditProductForm;
