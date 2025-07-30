const {User,Assignment,Classroom}= require('../model/schoolDB')

// teachers dashboard
exports.teacherDash = async(req,res)=>{
    try {
        // the loged in user who is the teacher
        const userId = req.user.userId
        // fetch the teacher's object id from user
        const user = await User.findById(userId)
        // Check if the user is a teacher
        if (!user || !user.teacher) return res.status(403).json({message:"Teacher not found or not linked to "})

        // Extract the teacher id from the user object
        const teacherId = user.teacher

        // aggregate classrooms to get the class count and student total
        const classStat = await Classroom.aggregate([
            {$match:{teacher:teacherId}},
            {
                $group:{
                    _id:null, //
                    totalClasses:{$sum:1},
                    totalStudents:{$sum:{$size: "$students"}}
                }
            }
        ])

        // count assignments
        const totalAssignments = await Assignment.countDocuments({postedBy:teacherId})
        // prepare results
        const result = {
            totalClasses:classStat[0]?.totalClasses || 0,
            totalStudents:classStat[0]?.totalStudents || 0,
            totalAssignments
        }
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}