import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data.json');

  // Leggi i dati dal file JSON
  let data = { count: 0, countries: {} };
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(fileContent);
  }

  if (req.method === 'POST') {
    // Quando arriva una nuova visita
    const { country } = req.body || {};
    data.count += 1;

    if (country) {
      data.countries[country] = (data.countries[country] || 0) + 1;
    } else {
      data.countries['Unknown'] = (data.countries['Unknown'] || 0) + 1;
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'GET') {
    // Quando si leggono le statistiche
    return res.status(200).json(data);
  }

  res.status(405).json({ message: 'Method not allowed' });
}
