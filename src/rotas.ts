import usuarioController from "./usuarios/usuario.controller.js";
import produtoController from "./produtos/produto.controller.js";
import carrinhoController from "./carrinho/carrinho.controller.js";

import { Router } from "express";

const rotas = Router();

//Criando rotas para os usuários
rotas.post('/usuarios', usuarioController.adicionar)
rotas.get('/usuarios', usuarioController.listar)

//Rotas para produtos
rotas.post('/produtos', produtoController.adicionar)
rotas.get('/produtos', produtoController.listar)

//Rotas para carrinho
rotas.post('/carrinhos', carrinhoController.adicionarItem)
rotas.get('/carrinhos', carrinhoController.listar)
rotas.delete('/carrinhos/:id', carrinhoController.removerItem)
rotas.put('/carrinhos/:id', carrinhoController.atualizarQuantidade)
rotas.delete('/carrinhos/:usuarioId/itens/:produtoId', carrinhoController.removerItem)

export default rotas;