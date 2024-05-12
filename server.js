const express = require('express');
const http = require('http');
const path = require('path');
const compression = require('compression');

const app = express();
app.use(compression());

app.use(express.static(__dirname + 'dist/social_network'));

app.get('*', (req,resp)=>{
    resp.sendFile(__dirname+'dist/social_network/index.html')
})

const port = process.env.PORT || 8080;
app.set('port',port);

const server = http.createServer(app);
server.listen(port,()=>console.log(`server start $(port)`));