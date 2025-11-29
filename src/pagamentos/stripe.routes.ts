import { Router } from "express";
import StripeController from "./stripe.controller.ts";
import Auth from "../middleware/auth.ts";

const router = Router();

router.post("/pagar", Auth, StripeController.criarSessao);

export default router;
