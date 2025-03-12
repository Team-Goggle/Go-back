import connectToDatabase from '../../../lib/mongodb';
import Sgf from '../../../models/Sgf';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();
    const sgfs = await Sgf.find({}).sort({ uploadedAt: -1 }).select('title uploadedAt');
    return res.status(200).json({ success: true, data: sgfs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}