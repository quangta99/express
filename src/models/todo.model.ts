import mongoose from 'mongoose'

class TodoClass {
  id: string = "";
  title: string = "";
  description: string = "";
}

interface TodoDoc extends mongoose.Document {
  id: string;
  title: string;
  description: string;
}

const todoSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    }
})

const Todo = mongoose.model<TodoDoc>('Todo', todoSchema)


export { Todo, TodoClass }