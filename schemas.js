const baseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
const Joi = baseJoi.extend(extension);
module.exports.campgroundJoiSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        images: Joi.array().items(
            Joi.object({
                url: Joi.string().escapeHTML(),
                fileName: Joi.string().escapeHTML()
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
        }).escapeHTML(),
        rating: Joi.number().required().max(5).min(1).messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5',
        })
    }).required()

})