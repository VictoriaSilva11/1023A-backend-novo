import { Request, Response } from "express";
import { ObjectId } from "bson";
import { db } from "../database/banco-mongo.js";

interface Produto {
  _id?: ObjectId;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
  categoria: string;
}

class ProdutoController {
  // Criar produto (ADMIN)
  async adicionar(req: Request, res: Response) {
    const { nome, preco, descricao, urlfoto, categoria } = req.body;

    if (!nome || !preco || !descricao || !urlfoto || !categoria) {
      return res
        .status(400)
        .json({ mensagem: "Campos obrigatorios: nome, preco, descricao, urlfoto, categoria" });
    }

    const produto: Produto = { nome, preco, descricao, urlfoto, categoria };
    const resultado = await db.collection<Produto>("produtos").insertOne(produto);

    res.status(201).json({ ...produto, _id: resultado.insertedId });
  }

  // Listar todos os produtos (TODOS)
  async listar(req: Request, res: Response) {
    const produtos = await db.collection<Produto>("produtos").find().toArray();
    res.status(200).json(produtos);
  }

  // Editar produto (ADMIN)
  async editar(req: Request, res: Response) {
    const id = req.params.id as string; 

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const { nome, preco, descricao, urlfoto } = req.body;

    const produto = await db.collection<Produto>("produtos").findOne({
      _id: new ObjectId(id),
    });

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    await db.collection<Produto>("produtos").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          nome: nome ?? produto.nome,
          preco: preco ?? produto.preco,
          descricao: descricao ?? produto.descricao,
          urlfoto: urlfoto ?? produto.urlfoto,
        },
      }
    );

    const produtoAtualizado = await db
      .collection<Produto>("produtos")
      .findOne({ _id: new ObjectId(id) });

    res.status(200).json(produtoAtualizado);
  }

  // Excluir produto (ADMIN)
  async excluir(req: Request, res: Response) {
    const id = req.params.id as string; 

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const resultado = await db
      .collection<Produto>("produtos")
      .deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    res.status(200).json({ mensagem: "Produto excluído com sucesso" });
  }
}

export default new ProdutoController();

