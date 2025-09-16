import userModel from "../models/user"
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


    } catch (error) {

    }
}

export default {
    signup
}