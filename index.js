const express = require("express");
const PORT = process.env.PORT||3500;
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
import { myKey } from "./key.js";
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", authRouter);

const start = async () => {

    try {
        await mongoose.connect(`${myKey}`)
        app.listen(PORT, () => console.log(`server started on ${PORT}`))
    }
    
    catch (e) {
        console.log(e)
    }
}
start()