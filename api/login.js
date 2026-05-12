export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let usuario, codigo;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    usuario = body?.usuario?.trim().toLowerCase();
    codigo = body?.codigo?.trim();
  } catch(e) {
    return res.status(400).json({ error: 'Body inválido' });
  }

  if (!usuario || !codigo) {
    return res.status(400).json({ error: 'Usuario y código requeridos' });
  }

  try {
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tblpbL1A41JIxefrK?filterByFormula=AND(LOWER({Usuario})="${usuario}",{Codigo}="${codigo}")`;

    const r = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });

    const data = await r.json();

    if (!r.ok) {
      console.error('Airtable error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (data.records && data.records.length > 0) {
      const miembro = data.records[0].fields;
      return res.status(200).json({
        ok: true,
        nombre: miembro.Nombre || usuario
      });
    } else {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas' });
    }

  } catch(e) {
    console.error('Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
