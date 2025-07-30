const {Classroom}=require('../model/schoolDB')

//All classrooms

exports.addClassroom=async (req,res)=>{
    try {
        //receive data from client
        const newClassroom=req.body

        console.log(newClassroom)
        const savedClassroom= new Classroom(newClassroom)
        await savedClassroom.save()
        res.json(savedClassroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}


//fetching all classrooms
exports.getAllClassrooms=async(req,res)=>{
    try {
        const classrooms=await Classroom.find()
        .populate('teacher','name email phone')
        .populate('students','name admissionNumber')
        res.json(classrooms)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}

//fetching one classrooms
exports.getClassroomsById=async(req,res)=>{
    try {
        const classroom=await Classroom.findById(req.params.id)
        .populate('teacher','name email phone')
        .populate('students','name admissionNumber')
        if(!classroom) return res.status (404).json ({message:"Classroom not found"})
            res.status(200).json(classroom)
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

//Update classrooms

exports.updateClassroom=async (req,res)=>{
    try {
        const updateClassroom=await Classroom.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    if (!updateClassroom) return res.status (404).json ({message:"Classroom not found"})
    res.status(201).json(updateClassroom)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//delete classroom
exports.deleteClassroom=async (req,res)=>{
    //find class and delete by id
    try{
    const deleteClassroom=await Classroom.findByIdAndDelete(req.params.id)
    if(!deleteClassroom) return res.status(500).json ({message:"Classroom not found"})
        res.json({message:"Classroom deleted successfully"})
    }catch(error){
        res.status(500).json({message:error.message})

    }
}

