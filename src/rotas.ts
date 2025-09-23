import usuarioController from "./usuarios/usuario.controller.js";
import produtoController from "./produtos/produto.controller.js";

import { Router } from "express";

const rotas = Router();

//Criando rotas para os usuários
rotas.post('/usuarios', usuarioController.adicionar)
rotas.get('/usuarios', usuarioController.listar)

//Rotas para produtos
rotas.post('/produtos', produtoController.adicionar)
rotas.get('/produtos', produtoController.listar)

export default rotas;