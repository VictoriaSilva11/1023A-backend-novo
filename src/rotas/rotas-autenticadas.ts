import { Router } from "express";
import usuarioController from "../usuarios/usuario.controller.ts";
import produtoController from "../produtos/produto.controller.ts";
import carrinhoController from "../carrinho/carrinho.controller.ts";
import Auth, { isAdmin } from "../middleware/auth.ts"; 
import estatisticasController from "../usuarios/estatisticas.controller.ts";
import deletarUsuarioController from "../usuarios/usuario.controller.ts";
import stripeRoutes from "../pagamentos/stripe.routes.ts";


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
rotasAutenticadas.delete("/usuarios/:id", isAdmin, deletarUsuarioController.deletarUsuario);

// Produtos
rotasAutenticadas.get("/produtos", produtoController.listar);
rotasAutenticadas.post("/produtos", isAdmin, produtoController.adicionar);
rotasAutenticadas.put("/produtos/:id", isAdmin, produtoController.editar);
rotasAutenticadas.delete("/produtos/:id", isAdmin, produtoController.excluir);
rotasAutenticadas.get("/admin/estatisticas", isAdmin, estatisticasController.estatisticasCarrinhos);
rotasAutenticadas.get("/admin/carrinhos", isAdmin, carrinhoController.listarTodos);

//Rota de pagamento
rotasAutenticadas.use("/stripe", stripeRoutes);


export default rotasAutenticadas;



