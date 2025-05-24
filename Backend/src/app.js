import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


import assetRoutes from './routes/asset.routes.js';

app.use("/api/v1/assets", assetRoutes);

export {app}