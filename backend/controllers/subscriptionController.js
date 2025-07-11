import db from "../db.js"; // Adjust this import to match your db file structure

export const getSubscriptions = async (req, res) => {
    try {
        const sql = "SELECT id, userId, plan FROM subscription";
        const [rows] = await db.query(sql);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching subscriptions:", err);
        res.status(500).send("Server error");
    }
};

export const getSubscriptionByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const sql = "SELECT id, userId, plan FROM subscription WHERE userId = ?";
        const [rows] = await db.query(sql, [userId]);
        if (rows.length === 0) {
            res.status(404).send("Subscription not found");
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        console.error("Error fetching subscription:", err);
        res.status(500).send("Server error");
    }
};

export const subscribePlan = async (req, res) => {
    const { selectedPlan } = req.params;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send("User not authenticated");
    }

    if (!selectedPlan) {
        return res.status(400).send("Subscription plan is required");
    }

    const validPlans = ['free', 'starter', 'premium'];
    if (!validPlans.includes(selectedPlan)) {
        return res.status(400).send("Invalid subscription plan");
    }

    try {
        const [rows] = await db.query(
            "SELECT * FROM subscription WHERE userId = ?",
            [userId]
        );

        if (rows.length > 0) {
            const updateSql = "UPDATE subscription SET plan = ? WHERE userId = ?";
            const [result] = await db.query(updateSql, [selectedPlan, userId]);
            if (result.affectedRows === 0) {
                return res.status(404).send("Subscription not found");
            }
            res.status(200).send("Subscription updated successfully");
        } else {
            const insertSql = "INSERT INTO subscription (userId, plan) VALUES (?, ?)";
            await db.query(insertSql, [userId, selectedPlan]);
            res.status(200).send("Subscription successful");
        }
    } catch (err) {
        console.error("Error subscribing user:", err);
        res.status(500).send("Server error");
    }
};
