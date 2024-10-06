const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}
module.exports.showCamp = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: 'author'
        })
        .populate('author');
    if (!camp) {
        req.flash('error', "rak Tkhalet fe swaleh khatik (Campground not found)")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp })
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp) {
        req.flash('error', "rak Tkhalet fe swaleh khatik (Campground not found)")
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp })
}

module.exports.createNewCampground = async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressErrorHandler('Invalid Request', '400');


    const newCamp = new Campground(req.body.campground)
    newCamp.author = req.user._id
    await newCamp.save();
    req.flash('success', "Waw ak ta3ref tzid campground")
    res.redirect(`/campgrounds/${newCamp.id}`)

}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "Action Not Authorized")
        return res.redirect(`/campgrounds/${id}`)
    }
    await Campground.findByIdAndUpdate(id, req.body.campground)
    req.flash('success', "ZID rak ta3ref Tupdati Campground")
    res.redirect(`/campgrounds/${id}`)
}


module.exports.deleteCampground = async (req, res) => {
    try {
        const { id } = req.params
        const deletedCamp = await Campground.findByIdAndDelete(id)
        req.flash('success', `LALAAAAA na7it "${deletedCamp.title}"`)
        res.redirect(`/campgrounds`)
    } catch (e) {
        next(e);
        req.flash('error', `manich 3aref wsh aw sari m3a ${id}`)
    }
}