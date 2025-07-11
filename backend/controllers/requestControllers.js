import db from "../db.js"; // Adjust this import to match your db file structure
import { sendApprovalEmail } from "./emailService.js";
import { addToHistory } from "./historyController.js";

export const getRequestsBySellerId = async (req, res) => {
    const { sellerId } = req.params;

    try {
        const sql = `
            SELECT 
                r.id,
                r.userId,
                r.bookId,
                b.id,
                b.pincode,
                b.state,
                b.email,
                bk.id,
                bk.bookName,
                s.id
            FROM 
                request r
            JOIN 
                buyers b ON r.userId = b.id
            JOIN 
                books bk ON r.bookId = bk.id
            JOIN 
                users s ON r.sellerId = s.id
            WHERE 
                r.sellerId = ? AND r.status = "PENDING";
        `;

        const [rows] = await db.query(sql, [sellerId]);
        
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No pending requests found' });
        }
        
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).send("Server error");
    }
};

export const approveRequest = async (req, res) => {
    const { bookId, sellerId, userId, bookName, buyerEmail } = req.body;

    try {
        // Update request status to APPROVED
        const [result] = await db.query(
            "UPDATE request SET status = 'APPROVED' WHERE bookId = ? AND sellerId = ? AND userId = ?",
            [bookId, sellerId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Get book price
        const [bookRows] = await db.query(
            "SELECT price FROM books WHERE id = ?",
            [bookId]
        );

        if (bookRows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Add to history
        await addToHistory({
            body: {
                bookId,
                sellerId,
                buyerId: userId,
                bookName,
                price: bookRows[0].price,
                status: 'APPROVED'
            }
        }, { json: () => {} });

        // Mark book as SOLD and store the approved buyer's ID
        await db.query(
            "UPDATE books SET status = 'SOLD', approvedBuyerId = ? WHERE id = ?",
            [userId, bookId]
        );

        try {
            // Send approval email
            await sendApprovalEmail(buyerEmail, bookName);
        } catch (emailError) {
            console.error("Failed to send approval email:", emailError);
            // Continue with the process even if email fails
        }

        res.json({ message: "Request approved and book marked as sold" });
    } catch (error) {
        console.error("Error approving request:", error);
        res.status(500).json({ message: "Error approving request" });
    }
};

export const rejectRequest = async (req, res) => {
    const { bookId } = req.params;
    const { sellerId, userId } = req.body;

    try {
        const sql = "UPDATE request SET status = ? WHERE bookId = ? AND sellerId = ? AND userId = ?";
        const [result] = await db.query(sql, ["REJECTED", bookId, sellerId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json({ message: "Request rejected successfully" });
    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ message: "Error rejecting request", error });
    }
};

export const getRequestCount = async (req, res) => {
    try {
        const [result] = await db.query('SELECT COUNT(*) as count FROM request');
        res.json(result[0]);
    } catch (error) {
        console.error("Error getting request count:", error);
        res.status(500).send("Server error");
    }
};
