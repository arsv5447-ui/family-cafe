// Cloudflare Worker: принимает заказ с сайта и отправляет его в общий Telegram-чат.
// Секреты (Settings → Variables and Secrets): BOT_TOKEN, CHAT_ID.
const ALLOWED_ORIGINS = [
  "https://arsv5447-ui.github.io",
  "http://localhost:5173",
];

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

const esc = (v) => String(v ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const clip = (v, n) => String(v ?? "").slice(0, n);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = { ...cors(origin), "Content-Type": "application/json" };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return new Response('{"ok":false}', { status: 405, headers });
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response('{"ok":false}', { status: 403, headers });

    let data;
    try { data = await request.json(); } catch { return new Response('{"ok":false}', { status: 400, headers }); }

    if (data.trap) return new Response('{"ok":true}', { status: 200, headers }); // бот: делаем вид, что всё ок

    const items = Array.isArray(data.items) ? data.items.slice(0, 40) : [];
    const name = clip(data.name, 60).trim();
    const phone = clip(data.phone, 30).trim();
    if (!items.length || !name || !phone) return new Response('{"ok":false}', { status: 400, headers });

    let total = 0;
    const lines = items.map((i) => {
      const qty = Math.min(Math.max(parseInt(i.qty, 10) || 1, 1), 20);
      const price = Number(i.price) || 0;
      total += qty * price;
      return `• ${esc(clip(i.name, 80))} × ${qty} — ${i.priceFrom ? "от " : ""}${(qty * price).toFixed(2).replace(/\.00$/, "")} руб.`;
    });

    const type = data.type === "pickup" ? "Навынос" : "В зале";
    const text = [
      "🧾 <b>Новый заказ с сайта</b>",
      "",
      ...lines,
      "",
      `<b>Итого: ${total.toFixed(2).replace(/\.00$/, "")} руб.</b> (оплата в кафе)`,
      `Тип: ${type}${data.type !== "pickup" && data.table ? `, столик ${esc(clip(data.table, 20))}` : ""}`,
      `Имя: ${esc(name)}`,
      `Телефон: ${esc(phone)}`,
      data.comment ? `Комментарий: ${esc(clip(data.comment, 300))}` : "",
    ].filter((l) => l !== "").join("\n");

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text, parse_mode: "HTML" }),
    });

    if (!tg.ok) return new Response('{"ok":false}', { status: 502, headers });
    return new Response('{"ok":true}', { status: 200, headers });
  },
};
