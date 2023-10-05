const fetch = require("node-fetch");

const getArtistsDetails = async artist => {
    const data = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist',{
        method: 'GET',
        contentType: '',
        headers: {
		    Authorization: 'Bearer BQBi8yxCV7_XoCiQR04n4ldiIums4J8sjKLqsekWYRwsq5kPs9cHdhDXWNKUN7EiKLiM94KhEZgYVDQvvIJdg0nz0mWhKy1pPynTcGiRxiKwphYKJiw'      
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

const generateData = async () => {
    const artists = ['Taylor Swift','Drake','Ed Sheeran','The Weeknd','Bad Bunny','Eminem','Justin Bieber','Ariana Grande','BTS','Kanye West','Rihanna','Post Malone','Billie Eilish','Dua Lipa','Adele','Coldplay','Beyonce','Bruno Mars','Michael Jackson','Imagine Dragons','Maroon 5','Lana Del Rey','Elton John','Shawn Mendes']

    const allData = [];
    
    for(artist in artists){
        const name = artists[artist]
        const data = await getArtistsDetails(name);
        allData.push(data);
    };

    return allData
}

const getTop40Artists = async () => {
    const top40Page = await fetch('https://www.officialcharts.com/charts/uk-top-40-singles-chart/')

    const artists = top40Page.document.getElementsByClassName("chart-artist")

    console.log(artists);
}

const main = async () => {    
    getTop40Artists();

    // const spotifyData = await generateData();

    // spotifyData.forEach(d => console.log(d));
}

main()