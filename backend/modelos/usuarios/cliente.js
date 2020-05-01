//Importando mongoose para conexão com MongoDB.
const mongoose = require('mongoose');
//Importando bcryptjs para criptografia de senha.
const bcrypt = require('bcryptjs');

//Criando um esquema de cliente = um padrão de informações necessárias para um objeto do DB.
const ClienteSchema = mongoose.Schema({
//Adicionando os elementos e características de cada elemento do meu Cliente (Nome é requirido? Tamanho mínimo da senha).
    nome: {
        type:String,
        required: true,
        minlenght: 3
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    senha: {
        type:String,
        required:true,
        minlenght:8,
        select:false
    },
    senhaTokenReset: {
        type:String,
        select: false
    },
    senhaTokenExpira: {
        type: Date,
        select: false
    },
    criado: {
        type: Date,
        default:Date.now,
    }
});

ClienteSchema.pre('save', async function(next) {
//Encriptando a senha com o BcryptJS.    
    const hash = await bcrypt.hash(this.senha, 8);
    this.senha = hash;

    next ();
});

//Exportando o meu esquema de cliente.
module.exports = mongoose.model('Cliente', ClienteSchema);