const { Schema, model } = require('mongoose')

const Role = new Schema({
    value: { type: String, unique: true, default: 'USER' },
    tasks: { type: String, unique: true, default: '[]' },

})
module.exports = model('Role', Role)