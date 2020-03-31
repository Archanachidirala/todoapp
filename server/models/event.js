const mongoose = require('mongoose') // import mongoose

const Schema = mongoose.Schema

// Create the Schema for Mongoose that corresponds to that type we set in GraphQL
const eventSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    id: {
        type: Date,
        required: true
    }

})

module.exports = mongoose.model('Event', eventSchema) // create and export the model