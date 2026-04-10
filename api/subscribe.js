export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  const r = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tblw9mSGD9gkmmUyi`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{ fields: { Email: email, Estado: 'Pendiente' } }]
      })
    }
  );
  const data = await r.json();
  return res.status(r.ok ? 200 : 500).json(data);
}
