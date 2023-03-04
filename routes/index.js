const express = require('express');
const router = express.Router()
const moveisRouter = require("./movies");
const pool = require("../config");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(5);
const jwt = require("jsonwebtoken");
const secretKey = "RAHASIANEGARA"
const {authorization, authenthication} = require("../auth")

router.post("/login", (req, res, next)=>{
    const {email, password} = req.body;

    const findQuery = `
    SELECT 
    *
    FROM users
    WHERE email = $1

    `

    pool.query(findQuery, [email], (err, result)=>{
        if(err) next(err)

        const data = result.rows[0];
        const compare = bcrypt.compareSync(password, data.password);

        const accessToken = jwt.sign({
            email: data.email,
            gender: data.gender,
            role: data.role,

        }, secretKey)
        console.log(accessToken)

        res.status(200).json({
            email: data.email,
            gender: data.gender,
            role: data.role,
            accessToken: accessToken
        })
    })
})

router.post("/register", (req, res, next) =>{
    const {email, gender, password, role} = req.body;
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash)
    const insertUser = `
    INSERT INTO users (email, gender, password, role)
        VALUES
        ($1, $2, $3, $4)
    `

    pool.query(insertUser, [email, gender, hash, role], (err, result)=>{
        if (err) next(err)
        res.status(201).json({
            messages:"Successfully Registered"
        })
        
    })
})
router.use(authenthication)
router.use("/", moveisRouter); 
module.exports = router;
