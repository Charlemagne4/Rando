const mongoose = require("mongoose");
const Campground = require("../models/campground");
const axios = require('axios');
const cities = require('./cities');
const { descriptions, places, descriptors, price } = require("./seedHelpers");

mongoose.connect('mongodb://127.0.0.1:27017/RanDo').then(() => {
    console.log("CONNECTED!!");
}).catch(err => {
    console.log("CONNECTION FAILED!!");
    console.log(err);
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const imageSrc = "https://api.unsplash.com/collections/3846912/photos";

let pictures = [];
let round = 4;

const populatePictures = async (pictures) => {
    do {
        let config = {
            params: {
                "client_id": "3IhUab9oH6FWEOrUBhGynYk3gQECSWnikdS8V4frVWM",
                per_page: 100,
                page: round
            }
        };

        await axios.get(imageSrc, config).then(async resp => {
            for (let data of resp.data) {
                pictures.push(data.urls.regular);
            }
            round--;
        });
    } while (round > 0);
    return pictures;
};

populatePictures(pictures).then(result => {
    pictures = result;
    seedDB();
});

const seedDB = async () => {
    await Campground.deleteMany({}); // Pour effacer les anciennes données

    for (let i = 0; i < 100; i++) {
        const random58 = Math.floor(Math.random() * 58);

        // Générer un nombre aléatoire entre 1 et 3
        const randomNum = Math.floor(Math.random() * 3) + 1;

        // Générer un tableau d'images avec un nombre aléatoire d'objets image
        const images = [];
        for (let j = 0; j < randomNum; j++) {
            images.push({
                url: pictures[Math.floor(Math.random() * pictures.length)], // Choisir une image aléatoire
                fileName: null
            });
        }

        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random58].city}, ${cities[random58].country}`,
            description: `${sample(descriptions)}`,
            price: `${sample(price)}`,
            images: images, // Ajouter le tableau d'images
            author: '66fc1fbab49fbcf448846fba'
        });

        await camp.save();
    }

    mongoose.connection.close();
};
