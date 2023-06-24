const express = require('express')
const app = express()

const dotenv = require('dotenv')
const mongoose = require('mongoose')
const categoryRoutes = require('./routes/categories')

dotenv.config()

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB connected..")
    })
    .catch(error => {console.log('DB not connected '+ error)})

app.use(express.json());

app.get('/api', (req, res) => {
    res.send('hello there')
})

app.use('/api/categories', categoryRoutes)

app.listen(3000, () => {
    console.log('Server is running...')
})
