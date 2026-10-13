import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram, Phone } from "lucide-react";

const SLIDES = [
  { src: "/family-cafe/birthday/1.jpg", alt: "День рождения под ключ — праздник без хлопот для родителей" },
  { src: "/family-cafe/birthday/2.jpg", alt: "Аренда в будни: 3 часа — 295 руб. Игровая зона, песочница, горка с лабиринтом, батуты, караоке" },
  { src: "/family-cafe/birthday/3.jpg", alt: "Спецпредложение 395 руб.: 1 час аниматора, серебряная дискотека, вынос торта" },
  { src: "/family-cafe/birthday/4.jpg", alt: "Имениннику вход бесплатно. Живые обезьянки, детское меню, своя кухня для взрослых" },
  { src: "/family-cafe/birthday/5.jpg", alt: "Бронируйте дату: телефон +375 33 677-76-17, Instagram @family_cafe_minsk" },
];

export default function Birthday() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(SLIDES.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section className="birthday section" id="birthday">
      <div className="container birthday-grid">
        <div className="birthday-copy">
          <div className="eyebrow">Праздники</div>
          <h2>День рождения <em>под ключ.</em></h2>
          <p>
            Праздник без хлопот для родителей: игровая зона, аниматор, дискотека и вынос торта.
            Листайте карточки, чтобы посмотреть условия, и бронируйте дату заранее.
          </p>
          <div className="birthday-actions">
            <a className="primary-btn" href="tel:+375336777617"><Phone size={18} /> Позвонить</a>
            <a className="text-link" href="https://www.instagram.com/family_cafe_minsk/" target="_blank" rel="noreferrer">
              <Instagram size={17} /> Написать в Instagram
            </a>
          </div>
        </div>

        <div className="carousel" aria-roledescription="карусель">
          <div className="carousel-track" ref={trackRef} onScroll={onScroll}>
            {SLIDES.map((slide, i) => (
              <div className="carousel-slide" key={slide.src}>
                <img src={slide.src} alt={slide.alt} loading={i === 0 ? "eager" : "lazy"} draggable="false" />
              </div>
            ))}
          </div>

          <button className="carousel-arrow prev" aria-label="Назад" onClick={() => goTo(index - 1)} disabled={index === 0}>
            <ChevronLeft size={22} />
          </button>
          <button className="carousel-arrow next" aria-label="Вперёд" onClick={() => goTo(index + 1)} disabled={index === SLIDES.length - 1}>
            <ChevronRight size={22} />
          </button>

          <div className="carousel-dots">
            {SLIDES.map((_, i) => (
              <button key={i} className={i === index ? "active" : ""} aria-label={`Слайд ${i + 1}`} onClick={() => goTo(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
