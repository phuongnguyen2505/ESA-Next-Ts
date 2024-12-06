import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: "Product ID is required" });
            }

            // Lấy thông tin ảnh trước khi xóa sản phẩm
            const [product]: any = await new Promise((resolve, reject) => {
                db.query(
                    'SELECT photo FROM table_product WHERE id = ?',
                    [id],
                    (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    }
                );
            });

            if (product?.photo) {
                // Đường dẫn đến file ảnh
                const imagePath = path.join(process.cwd(), 'public/uploads/products', product.photo);
                
                // Xóa file ảnh nếu tồn tại
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            // Xóa sản phẩm từ database
            await new Promise((resolve, reject) => {
                db.query(
                    'DELETE FROM table_product WHERE id = ?',
                    [id],
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
            });

            res.status(200).json({ message: "Deleted successfully" });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
