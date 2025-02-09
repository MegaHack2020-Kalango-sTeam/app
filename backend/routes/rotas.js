const axios = require('axios');
const Cliente = require ('../models/usuarios/cliente');
const Loja = require ('../models/usuarios/loja');
const Fornecedores = require ('../models/usuarios/fornecedores');

//Importando express.
const express = require('express');
//Importando bcryptjs para encriptar ou decriptar.
const bcrypt = require('bcryptjs');
//Definindo as rotas, que serão administradas pelo express.
const routes = express.Router();

//Criando as Routes de login para cliente (c), fornecedores (f) e lojas (l);
routes.post('/login-c', async (req,res) =>{
    const {email, senha} = req.body;
    //Procura pelo cliente no nosso DB.
    const cliente = await Cliente.findOne({email}).select('+senha');
    //Verifica se o usuário existe.
    if (!cliente)
    return res.status(400).send({error: 'Cliente não foi encontrado.'});
        
    //Decriptação e verificação da senha.
    if (!await bcrypt.compare(senha, Cliente.senha))
     return res.status(400).send({error: 'Senha incorreta.'});

    Cliente.senha = undefined;
    res.send({cliente, token: generateToken({id:cliente.id})});
});

routes.post('/login-f', async (req,res) =>{
    const {email, senha} = req.body;
    //Procura pelo fornecedor no nosso DB.
    const fornecedores = await Fornecedores.findOne({email}).select('+senha');
    //Verifica se o usuário existe.
    if (!fornecedores)
    return res.status(400).send({error: 'Fornecedor não encontrado.'});
        
    //Decriptação e verificação da senha.
    if (!await bcrypt.compare(senha, Fornecedores.senha))
     return res.status(400).send({error: 'Senha incorreta.'});

    Fornecedores.senha = undefined;
    res.send({fornecedores, token: generateToken({id:fornecedores.id})});
});

routes.post('/login-l', async (req,res) =>{
    const {email, senha} = req.body;
    //Procura pelo fornecedor no nosso DB.
    const loja = await Loja.findOne({email}).select('+senha');
    //Verifica se o usuário existe.
    if (!loja)
    return res.status(400).send({error: 'Loja não encontrada.'});
        
    //Decriptação e verificação da senha.
    if (!await bcrypt.compare(senha, Loja.senha))
     return res.status(400).send({error: 'Senha incorreta.'});

    Loja.senha = undefined;
    res.send({loja, token: generateToken({id:loja.id})});
});

//Criando as Routes de registo para cliente (c), fornecedores (f) e lojas (l);
routes.post('/register-c', async (req,res) => {
    const {email} = req.body;
 try { 
    if (await Cliente.findOne({email}))
        return res.status(400).send({error: 'Usuário já cadastrado.'});
    const cliente = await Cliente.create(req.body);

    cliente.senha = undefined;

    return res.send({ cliente, token: generateToken({id:cliente.id})});
}
    catch(err){
        return res.status(400).send({ error: 'Falha ao registrar.'});
} 
});

routes.post('/register-f', async (req,res) => {
    const {email, cnpj, nome} = req.body;
 try { 
    if (await Fornecedores.findOne({email}))
        return res.status(400).send({error: 'E-mail já cadastrado.'});
    if (await Fornecedores.findOne({cnpj}))
        return res.status(400).send({error: 'Este CNPJ já está cadastrado.'});
    // Utilizando a API disponibilizada pelo GR1D para verificação de dados pelo CNPJ.
    const axiosGetData = () => { 
        axios({
          url: `https://gateway.gr1d.io/sandbox/procob/v1/consultas/v1/L0008/${cnpj}`,
          method: "get",
          headers: { "X-Api-Key": "f01073cf-4413-43b3-bce0-0c700c22cea" }
        });
      };
    // Caso não exista o CNPJ ou seja inserido de forma inadequada.
    if(axiosGetData.code !== 000)
    return res.status(400).send({error: 'O CNPJ informado não existe.'});
    // Verificando se a receita se encontra ativa.
    const {content:{'situacao da receita':atividade}} = axiosGetData;
    if(atividade!== ativa)
    return res.status(400).send({error: 'O CNPJ informado não se encontra ativo.'});
    // Registrando a loja no banco de dados.
    const fornecedor = await Fornecedores.create(req.body);

    fornecedor.senha = undefined;

    return res.send({ fornecedor, token: generateToken({id:fornecedor.id})});
}
    catch(err){
        return res.status(400).send({ error: 'Falha ao registrar.'});
} 
});

routes.post('/register-l', async (req,res) => {
    const {email, cnpj} = req.body;
 try { 
    if (await Loja.findOne({email}))
        return res.status(400).send({error: 'E-mail já cadastrado.'});
    if (await Loja.findOne({cnpj}))
        return res.status(400).send({error: 'Este CNPJ já está cadastrado.'});
    // Utilizando a API disponibilizada pelo GR1D para verificação de dados pelo CNPJ.
    const axiosGetData = () => { 
        axios({
          url: `https://gateway.gr1d.io/sandbox/procob/v1/consultas/v1/L0008/${cnpj}`,
          method: "get",
          headers: { "X-Api-Key": "f01073cf-4413-43b3-bce0-0c700c22cea" }
        });
      };
    // Caso não exista o CNPJ ou seja inserido de forma inadequada.
    if(axiosGetData.code !== 000)
    return res.status(400).send({error: 'O CNPJ informado não existe.'});
    // Verificando os dados inseridos (nome da loja e CNPJ).
    const {content:{nome:nomeloja}} = axiosGetData;
    if(!nome.includes(nomeloja))
    return res.status(400).send({error: 'O nome da loja não coincide ao nome cadastrado no CNPJ.'});
    // Registrando a loja no banco de dados.
    const loja = await Loja.create(req.body);

    loja.senha = undefined;

    return res.send({ loja, token: generateToken({id:loja.id})});
}
    catch(err){
        return res.status(400).send({ error: 'Falha ao registrar.'});
} 
});

//Criando a rota de recuperação de senha para clientes, fornecedores e lojas.
routes.post('/esqueci-senha', async (req,res) => {
    const {email} = req.body;
    try {
    const user = await User.findOne({ email });
    if (!user){
        const user = await Loja.findOne({ email });
        if (!user){
            const user = await Fornecedores.findOne({ email });
            if (!user){
                res.status(400).send({error:'O usuário informado não existe, tente novamente.'});
            }
        }
    }

    const token = crypto.randomBytes(4).toString('hex');
    const now = new Date;
    now.setHours(now.getHours() +1 );

    await User.findByIdAndUpdate(user.id, {
        '$set' : {
            senhaResetToken: token,
            senhaResetExpira: now,
        }
    }, { new: true, useFindAndModify: false }
    );

    mailer.sendMail({
        to: email,
        from: 'al1en.devs@gmail.com',
        template: 'esqueceu-senha',
        subject: 'Esqueceu a sua senha?',
        context: {token},
    }, (err) => {
        if (err)
        return res.status(404).send({error: 'Algum erro aconteceu ao enviar seu e-mail, tente novamente'});

        return res.json('O seu e-mail foi enviado com sucesso, verifique sua caixa de entrada.');
    });
    } catch (err) {
        console.log(err);
        return res.status(404).send({error: 'Algum erro aconteceu, tente novamente'});
    }
});

// Espaço destinado para bot //
//...........................//
const twilio = require('twilio')

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)

twilioClient.messages.create({
    from: '+1415523886',
    to: '+55985623105',
    body: 'Olá mundo!'
}).then(console.log).catch(console.error);

// --------------------------//