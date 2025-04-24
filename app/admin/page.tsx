"use client";
import {
  Box,
  CircularProgress,
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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
    [movies, searchQuery]
  );

  if (loading) return <CircularProgress />;
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Price</DialogTitle>
        <DialogContent>
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
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handlePriceUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
