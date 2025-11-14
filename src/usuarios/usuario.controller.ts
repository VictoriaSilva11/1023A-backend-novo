import { Request, Response } from "express";
import { db } from "../database/banco-mongo.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UsuarioController {
    async adicionar(req: Request, res: Response) {
        const { nome, idade, email, senha, tipo } = req.body;

        if (!nome || !email || !senha || !idade) {
            return res.status(400).json({ mensagem: "Dados incompletos (nome, email, senha, idade)" });
        }

        // tipo padrão é 'usuario', só pode ser 'admin' se for explicitamente enviado
        const tipoUsuario = tipo === 'admin' ? 'admin' : 'usuario';

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const usuario = { nome, idade, email, senha: senhaCriptografada, tipo: tipoUsuario };

        const resultado = await db.collection('usuarios').insertOne(usuario);
        res.status(201).json({ ...usuario, _id: resultado.insertedId });
    }

    async listar(req: Request, res: Response) {
        const usuarios = await db.collection('usuarios').find().toArray();
        res.status(200).json(usuarios);
    }

    async login(req: Request, res: Response) {
        const { email, senha } = req.body;

        if (!email || !senha)
            return res.status(400).json({ mensagem: "Email e senha são obrigatórios!" });

        const usuario = await db.collection("usuarios").findOne({ email });
        if (!usuario)
            return res.status(400).json({ mensagem: "Usuário incorreto!" });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida)
            return res.status(400).json({ mensagem: "Senha inválida!" });

        // cria token com tipo de usuário
        const token = jwt.sign(
    {
        usuarioId: usuario._id,
        nome: usuario.nome,      // <-- ADICIONAR ISSO
        tipo: usuario.tipo
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
);


        res.status(200).json({ token });
    }
}

export default new UsuarioController();
