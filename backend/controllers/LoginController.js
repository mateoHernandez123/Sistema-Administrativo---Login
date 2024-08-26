const mysql = require('mysql');

class LoginController{
  constructor(){

  }
  async login(req,res){
    try {
      const db = mysql.createConnection({
        host:'185.27.134.140:3306',
        user:'if0_37174032',
        password:'xhOfoexWWmtl',
        database:'if0_37174032_db_sistema_administrativo'
      })

      db.query(`Select * from USUARIOS;`, (err, rows)=>{
        if(err){
          console.log(err);
          return res.status(500).send({msg:'Error en la conexion.'})
        }else{
          return res.status(200).send({data: rows})
        }
      })
    } catch (error) {
      console.log('Error en el proceso.')
      console.log(error)
      return res.status(500).send('Error en la conexion')
    }
  }
}

module.exports = new LoginController();