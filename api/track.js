let stats = { count: 0, countries: {} };

export default async function handler(req, res) {
  const { id } = req.query;

  // Conteggio visite
  stats.count++;

  // Ottieni IP dell'utente
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Richiesta API per la geolocalizzazione
  let country = 'Unknown';
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    if (data && data.country_name) {
      country = data.country_name;
    }
  } catch (e) {
    console.error('Errore geolocalizzazione:', e);
  }

  // Aggiorna statistiche
  stats.countries[country] = (stats.countries[country] || 0) + 1;

  res.status(200).json(stats);
}
