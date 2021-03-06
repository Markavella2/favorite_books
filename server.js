const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'books'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('faveBooks').find().toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addBook', (request, response) => {
    db.collection('faveBooks').insertOne({title: request.body.title,
    author: request.body.author, likes: 0})
    .then(result => {
        console.log('Favorite Book Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
//BELOW IS THE ERROR!!?? Fixed??
app.put('/addOneLike', (request, response) => {
    db.collection('faveBooks').updateOne({title: request.body.bookTitleS, author: request.body.bookAuthorS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteBook', (request, response) => {
    //console.log(request)
    db.collection('faveBooks').deleteOne({title: request.body.bookTitleS})
    .then(result => {
        console.log('Book Deleted')
        response.json('Book Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})