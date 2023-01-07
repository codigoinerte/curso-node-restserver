const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        
        // Paths
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        // Conectar a base de datos

        this.connectarDB();

        // Middlewares

        this.middlewares();

        // Rutas de mi aplicación

        this.routes();
    }

    async connectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.authPath, require('../routes/auth'));
    }

    listen(){

        this.app.listen(this.port, ()=>{
            console.log('servidor corriendo en el puerto ', this.port);
        });
    }
}

module.exports = Server;