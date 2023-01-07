const { request, response } = require("express")

const esAdminRole = (req = request, res=response, next) => {

    const usuario = req.usuario;

    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere verificar el role sin verificar el token primero'
        })
    }

    const { rol , nombre } = usuario;
    
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg:`${nombre} no es administrador - No puede hacer eso`
        })
    }

    next();
}

const tieneRole = (...roles)=>{
    
    return (req, res, next) => {
        
        if(!req.usuario){
            return res.status(500).json({
                msg:'Se quiere verificar el role sin verificar el token primero'
            })
        }

        const { rol , nombre } = req.usuario;
        
        if(!roles.includes(rol)){
            return res.status(401).json({
                msg:`${nombre} no es administrador - No puede hacer eso require ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}