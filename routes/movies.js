const express = require('express');
const router = express.Router()
const pool =  require("../config.js")
const {authorization} = require("../auth.js")
const defaultLimit = 10;
const defaultPages = 1;

router.get("/movies", authorization, (req, res, next) =>{
    console.log(req.query)
    const {limit, page} = req.query

    let resultLimit = limit? +limit:defaultLimit;
    let resultPages = page? +page:defaultPages;

    console.log(resultLimit, resultPages)
    console.log(req.loggedUser)
    const findQuery = `
    SELECT
    * 
    FROM movies
    LIMIT  ${resultLimit} OFFSET ${(resultPages -1) * resultLimit}
    `

    pool.query(findQuery, (err, result)=> {
        if(err)next(err)
        res.status(200).json(result.rows)
    })
})
router.get("/movies/:id", authorization,(req, res, next) =>{
    const {id} = req.params
    const oneQuery = `
    SELECT
    * 
    FROM movies
    WHERE id = $1
    `

    pool.query(oneQuery, [id], (err, result)=> {
        if(err)next(err)
        res.status(200).json(result.rows[0])
    })
})

router.post("/movies", authorization,(req, res, next)=>{
    // console.log(req.body)
    const {title, genres, year} = req.body;

    const addMovies = `
    INSERT INTO movies (title, genres, year)
        VALUES 
            ($1, $2, $3)
    `
    pool.query(addMovies, [title, genres, year], (err, result) =>{
        if(err) next(err)
        res.status(201).json({
            messages : "Movies added successfully"
        })
    })
})

router.put("/movies/:id", authorization,(req, res, next) =>{
    const {title, genres, year} = req.body;
    const {id} = req.params;
    const updateMovies = `
    UPDATE movies
    SET title = $1,
        genres = $2,
    WHERE id = $3
    `
    pool.query(updateMovies, [title, genres, id], (err, result) =>{
        if (err) next(err)
        res.status(200).json({
            messages:"Movie successfully updated"
        })
    })

})

router.delete("/movies/:id", authorization,(req, res, next) =>{
   const {id} = req.params;
   const deleteMovies = `
   DELETE FROM movies
   WHERE id = $1
   `

   pool.query(deleteMovies, [id], (err, result)=>{
    if (err) next(err)
    res.status(200).json({
        messages: "movies deleted properly"
    })
   })
})


module.exports = router;