import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
  const { username, count } = req.query;

  if (!username || !count || typeof username !== 'string' || isNaN(count)) {
    return res.status(400).json({ error: 'Valid username and count required' });
  }

  if (username.length > 15 || !/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  try {
    if (!process.env.X_API_KEY || !process.env.X_API_SECRET) {
      console.error('Missing X API credentials');
      throw new Error('Missing X API credentials');
    }

    const client = new TwitterApi({
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
    });

    const callbackUrl = process.env.NODE_ENV === 'production'
      ? 'https://your-app.vercel.app/api/callback'
      : 'http://localhost:3000/api/callback';

    const authClient = await client.generateAuthLink(callbackUrl, {
      authAccessType: 'write',
      linkMode: 'authorize',
    });

    const authUrl = `${authClient.url}&username=${encodeURIComponent(username)}&count=${count}`;
    console.log(`Generated OAuth URL for ${username}`);
    return res.status(200).json({ authUrl });
  } catch (error) {
    console.error(`Error initiating OAuth for ${username}:`, error);
    return res.status(500).json({ error: `Failed to initiate authentication: ${error.message}` });
  }
}