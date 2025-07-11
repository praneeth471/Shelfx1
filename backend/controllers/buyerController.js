import bcrypt from "bcrypt";
import db from "../db.js";


export const signupBuyer = async (req, res) => {
  const { username, email, password, pincode, state } = req.body;
  const hunterApiKey = 'b6348712893d49368750be36e34648a16850a431';
  const verifyUrl = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${hunterApiKey}`;
  
  const response = await fetch(verifyUrl);
  const data = await response.json();
  
  if (data.data.result !== 'deliverable') {
    return res.status(400).json({
      success: false,
      message: 'Invalid or undeliverable email address'
    });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO buyers (username, email, password, pincode, state) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [username, email, hashedPassword, pincode, state]);
    res.status(200).send("Registration successful");
  } catch (err) {
    console.error("Error registering buyer:", err);
    res.status(500).send("Server error");
  }
};

export const loginBuyer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const sql = "SELECT id, password FROM buyers WHERE email = ?";
    const [rows] = await db.query(sql, [email]);
    if (rows.length === 0) return res.status(401).send("Invalid email or password");

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (isMatch) {
      req.session.userId  = rows[0].id;
      
      req.session.save(err => {
        if (err) {
            console.error("Session save error:", err);
            return res.status(500).send("Server error");
        }
        console.log("After login - Session ID:", req.sessionID);
        console.log("Session after save:", req.session);
        res.setHeader("Access-Control-Allow-Credentials", "true"); 
        res.status(200).json({ message: "Login successful", session: req.session });
    });
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error("Error logging in buyer:", err);
    res.status(500).send("Server error");
  }
};

export const exploreBuyer = async (req, res) => {
      const userId = req.session.userId; // Get user ID from UserSession
    
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
    
      try {
        // Fetch user details
        const sql = 'SELECT * FROM buyers WHERE id = ?';
        const [rowsUser] = await db.query(sql, [userId]);
    
        if (rowsUser.length === 0) {
          return res.status(404).json({ message: 'Seller not found' });
        }
    
        const user = rowsUser[0];  
    
        const sqlBooks = 'SELECT id, userId, bookname, address, pincode, price, imageData, listingType, status, approvedBuyerId FROM books';
        const [rowsBooks] = await db.query(sqlBooks);
    
        const books = rowsBooks.map(book => ({
          address: book.address,
          pincode: book.pincode,
          price: book.price,
          id: book.id,
          userId: book.userId,
          bookName: book.bookname,
          imageUrl: book.imageData || null,
          listingType: book.listingType,
          status: book.status,
          approvedBuyerId: book.approvedBuyerId
        }));
    
        res.json({ user, books });
      } catch (err) {
        console.error('Error fetching current user:', err);
        res.status(500).json({ message: 'Server error' });
      }
    };

export const getBuyers = async (req, res) => {
  try {
    const sql = "SELECT id, username, email FROM buyers";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching buyers:", err);
    res.status(500).send("Server error");
  }
};

export const postRequest = async (req, res) => {
    const { bookId, sellerId } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send("User not authenticated");
    }

    try {
        // Check if request already exists
        const checkSql = "SELECT * FROM request WHERE userId = ? AND bookId = ? AND sellerId = ?";
        const [existingRequests] = await db.query(checkSql, [userId, bookId, sellerId]);
        
        if (existingRequests.length > 0) {
            return res.status(400).json({ message: "You have already requested this book" });
        }

        const sql = "INSERT INTO request (userId, bookId, sellerId) VALUES (?, ?, ?)";
        await db.query(sql, [userId, bookId, sellerId]);
        res.status(201).json({ message: "Request created successfully" });
    } catch (err) {
        console.error("Error creating request:", err);
        res.status(500).json({ message: "Server error" });
    }
};


export const updateBuyer = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const sql = "UPDATE buyers SET username = ?, email = ? WHERE id = ?";
    await db.query(sql, [username, email, id]);
    res.status(200).send("Buyer updated successfully");
  } catch (err) {
    console.error("Error updating buyer:", err);
    res.status(500).send("Server error");
  }
};

export const deleteBuyer = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM buyers WHERE id = ?";
    await db.query(sql, [id]);
    res.status(200).send("Buyer deleted successfully");
  } catch (err) {
    console.error("Error deleting buyer:", err);
    res.status(500).send("Server error");
  }
};

export const countBuyers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM buyers");
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Error fetching buyer count:", err);
    res.status(500).send("Server error");
  }
};

export const editBuyerProfile = async (req, res) => {
    const userId =req.session.userId;
    const { username,newPassword } = req.body; 
  
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  if(newPassword == null){
    try {
      const sql = 'UPDATE buyers SET username = ? WHERE id = ?';
      const [result] = await db.query(sql, [username, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Username updated successfully' });
    } catch (err) {
      console.error('Error updating username:', err);
      res.status(500).json({ message: 'Server error' });
    }}
    else{ try {
      const hashedPassword = await bcrypt.hash(newPassword, 10); 
      const sql = 'UPDATE buyers SET password = ? WHERE id = ?';
      const [result] = await db.query(sql, [hashedPassword, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error('Error updating password:', err);
      res.status(500).json({ message: 'Server error' });
    }
  
    }
  };

export const getBookStatus = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  
  try {
    const requestSql = `
      SELECT bookId, requestDate, status 
      FROM request 
      WHERE userId = ?`;

    const [requestRows] = await db.query(requestSql, [userId]);

    if (requestRows.length === 0) {
      return res.status(404).json({ message: "No requests found for this buyer" });
    }

    const bookIds = requestRows.map((row) => row.bookId);

    const bookSql = `
      SELECT id as bookId, bookName, price 
      FROM books 
      WHERE id IN (?)`;

    const [bookRows] = await db.query(bookSql, [bookIds]);

    const bookMap = {};
    bookRows.forEach((book) => {
      bookMap[book.bookId] = {
        bookName: book.bookName,
        bookPrice: book.price,
      };
    });

    const requests = requestRows.map((row) => ({
      bookId: row.bookId,
      bookName: bookMap[row.bookId]?.bookName || "Unknown", // Check if book exists
      bookPrice: bookMap[row.bookId]?.bookPrice || 0, // Default price to 0 if not found
      date: row.requestDate,
      status: row.status,
    }));

    res.json({ requests });
  } catch (err) {
    console.error("Error fetching request details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBuyerById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const sql = "SELECT id, username, email FROM buyers WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    
    res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error("Error fetching buyer details:", err);
    res.status(500).json({ message: "Server error" });
  }
};
