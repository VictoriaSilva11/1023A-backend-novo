import { Request, Response } from "express";
import { db } from "../database/banco-mongo.js";

interface ItemCarrinho {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string
}

interface Carrinho {
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}

class CarrinhoController {
    //adicionarItem
    async adicionarItem(req: Request, res: Response) {
        const { usuarioId, produtoId, quantidade, precoUnitario, nome } = req.body;
        const item: ItemCarrinho = { produtoId, quantidade, precoUnitario, nome };
        const resultado = await db.collection('carrinho').insertOne(item);


        //verificar se o carrinho do usuário já existe
        const carrinhoExistente = await db.collection<Carrinho>('carrinho').findOne({ usuarioId });
        

        //Se não existir, criar um novo carrinho
        if (!carrinhoExistente) {
            const novoCarrinho: Carrinho = {
                usuarioId,
                itens: [item],
                dataAtualizacao: new Date(),
                total: item.precoUnitario * item.quantidade
            };
            const resultado = await db.collection('carrinho').insertOne(novoCarrinho);
            return res.status(201).json({ ...novoCarrinho, _id: resultado.insertedId });
        }

        //Se existir, adicionar o item ao carrinho existente
        carrinhoExistente.itens.push(item);
        carrinhoExistente.total += item.precoUnitario * item.quantidade;
        carrinhoExistente.dataAtualizacao = new Date();

        //Calcular o total do carrinho
        carrinhoExistente.total = carrinhoExistente.itens.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0);

        //Atualizar a data de atualização do carrinho
        carrinhoExistente.dataAtualizacao = new Date();

        //Salvar o carrinho no banco de dados
        await db.collection('carrinho').updateOne(
            { usuarioId },
            { $set: { itens: carrinhoExistente.itens, total: carrinhoExistente.total, dataAtualizacao: carrinhoExistente.dataAtualizacao } }
        );

        //Retornar o carrinho atualizado na resposta
        res.status(200).json(carrinhoExistente);
    }

    //removerItem
    async removerItem(req: Request, res: Response) {
       
    }

    //atualizarQuantidade
    async atualizarQuantidade(req: Request, res: Response) {

    }

    //listar
    async listar(req: Request, res: Response) {
        const carrinho = await db.collection('carrinhos').find().toArray();
        res.status(200).json(carrinho);


    }

    //removerCarrinho
    async removerCarrinho(req: Request, res: Response) {
        const { usuarioId } = req.params;
        const resultado = await db.collection('carrinho').deleteOne({ usuarioId });
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ message: 'Carrinho não encontrado' });
        }
        res.status(204).send();

    }


}
export default new CarrinhoController();