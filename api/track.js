let stats = { count: 0, countries: {} };

export default function handler(req, res) {
  const { action, country } = req.query;

  if (action === 'visit') {
    stats.count++;

    if (country) {
      stats.countries[country] = (stats.countries[country] || 0) + 1;
    } else {
      stats.countries['Unknown'] = (stats.countries['Unknown'] || 0) + 1;
    }
  }

  res.status(200).json(stats);
}
