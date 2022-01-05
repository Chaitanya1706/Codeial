const express = require('express');
const port = 8000;

const app = express();

app.listen(port,function(err){
    if(err){
        console.log(`error : ${err}`);
    }
    console.log(`Server is up and running at port: ${port}`);
})
