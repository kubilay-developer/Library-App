import Navbar from "./Navbar";
// Navbar bileşenini içe aktarıyoruz. Bu bileşen, uygulamanın üst kısmında yer alan navigasyon menüsünü temsil eder.

import Publisher from "./pages/Publisher";
import Author from "./pages/Author";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Borrowing from "./pages/Borrowing";
import Book from "./pages/Book";
// Yayıncı, Yazar, Ana Sayfa, Kategori, Ödünç Alma ve Kitap bileşenlerini içe aktarıyoruz.
// Bu bileşenler, farklı sayfaları temsil eder ve kullanıcı bu sayfalarda işlem yapabilir.

import { Route, Routes } from "react-router-dom";
// Route ve Routes bileşenlerini React Router'dan içe aktarıyoruz. Bu bileşenler, farklı URL yollarına göre bileşenlerin gösterilmesini sağlar.

function App() {
  // App bileşenini tanımlıyoruz.
  return (
    <>
      <Navbar />
      {/* Tüm sayfalarda görünmesini istediğimiz Navbar bileşenini ekliyoruz */}

      <div className="container">
        {/* Sayfa içerikleri için bir container oluşturuyoruz */}
        <Routes>
          {/* Routes bileşeni içinde her bir Route, farklı bir sayfa bileşenine gider */}
          <Route path="/" element={<Home />} />
          {/* Ana sayfa için rota, bu rota "/" adresine gidildiğinde Home bileşenini gösterir */}
          <Route path="/publisher" element={<Publisher />} />
          {/* Yayıncılar sayfası için rota */}
          <Route path="/author" element={<Author />} />
          {/* Yazarlar sayfası için rota */}
          <Route path="/category" element={<Category />} />
          {/* Kategoriler sayfası için rota */}
          <Route path="/borrowing" element={<Borrowing />} />
          {/* Ödünç Alma sayfası için rota */}
          <Route path="/book" element={<Book />} />
          {/* Kitaplar sayfası için rota */}
        </Routes>
      </div>
    </>
  );
}

export default App;
// Bu bileşeni diğer dosyalarda kullanabilmek için dışa aktarıyoruz.
