import dotenv from 'dotenv';
import express from 'express';
import { ConfigDb } from './config/db.js';
import { route } from './config/routes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import configScoket from './config/socket.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const port = 3030;
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(route);
app.use('/upload', express.static(path.join(__dirname, 'upload')));

ConfigDb();

configScoket();

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
