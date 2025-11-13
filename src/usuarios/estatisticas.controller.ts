import { Request, Response } from "express";
import { db } from "../database/banco-mongo.js";

interface ItemCarrinho {
  nome: string;
  preco: number;
  quantidade: number;
}

interface Carrinho {
  usuarioId: string;
  itens: ItemCarrinho[];
  total: number;
}

class AdminController {
  async estatisticasCarrinhos(req: Request, res: Response) {
    try {
      const carrinhos = await db.collection<Carrinho>("carrinhos").find().toArray();

      if (carrinhos.length === 0) {
        return res.status(200).json({
          usuariosComCarrinho: 0,
          somaTotalCarrinhos: 0,
          rankingProdutos: [],
        });
      }

      //  total de usuários com carrinho
      const usuariosComCarrinho = carrinhos.length;

      //  soma total de todos os carrinhos
      const somaTotalCarrinhos = carrinhos.reduce((acc, c) => acc + c.total, 0);

      //  produtos mais frequentes
      const contagemProdutos: Record<string, { nome: string; quantidade: number }> = {};

      for (const carrinho of carrinhos) {
        for (const item of carrinho.itens) {
          let entrada = contagemProdutos[item.nome];
          if (!entrada) {
            entrada = { nome: item.nome, quantidade: 0 };
            contagemProdutos[item.nome] = entrada;
          }
          entrada.quantidade += item.quantidade;
        }
      }

      const rankingProdutos = Object.values(contagemProdutos)
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 10);

      return res.status(200).json({
        usuariosComCarrinho,
        somaTotalCarrinhos,
        rankingProdutos,
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: "Erro ao gerar estatísticas" });
    }
  }
}

export default new AdminController();
