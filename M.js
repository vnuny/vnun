import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'node:fs';
import getVideo from './servers/vadsr.js';
import domain from './domain.js';
function GetMovie(search) {
    const formattedSearch = search.split(' ').join('+');
    return new Promise(async (resolve, reject) => {
        const domainHome = await domain();
        console.log(domainHome);
        // console.log(`${domainHome}/search/${formattedSearch}/`);
        fetch(`${domainHome}search/${formattedSearch}/`)
            .then(res => res.text())
            .then(data => {
                const $ = cheerio.load(data);
                const movies = [];
                $(".GridItem").each((index, element) => {
                    const thumbGridItem = $(element).find(".Thumb--GridItem");
                    const dataLazyURL = thumbGridItem.find("span.BG--GridItem").attr("data-lazy-style");
                    const title = thumbGridItem.find("strong.hasyear").text().replace(/[\(\)]/g, '');
                    const year = thumbGridItem.find("span.year").text().replace(/[\(\)]/g, '').trim();
                    const href = thumbGridItem.find("a").attr("href");
                    const imageUrl = extractImageUrl(dataLazyURL);
                    const movieData = {
                        imageUrl,
                        title,
                        href,
                        year
                    };
                    movies.push(movieData);
                });

                resolve(movies);
            })
            .catch(error => {
                console.error("Error:", error);
                reject(error);
            });
    });
}
function extractImageUrl(dataLazyStyle) {
    const match = dataLazyStyle.match(/url\(([^)]+)\)/);
    return match ? match[1] : null;
}
async function Page(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        const $ = cheerio.load(data);
        const englishName = $('.Title--Content--Single-begin h1').text().trim();
        const yearMatch = englishName.match(/\((\d{4})\)$/);
        const year = yearMatch ? yearMatch[1] : null;
        const downloadLinks = $('.List--Download--Wecima--Single li a').map((_, element) => {
            const link = $(element);
            const url = link.attr('href');
            const quality = link.find('quality').text().trim();
            const resolution = link.find('resolution').text().trim();
            return { url, quality, resolution };
        }).get();
        const watchUrls = $('.WatchServersList .MyCimaServer, .WatchServersList ul li[style^="--color:"] btn')
            .map((_, element) => {
                const btn = $(element);
                return btn.attr('data-url');
            })
            .get();
        const noadsPromises = watchUrls
            .filter(url => url.startsWith('https://vadsr.shop'))
            .map(async urll => ({ server: 'vadsr', url: await getVideo(urll) }));
        const noads = await Promise.all(noadsPromises);
        const ads = watchUrls
            .filter(url => !url.startsWith('https://vadsr.shop'))
            .map(url => {
                const serverName = url.match(/https:\/\/([^\/]+)/);
                return { server: serverName ? serverName[1] : 'unknown', url };
            });
        const movieStory = $('.AsideContext .StoryMovieContent').text().trim();
        const termsContent = $('.Terms--Content--Single-begin li').map((_, element) => {
            const term = $(element);
            const termName = term.find('span').text().trim();
            const termValue = term.find('p').text().trim();

            if (termName !== 'شركات الإنتاج' && termName !== 'معروف ايضاََ بـ') {
                return { [termName]: termValue };
            }
        }).get().filter(Boolean);
        let posterUrl = $('meta[itemprop="thumbnailUrl"]').attr('content');
        const lazyStyleUrl = $('.wecima .separated--top').attr('data-lazy-style');
        let imageUrl;
        if (!posterUrl && lazyStyleUrl) {
            imageUrl = extractImageUrl(lazyStyleUrl);
        }
        const result = {
            downloadLinks,
            posterUrl,
            noads,
            ads,
            movieStory,
            termsContent,
            englishName,
            year,
        };
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
async function final(seasons) {
    const allData = {};
    for (let i = 0; i < seasons.length; i++) {
        try {
            const data = await getEpsidesInSeson(seasons[i].href);
            allData[seasons[i].text] = data;
        } catch (error) {
            console.error(`Error fetching data for season ${seasons[i].text}: ${error}`);
        }
    }
    return allData;
}
async function series(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const seasons = [];

        $('.List--Seasons--Episodes a').each((index, element) => {
            const href = $(element).attr('href');
            const text = $(element).text();
            seasons.push({ href, text });
        });
        return seasons;

    } catch (err) {
        console.error(err);
    }
}
async function getEpsidesInSeson(seasonUrl) {
    try {
        const response = await fetch(seasonUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        const seasonEpisodes = [];
        $('.Episodes--Seasons--Episodes a').each((index, element) => {
            const episodeLink = $(element).attr('href');
            const episodeText = $(element).text();
            seasonEpisodes.push({ link: episodeLink, text: episodeText });
        });
        return seasonEpisodes;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export {GetMovie, Page, series, getEpsidesInSeson};