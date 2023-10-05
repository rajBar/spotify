const fetch = require("node-fetch");
const axios = require("axios")
const cheerio = require("cheerio")
const uniqby = require('lodash.uniqby');

const CREDS = require('../src/creds.json')

const getArtistsDetailsFromName = async (artist, token) => {

    try {
        const data = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist', {
            method: 'GET',
            contentType: '',
            headers: {
                Authorization: 'Bearer ' + token      
        }}).then(res => res.json())
    
        const name = data.artists.items[0].name;
        const followers = data.artists.items[0].followers.total ? data.artists.items[0].followers.total : null;
        const genres = data.artists.items[0].genres;
        const popularity = data.artists.items[0].popularity;
        const uri = data.artists.items[0].uri;
        const id = data.artists.items[0].id;
    
        return {
            name, 
            id,
            followers,
            genres,
            popularity,
            uri
        }
        
    } catch (error) {
        console.log(error);
    }

    const data = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist', {
        method: 'GET',
        contentType: '',
        headers: {
		    Authorization: 'Bearer ' + token      
    }}).then(res => res.json())

    const name = data.artists.items[0].name;
    const followers = data.artists.items[0].followers.total ? data.artists.items[0].followers.total : null;
    const genres = data.artists.items[0].genres;
    const popularity = data.artists.items[0].popularity;
    const uri = data.artists.items[0].uri;
    const id = data.artists.items[0].id;

    return {
        name, 
        id,
        followers,
        genres,
        popularity,
        uri
    }
}

const getArtistsDetailsFromID = async (artistId, token) => {   
    try {
        const data = await fetch('https://api.spotify.com/v1/artists/' + artistId, {
        method: 'GET',
        contentType: '',
        headers: {
		    Authorization: 'Bearer ' + token      
        }}).then(res => res.json())

        console.log(artistId)

        const name = data.name;
        const followers = data.followers.total ? data.followers.total : null;
        const genres = data.genres;
        const popularity = data.popularity;
        const uri = data.uri;
        const id = data.id;

        return {
            name, 
            id,
            followers,
            genres,
            popularity,
            uri
        }
    } catch (error) {
        console.log(error);
    }

    
}

const generateToken = async () => {
    const data = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': CREDS.clientid,
            'client_secret': CREDS.clientSecret
        })
    }).then(res => res.json())

    return data.access_token;
}

const getNewReleaseArtists = async (token, country) => {
    let allIds = [];
    const iterations = 2; // how many times to iterate through and offset of 50, so 2=100, 3=150, 4=200 artists

    for(let i=0; i<iterations; i++) {
        const data = await fetch('https://api.spotify.com/v1/browse/new-releases?country=GB&offset=' + i*50 + '&limit=50', {
            method: 'GET',
            contentType: '',
            headers: {
                Authorization: 'Bearer ' + token      
        }}).then(res => res.json())
         
        // console.log(data);

        const idArray = [];
        const items = data.albums.items;
        items.forEach(item => {
            item.artists.forEach(artist => idArray.push(artist.id))
        })
        allIds = allIds.concat(idArray);
    }

    return allIds;
}

const generateData = async (names) => {
    const artists = ['Taylor Swift','Drake','Drake','Ed Sheeran','The Weeknd','Bad Bunny','Eminem','Justin Bieber','Ariana Grande','BTS','Kanye West','Rihanna','Post Malone','Billie Eilish','Dua Lipa','Adele','Coldplay','Beyonce','Bruno Mars','Michael Jackson','Imagine Dragons','Maroon 5','Lana Del Rey','Elton John','Shawn Mendes'].concat(names)

    const token = await generateToken();
    const allData = [];
    
    for(artist in artists){
        const name = artists[artist]
        const data = await getArtistsDetailsFromName(name, token);
        allData.push(data);
    };

    const countries = ['GB','US','AR','AU','AT','BE','BO','BR','BG']//,'CA','CL','CO','CR','CY','CZ','DK','DO','DE','EC','EE','SV','FI','FR','GR'];

    let newReleaseArtists = [];

    for(index in countries){
        const country = countries[index];
        console.log(country);
        const countryData = await getNewReleaseArtists(token, country);
        newReleaseArtists = newReleaseArtists.concat(countryData);
    }

    console.log(newReleaseArtists.length)

    for(index in newReleaseArtists) {
        if( index % 75 == 0) {
            setTimeout(() => {}, 10000)
        } 
        const id = newReleaseArtists[index]
        const data = await getArtistsDetailsFromID(id, token);
        allData.push(data);
    }

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

    const dataNoDupes = uniqby(spotifyData, (i) => i.id);

    // dataNoDupes.forEach(d => console.log(d));
    console.log(spotifyData.length);
    console.log(dataNoDupes.length);
}

main()