const router = require('express').Router(),
    Note = require('../models/note.model'),
    Group = require('../models/group.model'),
    isValid = require('../helpers/validator').isValid;

module.exports = function(io) {
    router.post('/create', (req, res) => {
        if (!isValid(req.body.title) || !isValid(req.body.text) || !isValid(req.body.groupId))
            return res.status(500).json({ 'message': 'Title, text and group id are required' });

        var note;
        var dgroup;
        Group.findById(req.body.groupId)
            .then((group) => {
                if (!group)
                    return res.status(500).json({ 'message': 'Invalid group id' });

                dgroup = group;

                note = Note({
                    title: req.body.title,
                    text: req.body.text
                });

                return note.save();
            })
            .then(() => {
                dgroup.notes.push(note._id);
                return dgroup.save();
            })
            .then(() => {
                io.to(dgroup._id).emit('noteCreated', note);

                res.json({ 'message': 'Note added successfully' });
            })
            .catch((err) => {
                console.log(`notes/create\n${err}`);

                res.status(500).json({ 'message': 'something went wrong' });
            });
    });

    router.get('/:groupId', (req, res) => {
        Group.findById(req.params.groupId)
            .populate('notes')
            .then((group) => {
                res.json(group);
            })
            .catch((err) => {
                console.log(`notes/\n${err}`);

                res.status(500).json({ 'message': 'something went wrong' });
            });
    });

    return router;
};