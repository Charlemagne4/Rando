const mongoose = require("mongoose");
const Review = require('./review.js')

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    fileName: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300')
})

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [imageSchema],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})
CampgroundSchema.post('findOneAndDelete', async (data) => {
    if (data) {
        await Review.deleteMany({
            _id: { $in: data.reviews }
        })
    }

})
module.exports = mongoose.model('Campground', CampgroundSchema); 