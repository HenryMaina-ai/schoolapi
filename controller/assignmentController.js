const {Assignment,User,Classroom} =require('../model/schoolDB')
// get all assignments (Admin view)
// includes classroom and teacher information
exports.getAllAssignments=async(req,res)=>{
    try {
        const assignments=await Assignment.find()
        .populate("classroom","name gradeLevel classYear")
        .populate("postedBy","name email phone")
        res.status(200).json(assignments)
    } catch (error) {
        res.status(501).json({message:error.message})
    }
}

// add assignments Only teachers
//validate user and classroom existence
exports.addAssignment=async(req,res)=>{
    try {
        //get loggedIn User
        const userId=req.user.userId

        //fetch the user and populate the 'teacher'
        const user=await User.findById(userId)
        .populate('teacher')

        //block non teacher from posting
        if(!user || !user.teacher) return res.status(403).json({message:"Only teacher can post"})

        //Extract classroomId from the request
        const {classroom:classroomId}=req.body

        //check if the classroom exists first
        const classroomExist=await Classroom.findById(classroomId)
        if(!classroomExist) return res.status(404).json({message:"Classroom Not Found!"})

        //prepare the assignment data
        const assignmentData={
            ...req.body,
            postedBy:user.teacher._id
        }

        //save assignment to db
        const newAssignment=new Assignment(assignmentData)
        const savedAssignment=await newAssignment.save()
        res.status(201).json(savedAssignment)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//single assignment
//include tha classroom and the teacher
exports.getAssignmentById=async(req,res)=>{
    try {
        const assignment=await Assignment.findById(req.params.id)
        .populate('classroom')
        .populate('postedBy')
        //check if it exists
        if (!assignment) return res.status(404).json({message:"Assignment Not Found!"})
        
        res.status(200).json(assignment)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//update assingment
exports.updateAssignment=async(req,res)=>{
    try {
        //find the assignment first
        const updateAssignment=await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updateAssignment) return res.status(404).json({message:"Assignment Not Found"})
        res.status(200).json({message:"Asssignment Updated Succesfully!",updateAssignment})
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}

//delete an assignment
exports.deleteAssignment=async(req,res)=>{
    try {
        const deleteAssignment=await Assignment.findByIdAndDelete(req.params.id)
        if(!deleteAssignment)return res.status (404).json({message:"Assignment Not Found!"})
        res.status(200).json({message:"Assignment Deleted Successfully!"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}