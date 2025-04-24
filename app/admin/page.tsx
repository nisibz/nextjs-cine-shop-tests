"use client";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useState, useMemo } from "react";
import { filterMovies, getNotFoundText } from "../utils/filterMovies";
import useMovies from "./../hooks/useMovies";
import type { Movie } from "./../types";

export default function AdminPage() {
  const { movies, loading, error, updateMoviePrice } = useMovies();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePriceUpdate = () => {
    if (selectedMovie) {
      updateMoviePrice(selectedMovie.id, Number(newPrice));
      setOpenDialog(false);
    }
  };

  const filteredMovies = useMemo(
    () => filterMovies(movies, searchQuery),
    [movies, searchQuery],
  );

  if (loading) {
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          <Skeleton width={300} />
        </Typography>

        <Skeleton variant="rounded" height={56} sx={{ my: 2 }} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Poster", "Title", "Release Date", "Price", "Edit Price"].map(
                  (header) => (
                    <TableCell key={header}>
                      <Skeleton
                        variant="text"
                        width={header === "Poster" ? 50 : "auto"}
                      />
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="rectangular" width={50} height={75} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" width={100} height={36} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Movie Inventory
      </Typography>

      <TextField
        fullWidth
        label="Search movies"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ my: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Poster</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Edit Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMovies.map((movie: Movie) => (
              <TableRow key={movie.id}>
                <TableCell>
                  {movie.poster_path && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      width={50}
                      height={75}
                      style={{
                        width: 50,
                        height: 75,
                        objectFit: "cover",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{movie.title}</TableCell>
                <TableCell>
                  {new Date(movie.release_date).toLocaleDateString()}
                </TableCell>
                <TableCell>${movie.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setNewPrice(movie.price.toFixed(2));
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredMovies.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    {getNotFoundText(searchQuery)}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Edit Price
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpenDialog(false)}
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
          <DialogContentText>
            Update price for {selectedMovie?.title}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Price"
            type="number"
            fullWidth
            variant="standard"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handlePriceUpdate}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
