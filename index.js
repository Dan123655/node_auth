const express = require('express')
const PORT = process.env.PORT||3500
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter)


const start = async () => {

    try {
        await mongoose.connect(`mongodb+srv://node_user:SFnZZH4eGfuRPMCk@cluster0.d5adm64.mongodb.net/?retryWrites=true&w=majority`)
        app.listen(PORT, () => console.log(`server started on ${PORT}`))
    }
    
    catch (e) {
        console.log(e)
    }
}
start()