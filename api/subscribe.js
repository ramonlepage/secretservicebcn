export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let email;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    email = body?.email;
  } catch(e) {
    return res.status(400).json({ error: 'Body inválido' });
  }

  if (!email) return res.status(400).json({ error: 'Email requerido' });

  try {
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
    if (!r.ok) {
      console.error('Airtable error:', JSON.stringify(data));
      return res.status(500).json(data);
    }
    return res.status(200).json(data);
  } catch(e) {
    console.error('Fetch error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
