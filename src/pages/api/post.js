import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, count } = req.body;

  if (!username || !count || typeof username !== 'string' || typeof count !== 'number') {
    return res.status(400).json({ error: 'Valid username and count required' });
  }

  if (username.length > 15 || !/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  try {
    if (!process.env.X_API_KEY || !process.env.X_API_SECRET || !process.env.X_ACCESS_TOKEN || !process.env.X_ACCESS_SECRET) {
      console.error('Missing X API credentials');
      throw new Error('Missing X API credentials');
    }

    const client = new TwitterApi({
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_SECRET,
    });

    const tweetText = `@yourusername: @${username} mentioned Union ${count} times! 🚀 #UnionToken`;
    await client.v2.tweet(tweetText);
    console.log(`Posted to X: ${tweetText}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error posting for ${username}:`, error);
    if (error.code === 429) {
      const resetTime = error.rateLimit?.reset
        ? new Date(error.rateLimit.reset * 1000).toISOString()
        : 'unknown';
      return res.status(429).json({ error: 'Rate limit exceeded', retryAfter: resetTime });
    }
    return res.status(500).json({ error: `Failed to post: ${error.message}` });
  }
}