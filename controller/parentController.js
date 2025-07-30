const {Parent,User} =require('../model/schoolDB')
const bcrypt = require('bcrypt')

// add Parent

exports.addParent = async(req,res)=>{
    try {
        // destructure variable to check if the parent exists
        const {email,nationalID,name} =req.body

        // check using email
        const existingParentEmail = await User.findOne({email})
        if(existingParentEmail) return res.json({message:"Email already taken"})
        // Check using the id
        const existingParentId = await Parent.findOne({nationalID})
        if(existingParentId) return res.json({message:"National Id has already been registered"})
        // When all checks are good , save the new parent

        const newParent = new Parent(req.body)
        const savedParent = await newParent.save()

        // creating the parent user account
        const defaultPassword = 'parent1234'
        const hashedPassword = await bcrypt.hash(defaultPassword,10)

        const newUser = new User({
            name,email,password:hashedPassword,
            role:'parent',
            parent:savedParent._id,
        })
        await newUser.save()
        res.status(201).json({parent:savedParent,message:"Parent and user account created successfully."})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get all parents
exports.getAllParents = async(req,res)=>{
    try {
        const parents = await Parent.find()
        res.status(200).json(parents)
    } catch (error) {
        res.status(500).json({messsage:error.message})
    }
}

// update Parent by admin
exports.updateParent = async(req,res)=>{
    try {
        const updatedParent = await Parent.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.status(200).json(updatedParent)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// update PArent by admin
exports.deleteParent = async(req,res)=>{
    try {
        const deletedParent = await Parent.findByIdAndDelete(req.params.id)
        if(!deletedParent) return res.status(404).json({message:"Parent not found"})
        
        // Delete also the associated user account
        await User.findOneAndDelete({parent:req.params.id})
        res.status(200).json({message:"Parent account deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}