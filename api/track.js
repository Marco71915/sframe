export default function handler(req, res) {
  const { id } = req.query;

  if (!global.visits) global.visits = {};
  if (!global.visits[id]) global.visits[id] = { count: 0 };

  global.visits[id].count++;

  res.status(200).json(global.visits[id]);
}
