//Importando mongoose para conexão com o DB.
const mongoose = require('mongoose');

const ProdutoLSchema = new mongoose.Schema({
    nome: {
        type:String,
        minlenght:3,
        required: true
    },
    descricao: {
        type:String,
        required:true,
        minlenght:3        
    },
    cor: {
        type:Array,
        required:true,
        minlenght:3
    },
    tag: {
        type:String,
        required:true,
        minlenght:3
    },
    imagem: {
        type:String,
        required:true
    }
});

//Salvando o modelo de objeto.
ProdutoLSchema.pre('save', async function(next){
    next();
});

//Exportando modelo de objeto.
module.exports = mongoose.model('ProdutoL', ProdutoLSchema);