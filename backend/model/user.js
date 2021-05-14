const mongoose =require("mongoose");

const UserSchema = new mongoose.Schema(
    {username: {type: String, required: true, unique: true}, password: {type: String, required:true}},
    {collection:'users'},{timestamps:true}
)

const models = mongoose.model('UserSchema',UserSchema)

module.exports= models;