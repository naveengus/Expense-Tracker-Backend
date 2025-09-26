import userModel from "../models/user.js"
import auth from "../common/auth.js"
import { randString } from "../common/helper.js"


const signup = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            req.body.password = await auth.hashPassword(req.body.password)
            req.body.userId = randString(6)

            await userModel.create(req.body);
            res.status(201).send({
                message: "user Create Successfully"
            });
        } else {
            res.status(400).send({
                message: `This Email ${req.body.email} already Exists`
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email })
        if (user) {
            if (await auth.hashCompare(req.body.password, user.password)) {
                let payload = { _id: user._id, email: user.email };
                let token = await auth.createToken(payload)

                res.status(200).send({
                    message: "Login Successful",
                    token,
                    userId: user._id,
                });
            } else {
                res.status(400).send({ message: "Password Incorrect  " });

            }
        } else {
            res.status(400).send({ message: "User does not exists" });

        }

    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error,
        });
    }
}

const getUser = async (req, res) => {
    try {
        let user = await userModel.findById(req.user.id).select("name email profilePicture");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Data fetch success",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const name = req.body.name; // multer parses this correctly
        // const profilePicture = req.file ? req.file.path.replace(/\\/g, "/") : undefined;

        let imageUrl;

        if (req.file) {
            // Cloudinary upload object returns 'path' or 'secure_url'
            imageUrl = req.file.path || req.file.secure_url || `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { ...(name && { name }), ...(imageUrl && { profilePicture: imageUrl }), },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User Not Found" });

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};




export default {
    signup,
    login,
    getUser,
    updateUser
}