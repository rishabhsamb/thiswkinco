const express = require('express')
const app = express()
const port = 3001

const redis = require('redis')
const client = redis.createClient()
const { promisify } = require('util')
const getAsync = promisify(client.get).bind(client) // asynchronously reads from Redis key:value store, given key as a string.

app.get('/papers', async (req, res) => {
    const papers = await getAsync('papers')
    res.header("Access-Control-Allow-Origin", "http://localhost:3000") // FOR DEV PURPOSES ONLY.
    return res.send(papers)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
