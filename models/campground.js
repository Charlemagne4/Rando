const mongoose = require("mongoose");
const Review = require('./review.js')

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
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
    console.log(`Deleting ${data}`);

})
module.exports = mongoose.model('Campground', CampgroundSchema); 