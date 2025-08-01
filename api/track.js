let visits = {
  count: 0,
  countries: {}
};

export default async function handler(req, res) {
  const { id } = req.query;

  // Prendi IP dal request
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    "unknown";

  // API per ottenere il paese
  let country = "Unknown";
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (response.ok) {
      const data = await response.json();
      country = data.country_name || "Unknown";
    }
  } catch (err) {
    console.error("Errore geolocalizzazione:", err);
  }

  // Aggiorna contatore (solo se è una chiamata di tracking e non di sola lettura)
  if (req.method === "POST") {
    visits.count++;
    visits.countries[country] = (visits.countries[country] || 0) + 1;
  }

  res.status(200).json(visits);
}
