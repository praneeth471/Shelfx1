import db from "../db.js"; 

export const booksCount = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT COUNT(*) as count FROM books");
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error("Error fetching book count:", err);
        res.status(500).send("Server error");
    }
};

// Get all books for admin
export const getAllBooks = async (req, res) => {
    try {
        const [books] = await db.query(`
            SELECT b.*, u.username as seller_name 
            FROM books b 
            JOIN users u ON b.userId = u.id
            ORDER BY b.id DESC
        `);
        res.json(books);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).send("Server error");
    }
};

// Update book by admin
export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { bookName, price, address, pincode, status, listingType } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE books 
             SET bookName = ?, price = ?, address = ?, pincode = ?, status = ?, listingType = ?
             WHERE id = ?`,
            [bookName, price, address, pincode, status, listingType, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book updated successfully" });
    } catch (err) {
        console.error("Error updating book:", err);
        res.status(500).send("Server error");
    }
};

// Delete book by admin
export const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM books WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).send("Server error");
    }
};

// Get book update history for analytics
export const getBookUpdates = async (req, res) => {
    try {
        const [updates] = await db.query(`
            SELECT 
                DATE(updated_at) as date,
                SUM(CASE WHEN update_type = 'UPDATE' THEN 1 ELSE 0 END) as updates,
                SUM(CASE WHEN update_type = 'DELETE' THEN 1 ELSE 0 END) as deletions
            FROM book_updates
            GROUP BY DATE(updated_at)
            ORDER BY date DESC
            LIMIT 30
        `);
        res.json(updates);
    } catch (err) {
        console.error("Error fetching book updates:", err);
        res.status(500).send("Server error");
    }
};

// Get books sold data
export const getBooksSold = async (req, res) => {
    try {
        const [books] = await db.query(`
            SELECT b.*, u.username as seller_name 
            FROM books b 
            JOIN users u ON b.userId = u.id
            WHERE b.status = 'SOLD'
        `);
        res.json(books);
    } catch (err) {
        console.error("Error fetching sold books:", err);
        res.status(500).send("Server error");
    }
};

// Get revenue data
export const getRevenue = async (req, res) => {
    try {
        const [revenue] = await db.query(`
            SELECT 
                DATE(s.createdAt) as date,
                SUM(CASE 
                    WHEN s.plan = 'starter' THEN 2400
                    WHEN s.plan = 'premium' THEN 8200
                    ELSE 0
                END) as amount
            FROM subscription s
            GROUP BY DATE(s.createdAt)
            ORDER BY date DESC
            LIMIT 30
        `);
        res.json(revenue);
    } catch (err) {
        console.error("Error fetching revenue:", err);
        res.status(500).send("Server error");
    }
};
