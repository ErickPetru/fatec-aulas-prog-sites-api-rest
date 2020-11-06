import express from 'express'
import cors from 'cors'
import nedb from 'nedb'
import rest from 'express-nedb-rest'

const app = new express()
app.use(cors())

const api = rest()

const dbPosts = new nedb({ filename: 'posts.db', autoload: true })
api.addDatastore('posts', dbPosts)

const dbUsers = new nedb({ filename: 'users.db', autoload: true })
api.addDatastore('users', dbUsers)

const dbTodos = new nedb({ filename: 'todos.db', autoload: true })
api.addDatastore('todos', dbTodos)

app.use('/', api)

app.listen(8080, () => console.log('Listening at http://localhost:8080'))
