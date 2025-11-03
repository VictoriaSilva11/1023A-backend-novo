import { Router } from "express";
import usuarioController from "../usuarios/usuario.controller.js";
import produtoController from "../produtos/produto.controller.js";
import carrinhoController from "../carrinho/carrinho.controller.js";
import { isAdmin } from "../middleware/auth.js";

const rotasAutenticadas = Router();


//Usuários autenticados

rotasAutenticadas.get("/usuarios", usuarioController.listar);


// Carrinho (usuário comum autenticado)

rotasAutenticadas.post("/carrinho/adicionar", carrinhoController.adicionarItem);
rotasAutenticadas.put("/carrinho/atualizar", carrinhoController.atualizarQuantidade);
rotasAutenticadas.delete("/carrinho/removerItem", carrinhoController.removerItem);
rotasAutenticadas.get("/carrinho/listar", carrinhoController.listar);
rotasAutenticadas.delete("/carrinho/remover", carrinhoController.remover);


// Produtos

rotasAutenticadas.get("/produtos", produtoController.listar); // todos podem ver
rotasAutenticadas.post("/produtos", isAdmin, produtoController.adicionar); // admin cria
rotasAutenticadas.put("/produtos/:id", isAdmin, produtoController.editar); // admin edita
rotasAutenticadas.delete("/produtos/:id", isAdmin, produtoController.excluir); // admin exclui

export default rotasAutenticadas;

