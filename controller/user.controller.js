const User = require('../models/user');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const load = async (req, res, next, id) => {

    try {

        const user = await User.get(id);
        req.route.meta = req.route.meta || {};
        req.route.meta.user = user;
        return next();
    } catch (error) {
        return errorHandler(error, req, res);
    }

};

const getAllUser = async (req, res, next) => {

    try {
        const allUser = await User.find();
        return res.status(200).json({ user: allUser });

    } catch (err) {
        return res.status(401).json({ err })
    }

}

const getOneUser = async (req, res, next) => {

    try {
        let id = req.query.user_id;
        const allUser = await User.findById(id).populate('my_prods').populate({
            path: 'my_prods',
            populate: {
                path: 'owner',
                model: 'User'
            }
        });
        if (!allUser)
            return res.status(400).json({ error: 'Vous avez déjà ajouté ce produit dans votre liste de favoris' });

        return res.status(200).json(allUser);

    } catch (err) {
        return res.status(401).json({ err })
    }

}

const loggedIn = (req, res) => res.json(req.route.meta.user);

const updateUser = async (req, res, next) => {

    try {

        let modifyUser = req.body
        let updateUser = await User.findByIdAndUpdate(req.route.meta.user._id, { ...modifyUser }, { returnOriginal: false });
        return res.status(200).json({ user: updateUser })

    } catch (err) {
        return res.status(401).json({ err })
    }

}

const updateUserLivraison = async (req, res, next) => {

    try {

        let modifyUser = req.body
        let updateUser = await User.findByIdAndUpdate(req.route.meta.user._id, { livraison:req.body}, { returnOriginal: false });
        return res.status(200).json({ user: updateUser })

    } catch (err) {
        return res.status(401).json({ err })
    }

}


const addToFav = async (req, res) => {

    try {
        let user = await User.findOne(req.route.meta.user._id);

        if (user.fav_prod.includes(req.body.id)) {
            return res.status(400).json({ error: 'Vous avez déjà ajouté ce produit dans votre liste de favoris' });
        }

        user.fav_prod.push(req.body.id)
        await user.save();

        return res.status(200).json({ user })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to add product' });
    }

};


const deleteToFav = async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.route.meta.user._id });

        const index = user.fav_prod.indexOf(req.body.id);
        if (index !== -1) {
            user.fav_prod.splice(index, 1);
            await user.save();
        } else {
            return res.status(400).json({ error: 'Vous avez déjà ajouté ce produit dans votre liste de favoris' });
        }

        return res.status(200).json({ user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

const updatePhoto = async (req, res, next) => {

    try {

        console.log(req.file);

        if (!req.file)
            return res.status(401).json({ err: "Iamge not provided" })

        return res.status(200).json({ photo: process.env.HOST + req.file.originalname });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ err })
    }

}

const deleteUser = async (req, res, next) => {

    try {
        await User.deleteMany({ _id: { $in: req.params.ids.split(",") } })
        return res.status(200).json({ message: "user deleted successfully" });

    } catch (err) {
        res.status(401).json({ err })
    }

}

const updatePasswordUser = async (req, res, next) => {
    try {
        let id = req.route.meta.user._id;
        let password = req.body.password;

        if (!password) throw res.status(401).json("Password doesnt exist");

        const hash = bcrypt.hashSync(password, 10);

        let oneUser = await User.findOneAndUpdate(
            { _id: id },
            { password: hash },
            {
                returnOriginal: false,
            }
        );

        if (!oneUser) throw createError(401, "Failed to update");

        return res.status(200).json({ message: "user modified successfully" });
    } catch (err) {
        res.status(401).json({ err })
    }
};

async function followUser(req,res) {
    try {

        let userId = req.route.meta.user._id
        let followerId = req.query.userId

        const user = await User.findById(userId);
        const follower = await User.findById(followerId);

        if (!user || !follower) {
            console.error('User or follower not found');
            return;
        }
        if (!follower.followers.includes(userId)) {

            follower.followers.push(userId);
            
            user.following.push(followerId);

            await follower.save();
            await user.save();

            return res.status(200).json(`tu as commencé a votre suivre ${follower.username}`);
        } else {
            return res.status(200).json(`${follower.username} is already following ${user.username}`);
        }
    } catch (error) {
        return res.status(401).json({ err: error.message })
    }
}

// Function to unfollow a user
async function unfollowUser(req,res) {
    let userId = req.route.meta.user._id
    let followerId = req.query.userId
    try {
        const user = await User.findById(userId);
        const follower = await User.findById(followerId);

        if (!user || !follower) {
            console.error('User or follower not found');
            return;
        }

        // Check if the follower is currently following the user
        if (follower.followers.includes(userId)) {
            follower.followers = follower.followers.filter(id => id.toString() !== userId.toString() );
            console.log(follower.followers);
            await follower.save();

            return res.status(200).json(`tu as cessé de suivre ${follower.username}`);
        } else {
            return res.status(200).json(`${follower.username} is not following ${user.username}`);
        }
    } catch (error) {
        return res.status(401).json({ error: error.message })
    }
}

async function isFollowing(req,res) {
    try {
        let userId = req.route.meta.user._id
        let followerId = req.query.userId

        const currentUser = await User.findById(followerId);
    
        if (!currentUser) {
            return res.status(401).json({ err: 'Current user not found'})

        }
  
      // Check if the current user is following the other user
      let status = currentUser.followers.includes(userId) ? true : false;
      return res.status(200).json({status});

    } catch (error) {
      console.error('Error:', error.message);

      return false;
    }
  }
module.exports = {
    getAllUser,
    updateUser,
    updatePhoto,
    deleteUser,
    load,
    loggedIn,
    addToFav,
    deleteToFav,
    updatePasswordUser,
    getOneUser,
    followUser,
    unfollowUser,
    isFollowing,
    updateUserLivraison
}