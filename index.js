import fetch from 'node-fetch';
import express, { query }  from 'express';
import bodyParser from 'body-parser';
import { Page, GetMovie, series, getEpsidesInSeson } from './M.js';
import dotenv from 'dotenv';
dotenv.config();
import  cheerio  from 'cheerio';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
let port = process.env.port || 3000;
app.get('/', (req, res) => {
    const check = req.query.state;
    let message = '';
    if (check) {
        message = check;
        res.render('index', { message });
    } else {
        res.render('index', { message });
    }
});
app.get('/search', (req, res) => {
    var notFound = "Did not find any movie 😔";
    const { search } = req.query;
    GetMovie(search)
        .then(data => {
            if (data.length === 0) {
                const url = `/?state=${encodeURIComponent(notFound)}`;
                res.redirect(url);
            } else {
                res.render('searchMovies', { data, search });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        });
});
app.post('/page', async (req, res) => {
    const moviePoster = req.body.moviePoster;
    const movieUrl = req.body.MovieUrl;
    const title = req.body.title;
    const seasonNumber = "";

    if (movieUrl.includes('series')) {
        try {
            let data = await series(movieUrl);
            if (data && data.length > 0) {
                const episodes = await getEpsidesInSeson(data[0].href);
                res.render('series', { data, moviePoster, episodes, title, movieUrl, seasonNumber });
            } else {
                const episodes = await getEpsidesInSeson(movieUrl);
                res.render('series', { data, moviePoster, episodes, title, movieUrl, seasonNumber });
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        try {
            const data = await Page(movieUrl);
            res.render('moviepage', { data, moviePoster });
        } catch (error) {
            console.error(error);
        }
    }
});
app.post('/getseason', async (req, res) => {
    const seasonUrl = req.body.seasonUrl;
    const title = req.body.title;
    const moviePoster = req.body.moviePoster;
    const movieUrl = req.body.MovieUrl;
    const seasonName = req.body.seasonName;
    const numberRegex = /\d+/g;
    const numbers = seasonName.match(numberRegex);
    const data = await series(movieUrl);
    const episodes = await getEpsidesInSeson(seasonUrl);
    const seasonNumber = `(season ${numbers})`
    res.render('series', { data, episodes, title, movieUrl, moviePoster, seasonNumber });
});
app.post('/getepisode', (req, res)=>{
    let episodeUrl = req.body.episodeUrl;
    let title = req.body.title;
    let moviePoster = req.body.moviePoster;
    Page(episodeUrl).then(data=>{
        res.render('moviePage', { data, title, moviePoster })
    })
})
app.listen(port, ()=>{});
