// imports - importações 
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Config JSON response - configurando resposta em JSON
app.use(express.json())

//Models
const User = require('./models/User')

//Open/Public Route - rota pública/aberta
app.get('/', (req, res) => {
    res.status(200).json({mgs: 'Bem vindo a nossa API'})
})

//Register User - Registrando usuário
app.post('/auth/register', async(req, res) => {

    const {name, email, password, confirmPassword} = req.body

    //validations - validações 
    if(!name) {
        return res.status(422).json({msg: 'O nome é obrigatório'})
    }

    if(!email) {
        return res.status(422).json({msg: 'O e-mail é obrigatório'})
    }

    if(!password) {
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    if(password !== confirmPassword) {
        return res.status(422).json({msg: 'As senhas não conferem'})
    }

//Check if user exists - checando se o usuário existe
const userExists = await User.findOne({ email:email})

    if(!userExists) {
        return res.status(422).json({msg: 'Já existe um usuário com este e-mail. Por favor, utilize outro'})
    }

//Create password - criando senha
const salt = await bcrypt.genSalt(12)
const passwordHash = await bcrypt.hash(password, salt)

// Create user - criando usuário
const user = new User({
    name,
    email,
    password,
})

    try {
        await user.save()

        res.status(201).json({msg: 'Usuário criado com sucesso'})

    }catch(error) {
        console.log(error)

        res.status(500).json({msg: 'Houve um erro no servidos, tente novamente mais tarde'})
    }
})

app.listen(8000)
