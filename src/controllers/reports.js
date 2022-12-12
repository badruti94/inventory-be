const { item, item_in_out, sequelize } = require('../../models')
const moment = require('moment')
const Joi = require('joi')

exports.getReport = async (req, res) => {
    try {
        const schema = Joi.object({
            month: Joi.required(),
            year: Joi.string().min(4).required(),
        })

        const { error } = schema.validate(req.query)

        if (error) {
            return res.status(401).send({
                message: error.details[0].message
            })
        }

        const {month, year} = req.query

        const query = `
        SELECT 
            iio.id, iio."createdAt" as date, proof_code, type, iio.stock, stock_after,
            i.name
        FROM item_in_outs iio 
        JOIN items i ON iio.item_id = i.id
        WHERE
            iio.user_id = ${req.userId}
            AND EXTRACT(MONTH FROM iio."createdAt") = '${month}'
            AND EXTRACT(YEAR FROM iio."createdAt") = '${year}'
        ORDER by iio."createdAt" ASC
        `
        let [data] = await sequelize.query(query)

        data = data.map((item_in_out, i) => {
            item_in_out.date = moment(item_in_out.date).format("DD MMM YYYY HH:mm")

            return item_in_out
        })

        res.status(200).send({
            data: {
                report: data
            }
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            msg: error.message
        })
    }
}