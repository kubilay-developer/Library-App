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

// API base URL'ini ortam değişkenlerinden alıyoruz
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// API URL'ini ortam değişkenlerinden alıyoruz. Bu, farklı ortamlar için URL'lerin kolayca değiştirilmesini sağlar.

export default function Publisher() {
  // Publisher bileşenini tanımlıyoruz.
  const [publishers, setPublishers] = useState([]);
  // publishers: Yayıncıların listesini tutar.
  // setPublishers: Yayıncı listesini güncellemek için kullanılır.

  const [name, setName] = useState("");
  // name: Yayıncının adı için form girdi değerini tutar.
  // setName: Yayıncı adını güncellemek için kullanılır.

  const [establishmentYear, setEstablishmentYear] = useState("");
  // establishmentYear: Yayıncının kuruluş yılını tutar.
  // setEstablishmentYear: Kuruluş yılını güncellemek için kullanılır.

  const [address, setAddress] = useState("");
  // address: Yayıncının adresini tutar.
  // setAddress: Adresi güncellemek için kullanılır.

  const [editingPublisher, setEditingPublisher] = useState(null);
  // editingPublisher: Düzenlenen yayıncının bilgilerini tutar.
  // Bu sayede mevcut bir yayıncıyı düzenleyip düzenlemediğimizi anlayabiliriz.

  const [error, setError] = useState("");
  // error: Kuruluş yılı ile ilgili hataları tutar.
  // setError: Hata mesajını güncellemek için kullanılır.

  const [openSnackbar, setOpenSnackbar] = useState(false);
  // openSnackbar: Snackbar'ı açıp kapatma kontrolünü tutar.

  const [snackbarMessage, setSnackbarMessage] = useState("");
  // snackbarMessage: Snackbar üzerinde gösterilecek mesajı tutar.

  useEffect(() => {
    // Bileşen yüklendiğinde yayıncıları API'den almak için kullanılıyor.
    axios
      .get(`${API_BASE_URL}/api/v1/publishers`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPublishers(response.data);
          // Yayıncılar listesini güncelliyoruz.
        } else {
          console.error("Beklenen formatta veri gelmedi:", response.data);
          setPublishers([]);
          // Beklenen formatta veri gelmezse boş liste atıyoruz.
        }
      })
      .catch((error) => {
        console.error("API'den veri alınırken hata oluştu:", error);
        setPublishers([]);
        // Veri alınırken hata oluşursa konsola hata mesajı basıyoruz ve listeyi boşaltıyoruz.
      });
  }, []);

  const handleSubmit = (e) => {
    // Form gönderildiğinde çalışır.
    e.preventDefault();
    // Formun varsayılan davranışını (sayfanın yenilenmesi) engelliyoruz.

    // Kuruluş yılı doğrulaması
    if (!establishmentYear || isNaN(establishmentYear)) {
      setError("Lütfen geçerli bir kuruluş yılı girin.");
      return;
    }

    setError(""); // Hata yoksa temizle

    if (editingPublisher) {
      // Eğer düzenleme yapılıyorsa
      axios
        .put(`${API_BASE_URL}/api/v1/publishers/${editingPublisher.id}`, {
          name,
          establishmentYear,
          address,
        })
        .then((response) => {
          setPublishers((prevPublishers) =>
            prevPublishers.map((publisher) =>
              publisher.id === editingPublisher.id ? response.data : publisher
            )
          );
          setSnackbarMessage("Yayıncı başarıyla güncellendi!");
          setOpenSnackbar(true); // Güncelleme sonrası Snackbar açılıyor
          resetForm();
        })
        .catch((error) => {
          setSnackbarMessage("Yayıncı güncellenemedi.");
          setOpenSnackbar(true); // Hata sonrası Snackbar açılıyor
        });
    } else {
      // Yeni yayıncı ekleme işlemi
      axios
        .post(`${API_BASE_URL}/api/v1/publishers`, {
          name,
          establishmentYear,
          address,
        })
        .then((response) => {
          setPublishers((prevPublishers) => [...prevPublishers, response.data]);
          setSnackbarMessage("Yayıncı başarıyla eklendi!");
          setOpenSnackbar(true); // Ekleme sonrası Snackbar açılıyor
          resetForm();
        })
        .catch((error) => {
          setSnackbarMessage("Yayıncı eklenemedi.");
          setOpenSnackbar(true); // Hata sonrası Snackbar açılıyor
        });
    }
    
  };

  const resetForm = () => {
    // Formu sıfırlamak için kullanılır.
    setEditingPublisher(null);
    setName("");
    setEstablishmentYear("");
    setAddress("");
  };

  const handleEdit = (publisher) => {
    // Düzenleme işlemini başlatıyoruz.
    setEditingPublisher(publisher);
    setName(publisher.name);
    setEstablishmentYear(publisher.establishmentYear);
    setAddress(publisher.address);
    // Formu düzenlenen yayıncının bilgileriyle dolduruyoruz.
  };

  const handleDelete = (id) => {
    // Yayıncı silme işlemi
    axios
      .delete(`${API_BASE_URL}/api/v1/publishers/${id}`)
      .then(() => {
        setPublishers(publishers.filter((publisher) => publisher.id !== id));
        setSnackbarMessage("Yayıncı başarıyla silindi!");
        setOpenSnackbar(true); // Silme sonrası Snackbar açılıyor
      })
      .catch((error) => {
        console.error("Yayıncı silinemedi:", error);
      });
  };

  const handleSnackbarClose = () => {
    // Snackbar kapatma işlemi
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1>Yayıncılar</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "20px 0",
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <TextField
          label="Yayıncı İsmi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Kuruluş Yılı"
          value={establishmentYear}
          onChange={(e) => setEstablishmentYear(e.target.value)}
          required
          error={!!error}
          helperText={error}
        />
        <TextField
          label="Adres"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {editingPublisher ? "Güncelle" : "Ekle"}
          {/* Eğer düzenleme yapılıyorsa "Güncelle", yoksa "Ekle" yazısı gösteriliyor */}
        </Button>
      </form>

      <TableContainer component={Paper}>
        {/* Yayıncıların listelendiği tablo */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Kuruluş Yılı</TableCell>
              <TableCell>Adres</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(publishers) &&
              publishers.map((publisher) => (
                <TableRow key={publisher.id}>
                  <TableCell>{publisher.name}</TableCell>
                  <TableCell>{publisher.establishmentYear}</TableCell>
                  <TableCell>{publisher.address}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(publisher)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(publisher.id)}>
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
