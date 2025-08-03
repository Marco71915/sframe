import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    const { action, country } = req.query;

    // Incremento visite solo se action = visit
    if (action === 'visit') {
      await redis.incr('visits');
      if (country) {
        await redis.incr(`country:${country}`);
      }
      return res.status(200).json({ success: true });
    }

    // Ottengo statistiche
    const count = (await redis.get('visits')) || 0;
    const keys = await redis.keys('country:*');

    const countries = {};
    for (const key of keys) {
      const countryName = key.replace('country:', '');
      countries[countryName] = await redis.get(key);
    }

    return res.status(200).json({ count, countries });
  } catch (err) {
    console.error('Errore API track:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
