const fetch = require("node-fetch")
const axios = require("axios")
const _ = require("lodash")

const dotenv = require("dotenv")
dotenv.config()

const discord = require("discord.js")
const client = new discord.Client()

baseURL = "https://www.alphavantage.co/query?function="
prefix = "?"

client.on("ready", () => {
    console.log("Ready!")
})

client.on("message", (msg) => {
    if(!msg.content.startsWith(prefix + "moolah")){
        return
    }

    const args = msg.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    console.log(args)

    queryFunc = args[0].toLowerCase()
    if(queryFunc === "forex"){
        FROM = args[1].toUpperCase()
        TO = args[2].toUpperCase()
        getForexData(FROM, TO)
            .then(res => {
                msg.channel.send(res)
            })
            .catch(err => {
                console.log(err)
            })
    }
    if(queryFunc == "crypto"){
        SYMBOL = args[1].toUpperCase()
        MARKET = args[2].toUpperCase()
        getCryptoData(SYMBOL, MARKET)
            .then(res => {
                msg.channel.send(res)
            })
            .catch(err => {
                console.log(err)
            })
        
        // console.log(price)
        // msg.channel.send(price)
    }
})
// res.data['Time Series (Digital Currency Daily)'][getDate()][`1a. open (${market})`]
function getForexData(from, to){
    queryURL = `${baseURL}FX_DAILY&from_symbol=${from}&to_symbol=${to}&apikey=${process.env.KEY}`
    return axios.get(queryURL)
        .then(res => {
            // return res.data['Time Series FX (Daily)'][getDate()]
            return res.data['Time Series FX (Daily)'][getDate()]['1. open']
        })
        .catch(err => {
            console.log(err)
        })
}

function getCryptoData(symbol, market){
    queryURL = `${baseURL}DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=${market}&apikey=${process.env.KEY}`
    return axios.get(queryURL)
        .then(res => {
            return res.data['Time Series (Digital Currency Daily)'][getDate()][`1a. open (${market})`]
        })
        
        .catch(err => {
            console.log(err)
        })
}

function getDate(){
    const date = new Date()
    let month = date.getMonth() + 1
    if(month < 10){
        month = `0${month}`
    }
    let dateToday = `${date.getFullYear()}-${month}-${date.getDate()}`
    return dateToday
}

client.login(process.env.TOKEN)