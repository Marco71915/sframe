let stats = { count: 0, countries: {} };

export default async function handler(req, res) {
  const { id, action } = req.query;

  if (action === 'visit') {
    // Conteggio visite - solo se chiamato con action=visit
    stats.count++;

    // Ottieni IP dell'utente
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Geolocalizzazione
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

    // Aggiorna conteggio paese
    stats.countries[country] = (stats.countries[country] || 0) + 1;
  }

  // Sempre restituiamo le statistiche aggiornate
  res.status(200).json(stats);
}
