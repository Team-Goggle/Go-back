import connectToDatabase from '../../../lib/mongodb';
import Sgf from '../../../models/Sgf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const sgf = new Sgf({
      title,
      content
    });
    
    await sgf.save();
    return res.status(201).json({ success: true, data: sgf });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}