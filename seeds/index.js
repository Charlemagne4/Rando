const mongoose = require("mongoose");
const campground = require("../models/campground");
const axios = require('axios');
const cities = require('./cities')
const { descriptions, places, descriptors, price } = require("./seedHelpers")


mongoose.connect('mongodb://127.0.0.1:27017/RanDo').then(() => {
    console.log("CONNECTED!!");
}).catch(err => {
    console.log("CONNECTION FAILED!!");
    console.log(err);
});
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const imageSrc = "https://api.unsplash.com/collections/3846912/photos"


let pictures = [];
let round = 4;
const populatePictures = async (pictures) => {
    do {
        let config = {
            params: {
                "client_id": "3IhUab9oH6FWEOrUBhGynYk3gQECSWnikdS8V4frVWM"
                , per_page: 25,
                page: round
            }
        }


        await axios.get(imageSrc, config).then(async resp => {

            for (let data of resp.data) {
                pictures.push(data.urls.regular);
            }
            round--;
        })
    } while (round > 0);
    return pictures;

}
populatePictures(pictures).then(result => {
    pictures = result;
    seedDB()
});





const seedDB = async () => {
    for (let i = 0; i < 100; i++) {
        const random58 = Math.floor(Math.random() * 58)
        const camp = new campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random58].city}, ${cities[random58].country}`,
            description: `${sample(descriptions)}`,
            price: `${sample(price)}`,
            image: `${pictures[i]}`
        })
        await camp.save()


    }
    mongoose.connection.close();
} 
