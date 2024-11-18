import { Link, useMatch, useResolvedPath } from "react-router-dom";
// React Router'dan Link, useMatch ve useResolvedPath hook'larını içe aktarıyoruz.
// Link: Kullanıcının tıklayarak farklı sayfalara gitmesini sağlar.
// useMatch: URL'nin belirtilen rota ile eşleşip eşleşmediğini kontrol eder.
// useResolvedPath: Verilen bir yola çözülmüş bir URL döndürür.

export default function Navbar() {
  // Navbar bileşenini tanımlıyoruz.
  return (
    <nav className="nav">
      {/* Navbar konteyneri */}
      <Link to="/" className="site-title">
        LibraryApp
      </Link>
      {/* Ana sayfaya giden bağlantı. "LibraryApp" başlık olarak gösterilir. */}

      <ul>
        {/* Sayfa bağlantılarını içeren liste */}
        <CustomLink to="/author">Yazarlar</CustomLink>
        {/* Yazarlar sayfasına yönlendiren özel bağlantı */}
        <CustomLink to="/publisher">Yayıncılar</CustomLink>
        {/* Yayıncılar sayfasına yönlendiren özel bağlantı */}
        <CustomLink to="/category">Kategoriler</CustomLink>
        {/* Kategoriler sayfasına yönlendiren özel bağlantı */}
        <CustomLink to="/book">Kitaplar</CustomLink>
        {/* Kitaplar sayfasına yönlendiren özel bağlantı */}
        <CustomLink to="/borrowing">Ödünç Alma Kayıtları</CustomLink>
        {/* Ödünç Alma Kayıtları sayfasına yönlendiren özel bağlantı */}
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  // Özel bir bağlantı bileşeni tanımlıyoruz.
  const resolvePath = useResolvedPath(to);
  // Verilen "to" yolu kullanılarak çözülmüş URL'yi elde ediyoruz.

  const isActive = useMatch({ path: resolvePath.pathname, end: true });
  // Verilen URL'nin aktif olup olmadığını kontrol ediyoruz. Eğer yol geçerli rota ile eşleşirse, bu bağlantının aktif olduğunu belirler.

  return (
    <li className={isActive ? "active" : ""}>
      {/* Eğer bağlantı aktifse "active" sınıfı eklenir, değilse boş kalır */}
      <Link to={to} {...props}>
        {/* Verilen "to" yoluna bağlantı oluşturuyoruz ve diğer eklenen tüm özellikleri bu bağlantıya ekliyoruz */}
        {children}
        {/* Bağlantı içeriği (metin veya başka bileşenler) */}
      </Link>
    </li>
  );
}
