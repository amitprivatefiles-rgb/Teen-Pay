import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { handleCors } from './_lib/auth';

function hashPII(data: string | undefined): string | undefined {
  if (!data) return undefined;
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'POST') {
    try {
      const { eventName, eventSourceUrl, userEmail, userPhone, firstName, lastName, city, state, zipCode, country, value, currency, contentName, contentCategory, contentIds, contents, numItems } = req.body;
      
      const token = process.env.FACEBOOK_ACCESS_TOKEN;
      if (!token) return res.status(500).json({ error: 'Missing access token' });

      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: {
            em: hashPII(userEmail),
            ph: hashPII(userPhone),
            fn: hashPII(firstName),
            ln: hashPII(lastName),
            ct: hashPII(city),
            st: hashPII(state),
            zp: hashPII(zipCode),
            country: hashPII(country)
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
        }]
      };

      const response = await fetch('https://graph.facebook.com/v18.0/1213789437532180/events?access_token=' + token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
