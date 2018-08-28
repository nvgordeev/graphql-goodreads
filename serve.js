const express = require('express')
const graphqlHTTP = require('express-graphql')
const app = express()
const DataLoader = require('dataloader')
const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)

const schema = require('./schema.js')

const fetchAuthor = (id) =>
    fetch(`https://www.goodreads.com/author/show.xml?key=1un3AYn63yr4ncdWR77A&id=${id}`)
        .then(response => response.text())
        .then(parseXML)


const fetchBooks = id => 
    fetch(`https://www.goodreads.com/book/show/${id}.xml?key=1un3AYn63yr4ncdWR77A`)
    .then(response => response.text())
    .then(parseXML)

const authorLoader = new DataLoader(keys => Promise.all(keys.map(fetchAuthor)))
const bookLoader = new DataLoader(keys => Promise.all(keys.map(fetchBooks)))


app.use('/graphql', graphqlHTTP({
    schema,
    context: {
        authorLoader,
        bookLoader
    },
    graphiql: true
}))

app.listen(4000)
console.log('Listening....')