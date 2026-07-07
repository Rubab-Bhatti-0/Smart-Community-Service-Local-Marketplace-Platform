const serviceModel=require('../models/Listing.model')

const createListing=async(req,res)=>{
    try{
    const {type,title,Description,Pricing,Delivery_Time,Availability,Images,serviceCategory,Stock}=req.body;
    if(!title  || !Description || !Pricing || !serviceCategory){
        return res.status(400).json('Provide all feilds that required!')
    }
    const imageURLs=req.files ? req.files.map(file=>file.path):[]
    const Listing= await serviceModel.create({
        owner:req.user._id,
        type,title,Description,Pricing,
        Delivery_Time:type==='service'?Delivery_Time:undefined,
        Availability:type==='service'?Availability:undefined,
        Images:imageURLs,serviceCategory,
        Stock:type==='product'? Stock:undefined,
        Location
        
    })
    return res.status(201).json({
        message:"New listing created!"
    })
}catch(error){
    res.status(500).json({ message: err.message });
}

}

const getListingByID= async(req,res)=>{
    try{
    const listings=await serviceModel.findById(req.params.id).populate('owner','Name Picture Bio RatingAvg Location')

    if(!listings){
        return res.status(500).json({
            message:"no listing found!"
        })
    }
    return res.status(200).json({
        listings
    })

    }catch(error){
         res.status(500).json({ message: err.message });
    }
}

const editListing=async(req,res)=>{
    try {
        const listing=await serviceModel.findById(req.params.id)

        if(!listing){
            return res.status(404).json("listing not found!")
        }

        if(listing.owner.toString() !== req.user._id.toString()&& req.user.role!=='admin'){
            return res.status(403).json('Unauthorization detected!You cannot edit the listing')
        }
        const updatableFeilds=['title','Description','Stock','Availability','Delivery_Time','Location','serviceCategory','Price'];
        updatableFeilds.forEach(feild=>{if(req.params[feild]!==undefined) listing[feild]=req.body[feild]})

        if(req.files && req.files.length>0){
            req.Images=req.files.map(file=>file.path)

        }

        await listing.save()
        return res.status(200).json('service updated!')


        
    } catch (error) {
        res.status(500).json({ message: err.message });
    }


}

const delListing=async(req,res)=>{
    try {
        const listing=await serviceModel.findById(req.params.id)

        if(!listing){
            return res.status(404).json("no such listing found!")
        }
        if( listing.owner.toString()!== req.user._id.toString() &&req.user.role!=='admin'){
            return res.status(403).json('You donot have this authorization!')
        }

        await listing.deleteOne()
        
    } catch (error) {
        res.status(500).json({ message: err.message });
        
    }


}

const viewListing=async(req,res)=>{
    try {
        const{
            page=1,
            limit=12,
            type,
            serviceCategory,
            minPrice,
            maxPrice,
            search,
            Location,
            sort='Newest'
        }=req.query

        const filter={
            status:'active'
        }

        if(type) filter.type=type;
        if(serviceCategory)filter.serviceCategory=serviceCategory
        if(Location) filter.Location={$regex:Location,$options:'i'};
        if(minPrice || maxPrice){
            filter.Pricing={}
            if(minPrice) filter.Pricing.$gte=Number(minPrice)
            if(maxPrice) filter.Pricing.$lte=Number(maxPrice)
        }

        if(search){
            filter.$or[
                {title:{$regex:search,$options:'i'}},
                {Description:{$regex:search,$options:'i'}}
            ]
        }

        const sortOption=sort==='Newest'?{createdAt:-1}:
                         sort==='priceLow'?{Pricing:1}:
                         sort==='priceHigh'?{Pricing:-1}:{createdAt:-1};

        const skip=(Number(pages)-1)*limit

        const [listings,total]=await Promise.all([
            serviceModel.find(filter).populate('owner','Name Picture RatingAvg Location').
            sort(sortOption).skip(skip).limit(limit),
            serviceModel.countDocuments(filter)
        ])

        res.status(200).json({
            Listings:listings,
            total:total
        })

        
    } catch (error) {
        res.status(500).json({ message: err.message });
        
    }


}

module.exports={createListing,editListing,delListing,viewListing,getListingByID}