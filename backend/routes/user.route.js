const express=require('express')
const routes=express.Router()
const {
    saveUser,
    checkUser
}=require('../controllers/user.controller')

routes.route('/signup')
    .post(saveUser)
routes.route('/login')
    .post(checkUser)

module.exports=routes