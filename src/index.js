const express = require("express") ;
const app = express() ;
const cheers = require("cheerio") ;
const ax = require("axios") ;

const PORT = 3001 ;

let movies = [
    
]

ax(
    "https://m.imdb.com/chart/top/?ref_=nv_mv_250" ,
    {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
        }
    }
)
    .then((res) => {
        const html = res.data ;
        const $ = cheers.load(html) ;
        $(".ipc-metadata-list-summary-item" , html).each(function() {
            const image = $(this).find("img").attr("src") ;
            const title = $(this).find("h3").text() ;
            const url = $(this).find("a").attr("href") ;
            const releaseYear = $(this).find('div .sc-c7e5f54-8').text() ;
            const rate = $(this).find("span .ipc-rating-star").text() ;
            movies.push({
                image: image ,
                title: title ,
                url: url ,
                releaseYear: releaseYear.slice(0,4)  ,
                rate: rate
            })
        })
    })
    .catch((err) => {
        console.log(err) ;
    })

app.get("/" , (request , response) => {
    response.send("Welcome To You In Our API Your Absolute Guide To Find Best Movies .") ;
})


app.get("/movies" , (request , response) => {

    console.log("Movies logged out successfuly !") ;
    response.json(movies) ;

}) ;

app.get("/movies/:name" , (request , response) => {

    const { name } = request.params ;
    const searchedMov = movies.filter((mov) => mov.title.toLowerCase().includes(name.toLowerCase())) ;

    searchedMov ? response.json(searchedMov) : response.status(401).send("Please type a valid pattern !")

})

app.get("/movie/parameter" , (request , response) => {

    const { releaseYear } = request.query ;
    const filteredMov = movies.filter((mov) => mov.releaseYear === releaseYear) ;

    filteredMov ? response.json(filteredMov) : response.status(401).send("There is no released movies in this year !") ;

})

app.listen(process.env.PORT || PORT , (req , res) => {
    console.log(`You are Connecting to the Server on port ${PORT}`) ;
}) ;