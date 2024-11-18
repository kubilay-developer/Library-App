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
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
// Material-UI'den gerekli bileşenleri içe aktarıyoruz. Bu bileşenler kullanıcı arayüzünü oluşturmak için kullanılıyor.

import { Edit, Delete } from "@mui/icons-material";
// Düzenle ve Sil ikonlarını içe aktarıyoruz.

import axios from "axios";
// Axios'u API isteklerini gerçekleştirmek için içe aktarıyoruz.

// API base URL'ini ortam değişkenlerinden alıyoruz
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// API URL'ini ortam değişkenlerinden alıyoruz. Bu, farklı ortamlar için URL'lerin kolayca değiştirilmesini sağlar.

export default function Book() {
  // Book bileşenini tanımlıyoruz.
  const [books, setBooks] = useState([]);
  // books: Kitapların listesini tutar.
  // setBooks: Kitap listesini güncellemek için kullanılır.

  const [name, setName] = useState("");
  // name: Kitabın adı için form girdi değerini tutar.
  // setName: Kitap adını güncellemek için kullanılır.

  const [publicationYear, setPublicationYear] = useState("");
  // publicationYear: Yayın yılını tutar.
  // setPublicationYear: Yayın yılını güncellemek için kullanılır.

  const [stock, setStock] = useState("");
  // stock: Kitabın stok miktarını tutar.
  // setStock: Stok miktarını güncellemek için kullanılır.

  const [authorId, setAuthorId] = useState("");
  // authorId: Kitabın yazarının ID'sini tutar.
  // setAuthorId: Yazar ID'sini güncellemek için kullanılır.

  const [publisherId, setPublisherId] = useState("");
  // publisherId: Kitabın yayıncısının ID'sini tutar.
  // setPublisherId: Yayıncı ID'sini güncellemek için kullanılır.

  const [selectedCategories, setSelectedCategories] = useState([]);
  // selectedCategories: Kitabın kategorilerinin ID'lerini tutar.
  // setSelectedCategories: Kategori ID'lerini güncellemek için kullanılır.

  const [authors, setAuthors] = useState([]);
  // authors: Yazarlar listesini tutar.
  // setAuthors: Yazarlar listesini güncellemek için kullanılır.

  const [publishers, setPublishers] = useState([]);
  // publishers: Yayıncılar listesini tutar.
  // setPublishers: Yayıncılar listesini güncellemek için kullanılır.

  const [categories, setCategories] = useState([]);
  // categories: Kategoriler listesini tutar.
  // setCategories: Kategoriler listesini güncellemek için kullanılır.

  const [editingBook, setEditingBook] = useState(null);
  // editingBook: Düzenlenen kitabın bilgilerini tutar.
  // Bu sayede mevcut bir kitabı düzenleyip düzenlemediğimizi anlayabiliriz.

  const [errorPublicationYear, setErrorPublicationYear] = useState("");
  // errorPublicationYear: Yayın yılı ile ilgili hata mesajını tutar.
  // setErrorPublicationYear: Yayın yılı hatasını güncellemek için kullanılır.

  const [errorStock, setErrorStock] = useState("");
  // errorStock: Stok ile ilgili hata mesajını tutar.
  // setErrorStock: Stok hatasını güncellemek için kullanılır.

  const [openSnackbar, setOpenSnackbar] = useState(false);
  // openSnackbar: Snackbar'ı açıp kapatma kontrolünü tutar.

  const [snackbarMessage, setSnackbarMessage] = useState("");
  // snackbarMessage: Snackbar üzerinde gösterilecek mesajı tutar.

  useEffect(() => {
    // Bileşen yüklendiğinde tüm verileri almak için kullanılıyor.
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    // Tüm kitap, yazar, yayıncı ve kategori verilerini almak için API istekleri yapıyoruz.
    axios.get(`${API_BASE_URL}/api/v1/books`).then((response) => {
      if (Array.isArray(response.data)) {
        setBooks(response.data);
        // Kitaplar listesini güncelliyoruz.
      } else {
        console.error("Beklenen formatta veri gelmedi:", response.data);
        setBooks([]);
        // Beklenen formatta veri gelmezse boş liste atıyoruz.
      }
    });

    axios
      .get(`${API_BASE_URL}/api/v1/authors`)
      .then((response) => setAuthors(response.data));
    // Yazarları API'den alıp yazarlar listesini güncelliyoruz.

    axios
      .get(`${API_BASE_URL}/api/v1/publishers`)
      .then((response) => setPublishers(response.data));
    // Yayıncıları API'den alıp yayıncılar listesini güncelliyoruz.

    axios
      .get(`${API_BASE_URL}/api/v1/categories`)
      .then((response) => setCategories(response.data));
    // Kategorileri API'den alıp kategoriler listesini güncelliyoruz.
  };

  const handleSubmit = (e) => {
    // Form gönderildiğinde çalışır.
    e.preventDefault();
    // Formun varsayılan davranışını (sayfanın yenilenmesi) engelliyoruz.

    if (!publicationYear || isNaN(publicationYear)) {
      // Yayın yılının bir sayı olup olmadığını kontrol ediyoruz.
      setErrorPublicationYear("Yayın yılı bir sayı olmalıdır.");
      return;
    }
    if (!stock || isNaN(stock)) {
      // Stok miktarının bir sayı olup olmadığını kontrol ediyoruz.
      setErrorStock("Stok bir sayı olmalıdır.");
      return;
    }

    // Kitap verilerini topluyoruz.
    const bookData = {
      name,
      publicationYear,
      stock,
      author: { id: authorId },
      publisher: { id: publisherId },
      categories: selectedCategories.map((id) => ({ id })),
    };

    if (editingBook) {
      // Eğer düzenleme yapılıyorsa
      axios
        .put(`${API_BASE_URL}/api/v1/books/${editingBook.id}`, bookData)
        .then((response) => {
          // Güncellenen kitap bilgilerini listede güncelliyoruz.
          setBooks(
            books.map((book) =>
              book.id === editingBook.id ? response.data : book
            )
          );
          resetForm();
          fetchAllData();
          setSnackbarMessage("Kitap başarıyla güncellendi!");
          setOpenSnackbar(true);
        });
    } else {
      // Yeni kitap ekleniyorsa
      axios.post(`${API_BASE_URL}/api/v1/books`, bookData).then((response) => {
        // Yeni kitabı mevcut listeye ekliyoruz.
        setBooks([...books, response.data]);
        resetForm();
        fetchAllData();
        setSnackbarMessage("Kitap başarıyla eklendi!");
        setOpenSnackbar(true);
      });
    }
  };

  const resetForm = () => {
    // Formu sıfırlamak için kullanılır.
    setName("");
    setPublicationYear("");
    setStock("");
    setAuthorId("");
    setPublisherId("");
    setSelectedCategories([]);
    setEditingBook(null);
    setErrorPublicationYear("");
    setErrorStock("");
  };

  const handleEdit = (book) => {
    // Düzenleme işlemini başlatıyoruz.
    setEditingBook(book);
    setName(book.name);
    setPublicationYear(book.publicationYear);
    setStock(book.stock);
    setAuthorId(book.author.id);
    setPublisherId(book.publisher.id);
    setSelectedCategories(book.categories.map((category) => category.id));
    // Formu düzenlenen kitabın bilgileriyle dolduruyoruz.
  };

  const handleDelete = (id) => {
    // Kitap silme işlemi
    axios.delete(`${API_BASE_URL}/api/v1/books/${id}`).then(() => {
      setBooks(books.filter((book) => book.id !== id));
      setSnackbarMessage("Kitap başarıyla silindi!");
      setOpenSnackbar(true);
    });
  };

  const handleSnackbarClose = () => {
    // Snackbar kapatma işlemi
    setOpenSnackbar(false);
  };

  const handleCategoryChange = (event) => {
    // Kategorilerin seçimini güncellemek için kullanılır.
    setSelectedCategories(event.target.value);
  };

  return (
    <div>
      <h1>Kitaplar</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "20px 0",
          display: "flex",
          gap: "15px",
          flexDirection: "column",
        }}
      >
        {/* Kitap ekleme/düzenleme formu */}
        <TextField
          label="Kitap İsmi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Yayın Yılı"
          value={publicationYear}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value)) {
              setErrorPublicationYear("");
              setPublicationYear(value);
            } else {
              setErrorPublicationYear("Yayın yılı bir sayı olmalıdır.");
            }
          }}
          error={!!errorPublicationYear}
          helperText={errorPublicationYear}
          required
        />
        <TextField
          label="Stok"
          value={stock}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value)) {
              setErrorStock("");
              setStock(value);
            } else {
              setErrorStock("Stok bir sayı olmalıdır.");
            }
          }}
          error={!!errorStock}
          helperText={errorStock}
          required
        />

        <FormControl>
          <InputLabel id="author-select-label">Yazar</InputLabel>
          <Select
            labelId="author-select-label"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="publisher-select-label">Yayıncı</InputLabel>
          <Select
            labelId="publisher-select-label"
            value={publisherId}
            onChange={(e) => setPublisherId(e.target.value)}
            required
          >
            {publishers.map((publisher) => (
              <MenuItem key={publisher.id} value={publisher.id}>
                {publisher.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="category-select-label">Kategoriler</InputLabel>
          <Select
            labelId="category-select-label"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            renderValue={(selected) =>
              selected
                .map(
                  (id) =>
                    categories.find((category) => category.id === id)?.name
                )
                .join(", ")
            }
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Checkbox
                  checked={selectedCategories.indexOf(category.id) > -1}
                />
                <ListItemText primary={category.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          {editingBook ? "Güncelle" : "Ekle"}
          {/* Eğer düzenleme yapılıyorsa "Güncelle", yoksa "Ekle" yazısı gösteriliyor */}
        </Button>
      </form>

      <TableContainer component={Paper}>
        {/* Kitapların listelendiği tablo */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Yayın Yılı</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell>Yazar</TableCell>
              <TableCell>Yayıncı</TableCell>
              <TableCell>Kategoriler</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(books) &&
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.publicationYear}</TableCell>
                  <TableCell>{book.stock}</TableCell>
                  <TableCell>{book.author.name}</TableCell>
                  <TableCell>{book.publisher.name}</TableCell>
                  <TableCell>
                    {book.categories
                      .map((category) => category.name)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(book)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(book.id)}>
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
