import 'dotenv/config'
import express from 'express';
import rotasAutenticadas from './rotas/rotas-autenticadas.js';
import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js';
import Auth from './middleware/auth.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


app.use(rotasNaoAutenticadas)
app.use(Auth)
app.use(rotasAutenticadas);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});