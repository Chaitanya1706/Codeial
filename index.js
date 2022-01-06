const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(express.static('./assets'))

app.set('layout extractStyles`',true)
app.set('layout extractScripts',true)

app.use(expressLayouts);
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
