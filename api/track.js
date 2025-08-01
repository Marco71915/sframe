let stats = { count: 0, countries: {} };

export default async function handler(req, res) {
  const { action } = req.query;

  if (action === 'visit') {
    stats.count++;

    // Ottieni IP reale dal header x-forwarded-for
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    ip = ip.split(',')[0].trim(); // prendi il primo IP

    // In test locale forziamo IP per debug (rimuovere in produzione)
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = '8.8.8.8'; // esempio IP pubblico Google
    }

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

    stats.countries[country] = (stats.countries[country] || 0) + 1;
  }

  res.status(200).json(stats);
}
