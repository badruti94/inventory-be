const cloudinary = require('cloudinary')
const DatauriParser = require('datauri/parser')
const path = require('path')
const { item, item_in_out } = require('../../models')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const parser = new DatauriParser()

exports.getItems = async (req, res) => {
    try {
        const data = await item.findAll({
            where: {
                user_id: req.userId
            },
            attributes: ['id', 'code', 'name', 'description', 'stock', 'photo'],
            order: [['createdAt','ASC']]
        })

        res.status(200).send({
            data: {
                items: data
            }
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

exports.createItem = async (req, res) => {
    try {
        const file = parser.format(path.extname(req.files.photo.name).toString(), req.files.photo.data).content
        const result = await cloudinary.uploader.upload(file, {
            folder: 'uploads',
            use_filename: true,
            unique_filename: false
        })

        await item.create({
            ...req.body,
            photo: result.secure_url,
            user_id: req.userId
        })

        res.status(201).send({
            message: 'Item created successfully'
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
        })
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params

        const itemFound = await item.findByPk(id)
        if (!itemFound) {
            return res.status(404).send({
                message: 'Item not found'
            })
        }

        await item.destroy({
            where: {
                id
            }
        })

        res.status(200).send({
            message: 'Item deleted successfully'
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

exports.itemIn = async (req, res) => {
    try {
        const { id } = req.params

        const { stock, proof_code } = req.body

        const itemFromDB = await item.findByPk(id)

        await item_in_out.create({
            type: 'in',
            stock,
            proof_code,
            stock_after: parseInt(itemFromDB.stock) + parseInt(stock),
            user_id: req.userId,
            item_id: req.params.id,
        })

        await item.increment({
            stock: stock,
        }, {
            where: {
                id
            }
        })

        res.status(200).send({
            message: 'success'
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}

exports.itemOut = async (req, res) => {
    try {
        const { id } = req.params

        const { stock, proof_code } = req.body

        const itemFromDB = await item.findByPk(id)
        if (parseInt(itemFromDB.stock) - parseInt(stock) < 0) {
            return res.status(401).send({
                message: "Jumlah barang yang keluar melebihi stok yang ada"
            })
        }

        await item_in_out.create({
            type: 'out',
            stock,
            proof_code,
            stock_after: parseInt(itemFromDB.stock) - parseInt(stock),
            user_id: req.userId,
            item_id: req.params.id,
        })

        await item.increment({
            stock: -stock,
        }, {
            where: {
                id
            }
        })

        res.status(200).send({
            message: 'success'
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
}