const mongoose = require('mongoose');
const bcrypt= require('bcrypt');

const user = new mongoose.Schema({
    // name, phone no , addresss, email id, and password.
    username:{
        type: String,
        required:true
    },
    phone:{
        type: String,
        required:true
    },
    address:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
})
user.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

user.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})
module.exports= mongoose.model('Users',user);