const express = require('express');
const port = 3000;
const app = express();
const db = require('./config/mongoose');
// middleware to parse req body
app.use(express.urlencoded());

//setting up SASS
const sassMiddleware = require('node-sass-middleware')
app.use(sassMiddleware({
    src : './assets/scss',      
    dest : './assets/css',  
    debug : true,
    outputStyle : 'extended',
    prefix: '/css'
}));

app.use(express.static('./assets'));
const customMware = require('./config/middleware');

// setting up layouts
const expressLayouts = require('express-ejs-layouts');
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)
app.use(expressLayouts);


//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'))

//set up the view engine
app.set('view engine', 'ejs');
app.set('views','./views')


//Creating session using cookies
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cookieParser()); 
const MongoStore = require('connect-mongo');

app.use(session({    // MongoStore is used to store the session cookie in the db
    name : 'codeial',
    // TODO change the secret before deployment in production mode
    secret : 'blahsomething',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000 * 60 * 100)
    },
    store : MongoStore.create(
        {
            mongoUrl : 'mongodb+srv://Chats:wkTnlxjfJG9dmxTP@cluster0.mxmxr.mongodb.net/codeial_development?retryWrites=true&w=majority',
            autoRemove : 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));


// setting up passport with local startegy
const passport = require('passport')
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)  // middleware to access the authenticated user from locals for views

//setting flag msgs
const flash = require('connect-flash');
app.use(flash());
app.use(customMware.setFlash);


// use express router
app.use('/',require('./routes/index'))

app.listen(port,function(err){
    if(err){
        console.log(`error : ${err}`);
    }
    console.log(`Server is up and running at port: ${port}`);
})
