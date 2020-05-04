//Importando  express pra auto atualização.
const express = require('express');
//Importando mongoose pra mongoDB.
const mongoose = require('mongoose');
//Importando as rotas do app.
const routes = require ('./routes/rotas');

//Colocando nosso APP para utilizar o Express.
const app = express();
//Tornando o app responsivo ao .json.
app.use(express.json());

//Conectando ao banco de dados
mongoose.connect('mongodb+srv://crimson:admin@cluster0-xkpwq.mongodb.net/test?retryWrites=true&w=majority', {
 useNewUrlParser: true,
 useUnifiedTopology: true
});

//Indicando em qual porta irá rodar nosso servidor.
app.listen(3333);
