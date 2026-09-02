import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './_lib/mongodb';
import { handleCors } from './_lib/auth';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
    if (!FACEBOOK_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Missing FACEBOOK_ACCESS_TOKEN' });
    }

    const {
      eventName, eventSourceUrl, userEmail, userPhone, 
      firstName, lastName, city, state, zipCode, country, 
      value, currency, contentName, contentCategory, contentIds, contents, numItems
    } = req.body;

    const hashString = (val?: string) => {
      if (!val) return undefined;
      return crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex');
    };

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: {
            em: hashString(userEmail),
            ph: hashString(userPhone),
            fn: hashString(firstName),
            ln: hashString(lastName),
            ct: hashString(city),
            st: hashString(state),
            zp: hashString(zipCode),
            country: hashString(country),
            client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            client_user_agent: req.headers['user-agent']
          },
          custom_data: {
            value,
            currency,
            content_name: contentName,
            content_category: contentCategory,
            content_ids: contentIds,
            contents,
            num_items: numItems
          }
        }
      ]
    };

    const fbRes = await fetch(`https://graph.facebook.com/v18.0/1213789437532180/events?access_token=${FACEBOOK_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await fbRes.json();
    return res.status(fbRes.ok ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
