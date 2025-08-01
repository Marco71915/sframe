let visits = {
  count: 0,
  countries: {}
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { country } = req.body;

    visits.count++;
    const c = country || "Unknown";
    visits.countries[c] = (visits.countries[c] || 0) + 1;
  }

  res.status(200).json({
    count: visits.count,
    countries: visits.countries
  });
}
