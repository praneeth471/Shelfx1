export const verifyToken = (req, res, next) => {
    // Check if user is authenticated via session
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized - Please log in' });
    }
    next();
}; 