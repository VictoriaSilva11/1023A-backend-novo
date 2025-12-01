import { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "../database/banco-mongo.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface RequestAuth extends Request {
  usuarioId?: string;
}

class PagamentoController {
  async criarPagamentoCartao(req: RequestAuth, res: Response) {
    try {
      const usuarioId = req.usuarioId;
      if (!usuarioId)
        return res.status(401).json({ mensagem: "Usuário não autenticado" });

      // Buscar carrinho no banco
      const carrinho = await db.collection("carrinhos").findOne({ usuarioId });

      if (!carrinho || carrinho.total <= 0)
        return res.status(400).json({ mensagem: "Carrinho vazio" });

      // Stripe usa centavos
      const valorEmCentavos = Math.round(carrinho.total * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: valorEmCentavos,
        currency: "brl",
        payment_method_types: ["card"],
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });

    } catch (err) {
      console.error("Erro Stripe:", err);
      return res.status(500).json({ mensagem: "Erro ao criar pagamento" });
    }
  }
}

export default new PagamentoController();
