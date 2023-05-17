const express = require('express')
const request = require('request');
const app = express()
require('dotenv').config()

var toast_type = ''
var toast_msg = ''


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))



app.get('/', async (req,res) => {
    const obj = await fetch(process.env.API_LIST);
    const response = await obj.json()
    res.render('index', {list: response, type: toast_type, msg: toast_msg})
    toast_type = ''
})


app.post('/shrink', async (req,res) => {
    request.post(process.env.API_SHRINK, { json: { url: req.body.originalUrl } }, (error,response,data)=>{
        if(!error && response.statusCode == 200) {
            console.log(data)
            toast_type = 'success'
            toast_msg = 'URL Shrinked Successfully'
            res.redirect('/')
        } else {
            toast_type = 'error'
            toast_msg = data.code + ' : ' + data.status
            res.redirect('/')
        }
    })
})


app.get('/:uid', async (req,res) => {
    let uid = req.params.uid
    if(!(uid === 'favicon.ico' || uid === '')) {
        const obj = await fetch(process.env.API_FIND + uid);
        const response = await obj.json()
        if(response.code == 200) {
            res.redirect(response.originalUrl)
        } else if(response.code == 410) {
            toast_type = 'error'
            toast_msg = 'URL Expired. Please regenerate it.'
            res.redirect('/')
        } else {
            toast_type = 'error'
            toast_msg = response.code + ' : ' + response.status
            res.redirect('/')
        }
    }
})



app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT}`)
});