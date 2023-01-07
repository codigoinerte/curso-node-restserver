const { request, response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;
    
    try {
        // verificar si el correo existe

        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - correo'
            })
        }

        //verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - esado: false'
            })
        }
        //verificar la contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password'
            })
        }

        //generar el jwt

        const token = await generarJWT(usuario.id);


        res.status(200).json({
            usuario,
            token
        }); 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hable con el adminisrtador'
        })
    }

    
}

const googleSignIn = async (req = request, res= response) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario)
        {
            // tengo que crearlo
            const data = {
                nombre,
                correo,
                img,
                password: ':p',
                rol:'USER_ROLE',
                img,
                google:true
            }

            usuario = new Usuario(data);

            await usuario.save();
        }

        // si el usuario esta bloqueado en la db

        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }

        // generar el JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        });    

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}