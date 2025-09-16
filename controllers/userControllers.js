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

export default {
    signup,
    login
}