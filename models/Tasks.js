const { Schema, model } = require('mongoose')

const Tasks = new Schema({
    tasks: { type: String, unique: true, default: '[]' },

})
module.exports = model('Tasks', Tasks)