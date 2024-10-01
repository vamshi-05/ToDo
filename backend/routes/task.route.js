const express=require('express')
const routes=express.Router()

const {
    getTasks,
    addTask,
    deleteTask,
    updateTask,
    summary,
}=require('../controllers/task.controller')
const { getAdmins } = require('../controllers/admin.controller')

routes.post('/addtask',addTask)
routes.get('/tasks',getTasks)
routes.get('/admins',getAdmins)
routes.get('/summary',summary)
routes.delete('/:id',deleteTask)
routes.put('/update/:taskId',updateTask)

module.exports=routes