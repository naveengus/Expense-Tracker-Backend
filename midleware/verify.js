// verify.js
import auth from "../common/auth.js";

const verify = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token Missing" });
        }

        let payload = await auth.decodeToken(token); // now using verify

        req.user = { id: payload._id || payload.id };
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or Expired Token", error: error.message });
    }
};

export default verify;
