// schemas (users,teachers,class,students,parents,assignments)
const mongoose = require("mongoose")
const Schema = mongoose.Schema

// define user schema
const userSchema = new Schema({
    name:{type:String},
    email:{type:String,required:true, unique:true},
    password:{type:String,required:true},
    isActive:{type:Boolean,default:true},
    role:{type:String,enum:['admin','teacher','parent'],required:true},
    teacher:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher', default:null},
    parent:{type:mongoose.Schema.Types.ObjectId,ref:'Parent',default:null}
},{timestamps:true}) //handles created at and updated at automatically.

// Teacher Schema
const teacherSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String},
    phone:{type:String},
    subject:{type:String}
},{timestamps:true})

// Parent Schema
const parentSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String},
    phone:{type:String,required:true},
    nationalID:{type:String,required:true, unique:true},
    address:{type:String}
},{timestamps:true})

// Classroom Schema
const classroomSchema = new Schema({
    name:{type:String,required:true},
    grade:{type:String},
    classYear:{type:Number},
    teacher:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher', default:null},
    students:[{type:mongoose.Schema.Types.ObjectId,ref:'Student', default:null}]
},{timestamps:true})

// Student Schema
const studentSchema = new Schema({
    name:{type:String,required:true},
    dateOfBirth:{type:Date,required:true},
    gender:{type:String},
    photo:{type:String},
    admissionNumber:{type:String,required:true},
    classroom:[{type:mongoose.Schema.Types.ObjectId,ref:'Classroom'}],
    parent:{type:mongoose.Schema.Types.ObjectId,ref:'Parent'},

},{timestamps:true})

// Assignments
const assignmentSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String},
    dueDate:{type:Date},
    classroom:[{type:mongoose.Schema.Types.ObjectId,ref:'Classroom'}],
    postedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'Teacher'}],
},{timestamps:true})

// prepare exports
const User = mongoose.model("User",userSchema)
const Teacher = mongoose.model("Teacher",teacherSchema)
const Classroom = mongoose.model("Classroom",classroomSchema)
const Parent = mongoose.model("Parent",parentSchema)
const Student = mongoose.model("Student",studentSchema)
const Assignment = mongoose.model("Assignment",assignmentSchema)

module.exports = {User,Teacher,Classroom,Parent,Student,Assignment}