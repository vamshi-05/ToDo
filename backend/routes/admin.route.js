const express=require('express')
const routes=express.Router()

const {
    getUsers,
    getTasks,
    deleteTask
}=require('../controllers/admin.controller')
const {
    addTask,
}=require('../controllers/task.controller')


 routes.get('/users',getUsers)
 routes.post('/addtask',addTask)
 routes.get('/tasks',getTasks)
 routes.delete('/:id',deleteTask)


module.exports=routes