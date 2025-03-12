import connectToDatabase from '../../../lib/mongodb';
import Sgf from '../../../models/Sgf';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  try {
    await connectToDatabase();
    const sgf = await Sgf.findById(id);
    
    if (!sgf) {
      return res.status(404).json({ message: 'SGF not found' });
    }
    
    return res.status(200).json({ success: true, data: sgf });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}