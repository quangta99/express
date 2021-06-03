import express, {Request, Response} from 'express'
import { v4 as uuidv4, v4 } from 'uuid';

import { Todo, TodoClass } from '../models/todo.model'

const router = express.Router()

router.get('/api/todo', async(req: Request, res: Response) => {
    const todos = await Todo.find({})
    return res.status(200).send(todos)
})

router.post('/api/todo', async(req: Request, res: Response) => {
    const {title, description} = req.body
    if(typeof title !== 'string'){
        return res.status(422).send('title: require String')
    }
    else if(typeof description !== 'string') {
        return res.status(422).send('description: require String')
    }
    else {
        let todo = new TodoClass()
        todo.id = v4()
        todo.title = title
        todo.description = description
        const result = await Todo.insertMany(todo)
        return res.status(201).send('todo is created')   
    }
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

router.delete('/api/todo/:id', async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const {deletedCount} = await Todo.deleteOne({"id": id})
        if(deletedCount !== 0) {
            return res.status(200).send('deleted success')
        }
        else {
            return res.status(403).send('not exist this todo')
        }
    }
    catch {
        return res.status(403).send('not exist this todo')
    }
})

router.patch('/api/todo/:id', async (req:Request, res: Response) => {
    const {id} = req.params
    const {title, description} = req.body
    if(typeof title !== 'string'){
        return res.status(422).send('title: require String')
    }
    else if(typeof description !== 'string') {
        return res.status(422).send('description: require String')
    }
    else {
        try{
            const result = await Todo.updateOne({'id': id},{'title': title,'description': description})
            console.log('result :>> ', result);
            if(result.nModified!==0) {
                return res.status(200).send('modified success')
            }
            else {
                return res.status(404).send('not found this todo')
            }
        }
        catch {
            return res.status(404).send('error')
        }
    }
})

export {router as todoRouter}