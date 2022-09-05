const express= require('express');
const app= express();
const path = require('path');
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
const dotenv= require('dotenv');
dotenv.config({path:'.env'});
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
useUnifiedTopology:true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("DataBase Connected");
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret' }))
const ejsMate= require('ejs-mate')
app.engine('ejs',ejsMate);

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}
app.get('/', (req, res) => {
    res.send('THIS IS THE HOME PAGE')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { password,username,phone,address,email } = req.body;
    const user = new User({ username,password,phone,address,email  })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    const { username,password,phone,address,email  } = req.body;
    const foundUser = await User.findAndValidate(username,password,phone,address,email );
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    }
    else {
        res.redirect('/login')
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')
})
app.get('/topsecret', requireLogin, (req, res) => {
    res.send("TOP SECRET!!!")
})

app.get('/',(req,res)=>{
    res.send('working');
})
app.listen(process.env.PORT,(req,res)=>{
    console.log('listening on Port 3000');
})