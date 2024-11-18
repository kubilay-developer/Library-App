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
  Snackbar,
  Alert,
} from "@mui/material";
// Material-UI'den çeşitli bileşenleri içe aktarıyoruz. Bu bileşenler kullanıcı arayüzünü oluşturmak için kullanılıyor.

import { Edit, Delete } from "@mui/icons-material";
// Düzenle ve Sil ikonlarını içe aktarıyoruz.

import axios from "axios";
// Axios'u API isteklerini gerçekleştirmek için içe aktarıyoruz.

import Navbar from "../Navbar"; // Doğru yolu kontrol edin
// Navbar bileşenini içe aktarıyoruz (bu bileşenin doğru yolunu kontrol edin).

// API base URL'ini ortam değişkenlerinden alıyoruz
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// API URL'ini ortam değişkenlerinden alıyoruz. Bu, yerel geliştirme ve üretim ortamında farklı URL'ler kullanabilmemizi sağlar.

export default function Author() {
  // Author bileşenini tanımlıyoruz.
  const [authors, setAuthors] = useState([]);
  // authors: Yazarlar listesini tutar.
  // setAuthors: Yazarlar listesini güncellemek için kullanılır.

  const [name, setName] = useState("");
  // name: Yazarın adı için form girdi değerini tutar.
  // setName: Yazar adını güncellemek için kullanılır.

  const [birthDate, setBirthDate] = useState("");
  // birthDate: Yazarın doğum tarihini tutar.
  // setBirthDate: Doğum tarihini güncellemek için kullanılır.

  const [country, setCountry] = useState("");
  // country: Yazarın ülkesini tutar.
  // setCountry: Ülkeyi güncellemek için kullanılır.

  const [editingAuthor, setEditingAuthor] = useState(null);
  // editingAuthor: Düzenlenen yazarın bilgilerini tutar.
  // Bu sayede mevcut bir yazarı düzenleyip düzenlemediğimizi anlayabiliriz.

  const [openSnackbar, setOpenSnackbar] = useState(false);
  // openSnackbar: Snackbar'ı açıp kapatma kontrolünü tutar.

  const [snackbarMessage, setSnackbarMessage] = useState("");
  // snackbarMessage: Snackbar üzerinde gösterilecek mesajı tutar.

  useEffect(() => {
    // Bileşen yüklendiğinde yazarları API'den almak için kullanılıyor.
    axios
      .get(`${API_BASE_URL}/api/v1/authors`)
      .then((response) => {
        // API isteği başarılı olursa yazarlar verisi alınır.
        if (Array.isArray(response.data)) {
          setAuthors(response.data);
          // Yazarlar listesini güncelliyoruz.
        } else {
          console.error("Beklenen formatta veri gelmedi:", response.data);
          setAuthors([]);
          // Beklenen formatta veri gelmezse boş liste atıyoruz.
        }
      })
      .catch((error) => {
        console.error("API'den veri alınırken hata oluştu:", error);
        setAuthors([]);
        // Veri alınırken hata oluşursa konsola hata mesajı basıyoruz ve listeyi boşaltıyoruz.
      });
  }, []);
  // [] bağımlılık dizisi sayesinde bu kod yalnızca bileşen yüklendiğinde bir kez çalışır.

  const handleSubmit = (e) => {
    e.preventDefault();
    // Formun varsayılan davranışını (sayfanın yenilenmesi) engelliyoruz.

    if (editingAuthor) {
      // Eğer düzenleme yapılıyorsa
      axios
        .put(`${API_BASE_URL}/api/v1/authors/${editingAuthor.id}`, {
          name,
          birthDate,
          country,
        })
        .then((response) => {
          // Yazar güncellenirse
          setAuthors(
            authors.map((author) =>
              author.id === editingAuthor.id ? response.data : author
            )
          );
          // Güncellenen yazarı yazarlar listesinde güncelliyoruz.

          setEditingAuthor(null);
          // Düzenleme modundan çıkıyoruz.

          setName("");
          setBirthDate("");
          setCountry("");
          // Formu temizliyoruz.

          setSnackbarMessage("Yazar başarıyla güncellendi!");
          setOpenSnackbar(true);
          // Snackbar ile başarı mesajı gösteriyoruz.
        })
        .catch((error) => {
          console.error("Yazar güncellenirken hata oluştu:", error);
        });
    } else {
      // Yeni yazar ekleniyorsa
      axios
        .post(`${API_BASE_URL}/api/v1/authors`, { name, birthDate, country })
        .then((response) => {
          setAuthors([...authors, response.data]);
          // Yeni yazarı mevcut listeye ekliyoruz.

          setName("");
          setBirthDate("");
          setCountry("");
          // Formu temizliyoruz.

          setSnackbarMessage("Yazar başarıyla eklendi!");
          setOpenSnackbar(true);
          // Snackbar ile başarı mesajı gösteriyoruz.
        })
        .catch((error) => {
          console.error("Yazar eklenirken hata oluştu:", error);
        });
    }
  };

  const handleEdit = (author) => {
    // Düzenleme işlemini başlatıyoruz.
    setEditingAuthor(author);
    // Düzenlenecek yazarı belirliyoruz.

    setName(author.name);
    setBirthDate(author.birthDate);
    setCountry(author.country);
    // Formu seçilen yazarın bilgileriyle dolduruyoruz.
  };

  const handleDelete = (id) => {
    // Yazar silme işlemi
    axios
      .delete(`${API_BASE_URL}/api/v1/authors/${id}`)
      .then(() => {
        setAuthors(authors.filter((author) => author.id !== id));
        // Silinen yazarı listeden çıkarıyoruz.

        setSnackbarMessage("Yazar başarıyla silindi!");
        setOpenSnackbar(true);
        // Snackbar ile silme işleminin başarılı olduğunu gösteriyoruz.
      })
      .catch((error) => {
        console.error("Yazar silinirken hata oluştu:", error);
      });
  };

  const handleSnackbarClose = () => {
    // Snackbar kapatma işlemi
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1>Yazarlar</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "20px 0",
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        {/* Yazar ekleme/düzenleme formu */}
        <TextField
          label="İsim"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Doğum Tarihi"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Ülke"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {editingAuthor ? "Güncelle" : "Ekle"}
          {/* Eğer bir yazar düzenleniyorsa "Güncelle", yoksa "Ekle" yazısı gösteriliyor */}
        </Button>
      </form>

      <TableContainer component={Paper}>
        {/* Yazarların listelendiği tablo */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Doğum Tarihi</TableCell>
              <TableCell>Ülke</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(authors) &&
              authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>{author.birthDate}</TableCell>
                  <TableCell>{author.country}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(author)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(author.id)}>
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
