const requestModel = require("../model/requestModel");
const userModel = require("../model/userModel");

const getRequestRoute = async(req, res , next)=>{

    try{
    const from = req.params.id;
    
    if(from !== undefined){
    let request = await requestModel.find({to: from});
   
       return  res.json({msz: "Successfully Called" ,req: request, success:true})
   
    }
    return res.json({msz: "Backchodi mt kr lode ", success: false})
}catch(err)
{
    console.error(err)
    return res.json({msz: "Internal Server error", success: false})
    
}


}
const sendRequest = async(req, res , next)=>{
    try {
        const from = req.params.id;
        const {to,name,img} = req.body;
        const user = await userModel.findById(to)
        if(to && from && user )
        {
            const newRequest = await requestModel.create({
                to: to,
                from: from,
                name: name,
                img: img,
            })
            if(newRequest) return res.json({success: true, msz: "Request Sent Succesfully"});
            return res.json({success: false, msz: "Some error occurred"});
        }
        return res.json({success: false, msz: "Some error occurred"});
    } catch (error) {
        return res.json({success: false, msz: "Internal Server error" , error: error})
       
    }
}
const acceptRequest = async(req, res, next)=>
{
    try {
        
        const {request_id} = req.body;
        const request = await requestModel.findById(request_id) 
        if(request)
        {
            const req_delete = await requestModel.findByIdAndDelete({request});
            if(req_delete)
            {
                const data = await friendsModel.create({
                   users: [request.from , request.to]
                });
                if (data) {
                    return res.json({ success: true, msz: "Friend Added and Request Deleted Successfully" });
                }
                return res.json({success: false, msz:"Friend not added"})
            }
            
            }
            return res.json({success: false, msz:"Request not found"});
    } catch (error) {
        console.error(error);
        return res.json({success: false, msz:"Internal Server Error"})
    }
}
module.exports = {
    getRequestRoute,
    sendRequest,
    acceptRequest
}