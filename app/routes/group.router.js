const router = require('express').Router(),
    Group = require('../models/group.model'),
    User = require('../models/user.model'),
    validator = require('../helpers/validator');


module.exports = function(io) {
    router.post('/create', (req, res) => {

        if (!validator.isValid(req.body.name))
            return res.status(500).json({ 'message': 'Please provide a name for the group' });

        var group = Group({
            name: req.body.name
        });

        group.save()
            .then(() => {

                return User.findOneAndUpdate({ token: req.headers.token }, { group: group._id });
            })
            .then((user) => {

                io.sockets.emit('groupCreated', group);

                res.json({ 'message': 'group created successfully', 'groupId': group._id });
            })
            .catch((err) => {
                console.log(`groups/create\n${err}`);

                res.status(500).json({ 'message': 'something went wrong' });
            });
    });

    router.get('/', (req, res) => {
        Group.find()
            .select('-notes')
            .then((groups) => res.json(groups))
            .catch((err) => {
                console.log(`groups/\n${err}`);

                res.status(500).json({ 'message': 'something went wrong' });
            });
    });

    router.post('/join', (req, res) => {
        if (!validator.isValid(req.body.groupId))
            return res.status(500).json({ 'message': 'Please choose a group to join' });

        User.findOneAndUpdate({ token: req.headers.token }, { group: req.body.groupId })
            .then((user) => {
                res.json({ 'message': 'You\'ve joined the group' });
            })
            .catch((err) => {
                console.log(`groups/join\n${err}`);

                res.status(500).json({ 'message': 'something went wrong' });
            });
    });

    return router;
}