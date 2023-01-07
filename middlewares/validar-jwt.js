const { request, response } = require("express")
const jwt = require("jsonwebtoken");
const usuario = require("../models/usuario");

const validarJWT = async (req = request, res=response, next) => {
    
    const token = req.header('x-token');
    
    if(!token)
    {
        return res.status(401).json({
            msg:'No hay token en la petición'
        })
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETKEY);
        
        const usuarioAutenticado = await usuario.findById({_id:uid});

        if(!usuarioAutenticado)
        {
            return res.status(401).json({
                msg:'Token no valido - usuario no existe DB'
            })
        }

        
        // Verificar si el uid tiene estado true

        if(!usuarioAutenticado.estado){
            return res.status(401).json({
                msg:'Token no valido - usuario con estado false'
            })
        }
        
        // leer el usuario que corresponde al uid
        
        req.usuario = usuarioAutenticado;

        // req.uid = uid;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
    }

}

module.exports = {
    validarJWT
}