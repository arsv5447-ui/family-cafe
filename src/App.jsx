import { useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  Instagram,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { categories, menuItems } from "./data/menu";

function Header({ onMenuClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const goToMenu = () => {
    setMobileOpen(false);
    onMenuClick();
  };

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a className="brand" href="#" aria-label="Семья — на главную">
          <span className="brand-mark"><img src="/family-cafe/tiffany-monkey.png" alt="" /></span>
          <span>
            <strong>Семья</strong>
            <small>семейное кафе</small>
          </span>
        </a>

        <nav className={`desktop-nav ${mobileOpen ? "mobile-open" : ""}`}>
          <a href="#about" onClick={() => setMobileOpen(false)}>О нас</a>
          <a href="#menu" onClick={() => setMobileOpen(false)}>Меню</a>
          <a href="#contacts" onClick={() => setMobileOpen(false)}>Контакты</a>
          <button className="nav-cta" onClick={goToMenu}>Смотреть меню</button>
        </nav>

        <button
          className="mobile-toggle"
          aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
    </header>
  );
}

function Hero({ onMenuClick }) {
  return (
    <section className="hero">
      <div className="hero-orb orb-one" />
      <div className="hero-orb orb-two" />
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <div className="eyebrow"><Sparkles size={16} /> Здесь всегда по-домашнему</div>
          <h1>Вкусные моменты, <em>которые хочется повторить.</em></h1>
          <p>
            Завтраки без спешки, уютные обеды и десерты для всей семьи.
            Готовим с любовью и встречаем как родных.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={onMenuClick}>
              Посмотреть меню <ArrowRight size={18} />
            </button>
            <a className="text-link" href="#about">Узнать о кафе</a>
          </div>
          <div className="hero-note">
            <div className="avatar-stack">
              <span>А</span><span>М</span><span>С</span>
            </div>
            <div>
              <strong>Нас выбирают семьи</strong>
              <span>Тёплая атмосфера каждый день</span>
            </div>
          </div>
        </div>

        <div className="hero-visual reveal">
          <div className="hero-card">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=90"
              alt="Уютный интерьер семейного кафе"
            />
            <div className="floating-rating">
              <Star size={16} fill="currentColor" />
              <div><strong>4.9</strong><span>любят гости</span></div>
            </div>
            <div className="floating-tag">Свежо · Вкусно · С любовью</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section" id="about">
      <div className="container about-grid">
        <div className="about-photo">
          <img
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=85"
            alt="Столик в уютном кафе"
          />
          <div className="about-badge">
            <span>с 2018</span>
            <strong>готовим<br />для своих</strong>
          </div>
        </div>
        <div className="about-copy">
          <div className="eyebrow">Немного о нас</div>
          <h2>Место, куда приходят за вкусом — <em>а остаются за атмосферой.</em></h2>
          <p>
            Мы создали «Семья» как маленькое семейное кафе, где можно спокойно
            позавтракать, встретиться с друзьями или провести вечер с близкими.
          </p>
          <div className="about-points">
            <div><span>01</span><strong>Домашняя кухня</strong><small>Понятные блюда из свежих продуктов.</small></div>
            <div><span>02</span><strong>Тёплая атмосфера</strong><small>Уютно взрослым и интересно детям.</small></div>
            <div><span>03</span><strong>Забота о гостях</strong><small>Каждого встречаем с улыбкой.</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuCard({ item }) {
  return (
    <article className="menu-card">
      <div className="card-image-wrap">
        <img src={item.image} alt={item.name} loading="lazy" />
        {item.badge && <span className="food-badge">{item.badge}</span>}
      </div>
      <div className="card-content">
        <div className="card-title-row">
          <h3>{item.name}</h3>
          <span className="price">{item.price.toFixed(2).replace(".", ",")} €</span>
        </div>
        <p>{item.description}</p>
        <span className="weight">{item.weight}</span>
      </div>
    </article>
  );
}

function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = useMemo(
    () => activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  return (
    <section className="menu-section section" id="menu">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Наше меню</div>
            <h2>Выбирайте любимое</h2>
          </div>
          <p>Простая, свежая и понятная еда,<br className="desktop-only" /> которую хочется заказывать снова.</p>
        </div>

        <div className="category-list" role="tablist" aria-label="Категории меню">
          {categories.map((category) => (
            <button
              key={category.id}
              className={activeCategory === category.id ? "category active" : "category"}
              onClick={() => setActiveCategory(category.id)}
              role="tab"
              aria-selected={activeCategory === category.id}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredItems.map((item) => <MenuCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="brand brand-light" href="#">
              <span className="brand-mark"><img src="/family-cafe/tiffany-monkey.png" alt="" /></span>
              <span><strong>Семья</strong><small>семейное кафе</small></span>
            </a>
            <p>Место для вкусных завтраков,<br />долгих разговоров и счастливых семей.</p>
          </div>
          <div className="footer-column">
            <h4>Мы здесь</h4>
            <a href="https://maps.google.com/?q=Vienna" target="_blank" rel="noreferrer">
              <MapPin size={17} /> Семейная улица, 12
            </a>
            <a href="tel:+4312345678"><Phone size={17} /> +43 1 234 56 78</a>
          </div>
          <div className="footer-column">
            <h4>Время работы</h4>
            <div><Clock3 size={17} /> Пн–Пт: 08:00–22:00</div>
            <div><Clock3 size={17} /> Сб–Вс: 09:00–23:00</div>
          </div>
          <div className="footer-column">
            <h4>Следите за нами</h4>
            <a href="#" className="social"><Instagram size={18} /> Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Семья. Все права защищены.</span>
          <span>Сделано с любовью к хорошей еде.</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header onMenuClick={scrollToMenu} />
      <main>
        <Hero onMenuClick={scrollToMenu} />
        <About />
        <MenuSection />
        <section className="visit section">
          <div className="container visit-box">
            <div>
              <div className="eyebrow">Заглядывайте в гости</div>
              <h2>Хорошая еда лучше всего <em>в хорошей компании.</em></h2>
            </div>
            <a className="primary-btn light-btn" href="#contacts">Наши контакты <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}