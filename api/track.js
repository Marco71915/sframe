import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { action, country } = req.query;

  try {
    if (action === 'visit') {
      // Incremento contatore totale
      await redis.incr('visits:total');

      // Incremento contatore per paese
      if (country) {
        await redis.incr(`visits:country:${country}`);
      }
      return res.status(200).json({ message: 'Visit tracked' });
    }

    // Recupero statistiche
    const total = (await redis.get('visits:total')) || 0;
    const keys = await redis.keys('visits:country:*');

    const countries = {};
    for (const key of keys) {
      const count = await redis.get(key);
      const countryName = key.replace('visits:country:', '');
      countries[countryName] = Number(count);
    }

    return res.status(200).json({ count: total, countries });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
