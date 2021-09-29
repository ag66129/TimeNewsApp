/*
    CopyRight 2021, Ashish Gupta
*/

const express = require('express');
const app = express();
const axios = require('axios');

const URL = 'https://time.com',
    PORT = 8080;

app.get('/', (req, res) => {
    res.send("Welcome to time.com, please open http://localhost:8080/getTimeStories to get the latest stories")
})
app.get('/getTimeStories', (req, res) => {
    axios(URL)
        .then(response => {
            const html = response.data; //response from time.com, stored in html
            const htmlString = html.split("\n"); //splitting the html code into htmlString
            res.json(getLatestStories(htmlString));//the returned data is parsed into JSON and sent it as the response
        })
        .catch(console.error);
});

app.listen(PORT, () => {
    console.log("✨✨ Server is listening on Port: " + PORT + " ✨✨");
});

let resultJson = [];

const getLatestStories = (htmlString) => {
    resultJson = []; //empty the array when user refresh the page
    let isDivFound = false;
    for (let line of htmlString) {
        let i = 0, words = line.split(' '); // splitting line into words
        for (let word of words) {
            i++;
            if (resultJson.length === 5)
                break;
            if (word == 'data-module_name="Latest' && words[i] == 'Stories">') { //verifying the heading of the div which named as Latest stories
                isDivFound = true; //if we found that kind of div, we have to go deep inside it
            }
            if (isDivFound && word === '<h2') { //to get h2 tag in the desired div
                let temp = line.split('>'),
                    url = URL.concat(temp[1].split('=')[1]), //this will collect the url 
                    title = temp[2].split('<')[0]; //this will collect the title
                resultJson.push({ 'title': title, 'link': url });//pushed in array
            }
        }
    }
    return resultJson;
}

