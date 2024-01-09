const mongoose = require('mongoose')
const MONGO = process.env.MONGO

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected at ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
    }
}

module.exports = connectDB