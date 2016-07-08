

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.get('/scrape', function(req,res){
  request("https://www.brandverity.com/blog", function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);

  var title, description, date, author;
  var json = {title: "", description:"", date:"", author:""};

//scraping the HTML page
  $('div.post-itemn.blog__home').each(function() {
    var title = $(this).find('div.blog__home__info >  div:nth-child(1)').text().trim();
    var description = $(this).find('div.blog__home__info >  div:nth-child(2)').text().trim();
    var date = $(this).find('div.blog__home__info > div#hubspot-author_data.hubspot-editable > div:nth-child(2)').text().trim();
    var author = $(this).find('div.blog__home__info > div#hubspot-author_data.hubspot-editable > a').text().trim();

    //print to text file
      fs.appendFileSync('output.txt', title  + '\n' + description + '\n'+ date + '\n' + author + '\n');

      //save as JSON data
      json.title = title;
      json.description = description;
      json.date = date;
      json.author = author.replace(/\./g,' ');


      //print to json
       fs.appendFileSync('output.json', JSON.stringify(json) + '\n');
  })
  res.send('Files are Populated')
})


})

var port = 8080;
app.listen(port)

console.log('things are up on ' + port);

exports = module.exports = app;
