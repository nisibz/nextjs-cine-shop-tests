"use client";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Typography,
  Button,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useEffect, useState } from "react";
import useMovies from "./hooks/useMovies";
import type { Movie } from "./types.ts";
const NotFoundImage = "https://placehold.co/600x400?text=Image+Not+Found";

export default function Home() {
  const { movies, loading, error } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Movie[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (movie: Movie) => {
    if (!cart.some((item) => item.id === movie.id)) {
      setCart([...cart, movie]);
    }
  };

  const removeFromCart = (movieId: number) => {
    setCart(cart.filter((item) => item.id !== movieId));
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    }
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ p: 4, pb: 0 }}>
        <Stack direction="row" spacing={2}>
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            <TextField
              fullWidth
              label="Search movies"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex" }}>
            <IconButton onClick={() => setCartOpen(true)}>
              <Badge badgeContent={cart.length} color="primary">
                <AddShoppingCartIcon fontSize="large" />
              </Badge>
            </IconButton>
          </Box>
        </Stack>
      </Box>
      <Grid container spacing={2} sx={{ padding: 4 }}>
        {movies
          .filter((movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map((movie: Movie) => (
            <Grid key={movie.id} size={{ xs: 12, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : NotFoundImage
                  }
                  alt={movie.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {movie.release_date}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {movie.overview.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <Box sx={{ m: 2 }}>
                  {(() => {
                    const isInCart = cart.some((item) => item.id === movie.id);
                    return (
                      <Button
                        variant={isInCart ? "outlined" : "contained"}
                        color={isInCart ? "success" : "primary"}
                        fullWidth
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => addToCart(movie)}
                        disabled={isInCart}
                      >
                        {isInCart ? "Added to Cart" : "Add to Cart"}
                      </Button>
                    );
                  })()}
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            display: "flex",
            flexDirection: "column",
            width: 350,
            padding: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Shopping Cart</Typography>
          <IconButton onClick={() => setCartOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {cart.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2 }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                overflowY: "auto",
                flex: 1,
                padding: 2,
              }}
            >
              <List>
                {cart.map((movie) => (
                  <ListItem
                    key={movie.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => removeFromCart(movie.id)}
                      >
                        <RemoveShoppingCartIcon color="error" />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        sx={{ width: 56, height: 84, mr: 2 }} // Matches typical poster aspect ratio
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={movie.title}
                      secondary={`Released: ${movie.release_date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                p: 2,
                pb: 4,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => alert("Proceeding to checkout...")}
              >
                Checkout
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </Box>
  );
}
