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
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from 'qrcode.react';
import { IProduct } from "../types";

// Define the API response shape
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

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://know-your-project20250508145247.azurewebsites.net/GetProducts"
        );
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: ApiProduct[] = await res.json();
        // Map API fields to our IProduct type
        const mapped: IProduct[] = data.map((item) => ({
          productID: item.productId,
          description: item.description,
          weight: item.weight,
          price: item.price,
          notes: item.notes,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: call AI-powered search endpoint here
  };

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.productID.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.notes.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" mb={3} spacing={2} alignItems="center">
        <TextField
          fullWidth
          placeholder="Search products (e.g. RGB keyboard or charging mouse)"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {filtered.length === 0 ? (
        <Typography>No products match “{searchQuery}.”</Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((product) => {
            const productUrl = `${window.location.origin}/product/${product.productID}`;
            return (
              <Grid item xs={12} md={6} lg={4} key={product.productID}>
                <Card elevation={3} sx={{ position: 'relative' }}>
                  <CardContent>
                    <Typography variant="h6">
                      {product.description}
                    </Typography>
                    <Typography color="text.secondary">
                      ID: {product.productID}
                    </Typography>
                    <Typography>
                      Price: ${product.price.toFixed(2)}
                    </Typography>
                    <Typography>
                      Weight: {product.weight} kg
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {product.notes}
                    </Typography>
                    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                      <QRCodeSVG value={productUrl} size={100} />
                    </Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.open(productUrl, '_blank')}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(`/edit-product/${product.productID}`)
                        }
                      >
                        Edit
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Products;
