import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Stack,
  Box,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { IProduct } from '../types';

// API response shape matches single record
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

const DisplayProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://know-your-project20250508145247.azurewebsites.net/GetProduct/${id}`
        );
        if (!res.ok) throw new Error('Failed to fetch product details');
        const data: ApiProduct = await res.json();
        const mapped: IProduct = {
          productID: data.productId,
          description: data.description,
          weight: data.weight,
          price: data.price,
          notes: data.notes,
        };
        setProduct(mapped);
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Product not found.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/products')}>
          Back to List
        </Button>
      </Container>
    );
  }

  const productUrl = `${window.location.origin}/product/${product.productID}`;

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={() => navigate('/products')}>
        Back to List
      </Button>

      <Card sx={{ mt: 2, p: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {product.description}
          </Typography>

          <Stack spacing={1} mb={2}>
            <Typography variant="body1"><strong>ID:</strong> {product.productID}</Typography>
            <Typography variant="body1"><strong>Price:</strong> ${product.price.toFixed(2)}</Typography>
            <Typography variant="body1"><strong>Weight:</strong> {product.weight} kg</Typography>
            <Typography variant="body1"><strong>Notes:</strong> {product.notes}</Typography>
          </Stack>

          <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
            <QRCodeSVG value={productUrl} size={150} />
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => window.open(productUrl, '_blank')}>Share</Button>
            <Button variant="outlined" onClick={() => navigate(`/edit-product/${product.productID}`)}>Edit</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DisplayProduct;
