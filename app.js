const express = require('express')
const mongoose = require('mongoose')
const shortId = require('shortid')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.set('strictQuery', true)


mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))



app.get('/', async (req,res) => {
    const obj = await ShortUrl.find()
    res.render('index', {shortUrls: obj})
})


app.post('/shortUrls', async (req,res) => {
    await ShortUrl.create({ 
        full: req.body.fullUrl,
        short: shortId.generate()
    })
    res.redirect('/')
})

// route for handling clicks on short url
app.get('/:something', async (req,res) => {
    const short = await ShortUrl.findOne({ short: req.params.something })         // find from db the full url corresponding to this short url
    if(short == null) return res.sendStatus(404)
    short.clicks++;
    short.save()
    res.redirect(short.full)        // redirect to full url

})


app.listen(process.env.PORT || 4000);