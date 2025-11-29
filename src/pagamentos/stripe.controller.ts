import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const YOUR_DOMAIN = "http://localhost:5173";

class StripeController {
  async criarSessao(req: Request, res: Response) {
    try {
      const { items } = req.body;

      const line_items = items.map((item: any) => ({
        price_data: {
          currency: "brl",
          product_data: { name: item.nome },
          unit_amount: Math.round(item.precoUnitario * 100),
        },
        quantity: item.quantidade,
      }));

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items,
        success_url: `${YOUR_DOMAIN}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}/carrinho`,
      });

      return res.json({ url: session.url });

    } catch (err) {
      console.error(err);
      res.status(500).json({ mensagem: "Erro ao criar sessão de pagamento" });
    }
  }
}

export default new StripeController();

