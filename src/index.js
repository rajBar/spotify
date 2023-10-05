const fetch = require("node-fetch");
const axios = require("axios")
const cheerio = require("cheerio")

const TOKEN='BQA1DWJmZ_ztuL4zXSXKVkEH4cV5qGWHMULcYgBHi7VPpm5RazOkzgxmm4mc85r5a2_69AYYKPHcO5coveMa60ivLgDjmTIkweoWvDm4fnsOlgWquDw'

const getArtistsDetails = async artist => {
    const data = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist',{
        method: 'GET',
        contentType: '',
        headers: {
		    Authorization: 'Bearer ' + TOKEN      
    }}).then(res => res.json())

    const followers = data.artists.items[0].followers.total;
    const genres = data.artists.items[0].genres;
    const popularity = data.artists.items[0].popularity;
    const uri = data.artists.items[0].uri;
    const id = data.artists.items[0].id;

    return {
        artist, 
        id,
        followers,
        genres,
        popularity,
        uri
    }
}

const generateData = async (names) => {
    // const artists = ['Taylor Swift','Drake','Ed Sheeran','The Weeknd','Bad Bunny','Eminem','Justin Bieber','Ariana Grande','BTS','Kanye West','Rihanna','Post Malone','Billie Eilish','Dua Lipa','Adele','Coldplay','Beyonce','Bruno Mars','Michael Jackson','Imagine Dragons','Maroon 5','Lana Del Rey','Elton John','Shawn Mendes']

    const allData = [];
    
    for(artist in names){
        const name = names[artist]
        const data = await getArtistsDetails(name);
        allData.push(data);
    };

    return allData
}

const getTop40Artists = async () => {
    const top40Page = await axios.request({
        method: "GET",
        url: "https://www.officialcharts.com/charts/uk-top-40-singles-chart/",
        headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const $ = cheerio.load(top40Page.data)

    const names = []

    const artists = $(".chart-content")
        .find(".chart-artist")
        .each((index, element) => {
            const name = $(element).find("span").text()
            names.push(name);
        })

    return names;
}

const main = async () => {    
    const names = await getTop40Artists();

    const spotifyData = await generateData(names);

    spotifyData.forEach(d => console.log(d));
}

main()