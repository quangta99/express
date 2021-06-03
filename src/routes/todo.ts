import express, {Request, Response} from 'express'
import { v4 as uuidv4, v4 } from 'uuid';

import { Todo } from '../models/todo.model'

const router = express.Router()

router.get('/api/todo', async(req: Request, res: Response) => {
    const todos = await Todo.find({})
    return res.status(200).send(todos)
})

router.post('/api/todo', async(req: Request, res: Response) => {
    const {title, description} = req.body
    const todo = Todo.build({id : v4(),title, description})
    await todo.save()
    return res.status(201).send('todo is created')
})

router.get('/api/todo/:id', async(req: Request, res:Response) => {
    const {id} = req.params
    try {
        const todo = await Todo.findOne({"id": id})
        return res.status(200).send(todo)
    }
    catch {

    }
})

export {router as todoRouter}