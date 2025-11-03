import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { Request, Response, NextFunction } from 'express';

interface RequestAuth extends Request {
    usuarioId?: string;
    tipo?: string;
}

function Auth(req: RequestAuth, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ mensagem: "Token não fornecido!" });

    const token = authHeader.split(" ")[1]!;

    try {
        // decodifica apenas para leitura (sem verificar ainda)
        const decoded: any = jwtDecode(token);

        // valida o token de fato
        jwt.verify(token, process.env.JWT_SECRET!);

        req.usuarioId = decoded.usuarioId;
        req.tipo = decoded.tipo;

        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ mensagem: "Token inválido!" });
    }
}

// middleware específico para admins
export function isAdmin(req: RequestAuth, res: Response, next: NextFunction) {
    if (req.tipo !== 'admin') {
        return res.status(403).json({ mensagem: "Acesso restrito a administradores!" });
    }
    next();
}

export default Auth;
