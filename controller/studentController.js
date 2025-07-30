const {Student,Classroom,Parent} = require('../model/schoolDB')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// file location folder/directory
const upload = multer({dest:'upload/'})
exports.uploadStudentPhoto = upload.single('photo')
exports.addStudent = async(req,res)=>{
    try {
        // destructuring
        const{name,dateOfBirth,gender,admissionNumber,parentNationalId,classroomId} = req.body
        // check if parent exists by nationalId
        const parentExist = await Parent.findOne({nationalID:parentNationalId})
        if(!parentExist) return res.status(404).json({message:"Parent with provided national ID not found"})
        // Check if the student exists
        const studentExist = await Student.findOne({admissionNumber})
        console.log(studentExist)
        if(studentExist) return res.json({message:"Admission number has already been assigned to someone else."})
        // Check if the class exists
        const classExist = await Classroom.findById(classroomId)
        if(!classExist) return res.status(500).json({message:"Classroom not found"})
        
        // prepare our upload file
        let photo = null
        if(req.file){
            const ext = path.extname(req.file.originalname)
            const newFileName = Date.now()+ext
            const newPath = path.join('upload',newFileName)
            fs.renameSync(req.file.path,newPath)
            photo = newPath.replace(/\\/g,'/')
        }

        // create student Document
        const newStudent = new Student({
            name,
            dateOfBirth,
            gender,
            admissionNumber,
            photo,
            parent:parentExist._id,
            classroom:classExist._id
        })
        

        const savedStudent = await newStudent.save()
        

        //adding a student to a class using the $addToSet to prevent duplicates
        await Classroom.findByIdAndUpdate(
            classExist._id,
            {$addToSet:{students:savedStudent}}
        ) 
        res.status(201).json(savedStudent)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get all students
exports.getAllStudents = async (req,res)=>{
    try {
        const students = await Student.find()
        .populate('classroom')
        .populate('parent')
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// get one students
exports.getOneStudent = async (req,res)=>{
    try {
        const student = await Student.findById(req.params.id)
        .populate('classroom')
        .populate('parent')
        if(!student) res.status(404).json({message:"Student not found"})
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// update student
exports.updateStudent = async(req,res)=>{
    try {
        const updatedStudent =await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updatedStudent) return res.status(404).json({message:"Student not found"})
        res.json(updatedStudent)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// Delete student
exports.deleteStudent =async(req,res)=>{
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id)
        if(!deletedStudent) return res.status(404).json({message:"Student not found."})
        // Remove the student from classroom
        /*await Classroom.updateMany(
            {students:deletedStudent._id},
            {$pull:{students:deletedStudent._id}}
        )*/
       await Classroom.findByIdAndUpdate(
        deletedStudent.classroom,
        {$pull:{students:deletedStudent._id}},
        {new:true}
       )
        res.status(200).json({message:"Student deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}