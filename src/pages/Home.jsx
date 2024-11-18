import React from "react";
// React bileşenlerini kullanmak için React kütüphanesini içe aktarıyoruz.

import { Typography, Container, Box } from "@mui/material";
// Material-UI'den çeşitli bileşenleri içe aktarıyoruz. Typography, metin stilleri için; Container, içerik yerleşimi için; Box ise esnek düzenlemeler için kullanılır.

import backgroundImage from "../assets/LibraryApp.jpg";
// Arka plan resmini içe aktarıyoruz.

import "./Home.css"; // CSS dosyasını da import ediyoruz
// CSS dosyasını projeye dahil ediyoruz. Bu dosya sayfa düzeni için gerekli stil kurallarını içeriyor.

const HomePage = () => {
  // HomePage bileşenini tanımlıyoruz.
  return (
    <Container className="homepage-container">
      {/* Sayfanın ana konteynırı. CSS dosyasındaki "homepage-container" sınıfı uygulanmış */}
      <div className="overlay">
        {/* Arka planda bulanıklık efekti için eklenmiş bir katman */}
        <Box textAlign="center" mt={5}>
          {/* İçerik için kullanılan bir kutu bileşeni. Tüm içerik yatayda ortalanmış ve yukarıdan biraz boşluk eklenmiş. */}
          <Typography variant="h2" gutterBottom>
            {/* Başlık olarak kullanılan bir bileşen. H2 tipinde ve altında boşluk bırakacak şekilde (gutterBottom). */}
            LibraryApp'e Hoşgeldiniz
          </Typography>
          <Typography variant="h6" color="white">
            {/* Açıklama metni. H6 tipinde ve rengi beyaz olarak ayarlanmış. */}
            Kitap ekleme, yayınevi ve yazar düzenleme, ödünç alma işlemleri ve daha fazlasını tek bir platformda yönetin. 
            <br /> 
            Kitaplarınızı hızlıca ekleyin, düzenleyin veya silin, ödünç işlemlerini kolayca takip edin ve tüm verilerinizi organize edin.
          </Typography>
        </Box>
      </div>
    </Container>
  );
};

export default HomePage;
// Bu bileşeni diğer dosyalarda kullanabilmek için dışa aktarıyoruz.
