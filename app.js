const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

//static file like css,images
app.use(express.static("public"));
var imgURL="";
var Temp=0;
var  weatherDescription = "";
var query = "";

app.get("/",function(req,res){
    res.render("index", { imgSource: imgURL, temperature: Temp,description:weatherDescription, userTypeCity:query});   
});

app.post("/",function(req,res){
    // console.log(req.body.cityName);
    query = req.body.cityName;
    const apiKey = "2e39bd71814916540391e6377c51";
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
    
    https.get(url,function(response){
       //console.log(response);
       response.on("data",function(data){
           const weatherData = JSON.parse(data);
           const Temp = Math.round(weatherData.main.temp);
           const weatherDescription = weatherData.weather[0].description;
           const icon = weatherData.weather[0].icon;
           imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";

           res.render("index", { imgSource: imgURL, temperature: Temp,description:weatherDescription, userTypeCity:query});   
           res.send();
       });
    });
});

app.listen(3000,function(){
    console.log("Server is running at port 3000");
});