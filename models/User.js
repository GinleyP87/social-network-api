const { Schema, model } = require("mongoose");


const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: "Please enter a valid username!",
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: "Please enter a valid password!",
            trim: true,
            unique: true
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {toJSON: {
        virtuals: true,
        getters: true
        },
    id: false
    }
);

userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});
const User = model('User', userSchema);

module.exports = User
