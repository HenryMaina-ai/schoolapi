const {Teacher,User,Classroom} = require('../model/schoolDB')
const bcrypt = require('bcrypt')
// add Teacher
exports.addTeacher = async(req,res)=>{
    try {
        // Check if teacher exists
        const {email} = req.body
        const existUserEmail = await User.findOne({email})
        if(existUserEmail)return res.json({message:"Email already exists"})

        const existEmail = await Teacher.findOne({email})
        if(existEmail)return res.json({message:"Email already exists"})
        // create the teacher
        const newTeacher = new Teacher(req.body)
        const savedTeacher = await newTeacher.save()

        // We create a corresponding user document
        // default password
        const defaultPassword = "teacher1234"
        const password = await bcrypt.hash(defaultPassword,10)

        const newUser = new User({
            name:savedTeacher.name,
            email:savedTeacher.email,
            password,
            role:"teacher",
            teacher:savedTeacher._id
        })
        await newUser.save()
        res.status(201).json({message:"Teacher Registration successful.",teacher:savedTeacher})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// Get all teachers
exports.getAllTeachers = async(req,res)=>{
    try {
        const teachers = await Teacher.find()
        res.status(200).json(teachers)
    } catch (error) {
        res.status(500).json({mesage:error.message})
    }
}

// Get single teacher
exports.getSingleTeacher = async(req,res)=>{
    try {
        const teacher = await Teacher.findById(req.params.id)
        if(!teacher) return res.status(404).json({message:"Teacher not found"})
        res.status(200).json(teacher)
    } catch (error) {
        res.status(500).json({mesage:error.message})
    }
}


exports.updateSingleTeacher = async(req,res)=>{
    try {
        const teacherId = req.params.id
        const userId = req.user.userId
        const updateData = req.body

        // Check if the teacher exists
        const existTeacher = await Teacher.findById(teacherId)
        if(!existTeacher) return res.status(404).json({message:"Teacher not found"})
        // Check if the user exists
        const existUser = await User.findById(userId)
        if(!existUser) return res.status(404).json({message:"Teacher not found"})
        
        // restricting the teacher to update the password
        if(updateData.password && req.user.role == "admin"){
            return res.status(403).json({message:"Permission denied"})
        }

        // Comparing the logged in user and the user in the url
        if(req.user.role == "teacher" && existUser.teacher.toString() !== teacherId){
            return res.status(403).json({message:"Access denied"})
        }
        console.log(existUser.teacher.toString())
        console.log(teacherId)

        if (updateData.password){
            const newPassword = await bcrypt.hash(updateData.password,10)
            updateData.password = newPassword
        }
        
        const user = await User.findOne({teacher:teacherId})
        const savedUser = await User.findByIdAndUpdate(
            user._id,
            updateData,
            {new:true}
        )
        
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            updateData,
            {new:true}
        )
        res.json({message:"Teacher has been updated."})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// delete a teacher
exports.deleteTeacher = async(req,res)=>{
    try {
        const teacherId = req.params.id
        console.log(teacherId)
        const existTeacher = await Teacher.findByIdAndDelete(teacherId)
        if(!existTeacher)return res.status(404).json({message:"Teacher not found"})
        // Unassign teacher from any classroom
        await Classroom.updateMany(
            {teacher:teacherId},
            {$set:{teacher:null}}
        )
        res.status(200).json({message: "Teacher Deleted Successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get Teachers Classes
exports.getMyClasses = async (req,res)=>{
    try {
        const userId = req.user.userId
        // find all classes for the teacher
        const user = await User.findById(userId)
        .populate('teacher','name')

        // check if user exist and is linked to a teacher
        if(!user || !user.teacher) return res.status().json({message:"Teacher not found"})

        const classes = await Classroom.find({teacher:user.teacher._id})
        .populate('students') // also get students in that class
        
        res.status(200).json(classes)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//get teacher's assignments
//includes clasroom and teacher information
exports.getAllAssignments=async(req,res)=>{
    try {
        const userId=req.user.userId
        const user=await User.findById(userId)
        .populate('teacher')
        const assignments=await Assignment.find({postedBy:user.teacher._id})
        .populate("classroom","name gradeLevel classYear")
        .populate("postedBy","name email phone")
        res.status(200).json(assignments)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}