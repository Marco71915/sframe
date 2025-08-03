import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    // Incrementa un contatore, es. 'page_views'
    const count = await redis.incr('page_views');

    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error('Errore Redis:', error);
    res.status(500).json({ success: false, message: 'Errore server' });
  }
}
