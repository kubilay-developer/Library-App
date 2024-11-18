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
// Material-UI'den gerekli bileşenleri içe aktarıyoruz. Bu bileşenler kullanıcı arayüzünü oluşturmak için kullanılıyor.

import { Edit, Delete } from "@mui/icons-material";
// Düzenle ve Sil ikonlarını içe aktarıyoruz.

import axios from "axios";
// Axios'u API isteklerini gerçekleştirmek için içe aktarıyoruz.

// API base URL'ini ortam değişkenlerinden alıyoruz
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// API URL'ini ortam değişkenlerinden alıyoruz. Bu, farklı ortamlar için URL'lerin kolayca değiştirilmesini sağlar.

export default function Category() {
  // Category bileşenini tanımlıyoruz.
  const [categories, setCategories] = useState([]);
  // categories: Kategorilerin listesini tutar.
  // setCategories: Kategori listesini güncellemek için kullanılır.

  const [name, setName] = useState("");
  // name: Kategorinin adı için form girdi değerini tutar.
  // setName: Kategori adını güncellemek için kullanılır.

  const [description, setDescription] = useState("");
  // description: Kategorinin açıklamasını tutar.
  // setDescription: Açıklamayı güncellemek için kullanılır.

  const [editingCategory, setEditingCategory] = useState(null);
  // editingCategory: Düzenlenen kategorinin bilgilerini tutar.
  // Bu sayede mevcut bir kategoriyi düzenleyip düzenlemediğimizi anlayabiliriz.

  const [openSnackbar, setOpenSnackbar] = useState(false);
  // openSnackbar: Snackbar'ı açıp kapatma kontrolünü tutar.

  const [snackbarMessage, setSnackbarMessage] = useState("");
  // snackbarMessage: Snackbar üzerinde gösterilecek mesajı tutar.

  useEffect(() => {
    // Bileşen yüklendiğinde kategorileri API'den almak için kullanılıyor.
    axios
      .get(`${API_BASE_URL}/api/v1/categories`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
          // Kategoriler listesini güncelliyoruz.
        } else {
          console.error("Beklenen formatta veri gelmedi:", response.data);
          setCategories([]);
          // Beklenen formatta veri gelmezse boş liste atıyoruz.
        }
      })
      .catch((error) => {
        console.error("API'den veri alınırken hata oluştu:", error);
        setCategories([]);
        // Veri alınırken hata oluşursa konsola hata mesajı basıyoruz ve listeyi boşaltıyoruz.
      });
  }, []);

  const handleSubmit = (e) => {
    // Form gönderildiğinde çalışır.
    e.preventDefault();
    // Formun varsayılan davranışını (sayfanın yenilenmesi) engelliyoruz.

    if (editingCategory) {
      // Eğer düzenleme yapılıyorsa
      const updatedCategory = {
        name: name || editingCategory.name, // Eğer isim boşsa, mevcut ismi kullan
        description,
      };

      // Kategori güncelleme işlemi
      axios
        .put(
          `${API_BASE_URL}/api/v1/categories/${editingCategory.id}`,
          updatedCategory
        )
        .then((response) => {
          setCategories(
            categories.map((category) =>
              category.id === editingCategory.id ? response.data : category
            )
          );
          setSnackbarMessage("Kategori başarıyla güncellendi!");
          setOpenSnackbar(true); // Güncelleme sonrası snackbar açılıyor
          resetForm();
        })
        .catch((error) => {
          setSnackbarMessage("Kategori eklenemedi.");
          setOpenSnackbar(true); // Hata mesajı içeren snackbar
          console.error("Kategori güncellenemedi:", error);
        });
    } else {
      // Yeni kategori ekleme işlemi
      axios
        .post(`${API_BASE_URL}/api/v1/categories`, { name, description })
        .then((response) => {
          setCategories([...categories, response.data]);
          setSnackbarMessage("Kategori başarıyla eklendi!");
          setOpenSnackbar(true); // Ekleme sonrası snackbar açılıyor
          resetForm();
        })
        .catch((error) => {
          console.error("Kategori eklenemedi:", error);
        });
    }
  };

  const resetForm = () => {
    // Formu sıfırlamak için kullanılır.
    setEditingCategory(null);
    setName("");
    setDescription("");
  };

  const handleEdit = (category) => {
    // Düzenleme işlemini başlatıyoruz.
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
    // Formu düzenlenen kategorinin bilgileriyle dolduruyoruz.
  };

  const handleDelete = (id) => {
    // Kategori silme işlemi
    axios
      .delete(`${API_BASE_URL}/api/v1/categories/${id}`)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== id));
        setSnackbarMessage("Kategori başarıyla silindi!");
        setOpenSnackbar(true); // Silme sonrası snackbar açılıyor
      })
      .catch((error) => {
        console.error("Kategori silinemedi:", error);
      });
  };

  const handleSnackbarClose = () => {
    // Snackbar kapatma işlemi
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1>Kategoriler</h1>
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
          label="Kategori İsmi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={!editingCategory} // Sadece ekleme sırasında zorunlu
        />
        <TextField
          label="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {editingCategory ? "Güncelle" : "Ekle"}
          {/* Eğer düzenleme yapılıyorsa "Güncelle", yoksa "Ekle" yazısı gösteriliyor */}
        </Button>
      </form>

      <TableContainer component={Paper}>
        {/* Kategorilerin listelendiği tablo */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category.id)}>
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
