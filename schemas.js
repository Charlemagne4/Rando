const Joi = require("joi");

module.exports.campgroundJoiSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required(),
        images: Joi.array().items(
            Joi.object({
                url: Joi.string(),
                fileName: Joi.string()
            })
        ),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewJoiSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().min(10).messages({
            'string.empty': 'Review body cannot be empty',
            'string.min': 'Review must be at least 10 characters long',
        }),
        rating: Joi.number().required().max(5).min(1).messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5',
        })
    }).required()

})