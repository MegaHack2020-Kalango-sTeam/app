//Importando o pacote que gera e verifica o token.
const jwt = require("jsonwebtoken");
//Importando configurações de autorização (secret).
const authConfig = require('../config/auth.json');

//Exportando o módulo de autenticação.
module.exports= (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
    return res.status(401).send({error:"Erro de autenticação: Não foi providenciado nenhum Token para sua requisição."});
    //Verificando o Token.
    const parts = authHeader.split(' ');
    //Se não houver duas partes.
    if(!parts.lenght === 2)
    return res.status(401).send({error: "Erro de autenticação: Token mal formatado."});
    //Desestruturando.
    const [scheme, token] = parts;
    if(!/^Bearer$/i.test(scheme))
    return res.status(401).send({error: "Erro de autenticação: Token com início inválido."});

    //Verificando se bate com o usuário requisitante.
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err)
        return res.status(401).send({error: "Erro de autenticação: Token inválido."});

        req.userId = decoded.params.id;
        return next();
    });
};