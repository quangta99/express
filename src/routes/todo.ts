import express, {Request, Response} from 'express'
import { PubSub }from '@google-cloud/pubsub'
import {Storage} from '@google-cloud/storage'
import { v4 as uuidv4, v4 } from 'uuid';

import { Todo, TodoClass } from '../models/todo.model'

const router = express.Router()
const cre = {
        
    "type": "service_account",
    "project_id": "go-firestore-rest-api",
    "private_key_id": "df1e6c245486c90c182edba78ecd0d4af7ecb994",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXwGvPmHrOC9m1\n+w8i/849avMpy4xrOxWWfXn1YB/Kr4n38G94Xrqa3xBPsOtm6oYlwrheTL7MxdWH\nk4MzHPkNnSzpYOOBSDS1gKRA0Rz14UA76TCwGKuijdtj4Fr0d1SuHgX5tlBTPAj7\n2YV5/feOtZds8ME61NO0C5ep2LKygG0KQpdSfL9cLtUsfFYv+xmPeTSn3yu84maY\nmIWiXHRXUsVjmzkFIy3aaTOze9hvFg3qAlXP2DvAJgVR4PS2b47ADFvMVzo0gn0I\nbdfXK1wAFQg4PgbIk2Rdwe5BWnI34K34ZVTxHfHZASfyDhHWg5+dKxkhrJR/ISIT\nsTmvSL3TAgMBAAECggEAN2kIZ1MaaxO5ENdPTmZTUgvHMrs/r4SHqVRFf8L1t0j5\nDq/1+PyfQUo7trPR6WcfF9CYKEPeltnSWtUEU5rDzf7Je5CyLVBdlSXaSXlLTkzR\nAfIEWp2jawayy0ZiJboGCgfU8gqkO5RGHGSDts6Gh2TU5Jo6jkD9tBZsF6d7UYNY\nRu8BkVNueNT/j9Nem6hzx1aux5gchIiEwjYnteDsZZBhNEPzilETXGAuT5UcVB2j\njgtX66+2mp1X76cdo1hk31vzrYxpsV1TqgsDAJzDToT1keWSWslWwx3xOUwHPs8N\nYfyuj+H71qZZiraTWiaN4kLJThJBtkbUJCjbPf8D/QKBgQD6ifBLH0dDnYXb2wsB\nrsX9SdwIz6XUqSg/n0T74lf/ABX4znadUzzfxGlB2EGqQ529Oxn+M2iChP667YVK\nMbuoqws/+CvXgrr6OF2qS74hajBpE/fIYIqdKZD7JbZAd6czyNEeRPwmu3xA+SH4\nTtGxg8WrRbu5M404w87KKwuOnQKBgQDcdFzI3i4GsglbzYYCLrW1WCPKGJey22fR\ngA3XZPp7+t2TVN9gjGQbvEFKNGzOiUCy4Y6ZQVJH8ALolExBHdj0Hdvl3X3XMB//\n93vWlP1NhGPwjZsthqINSk94Vxlxv2YPriEXblHQdZ4lsCZ3KhTeK4QNeHoUqk1q\njjx4XusbLwKBgEVuSKto5aT1WI1PLMOwnanN+C5w7TH8Fu1axBFR7rT6Xxxuiyya\nTrpsggb/WWNIDcTNRizOLl5NYRKIlHG1Sp45mIqHyg6Vah/B0yNIjk5QUU4tfHOJ\nXaCkTktrbhB7mFifhGRxFbfeKVcQM7vOjAo3zGXkk1uFz9M1YG9icnd5AoGAHEXc\nJHLCKl+o7ZolJqCA81nzdRbEVc7nuKmYnNg5e68Hvb5zy3kV2azCHtcsYSyfHJHq\n7OLAv7MbXGKwiOVgDqbJrehDHFbys6w0uKdw+QESpCY1EZijrdqq6H8bJ0hpuXcW\njV+7pGWBO8oklMHT3U5taCDcX0wcE59cR/+8XUcCgYEAz7ly/vY82s+beEVcpbbZ\nIw1tmOCkzPywQcePrSX+rPGdShYeiwQmprbZWiKyTYREUKkr2xt23A0irSgG3KOW\nWOZ0uswzj5r7VEnQflbAXhQLONRBWGHZZYdJ1GEqVlhb0A4j3xsw7jnB1Ypwfmbl\niiPXdFzuEX2Q3on3AfThMgw=\n-----END PRIVATE KEY-----\n",
    "client_email": "pubsub@go-firestore-rest-api.iam.gserviceaccount.com",
    "client_id": "112269970918400710901",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/pubsub%40go-firestore-rest-api.iam.gserviceaccount.com"
  
}

const projectId = 'go-firestore-rest-api';
const subscriptionName = 'todo-sub';
const timeout = 60;
const pubSubClient = new PubSub({projectId: projectId, credentials: cre});



function listenForMessages() {
  const subscription = pubSubClient.subscription(subscriptionName);

  const messageHandler = async(message: any) => {
      
    let result = new TodoClass();
    result = JSON.parse(message.data)
    console.log('result :>> ', result);
    const todos = await Todo.find({})
    const todo = todos.find(item => item.id === result.id)
    if(todo) {
        await Todo.updateOne({'id': todo.id},{'title': result.title,'description': result.description})
    }
    else {
        await Todo.insertMany(result)
    }
    message.ack();
  };

  subscription.on('message', messageHandler);

}

listenForMessages();

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
        const todos = await Todo.find({})
        let todo = new TodoClass()
        todo.id = (todos.length + 1).toString()
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