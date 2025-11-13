import { Router } from "express";
import usuarioController from "../usuarios/usuario.controller.js";
import produtoController from "../produtos/produto.controller.js";
import carrinhoController from "../carrinho/carrinho.controller.js";
import Auth, { isAdmin } from "../middleware/auth.js"; // <== IMPORTAR O Auth
import estatisticasController from "../usuarios/estatisticas.controller.js";

const rotasAutenticadas = Router();

//  Protege todas as rotas abaixo com Auth
rotasAutenticadas.use(Auth);

// Usuários autenticados
rotasAutenticadas.get("/usuarios", usuarioController.listar);

// Carrinho
rotasAutenticadas.post("/carrinho/adicionar", carrinhoController.adicionarItem);
rotasAutenticadas.put("/carrinho/atualizar", carrinhoController.atualizarQuantidade);
rotasAutenticadas.delete("/carrinho/removerItem", carrinhoController.removerItem);
rotasAutenticadas.get("/carrinho/listar", carrinhoController.listar);
rotasAutenticadas.delete("/carrinho/remover", carrinhoController.remover);

// Produtos
rotasAutenticadas.get("/produtos", produtoController.listar);
rotasAutenticadas.post("/produtos", isAdmin, produtoController.adicionar);
rotasAutenticadas.put("/produtos/:id", isAdmin, produtoController.editar);
rotasAutenticadas.delete("/produtos/:id", isAdmin, produtoController.excluir);
rotasAutenticadas.get("/admin/estatisticas", isAdmin, estatisticasController.estatisticasCarrinhos);
rotasAutenticadas.get("/admin/carrinhos", isAdmin, carrinhoController.listarTodos);



export default rotasAutenticadas;



