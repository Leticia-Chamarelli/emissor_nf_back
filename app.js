// imports - importações 
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Open/Public Route - rota pública/aberta
app.get('/', (req, res) => {
    res.status(200).json({mgs: "Bem vindo a nossa API"})
})

app.listen(8000)
