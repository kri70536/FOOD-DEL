import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token; // Ensure token is extracted properly

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, please login again" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decodedToken.id; // Assign userId to req.body
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Invalid token, please login again" });
    }
};

export default authMiddleware;