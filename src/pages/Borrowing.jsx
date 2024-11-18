import React, { useState, useEffect } from "react";
// React'ten gerekli hook'ları (useState, useEffect) içe aktarıyoruz.

import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
// Material-UI'den gerekli bileşenleri içe aktarıyoruz. Bu bileşenler kullanıcı arayüzünü oluşturmak için kullanılıyor.

import { Edit, Delete } from "@mui/icons-material";
// Düzenle ve Sil ikonlarını içe aktarıyoruz.

import axios from "axios";
// Axios'u API isteklerini gerçekleştirmek için içe aktarıyoruz.

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// API URL'ini ortam değişkenlerinden alıyoruz. Bu, farklı ortamlar için URL'lerin kolayca değiştirilmesini sağlar.

export default function Borrowing() {
  // Borrowing bileşenini tanımlıyoruz.
  const [borrowings, setBorrowings] = useState([]);
  // borrowings: Ödünç alınan kitapların listesini tutar.
  // setBorrowings: Ödünç alınan kitapların listesini güncellemek için kullanılır.

  const [borrowerName, setBorrowerName] = useState("");
  // borrowerName: Ödünç alan kişinin adını tutar.
  // setBorrowerName: Kişi adını güncellemek için kullanılır.

  const [borrowerMail, setBorrowerMail] = useState("");
  // borrowerMail: Ödünç alan kişinin e-posta adresini tutar.
  // setBorrowerMail: E-posta adresini güncellemek için kullanılır.

  const [borrowingDate, setBorrowingDate] = useState("");
  // borrowingDate: Ödünç alma tarihini tutar.
  // setBorrowingDate: Ödünç alma tarihini güncellemek için kullanılır.

  const [returnDate, setReturnDate] = useState("");
  // returnDate: İade tarihini tutar.
  // setReturnDate: İade tarihini güncellemek için kullanılır.

  const [bookId, setBookId] = useState("");
  // bookId: Ödünç alınan kitabın ID'sini tutar.
  // setBookId: Kitap ID'sini güncellemek için kullanılır.

  const [books, setBooks] = useState([]);
  // books: Kitapların listesini tutar.
  // setBooks: Kitap listesini güncellemek için kullanılır.

  const [editingBorrowing, setEditingBorrowing] = useState(null);
  // editingBorrowing: Düzenlenen ödünç alma işlemini tutar.
  // Bu sayede mevcut bir ödünç alma kaydını düzenleyip düzenlemediğimizi anlarız.

  const [openSnackbar, setOpenSnackbar] = useState(false);
  // openSnackbar: Snackbar'ı açıp kapatma kontrolünü tutar.

  const [snackbarMessage, setSnackbarMessage] = useState("");
  // snackbarMessage: Snackbar üzerinde gösterilecek mesajı tutar.

  useEffect(() => {
    // Bileşen yüklendiğinde ödünç alma ve kitap verilerini alıyoruz.
    fetchBorrowings();
    fetchBooks();
  }, []);

  const fetchBorrowings = async () => {
    // Ödünç alınan kitapların verilerini API'den almak için kullanılır.
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/borrows`);
      setBorrowings(response.data);
    } catch (error) {
      console.error("Borrowings verisi çekilemedi:", error);
    }
  };

  const fetchBooks = async () => {
    // Kitap verilerini API'den almak için kullanılır.
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/books`);
      setBooks(response.data);
    } catch (error) {
      console.error("Kitaplar çekilemedi:", error);
    }
  };

  const handleSubmit = async (e) => {
    // Form gönderildiğinde çalışır.
    e.preventDefault();
    // Formun varsayılan davranışını (sayfanın yenilenmesi) engelliyoruz.

    const selectedBook = books.find((book) => book.id === bookId);
    // Seçilen kitabı buluyoruz.

    const borrowingData = {
      borrowerName,
      borrowerMail,
      borrowingDate,
      bookForBorrowingRequest: {
        id: selectedBook.id,
        name: selectedBook.name,
        publicationYear: selectedBook.publicationYear,
        stock: selectedBook.stock,
      },
      ...(editingBorrowing && { returnDate }),
      // Eğer düzenleme yapılıyorsa, iade tarihini de ekliyoruz.
    };

    try {
      if (editingBorrowing) {
        // Eğer düzenleme yapılıyorsa
        await axios.put(
          `${API_BASE_URL}/api/v1/borrows/${editingBorrowing.id}`,
          borrowingData
        );
        fetchBorrowings();
        setSnackbarMessage("Ödünç alma işlemi başarıyla güncellendi!");
      } else {
        // Yeni ödünç alma işlemi ekleniyorsa
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/borrows`,
          borrowingData
        );
        setBorrowings([...borrowings, response.data]);
        setSnackbarMessage("Ödünç alma işlemi başarıyla eklendi!");
      }
      resetForm();
      setOpenSnackbar(true); // İşlem sonrası Snackbar açılıyor
    } catch (error) {
      console.error("Borrowing kaydedilemedi:", error);
    }
  };

  const resetForm = () => {
    // Formu sıfırlamak için kullanılır.
    setBorrowerName("");
    setBorrowerMail("");
    setBorrowingDate("");
    setReturnDate("");
    setBookId("");
    setEditingBorrowing(null);
  };

  const handleEdit = (borrowing) => {
    // Düzenleme işlemini başlatıyoruz.
    setEditingBorrowing(borrowing);
    setBorrowerName(borrowing.borrowerName || "");
    setBorrowerMail(borrowing.borrowerMail || "");
    setBorrowingDate(borrowing.borrowingDate || "");
    setReturnDate(borrowing.returnDate || "");
    setBookId(borrowing.book?.id || "");
    // Formu düzenlenen ödünç alma kaydının bilgileriyle dolduruyoruz.
  };

  const handleDelete = async (id) => {
    // Ödünç alma kaydını silmek için kullanılır.
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/borrows/${id}`);
      setBorrowings(borrowings.filter((borrowing) => borrowing.id !== id));
      setSnackbarMessage("Ödünç alma işlemi başarıyla silindi!");
      setOpenSnackbar(true); // Silme işlemi sonrası Snackbar açılıyor
    } catch (error) {
      console.error("Borrowing silinemedi:", error);
    }
  };

  const handleSnackbarClose = () => {
    // Snackbar kapatma işlemi
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1>Kitap Alma</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ödünç Alan Kişinin Adı"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ödünç Alan Kişinin E-Posta Adresi"
              value={borrowerMail}
              onChange={(e) => setBorrowerMail(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ödünç Alma Tarihi"
              type="date"
              value={borrowingDate}
              onChange={(e) => setBorrowingDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          {editingBorrowing && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="İade Tarihi"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Kitap Bilgisi</InputLabel>
              <Select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                required
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editingBorrowing ? "Güncelle" : "Kaydet"}
              {/* Eğer düzenleme yapılıyorsa "Güncelle", yoksa "Kaydet" yazısı gösteriliyor */}
            </Button>
          </Grid>
        </Grid>
      </form>

      <h3>Kitap Alan Kişi Bilgileri</h3>
      <TableContainer component={Paper}>
        {/* Ödünç alan kişilerin bilgilerini listeliyoruz */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Adı</TableCell>
              <TableCell>E-Posta</TableCell>
              <TableCell>Kitap Adı</TableCell>
              <TableCell>Alım Tarihi</TableCell>
              <TableCell>İade Tarihi</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowings.map((borrowing) => (
              <TableRow key={borrowing.id}>
                <TableCell>{borrowing.borrowerName}</TableCell>
                <TableCell>{borrowing.borrowerMail}</TableCell>
                <TableCell>{borrowing.book.name}</TableCell>
                <TableCell>{borrowing.borrowingDate}</TableCell>
                <TableCell>{borrowing.returnDate || "N/A"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(borrowing)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(borrowing.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar Bileşeni */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
