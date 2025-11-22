import express from 'express';
import path from 'path';
import fs from 'fs'
import { injector } from '../src/index'
const app = express();

app.get('/', (req: any, res: any) =>
    res.sendFile(path.join(__dirname, './index.html'))
);

app.get('/iframe1.html', async (req: any, res: any) => {
    const targetHtml = fs.readFileSync(path.join(__dirname, './target1.html'), 'utf8')
    const html = injector(targetHtml)
    res.send(html)
});

app.get('/iframe2.html', async (req: any, res: any) => {
    const targetHtml = fs.readFileSync(path.join(__dirname, './target2.html'), 'utf8')
    const html = injector(targetHtml)
    res.send(html)
});

app.listen(3000, () => {
    console.log('Visit: http://localhost:3000')
})