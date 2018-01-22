var express = require('express');
var app = express();
var request = require('request');
app.set("view engine", "ejs");


app.get("/", function(req, res){
    res.render("search");
})

app.get('/results', function(req, res){
    console.log("swag");
    var query = req.query.search
    var url = "http://omdbapi.com?s=" + query + "&apikey=thewdb";
    var allData = [];
    var secondaryData = [];
    var count = 0;
    var rottenTomatoes = [];
    var imdbScore = [];
    request(url, function(error, response, body){
        if (!error & response.statusCode == 200){
            var data = JSON.parse(body);
            
            data["Search"].forEach(function(movie){
                allData.push(movie);
                secondaryData.push(movie["imdbID"]);
            });
            
		
            
            
            allData.forEach(function(movie){

                        var moreInfo = "http://omdbapi.com/?i=" + movie["imdbID"]
                        + "&apikey=thewdb";
                        request(moreInfo, function(error, response, body){
                            if (!error & response.statusCode == 200){
                               
                                var dataTwo = JSON.parse(body);
                                
                                if(dataTwo["Ratings"].length >= 2){
                                    rottenTomatoes[secondaryData.indexOf(dataTwo["imdbID"])] = dataTwo["Ratings"][1]["Value"];
                                    imdbScore[secondaryData.indexOf(dataTwo["imdbID"])] = dataTwo["imdbRating"];
                                    
                                } else {
                                    rottenTomatoes[secondaryData.indexOf(dataTwo["imdbID"])] = "N/A" ;
                                    imdbScore[secondaryData.indexOf(dataTwo["imdbID"])] = dataTwo["imdbRating"];
                                }

                                if (rottenTomatoes.filter(x => x).length == allData.length){
                                
                                res.render("results", {allData: allData, rottenTomatoes: rottenTomatoes,
                                    imdbScore: imdbScore
                                });
                                
                            }
                            
                            

                        }
                        });
                        
                        
            });
            

                            
            
            
        };
    });
    
   
    
    
            
    
});

app.listen(3000, () => console.log("Start"));
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server start!");
});