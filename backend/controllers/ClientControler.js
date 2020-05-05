const authMiddleware = require('../middlewares/auth');
const Frete = require('../models/Frete');
const axios = require('axios');
const routes = require ('../routes');
const isAdmin = require('../utils/isAdmin');

routes.get('/frete/fretes', authMiddleware, async (req,res) => {
    const fretes = await Frete.find();
    return res.json(fretes);
});

routes.post('/frete/criar', isAdmin, async (req,res) => {
    const { origem, destino, carga, valor, numero } = req.body;
    // Consultando preço dos pedágios e sua distância.
    const apiResponse = await axios.get(`https://api.qualp.com.br/rotas/v3?access-token=tBfw2c7o2pYbPEkhBdNb0ZUe13JSQH7e&origem=${origem}&destinos=${destino}&categoria=caminhao&eixos=1&calcular-volta=sim&format=json`);
    const {distancia: {valor: distancia }, pedagios} = apiResponse.data;
    // Fazendo a somatória dos pedágios.
    let total = pedagios.reduce((total, item) => total + item.tarifa, 0);
    // Cadastro do Frete
    const frete = await Frete.create({
            carga,
            valor,
            origem,
            destino,
            distancia,
            total,
            numero
        })
        return res.json(frete);
});


module.exports= app =>app.use('/frete', routes);