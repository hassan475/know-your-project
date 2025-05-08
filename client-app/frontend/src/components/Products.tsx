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
import { QRCodeSVG } from "qrcode.react";
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

  // Handles user search and AI-powered search fallback
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (!q) {
      // if empty query, reload base products
      setLoading(true);
      await new Promise((r) => setTimeout(r, 300));
      setSearchQuery("");
      setLoading(false);
      return;
    }

    // Call AI search endpoint
    try {
      setLoading(true);
      const aiRes = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const aiResults: IProduct[] = await aiRes.json();
      setProducts(aiResults);
    } catch (err) {
      console.error("AI search failed, falling back to client filter", err);
      // fallback client filter
      // no change to products array here
    } finally {
      setLoading(false);
    }
  };

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
          placeholder="Search products (e.g. Find charging mouse under )"
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

      <Grid container spacing={3}>
        {products.map((product) => {
          const productUrl = `${window.location.origin}/product/${product.productID}`;
          return (
            <Grid item xs={12} md={6} lg={4} key={product.productID}>
              <Card elevation={3} sx={{ position: "relative" }}>
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
                  <Box
                    sx={{ my: 2, display: "flex", justifyContent: "center" }}
                  >
                    <QRCodeSVG value={productUrl} size={100} />
                  </Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/product/${product.productID}`)}
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
    </Container>
  );
};

export default Products;
