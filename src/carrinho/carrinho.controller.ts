import { Request, Response } from "express";
import { ObjectId } from "bson";
import { db } from "../database/banco-mongo.js";

interface ItemCarrinho {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
}

interface Carrinho {
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}

interface Produto {
    _id: ObjectId;
    nome: string,
    preco: number,
    descricao: string,
    urlfoto: string,
    categoria: string
}
interface RequestAuth extends Request {
    usuarioId?: string
}

class CarrinhoController {
    //adicionarItem
    async adicionarItem(req: RequestAuth, res: Response) {
        const { produtoId, quantidade } = req.body as { usuarioId: string, produtoId: string, quantidade: number };
        const usuarioId = req.usuarioId
        if (!usuarioId)
            return res.status(401).json({ mensagem: "Token nao foi passado para adicionar no carrinho" })

        //Buscar o produto no banco de dados
        const produto = await db.collection<Produto>('produtos')
            .findOne({ _id: ObjectId.createFromHexString(produtoId) });
        if (!produto)
            return res.status(404).json({ mensagem: 'Produto nao encontrado' });
        //Pegar o preco do produto
        //Pegar o nome do produto
        const nomeProduto = produto.nome;
        const precoProduto = produto.preco;

        // Verificar se um carrinho com o usuario ja existe
        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });

        if (!carrinho) {
            const novoCarrinho: Carrinho = {
                usuarioId: usuarioId,
                itens: [{
                    produtoId: produtoId,
                    quantidade: quantidade,
                    precoUnitario: precoProduto,
                    nome: nomeProduto
                }],
                dataAtualizacao: new Date(),
                total: precoProduto * quantidade
            }
            const resposta = await db.collection<Carrinho>("carrinhos").insertOne(novoCarrinho);
            const carrinhoResposta = {
                usuarioId: novoCarrinho.usuarioId,
                itens: novoCarrinho.itens,
                dataAtualizacao: novoCarrinho.dataAtualizacao,
                total: novoCarrinho.total,
                _id: resposta.insertedId

            }
            //return res.status(201).json({...novoCarrinho, _id: resposta.insertedId});

            //Early Return
            return res.status(201).json(carrinhoResposta);

        }
        //ELSE
        // Se existir, deve adicionar o item ao carrinho existente
        const itemExistente = carrinho.itens.find(item => item.produtoId === produtoId);
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
            carrinho.total += precoProduto * quantidade;
            carrinho.dataAtualizacao = new Date();
        }
        else {
            carrinho.itens.push({
                produtoId: produtoId,
                quantidade: quantidade,
                precoUnitario: precoProduto,
                nome: nomeProduto
            });
            carrinho.total += precoProduto * quantidade;
            carrinho.dataAtualizacao = new Date();
        }
        // Atualizar o carrinho no banco de dados
        await db.collection<Carrinho>("carrinhos").updateOne({ usuarioId: usuarioId },
            {
                $set: {
                    itens: carrinho.itens,
                    total: carrinho.total,
                    dataAtualizacao: carrinho.dataAtualizacao
                }
            }
        )
        res.status(200).json(carrinho);
    }

    async removerItem(req: Request, res: Response) {
        const { produtoId, usuarioId } = req.body;
        //CONSTRUA o removerItem
        //Do melhor jeito

        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });
        if (!carrinho) {
            return res.status(404).json({ mensagem: 'Carrinho nao encontrado' });
        }
        const itemExistente = carrinho.itens.find(item => item.produtoId === produtoId);
        if (!itemExistente) {
            return res.status(404).json({ mensagem: 'Item nao encontrado' });
        }
        const filtrados = carrinho.itens.filter(item => item.produtoId !== produtoId);
        const total = filtrados.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0);

        // ADICIONEISSE: Se carrinho ficar vazio, deleta
        if (filtrados.length === 0) {
            await db.collection<Carrinho>("carrinhos").deleteOne({ usuarioId: usuarioId });
            return res.status(200).json({ mensagem: 'Item removido e carrinho vazio deletado' });
        }

        const carrinhoAtualizado = {
            usuarioId: carrinho.usuarioId,
            itens: filtrados,
            dataAtualizacao: new Date(),
            total: total
        }
        await db.collection<Carrinho>("carrinhos").updateOne({ usuarioId: usuarioId },
            {
                $set: {
                    itens: carrinhoAtualizado.itens,
                    total: carrinhoAtualizado.total,
                    dataAtualizacao: carrinhoAtualizado.dataAtualizacao
                }
            }
        )
        return res.status(200).json(carrinhoAtualizado);
    }

    async atualizarQuantidade(req: Request, res: Response) {
        const { produtoId, usuarioId, quantidade } = req.body;
        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });
        if (!carrinho) {
            return res.status(404).json({ mensagem: 'Carrinho nao encontrado' });
        }
        const itemExistente = carrinho.itens.find(item => item.produtoId === produtoId);
        if (!itemExistente) {
            return res.status(404).json({ mensagem: 'Item nao encontrado' });
        }
        itemExistente.quantidade = quantidade;
        carrinho.total = carrinho.itens.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0);
        carrinho.dataAtualizacao = new Date();
        await db.collection<Carrinho>("carrinhos").updateOne({ usuarioId: usuarioId },
            {
                $set: {
                    itens: carrinho.itens,
                    total: carrinho.total,
                    dataAtualizacao: carrinho.dataAtualizacao
                }
            }
        )
        return res.status(200).json(carrinho);
    }

    // listar produtos no carrinho
  async listar(req: RequestAuth, res: Response) {
  const usuarioId = req.usuarioId;
  if (!usuarioId) return res.status(401).json({ mensagem: "Token inválido!" });

  const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId });
  if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado" });

  return res.status(200).json(carrinho);
}


    // Use RequestAuth em vez de Request
    async remover(req: RequestAuth, res: Response) {
        // 1. Pegue o usuarioId do token (igual ao adicionarItem)
        const usuarioId = req.usuarioId;

        // 2. Adicione uma verificação de segurança
        if (!usuarioId) {
            return res.status(401).json({ mensagem: "Token não fornecido ou inválido" });
        }

        // 3. O resto do seu código original está perfeito
        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });
        if (!carrinho) {
            return res.status(404).json({ mensagem: 'Carrinho nao encontrado' });
        }

        await db.collection<Carrinho>("carrinhos").deleteOne({ usuarioId: usuarioId });
        return res.status(200).json({ mensagem: 'Carrinho removido com sucesso' });
        
    }

    
    async listarTodos(req: Request, res: Response) {
      try {
        // Busca todos os carrinhos
        const carrinhos = await db.collection<Carrinho>("carrinhos").find().toArray();

        if (!carrinhos.length) {
          return res.status(404).json({ mensagem: "Nenhum carrinho encontrado" });
        }

        // Pega os IDs de todos os usuários que têm carrinho
        const usuariosIds = carrinhos.map((c) => new ObjectId(c.usuarioId));

        // Busca os dados dos usuários
        const usuarios = await db
          .collection("usuarios")
          .find({ _id: { $in: usuariosIds } })
          .project({ nome: 1 }) // pega só o nome
          .toArray();

        // Junta as informações (carrinho + nome do usuário)
        const resultado = carrinhos.map((c) => {
          const usuario = usuarios.find((u) => u._id.toString() === c.usuarioId);
          return {
            ...c,
            nomeUsuario: usuario ? usuario.nome : "Usuário não encontrado",
          };
        });

        return res.status(200).json(resultado);
      } catch (erro) {
        console.error("Erro ao listar todos os carrinhos:", erro);
        return res.status(500).json({ mensagem: "Erro ao listar carrinhos" });
      }
    }
    

    

}

export default new CarrinhoController();