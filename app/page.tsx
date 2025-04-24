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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useEffect, useState, useMemo } from "react";
import { filterMovies, getNotFoundText } from "./utils/filterMovies";
import useMovies from "./hooks/useMovies";
import type { Movie } from "./types.ts";
const NotFoundImage = "https://placehold.co/600x400?text=Image+Not+Found";

export default function Home() {
  const { movies, loading, error } = useMovies();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Migrate old format (movie objects) to new format (IDs)
          return parsed.length && typeof parsed[0] === "object"
            ? parsed.map((m: Movie) => m.id)
            : parsed;
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCheckoutDialogOpen && countdown > 0) {
      const id = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      setTimerId(id);

      return () => {
        if (id) clearInterval(id);
      };
    }
  }, [isCheckoutDialogOpen]);

  useEffect(() => {
    if (countdown === 0 && timerId) {
      clearInterval(timerId);
    }
  }, [countdown, timerId]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (movie: Movie) => {
    setCart((prev) => [...new Set([...prev, movie.id])]); // Prevent duplicates
  };

  const removeFromCart = (movieId: number) => {
    setCart((prev) => prev.filter((id) => id !== movieId));
  };

  const clearCart = () => {
    setCart([]);
    setCartOpen(false);
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

  const filteredMovies = useMemo(
    () => filterMovies(movies, searchQuery),
    [movies, searchQuery],
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const calculateTotal = (cartIds: number[]) => {
    const cartMovies = cartIds
      .map((id) => movies.find((m) => m.id === id))
      .filter(Boolean) as Movie[];
    const subtotal = cartMovies.reduce((sum, movie) => sum + movie.price, 0);
    const itemCount = cartMovies.length;

    let discount = 0;
    if (itemCount > 5) discount = 0.2;
    else if (itemCount > 3) discount = 0.1;

    return subtotal * (1 - discount);
  };

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
        {filteredMovies.map((movie: Movie) => (
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
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Price: ${movie.price.toFixed(2)}
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
                  const isInCart = cart.includes(movie.id);
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

      {filteredMovies.length === 0 && (
        <Typography
          variant="h5"
          align="center"
          sx={{ p: 4, color: "text.secondary" }}
        >
          {getNotFoundText(searchQuery)}
        </Typography>
      )}

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
                {cart.map((movieId) => {
                  const movie = movies.find((m) => m.id === movieId);
                  if (!movie) return null; // Handle case where movie was removed
                  return (
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
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Released: {movie.release_date}
                            </Typography>
                            <br />
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Price: ${movie.price.toFixed(2)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                pb: 4,
                gap: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ textAlign: "right", mb: 2 }}>
                <Stack spacing={0.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Items:</Typography>
                    <Typography variant="body2">{cart.length}</Typography>
                  </Box>
                  {cart.length > 3 && (
                    <>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2">
                          $
                          {cart
                            .map(
                              (id) =>
                                movies.find((m) => m.id === id)?.price || 0,
                            )
                            .reduce((sum, price) => sum + price, 0)
                            .toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Discount:</Typography>
                        <Typography variant="body2" color="green">
                          {cart.length > 5 ? "20%" : "10%"}
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">
                      ${calculateTotal(cart).toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
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
                  onClick={() => {
                    setIsCheckoutDialogOpen(true);
                    setCountdown(60);
                  }}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Drawer>

      <Dialog
        open={isCheckoutDialogOpen}
        onClose={() => setIsCheckoutDialogOpen(false)}
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Confirm Checkout
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setIsCheckoutDialogOpen(false)}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <Stack spacing={0.5}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Items:</Typography>
              <Typography variant="body2">{cart.length}</Typography>
            </Box>
            {cart.length > 3 && (
              <>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">
                    $
                    {cart
                      .map((id) => movies.find((m) => m.id === id)?.price || 0)
                      .reduce((sum, price) => sum + price, 0)
                      .toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Discount:</Typography>
                  <Typography variant="body2" color="green">
                    {cart.length > 5 ? "20%" : "10%"}
                  </Typography>
                </Box>
              </>
            )}
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">
                ${calculateTotal(cart).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Confirm within {countdown} seconds
            </Typography>
            <Typography variant="caption" display="block">
              (Payment will be processed automatically)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setIsCheckoutDialogOpen(false);
              if (timerId) clearInterval(timerId);
              setCountdown(60);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setIsCheckoutDialogOpen(false);
              clearCart();
            }}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
