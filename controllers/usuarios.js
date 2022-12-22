const { response, request } = require('express');

const bcryptjs = require("bcryptjs");

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    
    // const { q, nombre, apikey, page = 1, limit = 10 } = req.query;

    // res.json(usuario)

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true }

    /*
    const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(parseInt(limite));

    const total = await Usuario.countDocuments(query);
    */

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(parseInt(limite))
    ])



    res.json({        
        total,
        usuarios
    })
}

const usuariosPut = async (req, res) => {

    const { id } = req.params;

    const { _id, password, google, correo, ...resto } = req.body;

    // TODO Validar contra base de datos

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(200).json({usuario})
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol
    });

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();

    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en DB

    await usuario.save();

    res.status(201).json({
        msg:'post API - controlador',
        usuario
    })
}

const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id,{ estado: false });

    res.json(usuario)
}

const usuariosPatch = (req, res) => {
    res.json({
        msg:'patch API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
}