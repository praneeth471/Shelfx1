import db from "../db.js";

export const addToHistory = async (req, res) => {
    try {
        const { bookId, sellerId, buyerId, bookName, price, status } = req.body;
        
        const sql = `
            INSERT INTO history (bookId, sellerId, buyerId, bookName, price, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await db.query(sql, [bookId, sellerId, buyerId, bookName, price, status]);
        res.status(201).json({ message: "History record added successfully" });
    } catch (err) {
        console.error("Error adding to history:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getBuyerHistory = async (req, res) => {
    try {
        const { buyerId } = req.params;
        
        const sql = `
            SELECT 
                h.id,
                h.bookId,
                h.sellerId,
                h.buyerId,
                h.bookName,
                h.price,
                h.status,
                h.requestDate,
                u.username as sellerName,
                b.username as buyerName
            FROM history h
            JOIN users u ON h.sellerId = u.id
            JOIN buyers b ON h.buyerId = b.id
            WHERE h.buyerId = ? AND h.status = 'APPROVED'
            ORDER BY h.requestDate DESC
        `;
        
        const [rows] = await db.query(sql, [buyerId]);
        res.json({ history: rows });
    } catch (error) {
        console.error("Error fetching buyer history:", error);
        res.status(500).json({ error: "Failed to fetch buyer history" });
    }
};

export const getSellerHistory = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        
        const sql = `
            SELECT 
                h.id,
                h.bookId,
                h.sellerId,
                h.buyerId,
                h.bookName,
                h.price,
                h.status,
                h.requestDate,
                b.username as buyerName
            FROM history h
            JOIN buyers b ON h.buyerId = b.id
            WHERE h.sellerId = ? AND h.status = 'APPROVED'
            ORDER BY h.requestDate DESC
        `;
        
        const [rows] = await db.query(sql, [sellerId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching seller history:", err);
        res.status(500).json({ message: "Server error" });
    }
}; 