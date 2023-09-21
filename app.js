const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));


const predefinedUsername = 'maharoof';
const predefinedPassword = '123';

app.get('/login', (req, res) => {
    if (req.session.username) {
        res.redirect('/home');
    } else {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.render('login', { session: req.session });
    }
});



app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === predefinedUsername && password === predefinedPassword) {
        req.session.username = username;
        res.redirect('/home');
    } else {
        res.send('Invalid username or password.');
    }
});


app.get('/home', (req, res) => {
    if (req.session.username) {
        
        res.header('Cache-Control', 'no-store, private, no-cache, must-revalidate, post-check=0, pre-check=0');
        res.header('Expires', '0');
        res.header('Pragma', 'no-cache');

        res.render('home', { username: req.session.username });
    } else {
        res.redirect('/login');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.header('Cache-Control', 'no-store'); 
        res.redirect('/login');
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
