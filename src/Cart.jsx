import { useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { ORDER_API_URL } from "./config";

export function formatMoney(value) {
  return `${Number.isInteger(value) ? value : value.toFixed(2)} руб.`;
}

export function QtyControl({ qty, onAdd, onRemove, compact }) {
  if (!qty) {
    return (
      <button className="add-btn" onClick={onAdd}>
        <Plus size={16} /> В корзину
      </button>
    );
  }
  return (
    <div className={compact ? "qty qty-compact" : "qty"}>
      <button aria-label="Убавить" onClick={onRemove}><Minus size={16} /></button>
      <span>{qty}</span>
      <button aria-label="Добавить" onClick={onAdd}><Plus size={16} /></button>
    </div>
  );
}

export function CartBar({ count, total, onOpen }) {
  if (!count) return null;
  return (
    <button className="cart-bar" onClick={onOpen}>
      <span className="cart-bar-left"><ShoppingBag size={20} /> Корзина · {count}</span>
      <strong>{formatMoney(total)}</strong>
    </button>
  );
}

export function CartDrawer({ open, onClose, lines, total, add, remove, clear }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("hall");
  const [table, setTable] = useState("");
  const [comment, setComment] = useState("");
  const [trap, setTrap] = useState(""); // скрытое поле от ботов
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!lines.length) return;
    if (!ORDER_API_URL) {
      setStatus("error");
      setError("Приём заказов на сайте пока не подключён. Позвоните нам: +375 33 677 76 17.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(ORDER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, type, table, comment, trap,
          items: lines.map((l) => ({ name: l.item.name, price: l.item.price, qty: l.qty, priceFrom: !!l.item.priceFrom })),
          total,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("done");
      clear();
    } catch {
      setStatus("error");
      setError("Не удалось отправить заказ. Попробуйте ещё раз или позвоните нам: +375 33 677 76 17.");
    }
  };

  const closeAll = () => {
    if (status === "done") setStatus("idle");
    onClose();
  };

  return (
    <div className="cart-overlay" onClick={closeAll}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Корзина">
        <div className="cart-head">
          <h3>Ваш заказ</h3>
          <button aria-label="Закрыть" onClick={closeAll}><X size={22} /></button>
        </div>

        {status === "done" ? (
          <div className="cart-done">
            <h4>Заказ отправлен!</h4>
            <p>Администратор уже получил его и скоро свяжется с вами. Оплата в кафе.</p>
            <button className="primary-btn" onClick={closeAll}>Хорошо</button>
          </div>
        ) : lines.length === 0 ? (
          <p className="cart-empty">В корзине пока пусто. Добавьте блюда из меню.</p>
        ) : (
          <form onSubmit={submit} className="cart-form">
            <div className="cart-lines">
              {lines.map(({ item, qty }) => (
                <div className="cart-line" key={item.id}>
                  <div className="cart-line-info">
                    <strong>{item.name}</strong>
                    <span>{item.priceFrom ? "от " : ""}{formatMoney(item.price)}</span>
                  </div>
                  <QtyControl compact qty={qty} onAdd={() => add(item)} onRemove={() => remove(item)} />
                </div>
              ))}
            </div>

            <div className="cart-total"><span>Итого</span><strong>{formatMoney(total)}</strong></div>
            {lines.some((l) => l.item.priceFrom) && (
              <p className="cart-hint">Для блюд «от …» итоговую цену уточнит администратор.</p>
            )}

            <div className="cart-type">
              <label className={type === "hall" ? "active" : ""}>
                <input type="radio" name="type" checked={type === "hall"} onChange={() => setType("hall")} /> В зале
              </label>
              <label className={type === "pickup" ? "active" : ""}>
                <input type="radio" name="type" checked={type === "pickup"} onChange={() => setType("pickup")} /> Навынос
              </label>
            </div>

            {type === "hall" && (
              <input className="field" placeholder="Номер столика (если знаете)" value={table} onChange={(e) => setTable(e.target.value)} maxLength={20} />
            )}
            <input className="field" required placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
            <input className="field" required type="tel" placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
            <textarea className="field" rows={2} placeholder="Комментарий к заказу" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={300} />
            <input className="trap" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} aria-hidden="true" />

            {status === "error" && <p className="cart-error">{error}</p>}
            <button className="primary-btn cart-submit" disabled={status === "sending"}>
              {status === "sending" ? "Отправляем…" : "Отправить заказ"}
            </button>
            <p className="cart-hint">Оплата при получении, в кафе.</p>
          </form>
        )}
      </aside>
    </div>
  );
}
