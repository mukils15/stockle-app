const PORT = 8000
const axios = require("axios").default
const express = require("express")
const cors = require("cors")
require('dotenv').config()
const app = express()
const path = require("path")

app.use(cors())
app.use(express.static('dist'));

app.get('/', (req, res) => {
    console.log("ok");
    console.log(req.url);
    res.sendFile(path.join(__dirname, '/dist/index.html'))
})


app.get('/word', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/ws/screeners/v1/finance/screener/predefined/saved',
        params: {scrIds: 'day_gainers', count: '100'},
        headers: {
            'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    }
    axios.request(options).then((response) => {
        to_send = []
        for (let i = 0; i < 100; i++){
            let poss = response.data['finance']['result'][0]['quotes'][i]['symbol']
            if (poss.length === 4){
                to_send.push(response.data['finance']['result'][0]['quotes'][i]['symbol'])
            }
        }
        console.log(to_send)
        res.json(to_send)
    }).catch((error) => {
        console.error(error)
    })
})


app.get('/check', (req, res) => {
    const word = req.query.word

    const options = {
        method: 'GET',
        url: 'https://stock-data-yahoo-finance-alternative.p.rapidapi.com/v6/finance/quote',
        params: {symbols: word},
        headers: {
            'x-rapidapi-host': 'stock-data-yahoo-finance-alternative.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    }
    axios.request(options).then((response) => {
        if (response.data['quoteResponse']['result'].length === 0){
            res.json("Symbol not found")
        } else {
            res.json("Found")
        }
    }).catch((error) => {
        console.error(error)
    })
})


app.listen(PORT, () => console.log('Server running on port ' + PORT))