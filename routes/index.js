var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var fs = require('fs');

//req.path req.body.{post的參數} req.params.{放在url的變數}
//--------------------------------------------------------------------------
var s2t = function(time){
    return new Date(time.split('.')[0])
}
var stableSort = function(arr,compare){
    var original = arr.slice(0);

    arr.sort(function(a,b){
        var result = compare(a,b);
        return result === 0? original.indexOf(a) - original.indexOf(b) : result;
    });
    return arr;
}

var sortTime1 = function(posts){
    //var original = posts.slice(0);
    sort1 = [[6,8],[3,5],[0,2]];
    sort1.forEach((e)=>{
        var original = posts.slice(0);
        //posts.sort(function(a,b){
        stableSort(posts,function(a,b){
            a_time = a['created_time'];
            b_time = b['created_time'];
            a_day = parseInt(a_time.split('T')[1].split('+')[0].slice(e[0],e[1]));
            b_day = parseInt(b_time.split('T')[1].split('+')[0].slice(e[0],e[1]));
            result = b_day-a_day;
            return  b_day>a_day?  1 : b_day<a_day? -1:0
        });
    }, this);
    return posts;
}
var sortTime2 = function(posts){
    sort2 = [[6,8],[3,5],[0,2]];
    sort2.forEach((e,i)=>{
        var original = posts.slice(0);
        //posts.sort(function(a,b){
        stableSort(posts,function(a,b){
            a_time = a['created_time'];
            b_time = b['created_time'];
            a_day = parseInt(a_time.split('T')[0].split('-')[2-i]);
            b_day = parseInt(b_time.split('T')[0].split('-')[2-i]);
            result = b_day-a_day;
            return  b_day>a_day?  1 : b_day<a_day? -1:0
        });
    }, this);
    return posts;
}
//---------------------------------------------------------------------------------
 
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'KnowWeb';

router.get('/', function(req, res, next) {
    res.render('movie')
    /*MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        //console.log("Connected successfully to server");
        const db = client.db(dbName);
        //db.collection("headset").find({})
        client.close();
    });*/
});

router.get('/movie', function(req, res, next) {
    /*MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        //console.log("Connected successfully to server");
        const db = client.db(dbName);
        db.collection("headset").find({}).sort({score:-1}).toArray(function(err, result) {
            if (err) throw err;
            res.render('index', { title: 'Web' , results:result });
            client.close();
        });
    });*/
    res.render('movie');
});


router.get('/people', function(req, res, next) {
    MongoClient.connect(url,function(err,client){
        if(err) throw err;
        const db = client.db(dbName);
        db.collection('people').find({}).toArray((e,result)=>{
            if(e)   throw e;
            //posts = result['FanPage_Posts'];
            posts = [];
            result.forEach((value,i)=>{
                //console.log(value['FanPage_Posts'])
                value['FanPage_Posts'].forEach((ele)=>{
                    ele['name'] = value['name'];
                    posts.push(ele);
                    //console.log(value['name']+ele.toString());
                });
            });
            //posts = result['FanPage_Posts'];
            sortTime1(posts);
            sortTime2(posts);
            posts = posts.slice(0,30)
            /*fs.readFile('./Python/postsFinal.json',(err,posts)=>{
                if(err) throw err;
                printTimes(JSON.parse(posts));
            });*/
            res.render('people',{posts:posts});
            client.close();
        });
    });
});

router.get('/postPeople', function(req, res, next) {
    res.render('postPeople');
});
router.post('/postPeople', function(req, res, next) {
    console.log('adding new people:' + req.body.name);
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        var Oid = null;
        db.collection("crawl_FB").findOne({name:req.body.name},(err,result)=>{
            if (err) throw err;
            if(result){
                Oid=result['_id'];
                console.log('exist');
            }
        });
        if(Oid){
            db.collection("crawl_FB").insertOne({name:req.body.name},(err,result)=>{
                if (err) throw err;
                console.log('updating crawl_FB...');
            });
        }
    });
    res.render('movie');
});

router.post('/login', function(req, res, next) {
    console.log('login new people:' + req.body.account);
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        var Oid = null;
        db.collection("users").findOne({account:req.body.account,password:req.body.password},(err,result)=>{
            if (err) throw err;
            if(result){
                Oid=result['_id'];
                console.log('login success!');
                return res.render('redirect');
            }else   res.render('movie');
            client.close();
        });
    });
    return
});
router.get('/FB_Redirect',(req,res,next)=>{
    console.log('redirect....')
    console.log(req);
});
router.post('/post',(req,res,next)=>{
    res.send('post to /post');
    //console.log(req)
});
router.post('/token',(req,res,next)=>{
    console.log('/token:' + req.body.token)
    res.send(req.body.token);
    res.end();
    //console.log(req)
});
module.exports = router;