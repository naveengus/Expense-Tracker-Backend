import userModel from "../models/user.js"
import auth from "../common/auth.js"
import { randString } from "../common/helper.js"
import nodemailer from "nodemailer";


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
        const imageUrl = req.file?.path || req.file?.secure_url;

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

const forgotPassword = async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });
        if (user) {
            const generateOTP = () => {
                const char = "0123456789";
                return Array.from(
                    { length: 6 },
                    () => char[Math.floor(Math.random() * char.length)]
                ).join("");
            };

            const OTP = generateOTP();
            await userModel.updateOne(
                { email: req.body.email },
                {
                    $set: {
                        resetPasswordOtp: OTP,
                        resetPasswordExpires: Date.now() + 3600000,
                    },
                }
            );
            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                secure: true,
                port: 465,
                auth: {
                    user: process.env.USER_MAIL,
                    pass: process.env.PASS_MAIL,
                },
            });

            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: user.email,
                subject: "Password Reset",
                html: `<div>
                <p>Dear ${user.firstName} ${user.lastName}</p>
                <p>We received a request to reset your password. Here is your One Time Password (OTP):<strong>${OTP}</strong></p>
                <p>Thank You</p>
                <p>${user.firstName} ${user.lastName}</p>
              </div>`,
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Password Reset email Sent" });
        } else {
            res.status(400).send({
                message: "User does not exist",
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error",
        });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { OTP, password } = req.body;
        const user = await userModel.findOne({
            resetPasswordOtp: OTP,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            const message = user ? "OTP Expired" : "Invalid OTP";
            return res.status(404).send({ message });
        }

        const hashPassword = await auth.hashPassword(password);

        await userModel.updateOne(
            { resetPasswordOtp: OTP },
            {
                $set: {
                    password: hashPassword,
                    resetPasswordOtp: null,
                    resetPasswordExpires: null,
                },
            }
        );
        res.status(200).send({
            message: "Password changed Successfully",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error",
        });
    }
};

export default {
    signup,
    login,
    getUser,
    updateUser,
    forgotPassword,
    resetPassword
}