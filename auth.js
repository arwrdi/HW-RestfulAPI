const jwt = require("jsonwebtoken");
const secretKey = "RAHASIANEGARA"
const pool = require("./config");


function authenthication (req, res, next){
    // console.log(req.headers)
    const {access_token} = req.headers;
    console.log(access_token)

    const decoded = jwt.verify(access_token, secretKey)
    const {email, gender, role} = decoded
    const findUser = `
        SELECT 
        *
        FROM users
        WHERE email = $1
         `

    pool.query(findUser, [email], (err, result) =>{
        if (err) next(err);

        const user = result.rows[0]

        req.loggedUser = {
            email : user.email,
            gender : user.gender,
            role : user.role

        }
        next()
    })
    console.log(decoded)

    
    // const decoded = jwt.verify(access_token, secretKey);



}
function authorization (req, res, next){
    console.log(req.loggedUser)
    const {email, gender, role} =req.loggedUser;

    if(role==='project manager'){
            next()
    }else{
        console.log(unauthorize)
    }
}

module.exports = {
    authenthication,
    authorization
}
