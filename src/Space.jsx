import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// w/h — размеры файла (чтобы страница не «прыгала» при загрузке), tag — раздел фильтра.
const PHOTOS = [
  { n: 1, w: 1280, h: 721, tag: "hall", alt: "Уютный зал кафе с гирляндами, гости за столиками" },
  { n: 5, w: 960, h: 1280, tag: "play", alt: "Дети играют на мягком полу игровой зоны" },
  { n: 3, w: 960, h: 1280, tag: "party", alt: "Шоу аниматора на празднике, фон «Семья» для фото" },
  { n: 9, w: 960, h: 1280, tag: "play", alt: "Девочка играет на интерактивной панели «Игренок»" },
  { n: 15, w: 960, h: 1280, tag: "hall", alt: "Накрытый праздничный стол: салаты, нарезка, закуски, морс" },
  { n: 6, w: 960, h: 1280, tag: "monkeys", alt: "Маленькая обезьянка-мармозетка сидит на мягком стуле" },
  { n: 12, w: 1280, h: 960, tag: "play", alt: "Аниматор играет с детьми у игрового лабиринта" },
  { n: 10, w: 960, h: 1280, tag: "party", alt: "Дети лежат в серебристом конфетти на празднике" },
  { n: 7, w: 960, h: 1280, tag: "monkeys", alt: "Обезьянки в просторном вольере с домиком" },
  { n: 14, w: 1280, h: 960, tag: "party", alt: "Аниматор и именинница на фоне «Семья» с шарами" },
  { n: 4, w: 960, h: 1280, tag: "party", alt: "Дети с аниматором-Человеком-пауком на празднике" },
  { n: 13, w: 1280, h: 894, tag: "play", alt: "Две подружки обнимаются у интерактивной панели" },
  { n: 8, w: 960, h: 1280, tag: "monkeys", alt: "Обезьянка с малышом на ветке" },
  { n: 11, w: 960, h: 1280, tag: "party", alt: "Общее фото детей, гостей и сотрудников кафе в конфетти" },
  { n: 2, w: 660, h: 885, tag: "party", alt: "Праздничная фотозона «Happy birthday» с мягким диваном и подарками" },
];

const FILTERS = [
  { id: "all", label: "Всё" },
  { id: "hall", label: "Зал" },
  { id: "play", label: "Игровая зона" },
  { id: "party", label: "Праздники" },
  { id: "monkeys", label: "Обезьянки" },
];

// Число колонок по ширине экрана.
function useColumnCount() {
  const calc = () => (typeof window !== "undefined" && window.innerWidth <= 960 ? 2 : 3);
  const [count, setCount] = useState(calc);
  useEffect(() => {
    const onResize = () => setCount(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return count;
}

export default function Space() {
  const [filter, setFilter] = useState("all");
  const colCount = useColumnCount();
  const [open, setOpen] = useState(null); // индекс в списке показанных фото
  const shown = PHOTOS.filter((p) => filter === "all" || p.tag === filter);

  // Раскладываем фото по колонкам: каждое следующее — в самую короткую колонку.
  const columns = useMemo(() => {
    const cols = Array.from({ length: colCount }, () => ({ height: 0, items: [] }));
    shown.forEach((p, index) => {
      const target = cols.reduce((a, b) => (b.height < a.height ? b : a));
      target.items.push({ p, index });
      target.height += p.h / p.w;
    });
    return cols;
  }, [shown, colCount]);

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % shown.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + shown.length) % shown.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, shown.length]);

  const current = open !== null ? shown[open] : null;

  return (
    <section className="space section" id="space">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Наше пространство</div>
            <h2>Место, где <em>хочется остаться.</em></h2>
          </div>
          <p>Просторный зал, игровая зона, живые обезьянки<br className="desktop-only" /> и праздники, которые запоминаются.</p>
        </div>

        <div className="category-list" role="tablist" aria-label="Фотографии кафе">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={filter === f.id ? "category active" : "category"}
              onClick={() => setFilter(f.id)}
              role="tab"
              aria-selected={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-grid">
          {columns.map((col, ci) => (
            <div className="space-col" key={ci}>
              {col.items.map(({ p, index }) => (
                <button className="space-item" key={p.n} onClick={() => setOpen(index)} aria-label={`Открыть фото: ${p.alt}`}>
                  <img src={`/family-cafe/space/${p.n}.jpg`} width={p.w} height={p.h} alt={p.alt} loading="lazy" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фото" onClick={() => setOpen(null)}>
          <button className="lightbox-close" aria-label="Закрыть" onClick={() => setOpen(null)}><X size={24} /></button>
          <button className="lightbox-nav prev" aria-label="Предыдущее фото" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + shown.length) % shown.length); }}>
            <ChevronLeft size={26} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={`/family-cafe/space/${current.n}.jpg`} alt={current.alt} />
          </figure>
          <button className="lightbox-nav next" aria-label="Следующее фото" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % shown.length); }}>
            <ChevronRight size={26} />
          </button>
        </div>
      )}
    </section>
  );
}
