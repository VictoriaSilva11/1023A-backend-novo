import { Router } from "express";
import usuarioController from "../usuarios/usuario.controller.js";
import produtoController from "../produtos/produto.controller.js";
import carrinhoController from "../carrinho/carrinho.controller.js";
import Auth, { isAdmin } from "../middleware/auth.js"; 
import estatisticasController from "../usuarios/estatisticas.controller.js";
import deletarUsuarioController from "../usuarios/usuario.controller.js";
import pagamentoController from "../pagamentos/stripe.controller.js";


const rotasAutenticadas = Router();


rotasAutenticadas.use(Auth);

rotasAutenticadas.get("/usuarios", usuarioController.listar);


rotasAutenticadas.post("/carrinho/adicionar", carrinhoController.adicionarItem);
rotasAutenticadas.put("/carrinho/atualizar", carrinhoController.atualizarQuantidade);
rotasAutenticadas.delete("/carrinho/removerItem", carrinhoController.removerItem);
rotasAutenticadas.get("/carrinho/listar", carrinhoController.listar);
rotasAutenticadas.delete("/carrinho/remover", carrinhoController.remover);
rotasAutenticadas.delete("/usuarios/:id", isAdmin, deletarUsuarioController.deletarUsuario);


rotasAutenticadas.get("/produtos", produtoController.listar);
rotasAutenticadas.post("/produtos", isAdmin, produtoController.adicionar);
rotasAutenticadas.put("/produtos/:id", isAdmin, produtoController.editar);
rotasAutenticadas.delete("/produtos/:id", isAdmin, produtoController.excluir);
rotasAutenticadas.get("/admin/estatisticas", isAdmin, estatisticasController.estatisticasCarrinhos);
rotasAutenticadas.get("/admin/carrinhos", isAdmin, carrinhoController.listarTodos);

rotasAutenticadas.post("/criar-pagamento-cartao", pagamentoController.criarPagamentoCartao);


export default rotasAutenticadas;



