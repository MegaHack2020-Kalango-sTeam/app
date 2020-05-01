//Importando  express pra auto atualização.
const express = require('express');
//Importando mongoose pra mongoDB.
const mongoose = require('mongoose');
//Importando as rotas do app.
const routes = require ('/rotas/rotas');

//Colocando nosso APP para utilizar o Express.
const app = express();
//Tornando o app responsivo ao .json.
app.use(express.json());
//Indicando em qual porta irá rodar nosso servidor.
app.listen(3333);
