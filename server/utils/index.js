const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const hasing = async(userValue) =>{
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(userValue,salt)
    return hasedPassword;
}

function createJWT(id){
    const token = jwt.sign({userId:id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
    return token;   
}

async function decodePassword(userId,hasedToken){
    const payload = jwt.decode(hasedToken)
    if(payload.userId === userId){
        return true;
    }
    if(err){
        return false;
    }
}

async function comparePassword(password,hasedPassword){
    const validPass = await bcrypt.compare(password,hasedPassword);
    if(validPass){
        return true;
    }
    else{
        return false;
    }
}

module.exports = {hasing,createJWT,decodePassword,comparePassword};