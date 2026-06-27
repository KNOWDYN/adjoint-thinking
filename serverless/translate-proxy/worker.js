export default {
  async fetch(request, env) {
    const cors = {
      'access-control-allow-origin': env.ALLOWED_ORIGIN || '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'vary': 'origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);
    if (!env.DEEPL_API_KEY) return json({ error: 'translation_provider_not_configured' }, 503, cors);

    const body = await request.json().catch(() => null);
    if (!body || typeof body.text !== 'string') return json({ error: 'invalid_payload' }, 400, cors);
    const targetLocale = body.targetLocale === 'ar' ? 'AR' : 'EN-US';
    const text = body.text.slice(0, 12000);
    const form = new URLSearchParams();
    form.set('text', text);
    form.set('target_lang', targetLocale);
    form.set('tag_handling', 'html');
    form.set('ignore_tags', 'code,pre,script,style');

    const endpoint = env.DEEPL_API_ENDPOINT || 'https://api-free.deepl.com/v2/translate';
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'authorization': `DeepL-Auth-Key ${env.DEEPL_API_KEY}`, 'content-type': 'application/x-www-form-urlencoded' },
      body: form
    });
    if (!upstream.ok) return json({ error: 'translation_failed' }, upstream.status, cors);
    const data = await upstream.json();
    return json({ provider: 'deepl', reviewStatus: 'machine', text: data.translations?.[0]?.text || '' }, 200, cors);
  }
};

function json(payload, status, headers) {
  return new Response(JSON.stringify(payload), { status, headers: { ...headers, 'content-type': 'application/json; charset=utf-8' } });
}
