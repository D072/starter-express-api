const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogDataSchema = new Schema({
    title : String,
    description : String,
    category : { type: Schema.Types.ObjectId, ref: 'category' },
    blogImage: String
});

const blogData = mongoose.model('blogData', blogDataSchema);


module.exports = blogData;