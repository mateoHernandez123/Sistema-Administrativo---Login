const express = require('express');
const cors = require('cors');
const Crypto = require('crypto-js');
const app = express();


app.use(express.json());
app.use(cors({
  origin:'*'
}));

//-----------------------------------------------------------
const LoginRouter = require('./routes/loginRouter.js');
app.use('/api/login', LoginRouter);

app.get('/api/prueba', async (req,res)=>{
  console.log('ingresaste a api/prueba');
  return res.status(200).send({msg: 'Ingresaste a api/prueba'})
})

//-----------------------------------------------------------
const port = 5000;
app.listen(port, ()=>{
  console.log(`Servidor iniciado en el puerto: ${port}.`)
})

