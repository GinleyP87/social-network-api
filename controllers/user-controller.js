const { User } = require('../models');

const userController = {

    // Create User
    createUser({ body }, res) {
        User.create(body)
            .then(dbUsers => res.json(dbUsers))
            .catch(err => res.status(400).json(err));
    },

    // Get All Users
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUsers => res.json(dbUsers))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Get One User By ID
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUsers => {
                if (!dbUsers) {
                    res.status(404).json({ message: 'No users match this id!' });
                    return;
                }
                res.json(dbUsers);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

}

module.exports = userController