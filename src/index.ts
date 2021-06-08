import express from 'express'
import {json} from 'body-parser'
import http from 'http'
import mongoose  from 'mongoose'


require('dotenv').config()

import { todoRouter } from './routes/todo'

const app = express()

const port = process.env.PORT
const mongoHostName = process.env.MONGO_HOSTNAME
const mongoPort = process.env.MONGO_PORT
const nameDB = process.env.MONGO_DB

app.use(json())
app.use(todoRouter)

mongoose.connect(`mongodb://${mongoHostName}:${mongoPort}/${nameDB}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=> {
    console.log('connected mongodb')
})

http.createServer(app).listen(port, ()=>{
    console.log('server is running on port: ', port);
})
