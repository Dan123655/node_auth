const express = require("express");
const PORT = process.env.PORT||3500;
const mongoose = require("mongoose");
const authRouter = require("./authRouter");

const cors = require("cors");
const app = express();
app.use(cors({

    methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'HEAD'], 
  
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': 'https://dan123655.github.io',
   
    origin: ['https://node-auth-seven.vercel.app','https://dan123655.github.io'
      
  
    ],
  
  
    credentials: true, 
    maxAge: 864000, 
  
  }));

app.use(express.json());
app.use("/api", authRouter);
// app.get("/", (req, res) => {
//     res.send("Express on Vercel");
//   });
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