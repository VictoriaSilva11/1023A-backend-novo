import usuarioController from "../usuarios/usuario.controller.js";
import { Router} from "express";

const rotasNaoAutenticadas = Router();

rotasNaoAutenticadas.post("/usuarios", usuarioController.adicionar);
rotasNaoAutenticadas.post("/login", usuarioController.login);

export default rotasNaoAutenticadas;