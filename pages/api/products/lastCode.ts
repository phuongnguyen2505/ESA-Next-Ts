import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const result: any = await new Promise((resolve, reject) => {
            db.query(
                'SELECT masp FROM table_product ORDER BY CAST(SUBSTRING(masp, 3) AS UNSIGNED) DESC LIMIT 1',
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });
        
        const lastCode = result[0]?.masp || 'MH000000';
        return res.status(200).json({ lastCode });
    } catch (error) {
        console.error('Error fetching last product code:', error);
        return res.status(200).json({ lastCode: 'MH000000' });
    }
} 