const router = require('express').Router(),
    validator = require('../helpers/validator'),
    User = require('../models/user.model'),
    Group = require('../models/group.model'),
    Note = require('../models/note.model');

router.post('/login', (req, res) => {
    if (!validator.isValid(req.body.nickname))
        return res.status(500).json({ 'message': 'Nickname is required' });

    var user = User({
        nickname: req.body.nickname
    });

    user.save()
        .then(() => {
            res.json(user);
        })
        .catch((err) => {
            console.log(`auth/login\n${err}`);

            res.status(500).json({ 'message': 'Nickname is used' });
        });
});

router.post('/logout', (req, res) => {
    var duser;
    User.findOneAndRemove({ token: req.headers.token })
        .then((user) => {
            duser = user;

            return User.count({ group: user.group });
        })
        .then((count) => {
            if (count === 0) {
                Group.findOneAndRemove({ _id: duser.group })
                    .then((group) => {
                        Note.remove({ _id: { '$in': group.notes } }).exec();
                    });
            }

            res.json({ 'message': 'You\'ve logged out successfully' });
        })
        .catch((err) => {
            console.log(`auth/logout\n${err}`);

            res.status(500).json({ 'message': 'Something went wrong' });
        });
});

router.get('/isAuth', (req, res) => {
    if (!req.headers.token)
        return res.status(401).json({ 'message': 'Unautherized' });

    User.findOne({ token: req.headers.token })
        .then((user) => {
            if (!user)
                return res.status(401).json({ 'message': 'Unautherized' });

            res.json(user);
        })
        .catch((err) => {
            console.log(`auth/isAuth\n${err}`);

            return res.status(401).json({ 'message': 'Unautherized' });
        });
});

module.exports = router;