const express = require('express');
const http = require('http');
const path = require('path');
const compression = require('compression');

const app = express();
app.use(compression());

app.use(express.static(__dirname + 'dist/social-network'));

app.get('*', (req,resp)=>{
    resp.sendFile(__dirname+'dist/social-network/index.html')
})

const port = http.createServer(app);
app.set('port',port);

const server = process.env.PORT || 8080;
server.listen(port,()=>console.log(`server start $(port)`));