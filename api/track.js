import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { action, country } = req.query;

  if (action === 'visit') {
    let count = await kv.get('visits');
    let countries = await kv.get('countries');

    if (!count) count = 0;
    if (!countries) countries = {};

    count++;
    if (country) {
      countries[country] = (countries[country] || 0) + 1;
    }

    await kv.set('visits', count);
    await kv.set('countries', countries);

    return res.status(200).json({ success: true });
  }

  if (action === 'stats') {
    const count = (await kv.get('visits')) || 0;
    const countries = (await kv.get('countries')) || {};
    return res.status(200).json({ count, countries });
  }

  return res.status(400).json({ error: 'Azione non valida' });
}
