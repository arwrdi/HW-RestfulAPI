const express = require('express');
const router = express.Router()
const pool =  require("../config.js")
const {authorization} = require("../auth.js")
const defaultLimit = 10;
const defaultPages = 1;

router.get("/users", authorization, (req, res, next) =>{
    console.log(req.query)
    const {limit, page} = req.query

    let resultLimit = limit? +limit:defaultLimit;
    let resultPages = page? +page:defaultPages;

    console.log(resultLimit, resultPages)
    console.log(req.loggedUser)
    const findQuery = `
    SELECT
    * 
    FROM users
    LIMIT  ${resultLimit} OFFSET ${(resultPages -1) * resultLimit}
    `

    pool.query(findQuery, (err, result)=> {
        if(err)next(err)
        res.status(200).json(result.rows)
    })
})