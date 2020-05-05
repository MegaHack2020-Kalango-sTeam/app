//Importando mongoose para conexão com MongoDB.
const mongoose = require('mongoose');
//Importando bcryptjs para criptografia de senha.
const bcrypt = require('bcryptjs');

//Criando um esquema de objeto para as nossas lojas, assim como foi feito com os clientes.
const LojaSchema = new mongoose.Schema({
    nome: {
        type:String,
        required:true,
        minlength:1,
    },
    email: {
        type:String,
        required:true,
        minlength: 5,
        maxlength: 40,
        unique: true
    },
    senha: {
        type:String,
        required:true,
        minlength: 8,
        select:false
    },
    telefone: {
        type:Number,
        required:true,
        minlength: 11,
        select:true
    },
    senhaTokenReset: {
        type:String,
        select: false
    },
    senhaTokenExpira: {
        type: Date,
        select: false
    },
    tagl: {
        type:String,
        required:true,
        minlength:3
    },
    cnpj: {
        type:Number,
        required:true,
        unique:true,
        minlength:14
    },
    classif: {
        type:Number,
        maxlength:1
    },
    criado: {
        type: Date,
        default:Date.now,
    }
});
//Encriptação da senha antes do save.
LojaSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.senha, 8);
    this.senha = hash;

    next();
});
//Exportando o modelo de objeto.
module.exports=mongoose.model('Loja', LojaSchema);