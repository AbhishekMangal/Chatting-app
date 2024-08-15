const friendsModel = require("../model/friendsModel");
const userModel = require("../model/userModel");

module.exports.addFriendRoute = async(req, res, next)=>
{
    try {
        const {from, to} =  req.body;
        const data = await friendsModel.create({
            users: [from, to]
        })
        if(data) return res.json({success: true, msz: "Friend Added Successfully"});
        return res.json({success: false , msz: 'Friends not Added'});
        
    } catch (error) {
        next(error);
        // return res.json({success: false, msz: "Internal Server Error"});
    }
}
module.exports.getFriends = async(req,res, next)=>
{
    try {
        const {myId} = req.body;
        const data = await friendsModel.find({
            myId: myId,
        });
        // const user = await data.JSON();
        // console.log(data);
        const IDS = await Promise.all(data.map(async (user) => {
            const friendData = await userModel.findById(user.friendID).select('-password');
            return {
                dagID: user.myId.toString() === myId,
                users: friendData,
            };
        }));
    
        return res.json({success: true, IDS});


        
    } catch (error) {
        next(error);
        
    }
}