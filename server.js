const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/social-network'));

app.get('/*', (req,resp)=>{
    resp.sendFile(__dirname+'/dist/social-network/index.html')
})


app.listen(process.env.PORT || 8080);
