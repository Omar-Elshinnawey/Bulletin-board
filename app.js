const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    config = require('./app/config/config'),
    User = require('./app/models/user.model');

var port = process.env.PORT || 3000;

function isAuthenticated(req, res, next) {
    if (!req.headers.token)
        return res.status(401).json({ 'message': 'Unautherized' });

    User.findOne({ token: req.headers.token })
        .then((user) => {
            if (!user)
                return res.status(401).json({ 'message': 'Unautherized' });

            next();
        })
        .catch((err) => {
            console.log(`auth/isAuth\n${err}`);

            return res.status(401).json({ 'message': 'Unautherized' });
        });
}

/**body parser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**static */
app.use('/assets', express.static(path.resolve(__dirname, './public')));

/**routes */
app.use('/api/auth', require('./app/routes/auth.router')(io));
app.use('/api/groups', isAuthenticated, require('./app/routes/group.router')(io));
app.use('/api/notes', isAuthenticated, require('./app/routes/note.router')(io));
app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

require('./app/routes/io.router')(io);

/**mongoose */
mongoose.Promise = require('bluebird');
mongoose.connect(config.db);

server.listen(port);