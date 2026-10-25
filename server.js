
import http from 'node:http';

const PORT = Number(process.env.PORT || 10000);
const ORIGIN = 'https://anitagaslainmagnetiseuse-maker.github.io';
const sandbox = process.env.PAYPAL_MODE !== 'live';
const PAYPAL = sandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

// Tarifs de test, contrôlés côté serveur.
const CATALOG = {
  soin_1: { name: 'Soin énergétique - 1 séance', cents: 4000 },
  soin_5: { name: 'Soins énergétiques - 5 séances', cents: 14000 },
  soin_9: { name: 'Soins énergétiques - 9 séances', cents: 28000 },
  soin_15: { name: 'Soins énergétiques - 15 séances', cents: 54600 }
};

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 8192) {
      throw new Error('Requête trop longue');
    }
  }
  return JSON.parse(raw || '{}');
}

async function accessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!id || !secret) {
    throw new Error('Clés PayPal absentes sur Render');
  }

  const basic = Buffer.from(`${id}:${secret}`).toString('base64');

  const response = await fetch(`${PAYPAL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Connexion PayPal impossible');
  }

  const data = await response.json();
  return data.access_token;
}

async function paypalRequest(path, body) {
  const token = await accessToken();

  const response = await fetch(`${PAYPAL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID()
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Erreur PayPal (${response.status})`);
  }

  return data;
}

const server = http.createServer(async (req, res) => {
  if (req.headers.origin === ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ORIGIN);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    return send(res, 200, { ok: true });
  }

  const path = new URL(req.url, 'http://localhost').pathname;

  if (req.method === 'GET' && path === '/health') {
    return send(res, 200, {
      status: 'ok',
      service: 'Anita Gaslain PayPal Checkout',
      payments:
        process.env.PAYPAL_CLIENT_ID &&
        process.env.PAYPAL_CLIENT_SECRET
          ? (sandbox ? 'sandbox' : 'live')
          : 'not-configured'
    });
  }

  if (req.method === 'GET' && path === '/api/config') {
    return send(res, 200, {
      clientId: process.env.PAYPAL_CLIENT_ID || null,
      mode: sandbox ? 'sandbox' : 'live',
      catalog: CATALOG
    });
  }

  if (req.method === 'POST' && path.startsWith('/api/')) {
    if (req.headers.origin !== ORIGIN) {
      return send(res, 403, { error: 'Origine non autorisée' });
    }

    if (
      req.headers['content-type']?.split(';')[0] !==
      'application/json'
    ) {
      return send(res, 415, { error: 'JSON requis' });
    }

    try {
      const body = await readBody(req);

      if (path === '/api/orders') {
        const item = CATALOG[body.serviceId];

        if (!item) {
          return send(res, 400, {
            error: 'Prestation inconnue'
          });
        }

        const order = await paypalRequest('/v2/checkout/orders', {
          intent: 'CAPTURE',
          purchase_units: [{
            reference_id: body.serviceId,
            description: item.name,
            amount: {
              currency_code: 'EUR',
              value: (item.cents / 100).toFixed(2)
            }
          }]
        });

        return send(res, 200, { id: order.id });
      }

      if (path === '/api/orders/capture') {
        if (
          typeof body.orderId !== 'string' ||
          !/^[A-Z0-9]{8,30}$/.test(body.orderId)
        ) {
          return send(res, 400, {
            error: 'Identifiant invalide'
          });
        }

        const result = await paypalRequest(
          `/v2/checkout/orders/${body.orderId}/capture`
        );

        return send(res, 200, {
          id: result.id,
          status: result.status
        });
      }

      return send(res, 404, {
        error: 'Route inconnue'
      });

    } catch (err) {
      console.error(err.message);

      return send(res, 502, {
        error: 'Le paiement test n’a pas pu aboutir'
      });
    }
  }

  return send(res, 404, {
   
