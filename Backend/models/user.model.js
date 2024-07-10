import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcryptjs";


const userSchema = new Schema({
    username: 
    {
        type:String, 
        required: true, 
        min: 4, 
        unique: true
    },
    email: 
    {
        type: String, 
        required:true, 
        unique: true
    },
    password: 
    {
        type:String, 
        required:true, 
        min: 8
    },
    saved:
    {
        type: [String],
        default: [],
    }
})

userSchema.pre('save', async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(pass){
    return await bcrypt.compare(pass, this.password)
}

export const User = mongoose.model('User', userSchema);
