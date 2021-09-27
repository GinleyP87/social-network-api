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
                path: 'thoughts',
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

    // Update User By ID
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUsers => {
                if (!dbUsers) {
                    res.status(404).json({ message: "No users match this id!" });
                    return;
                }
                res.json(dbUsers);
            })
            .catch(err => res.status(400).json(err));
    },

    // Delete User
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUsers => {
                if (!dbUsers) {
                    res.status(404).json({ message: "No users match this id!" });
                    return;
                }
                res.json(dbUsers);
            })
            .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUsers => {
                if (!dbUsers) {
                    res.status(404).json({ message: "No users match this id!" });
                    return;
                }
                res.json(dbUsers);
            })
            .catch(err => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUsers => res.json(dbUsers))
            .catch(err => res.json(err));
    }
};

module.exports = userController