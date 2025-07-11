/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password (hashed)
 *       example:
 *         id: 1
 *         username: johndoe
 *         email: john@example.com
 *         password: hashedpassword123
 *
 *     Buyer:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - pincode
 *         - state
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the buyer
 *         username:
 *           type: string
 *           description: The username
 *         email:
 *           type: string
 *           description: The buyer email
 *         password:
 *           type: string
 *           description: The buyer password (hashed)
 *         pincode:
 *           type: string
 *           description: The buyer's pincode
 *         state:
 *           type: string
 *           description: The buyer's state
 *       example:
 *         id: 1
 *         username: johndoe
 *         email: john@example.com
 *         password: hashedpassword123
 *         pincode: "123456"
 *         state: "California"
 *
 *     Book:
 *       type: object
 *       required:
 *         - bookName
 *         - address
 *         - pincode
 *         - price
 *         - image
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the book
 *         userId:
 *           type: integer
 *           description: The id of the user who uploaded the book
 *         bookName:
 *           type: string
 *           description: The name of the book
 *         address:
 *           type: string
 *           description: The address where the book is available
 *         pincode:
 *           type: string
 *           description: The pincode where the book is available
 *         price:
 *           type: string
 *           description: The price of the book
 *         imageUrl:
 *           type: string
 *           description: The URL of the book image
 *       example:
 *         id: 1
 *         userId: 1
 *         bookName: "The Great Gatsby"
 *         address: "123 Main St"
 *         pincode: "123456"
 *         price: "10.99"
 *         imageUrl: "http://res.cloudinary.com/example/image/upload/book.jpg"
 *
 *     Request:
 *       type: object
 *       required:
 *         - userId
 *         - bookId
 *         - sellerId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the request
 *         userId:
 *           type: integer
 *           description: The id of the buyer who made the request
 *         bookId:
 *           type: integer
 *           description: The id of the requested book
 *         sellerId:
 *           type: integer
 *           description: The id of the seller who owns the book
 *         status:
 *           type: string
 *           description: The status of the request (PENDING, APPROVED, REJECTED)
 *         requestDate:
 *           type: string
 *           format: date-time
 *           description: The date when the request was made
 *       example:
 *         id: 1
 *         userId: 2
 *         bookId: 1
 *         sellerId: 1
 *         status: "PENDING"
 *         requestDate: "2023-01-01T00:00:00.000Z"
 *
 *     Subscription:
 *       type: object
 *       required:
 *         - userId
 *         - plan
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the subscription
 *         userId:
 *           type: integer
 *           description: The id of the user who subscribed
 *         plan:
 *           type: string
 *           description: The subscription plan (free, starter, premium)
 *       example:
 *         id: 1
 *         userId: 1
 *         plan: "premium"
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Sellers
 *     description: Seller management endpoints
 *   - name: Buyers
 *     description: Buyer management endpoints
 *   - name: Books
 *     description: Book management endpoints
 *   - name: Requests
 *     description: Request management endpoints
 *   - name: Subscriptions
 *     description: Subscription management endpoints
 *   - name: Admin
 *     description: Admin management endpoints
 */

/**
 * @swagger
 * /signupSeller:
 *   post:
 *     summary: Register a new seller
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /loginSeller:
 *   post:
 *     summary: Login as a seller
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 session:
 *                   type: object
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /details:
 *   get:
 *     summary: Get authenticated user details
 *     tags: [Sellers]
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /sellers:
 *   get:
 *     summary: Get all sellers (admin only)
 *     tags: [Sellers]
 *     responses:
 *       200:
 *         description: List of all sellers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /Edituserprofile:
 *   post:
 *     summary: Edit user profile
 *     tags: [Sellers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               newpassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /countSellers:
 *   get:
 *     summary: Get count of all sellers (admin only)
 *     tags: [Sellers]
 *     responses:
 *       200:
 *         description: Count of sellers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /sellerdetails/{id}:
 *   get:
 *     summary: Get seller details by ID
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: Seller details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /sellers/{id}:
 *   put:
 *     summary: Update seller details
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Seller ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seller updated successfully
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete seller (admin only)
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: Seller deleted successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /deleteBook/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /signupBuyer:
 *   post:
 *     summary: Register a new buyer
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - pincode
 *               - state
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               pincode:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /loginBuyer:
 *   post:
 *     summary: Login as a buyer
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /Editbuyerprofile:
 *   post:
 *     summary: Edit buyer profile
 *     tags: [Buyers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /explore:
 *   get:
 *     summary: Explore books for buyers
 *     tags: [Buyers]
 *     responses:
 *       200:
 *         description: List of books and user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Buyer'
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /buyers:
 *   get:
 *     summary: Get all buyers (admin only)
 *     tags: [Buyers]
 *     responses:
 *       200:
 *         description: List of all buyers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /buyers/{id}:
 *   put:
 *     summary: Update buyer details
 *     tags: [Buyers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Buyer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Buyer updated successfully
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete buyer (admin only)
 *     tags: [Buyers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Buyer ID
 *     responses:
 *       200:
 *         description: Buyer deleted successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /countBuyers:
 *   get:
 *     summary: Get count of all buyers (admin only)
 *     tags: [Buyers]
 *     responses:
 *       200:
 *         description: Count of buyers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get book status for buyer
 *     tags: [Buyers]
 *     responses:
 *       200:
 *         description: Book status information
 *       400:
 *         description: Buyer ID is required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /request:
 *   post:
 *     summary: Create a new book request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - sellerId
 *             properties:
 *               bookId:
 *                 type: integer
 *               sellerId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Request created successfully
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /requests/{sellerId}:
 *   get:
 *     summary: Get requests by seller ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Seller ID
 *     responses:
 *       200:
 *         description: List of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   bookId:
 *                     type: integer
 *                   pincode:
 *                     type: string
 *                   state:
 *                     type: string
 *                   email:
 *                     type: string
 *                   bookName:
 *                     type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /requests/{bookId}/approve:
 *   put:
 *     summary: Approve a book request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sellerId
 *               - userId
 *               - bookName
 *               - buyerEmail
 *             properties:
 *               sellerId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               bookName:
 *                 type: string
 *               buyerEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /requests/{bookId}/reject:
 *   put:
 *     summary: Reject a book request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sellerId
 *               - userId
 *             properties:
 *               sellerId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /subscribe/{selectedPlan}:
 *   post:
 *     summary: Subscribe to a plan
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: selectedPlan
 *         schema:
 *           type: string
 *         required: true
 *         description: Selected plan (free, starter, premium)
 *     responses:
 *       200:
 *         description: Subscription successful
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of all subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /adminStatus:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /subscription/{id}:
 *   get:
 *     summary: Get subscription by user ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Subscription details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /books/count:
 *   get:
 *     summary: Get count of all books (admin only)
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Count of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /uploadBook:
 *   post:
 *     summary: Upload a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookName
 *               - address
 *               - pincode
 *               - price
 *               - image
 *             properties:
 *               bookName:
 *                 type: string
 *               address:
 *                 type: string
 *               pincode:
 *                 type: string
 *               price:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Book uploaded successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Subscription required or upload limit reached
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /check-auth:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 userId:
 *                   type: integer
 */