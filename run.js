// http access
var https = require('https');
var http = require('http');
// like jquery, load page, then do stuff
var cheerio = require('cheerio');
// file system
var fs = require('fs');

var mkdirp = require('mkdirp');

// the starting page, then extend to other pages.
var queryHref = "https://digg.com/";   

// page 1, not used.
var querySearch = 1;
              
// urls....?  
var urls = [];

/**
 * get html
 * @param {String}: href, url
 * @param {int}: serach
 */
// func
// get html
// href and page num
function getHtml(href, search) {
	// page data
	// what page data
	// it seems res.on is loading data chunk by chunk
  var pageData = "";

  // var req
  // http
  // .get
  // url
  // func res
  var req = https.get(href, function(res) {
		// res
		// set encoding
		// utf8, utf8
    res.setEncoding('utf8');
    // res.on
    // data
    // func
    // chunk
    // then append more data
    res.on('data', function(chunk) {
			// append page data + chunk
      pageData += chunk;
      
      //console.log("~data~");
      //console.log(pageData);
    });

		// res
		// .on
		// end
		// func
    res.on('end', function() {
      // dollar
      // jquery?
      // cheerio
      // .load
      // pageData
      $ = cheerio.load(pageData);
      // var html
      // get the image ......
      // like jquery
      var html = $("img.digg-story__image-img");

			// loop through each of them
      for(var i = 0; i < html.length; i++) {
        // var src
        // html
        // .attr
        // .src
        var src = html[i].attribs.src;
        
        // not https, http
        if (src.indexOf("http://static.digg.com") > -1) {
          urls.push(html[i].attribs.src);
        }
      }

      if (1 == pagemax) {
        //
        console.log("img url num: " + urls.length);
        //
        console.log("total: " + urls.length);
        // url length
        if (urls.length > 0) {
					// array remove, get the first element and pass down
					// then inside we recursive.
          downImg(urls.shift());
        } else {
          console.log("------- finish done ----------");
        }
      }
    });
  });
}


/**
 * dl image
 * @param {String} imgurl, url
 */
function downImg(imgurl) {
  var tmpImgUrl = imgurl;
  var narr = imgurl.replace("http://static.digg.com/", "").split("/")

  //console.log("--- test ---");
  //console.log(tmpImgUrl);
  //console.log(narr);

	// replace small with big
  http.get(tmpImgUrl, function(res) {
    var imgData = "";
		// need binary, otherwise cannot see img
    res.setEncoding("binary"); 

		// res on data
		// 
    res.on("data", function(chunk) {
      imgData += chunk;
    });
   
		// end 
    res.on("end", function() {
      console.log("");
      console.log(narr);
      console.log(narr[1]);
    
			// buld the path we want
      var savePath = __dirname + "/upload/tmp/" + narr[1];
      // now write
      fs.writeFile(savePath, imgData, "binary", function(err) {
        if(err) {
          console.log(err);
        }  else {
          console.log(savePath);
          if (urls.length > 0) {
            // goging down
            downImg(urls.shift());
          } else {
            console.log("finish dl img");
          }
        }
      });
    });
  });
}

var pagemax = 1; // page max 
function start() {
  console.log("--- starting ---");
  
  // https://stackoverflow.com/questions/21194934/node-how-to-create-a-directory-if-doesnt-exist

  mkdirp(__dirname + '/upload/tmp', function (err) {
    if (err) console.error(err);
    else console.log('dir created!')
    
    for (var i = 1 ; i <= pagemax ; i++) {
      getHtml(queryHref, "");
    }
  });
}

start();
