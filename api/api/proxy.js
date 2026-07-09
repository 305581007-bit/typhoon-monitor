export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { platform, token, keyword, action } = req.body || {};

  try {
    let response;
    
    if (platform === 'istero') {
      if (action === 'hotlist') {
        response = await fetch('https://api.istero.com/resource/v1/douyin/top', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } else if (action === 'search') {
        response = await fetch('https://api.istero.com/resource/v1/douyin/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, keyword, limit: 10 })
        });
      }
    } else if (platform === 'tianapi') {
      if (action === 'hotlist') {
        response = await fetch(`https://apis.tianapi.com/douyinhot/index?key=${token}`);
      } else if (action === 'search') {
        response = await fetch(`https://apis.tianapi.com/douyinvideo/index?key=${token}&word=${encodeURIComponent(keyword)}&num=10`);
      }
    }

    if (!response) {
      res.status(400).json({ error: 'Invalid platform or action' });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
