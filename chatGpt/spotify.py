import requests

def get_artists_details(artist):
    headers = {
        "Authorization": "Bearer BQBi8yxCV7_XoCiQR04n4ldiIums4J8sjKLqsekWYRwsq5kPs9cHdhDXWNKUN7EiKLiM94KhEZgYVDQvvIJdg0nz0mWhKy1pPynTcGiRxiKwphYKJiw"
    }

    url = f'https://api.spotify.com/v1/search?q={artist}&type=artist'
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        artists_data = data.get('artists', {}).get('items', [{}])[0]
        followers = artists_data.get('followers', {}).get('total', 0)
        genres = artists_data.get('genres', [])
        popularity = artists_data.get('popularity', 0)
        uri = artists_data.get('uri', '')
        artist_id = artists_data.get('id', '')

        return {
            'artist': artist,
            'id': artist_id,
            'followers': followers,
            'genres': genres,
            'popularity': popularity,
            'uri': uri
        }
    else:
        print(f"Failed to fetch data for {artist}")
        return {}

def generate_data():
    artists = [
        'Taylor Swift', 'Drake', 'Ed Sheeran', 'The Weeknd', 'Bad Bunny', 'Eminem', 'Justin Bieber', 
        'Ariana Grande', 'BTS', 'Kanye West', 'Rihanna', 'Post Malone', 'Billie Eilish', 'Dua Lipa', 
        'Adele', 'Coldplay', 'Beyonce', 'Bruno Mars', 'Michael Jackson', 'Imagine Dragons', 
        'Maroon 5', 'Lana Del Rey', 'Elton John', 'Shawn Mendes'
    ]

    all_data = []
    
    for artist in artists:
        data = get_artists_details(artist)
        all_data.append(data)

    return all_data

def main():
    spotify_data = generate_data()

    for data in spotify_data:
        print(data)

if __name__ == "__main__":
    main()
