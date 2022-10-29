const Router = require('express')
const router = new Router()
const controller = require('./authController')
const { check } = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')
router.post('/registration',
    [check("username", 'username field cannot be empty').notEmpty(),
    check("password",'password should be between 5 and 12 characters').isLength({min:5, max:12})], controller.registration)
router.post('/login', controller.login)
// router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)
router.get('/tasks', controller.getTasks)

module.exports = router