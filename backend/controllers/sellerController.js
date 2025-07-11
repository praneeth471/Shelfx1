import bcrypt from "bcrypt";
import db from "../db.js";
import cloudinary from "../config/cloudinary.js";
import { list } from "postcss";

export const signupSeller = async (req, res) => {
    const { username, email, password } = req.body;
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
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        await db.query(sql, [username, email, hashedPassword]);
        res.status(200).send("Registration successful");
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Server error");
    }
};

export const loginSeller = async (req, res) => {
    console.log("Before login - Session ID:", req.sessionID);
    
    const { email, password } = req.body;
    try {
        const sql = "SELECT id, email, password FROM users WHERE email = ?";
        const [rows] = await db.query(sql, [email]);
        if (rows.length === 0) return res.status(401).send("Invalid email or password");

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (isMatch) {
            req.session.userId = rows[0].id;
            
            console.log("Setting userId in session:", rows[0].id);
            
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
        console.error("Error logging in:", err);
        res.status(500).send("Server error");
    }
};

export const getDetails = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    try {
        const sqlUser = "SELECT * FROM users WHERE id = ?";
        const [rowsUser] = await db.query(sqlUser, [userId]);
        if (rowsUser.length === 0) return res.status(404).json({ message: "User not found" });

        const user = rowsUser[0];
        const sqlBooks = "SELECT id, bookname, address, pincode, price, imageData, listingType FROM books WHERE userId = ?";
        const [rowsBooks] = await db.query(sqlBooks, [userId]);

        const books = rowsBooks.map(book => ({
            address: book.address,
            pincode: book.pincode,
            price: book.price,
            id: book.id,
            bookName: book.bookname,
            imageUrl: book.imageData || null,  // ✅ Use the Cloudinary URL directly
            listingType: book.listingType,
        }));

        res.json({ user, books });
    } catch (err) {
        console.error("Error fetching current user:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSellers = async (req, res) => {
    try {
        const sql = "SELECT id, username, email FROM users";
        const [rows] = await db.query(sql);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching sellers:", err);
        res.status(500).send("Server error");
    }
};

export const getCountSellers = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT COUNT(*) as count FROM users");
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error("Error fetching seller count:", err);
        res.status(500).send("Server error");
    }
};

export const getSellerDetailsById = async (req, res) => {
    try {
        const userId = req.params.id;
        const sql = "SELECT * FROM users WHERE id = ?";
        const [rowsUser] = await db.query(sql, [userId]);

        if (rowsUser.length === 0) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const seller = rowsUser[0];
        res.json({
            user: {
                userId: seller.id,
                username: seller.username,
                email: seller.email,
            },
        });
    } catch (err) {
        console.error("Error fetching seller details:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateSellerDetailsById = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
        await db.query(sql, [username, email, id]);
        res.status(200).send("Seller updated successfully");
    } catch (err) {
        console.error("Error updating seller:", err);
        res.status(500).send("Server error");
    }
};

export const deleteSellerById = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = "DELETE FROM users WHERE id = ?";
        await db.query(sql, [id]);
        res.status(200).send("Seller deleted successfully");
    } catch (err) {
        console.error("Error deleting seller:", err);
        res.status(500).send("Server error");
    }
};

export const uploadBook = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send("User not authenticated. Please log in.");
    }

    // Get the user's subscription plan
    const [subscriptionRows] = await db.query("SELECT plan FROM subscription WHERE userId = ?", [userId]);
    const userPlan = subscriptionRows[0]?.plan;

    if (!userPlan) {
        return res.status(403).json({ redirect: "http://localhost:5173/subscription" });
    }

    const uploadLimits = { free: 5, starter: 50, premium: Infinity };

    const [bookCountRows] = await db.query("SELECT COUNT(*) as count FROM books WHERE userId = ?", [userId]);
    const currentUploadCount = bookCountRows[0].count;

    if (currentUploadCount >= uploadLimits[userPlan]) {
        return res.status(403).json({ redirect: "http://localhost:5173/subscription" });
    }

    const { bookName, address, pincode, price, image, listingType } = req.body;

    if (!bookName || !address || !pincode || !price || !image) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Validate and extract Base64 data
        let base64Data;

        if (image.startsWith('data:image')) {
            console.log("Full Base64 String (First 50 chars):", image.substring(0, 50));

            const base64Parts = image.split(','); // Split at the comma
            if (base64Parts.length !== 2) {
                return res.status(400).json({ message: "Invalid image format." });
            }
            base64Data = base64Parts[1]; // Get only the Base64 data
        } else {
            return res.status(400).json({ message: "Image format not supported. Please upload a Base64-encoded image." });
        }

        // Upload image to Cloudinary
        const uploadOptions = {
            folder: "shelfx_books",
            public_id: `book_${userId}_${Date.now()}`,
            transformation: [
                { width: 1200, height: 1600, crop: "limit" },
                { fetch_format: "auto" },
                { quality: "auto:good" }
            ],
            tags: ["book", `user_${userId}`]
        };

        const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, uploadOptions);

        console.log("Cloudinary Upload Result:", uploadResult);

        // Save book details to database
        const sql = "INSERT INTO books (address, pincode, price, imageData, userId, bookName, listingType) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [dbResult] = await db.query(sql, [
            address,
            pincode,
            price,
            uploadResult.secure_url,
            userId,
            bookName,
            listingType || 'sell', // Default to 'sell' if not provided
        ]);

        res.status(201).json({
            message: "Book uploaded successfully",
            book: {
                id: dbResult.insertId,
                address,
                pincode,
                price,
                bookName,
                listingType: listingType || 'sell',
                imageUrl: uploadResult.secure_url,
                imageDetails: {
                    format: uploadResult.format,
                    size: uploadResult.bytes,
                    dimensions: {
                        width: uploadResult.width,
                        height: uploadResult.height
                    }
                }
            }
        });

    } catch (err) {
        console.error("Error uploading book:", err);
        res.status(500).json({
            message: "Failed to upload book",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
};

export const deleteBook = async(req, res) => {
      const bookId = req.params.id;
      const userId = req.session.userId;
    
      try {
        const sqlDelete = "DELETE FROM books WHERE id = ? AND userId = ?";
        const [result] = await db.query(sqlDelete, [bookId, userId]);
    
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Book not found or user not authorized" });
        }
    
        res.status(200).json({ message: "Book deleted successfully" });
      } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).json({ message: "Server error" });
      }
    }

export const editUserProfile = async (req, res) => {
    const userId = req.session.userId; 
    const { username,newpassword } = req.body; 
  
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  if(newpassword==null){
    try {
      const sql = 'UPDATE users SET username = ? WHERE id = ?';
      const [result] = await db.query(sql, [username, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Username updated successfully' });
    } catch (err) {
      console.error('Error updating username:', err);
      res.status(500).json({ message: 'Server error' });
    }}
  else{
    try {
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      const sql = 'UPDATE users SET password = ? WHERE id = ?';
      const [result] = await db.query(sql, [hashedPassword, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'password updated successfully' });
    } catch (err) {
      console.error('Error updating password:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  };

export const logout = (req, res) => {
    req.session.destroy();
    res.status(200).send("Logout successful");
};
