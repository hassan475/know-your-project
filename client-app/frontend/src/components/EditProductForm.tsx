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

// API response shape for a single product
interface ApiProduct {
  partitionKey: string;
  rowKey: string;
  timestamp: string;
  productId: string;
  description: string;
  weight: number;
  price: number;
  notes: string;
  eTag: string;
}

const EditProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Fetch product details from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://know-your-project20250508145247.azurewebsites.net/GetProduct/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch product details");
        const data: ApiProduct = await res.json();
        setProduct({
          productID: data.productId,
          description: data.description,
          weight: data.weight,
          price: data.price,
          notes: data.notes,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Product not found.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/products")}>Back to List</Button>
      </Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => prev && ({
      ...prev,
      [name]: name === "weight" || name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `https://know-your-project20250508145247.azurewebsites.net/UpdateProduct/${product.productID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );
      if (!res.ok) throw new Error("Failed to update product");
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>Edit Product</Typography>
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
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving..." : "Update"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditProductForm;
