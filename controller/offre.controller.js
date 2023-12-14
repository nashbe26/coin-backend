const Offre = require("../models/offre");
const mongoose = require("mongoose");

async function changeStatus(req, res) {
    try {

        let offre_id = req.query.offre_id

        const offres = await Offre.findById(offre_id)
            .populate("owner prod_id receiver");

        offres.status = req.body.status;

        await offres.save()

        return res.status(200).json(offres);

    } catch (error) {
            console.error(error);
        return res.status(404).json({ msg: "Failed to get disccusion" });
    }
}

async function  findOffreByUser(req,res) { 
try {

    let ownerId = req.query.owner
    let receiverId = req.query.receiver

    const offer = await Offre.find({
        $or: [
            { owner: ownerId, receiver: receiverId },
            { owner: receiverId, receiver: ownerId }
        ]
    }).populate("owner prod_id receiver");

    if(!offer)
    return res.status(200).json(null);

    return res.status(200).json(offer[offer.length-1]);
    

} catch (error) {
    console.error(error);
    return res.status(404).json({ msg: "Failed to get offre" });
}
}

async function setOffreDiscussion(req, res) {
    try {

        let offres = new Offre(req.body)
        await offres.save()

        return res.status(200).json(offres);
    } catch (error) {
            console.error(error);
        return res.status(404).json({ msg: "Failed to get disccusion" });
    }
}

module.exports = {
    findOffreByUser,
    setOffreDiscussion,
    changeStatus
};
