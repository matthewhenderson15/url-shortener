const UrlModel = require('../models/url.model');
const {nanoid} = require('nanoid');

exports.getURL = async (req, res) => {
    const {slug} = req.params;

    const foundSlug = await UrlModel.findOne({slug}) // checks if slug exists

    //create slug if no slug exists
    if (!foundSlug || foundSlug.length == 0) {
        let fullUrl = req.protocol + '://' + req.get('Host') + req.originalUrl;
        res.status(404).json({message: "URL not found", body:{slug, url: fullUrl}});
    } else {
        res.status(302).redirect(foundSlug.url);
    }
}

exports.postUrl = async (req, res) => {
    let {url, slug} = req.body;

    if(!slug) {
        slug = nanoid(5);
    } //if no slug provided, create a new one

    slug = slug.toLocaleLowerCase(); //convert slug to lowercase text

    const foundSlug = await UrlModel.find({slug});

    //if no slug exists create one
    if(!foundSlug || foundSlug.length == 0) {
        const newUrl = new UrlModel(
        {
            slug,
            url
        }
        );
        const response = await newUrl.save();
        res.status(200).json({message: "Creation successful", body: response});
    } else {
        res.status(409).json({message: "Resource already exists.", body:{slug: "", url: ""}});
    }
}
