import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { Request, Response, NextFunction } from 'express';

interface RequestAuth extends Request {
  usuarioId?: string;
  tipo?: string;
}

function Auth(req: RequestAuth, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido!' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido!' });
  }

  try {

    jwt.verify(token, process.env.JWT_SECRET!);

    
    const decoded: any = jwtDecode(token);

    
    req.usuarioId = decoded.usuarioId;
    req.tipo = decoded.tipo;

    next();
  } catch (err) {
    console.error('Erro de autenticação:', err);
    return res.status(401).json({ mensagem: 'Token inválido ou expirado!' });
  }
}

export function isAdmin(req: RequestAuth, res: Response, next: NextFunction) {
  if (req.tipo !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores!' });
  }
  next();
}

export default Auth;
