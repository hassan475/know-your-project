import React, { useEffect, useState, useMemo } from "react";
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

// Define API response shape
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

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  // Fetch initial list
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://know-your-project20250508145247.azurewebsites.net/GetProducts"
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ApiProduct[] = await res.json();
        const mapped: IProduct[] = data.map(item => ({
          productID: item.productId,
          description: item.description,
          weight: item.weight,
          price: item.price,
          notes: item.notes,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Debounce user query
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Trigger AI-search on debouncedQuery
  useEffect(() => {
    if (!debouncedQuery) {
      // reload default list when query is cleared
      (async () => {
        setLoading(true);
        try {
          const res = await fetch(
            "https://know-your-project20250508145247.azurewebsites.net/GetProducts"
          );
          if (!res.ok) throw new Error("Failed to fetch products");
          const data: ApiProduct[] = await res.json();
          const mapped: IProduct[] = data.map(item => ({
            productID: item.productId,
            description: item.description,
            weight: item.weight,
            price: item.price,
            notes: item.notes,
          }));
          setProducts(mapped);
        } catch {
          // ignore
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const aiRes = await fetch("https://know-your-project20250508145247.azurewebsites.net/api/AiSearch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: debouncedQuery }),
        });
        if (!aiRes.ok) throw new Error("AI search failed");
        const results: IProduct[] = await aiRes.json();
        setProducts(results);
      } catch (err) {
        console.error(err);
        // fallback client filter
        setProducts(prev =>
          prev.filter(p =>
            [p.productID, p.description, p.notes]
              .join(" ")
              .toLowerCase()
              .includes(debouncedQuery.toLowerCase())
          )
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQuery]);

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
          placeholder="Search products (e.g. 'Find charging mouse under $20')"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
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
        {products.map(product => {
          const productUrl = `${window.location.origin}/product/${product.productID}`;
          return (
            <Grid item xs={12} md={6} lg={4} key={product.productID}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{product.description}</Typography>
                  <Typography color="text.secondary">ID: {product.productID}</Typography>
                  <Typography>Price: ${product.price.toFixed(2)}</Typography>
                  <Typography>Weight: {product.weight} kg</Typography>
                  <Typography variant="body2" mt={1}>{product.notes}</Typography>
                  <Box sx={{ my: 2, textAlign: 'center' }}>
                    <QRCodeSVG value={productUrl} size={100} />
                  </Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Button variant="outlined" size="small" onClick={() => navigate(`/product/${product.productID}`)}>View</Button>
                    <Button variant="contained" size="small" onClick={() => navigate(`/edit-product/${product.productID}`)}>Edit</Button>
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
