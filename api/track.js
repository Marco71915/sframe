import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    const { action, country } = req.query;

    if (action === 'visit') {
      // Incrementa contatore totale
      await redis.incr('count');
      if (country) {
        await redis.hincrby('countries', country.toLowerCase(), 1);
      }
      return res.status(200).json({ success: true });
    }

    if (action === 'stats') {
      const count = await redis.get('count') || 0;
      const countries = await redis.hgetall('countries') || {};
      return res.status(200).json({ count: Number(count), countries });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
