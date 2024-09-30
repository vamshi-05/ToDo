const express=require('express')
const routes=express.Router()

const {
    getTasks,
    addTask,
    deleteTask,
    updateTask,
}=require('../controllers/task.controller')
const { getAdmins } = require('../controllers/admin.controller')

routes.post('/addtask',addTask)
routes.get('/tasks',getTasks)
routes.get('/admins',getAdmins)
routes.delete('/:id',deleteTask)
routes.put('/update/:taskId',updateTask)

module.exports=routes