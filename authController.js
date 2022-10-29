const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser());
const { validationResult } = require('express-validator') //returns validation errors
const {secret} = require('./config')
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: '24h'})
}
class authController {

    async registration(req,res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){return res.status(400).json({message:'reg errors', errors})}
            const { username, password } = req.body
            const candidate = await User.findOne({ username })
            if (candidate) { res.status(400).json({ message: 'username already exists' }) }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value:'USER'})
            const user = new User({ username, password: hashPassword, roles: [userRole.value] })
            await user.save()
            return res.json({message:'user registered successfully'})
        } catch (e) {  
            console.log(e)
            res.status(400).json({ message: 'reg error' })
        
        }
    }
    async login(req,res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) { return req.status(400).json({ message: `user ${username} was not found` }) }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) { return res.status(400).json({ message: `incorrect password` }) }
            const token = generateAccessToken(user._id, user.roles)
            res.cookie('session', `${user._id}`)
                // .send(`${user._id}`)
            return res.json({ token })
            
        }catch (e) {
            console.log(e)
            res.status(400).json({ message: 'login error' })
            
        }
    }
    // async getUsers(req,res) {
    //     try {
    //         // const userRole = new Role()
    //         // const adminRole = new Role({ value: 'ADMIN' })
    //         // await userRole.save()
    //         // await adminRole.save()
    //         // //now browse collections on cloud.mongodb and delete
    //         const users = await User.find()
    //         res.json(users)
    //     }catch (e) {
            
    //     }
    // }
    async getTasks(req, res) {
        try {
            
            console.log('tasks ok')
            
            
                const id = '635b0ddcc618de490b6cad1b';
                User.findById(id, function (err, docs) {
                    if (err){
                        console.log(err);
                    }
                    else {
                        res.send(JSON.parse(docs.tasks[0][0]))
                    
                    }
                });
        
        } catch (e) {
            console.log(e)
         }
    }
};
module.exports = new authController()

