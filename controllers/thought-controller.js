const { User, Thought } = require('../models');

const thoughtController = {

    // Create a Thought
    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id, _doc }) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } }
                ).then(res.json(_doc))
            })
            .catch(err => res.status(400).json(err));
    },

    // Get All Thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughts => res.json(dbThoughts))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //Get One Thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .select('-__v')
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: "No thought matches this id!" });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Update a Thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: "No thought matches this id!" });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => res.status(400).json(err));
    },

    // Delete a Thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: "No thought matches this id!" });
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => res.status(400).json(err));
    },

    // Create a Reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: { reactions: body } },
            { new: true }
        )
            .then(dbThoughts => {
                if (!dbThoughts) {
                    res.status(404).json({ message: "No thought matches this id"});
                    return;
                }
                res.json(dbThoughts);
            })
            .catch(err => res.json(err));
    },

    // Delete a Reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $pull: { reactions: params.reactionId } },
            { new: true }
        )
            .then(dbThoughts => res.json(dbThoughts))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;