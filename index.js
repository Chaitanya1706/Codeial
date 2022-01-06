const express = require('express');
const port = 8000;
const app = express();

// use express router
app.use('/',require('./routes/index'))

//set up the view engine
app.set('view engine', 'ejs');
app.set('views','./views')

app.listen(port,function(err){
    if(err){
        console.log(`error : ${err}`);
    }
    console.log(`Server is up and running at port: ${port}`);
})
