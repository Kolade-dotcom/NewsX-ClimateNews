const POST = process.env.PORT || 8000
const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

const newspapers = [
    {
        name: 'reuters',
        address: 'https://www.reuters.com/news/environment/climate-change',
        base: 'https://www.reuters.com',
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/specials/world/climate-change',
        base: 'https://edition.cnn.com',
    },
    {
        name: 'forbes',
        address: 'https://www.forbes.com/climate-change/',
        base: 'https://www.forbes.com',
    },
    {
        name: 'washingtonpost',
        address: 'https://www.washingtonpost.com/climate-environment/',
        base: 'https://www.washingtonpost.com',
    },
    {
        name: 'cbc',
        address: 'https://www.cbc.ca/news/climate',
        base: 'https://www.cbc.ca',
    },
    {
        name: 'time',
        address: 'https://time.com/section/climate-change/',
        base: 'https://time.com',
    },
    {
        name: 'nationalgeographic',
        address: 'https://www.nationalgeographic.com/environment/climate-change/',
        base: 'https://www.nationalgeographic.com',
    },
    {
        name: 'abcnews',
        address: 'https://abcnews.go.com/Environment/climate-change/',
        base: 'https://abcnews.go.com',
    },
    {
        name: 'independent',
        address: 'https://www.independent.co.uk/environment/climate-change',
        base: 'https://www.independent.co.uk',
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }
]

const articles = []

newspapers.forEach((newspaper) => {
    axios.get(newspaper.address)
        .then(r => {
            const html = r.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each((index, element) => {
                const title = $(element).text()
                const url = $(element).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
        .catch(e => {console.error(e);});
})

app.get('/', (req, res) => {
    res.json('Welcome to My Climate News API')
})

app.get("/newsX", (req, res) => {
    res.json(articles)
})

app.get('/newsX/:newspaperId', (req, res) => {
    const { newspaperId } = req.params

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(r => {
            const html = r.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each((index, element) => {
                const title = $(element).text()
                const url = $(element).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        })
        .catch(e => {
            console.error(e);
            res.status(500).send("Error fetching data from the API");
        });
})

app.listen(POST, () => console.log(`server running on PORT ${POST}`))
