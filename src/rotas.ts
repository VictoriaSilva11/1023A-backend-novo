import usuarioController from "./usuarios/usuario.controller";

import { Router } from "express";

const rotas = Router();

//Criando rotas para os usuários
rotas.post('/usuarios', usuarioController.adicionar)
rotas.get('/usuarios', usuarioController.listar)

//Ainda vamos ter que criar as rotas para caminho e produtos
//Tafefa

export default rotas;