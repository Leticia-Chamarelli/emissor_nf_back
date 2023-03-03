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

//Private route - rota privada 
app.get("/user/:id", checkToken, async (req, res) =>{

    const id = re.params.id

    //check if user exists 
    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    res.status(200).json({ user })
})

//Check token - checando o token 
function checkToken(req, res, next) {

    const authHeader = re.headers['authorization']
    const token = authHeader && authHeader.split("")[1]

    if(!token) {
        return res.status(401).json({msg: "Acesso negado!"})
    }

    try{

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()

    }catch(error) {
        res.status(400).json({msg: "Token inválido!"})
    }

}

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

    if(userExists) {
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

        res.status(500).json({msg: 'Houve um erro no servidor, tente novamente mais tarde'})
    }
})

//Login user - login do usuário
app.post("/auth/login", async (req, res) => {

    const { email, password } = re.body
    
    // Validations - validações
    if(!email) {
        return res.status(422).json({msg: 'O e-mail é obrigatório'})
    }

    if(!password) {
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }
})

//check if user exists - checando se o usuário existe
const user = await User.findOne({ email:email})

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    //chek if password match - checando se as senhas são iguais
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({msg: 'Senha inválida'})
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign(
            {
            id: user._id,
            }, 
        secret,
        )

        res.status(200).json({msg: 'Autenticação realizada com sucesso', token})

    } catch (err) {
        console.log(error)

        res.status(500).json({msg: 'Aconteceu algo no servidor, tente novamente mais tarde'})

    }

app.listen(8000)
