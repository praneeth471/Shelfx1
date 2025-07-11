import db from "../db.js"; 

export const adminStatus = async (req, res) => {
    const { username, password } = req.body;
    try {
        const sql = "SELECT * FROM admin WHERE username = ?";
        const [results] = await db.query(sql, [username]);

        if (results.length > 0) {
            const admin = results[0];

            if (admin.password === password) {
                console.log('Login successful for:', username);
                 res.status(200).send({ message: 'Login successful'});
            } else {
                console.log('Invalid credentials for:', username);
                 res.status(401).send({ message: 'Invalid credentials' });
            }
        } else {
            console.log('User not found:', username);
             res.status(401).send({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send({ message: 'Server error' });
    }
};

export const adminLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error logging out" });
            }
            res.clearCookie('connect.sid');
            res.json({ message: "Logged out successfully" });
        });
    } catch (err) {
        console.error("Error in admin logout:", err);
        res.status(500).send("Server error");
    }
};


