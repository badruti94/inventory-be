const bcrypt = require('bcrypt')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { user } = require('../../models')

exports.register = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
    })

    const { error } = schema.validate(req.body)
    try {
        if (error) {
            return res.status(401).send({
                message: error.details[0].message
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await user.create({ ...req.body, password: hashPassword })

        res.status(201).send({
            message: 'User registered successfully',
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }


}

exports.login = async (req, res) => {
    try {
        const userLogin = await user.findOne({
            where: {
                username: req.body.username
            }
        })
        if(!userLogin){
            return res.status(401).send({
                message: 'Username not found'
            })
        }

        const result = await bcrypt.compare(req.body.password, userLogin.password)
        if(!result){
            return res.status(401).send({
                message: 'wrong password'
            })
        }

        const token = jwt.sign({userId: userLogin.id}, process.env.TOKEN_KEY)

        res.status(200).send({
            message: 'user login sucessfully',
            data : {
                user: {
                    username: userLogin.username,
                    id: userLogin.id
                },
                token
            }
        })

    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }

}