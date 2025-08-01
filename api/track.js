export default async function handler(req, res) {
  const { id } = req.query; // ID del QR code
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Otteniamo il paese dell'utente
  const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
  const geoData = await geoRes.json();

  // Salviamo temporaneamente in memoria (poi useremo un DB)
  if (!global.visits) global.visits = {};
  if (!global.visits[id]) global.visits[id] = { count: 0, countries: {} };

  global.visits[id].count++;
  const country = geoData.country_name || "Unknown";
  global.visits[id].countries[country] =
    (global.visits[id].countries[country] || 0) + 1;

  res.status(200).json(global.visits[id]);
}
