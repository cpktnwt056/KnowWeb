const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var fs = require('fs');

//FBDATE
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

var printTimes = function(posts){
    posts.forEach((e)=>{
        console.log(e['created_time']);
    });
}

var dbSort = function(){
    const url = 'mongodb://localhost:27017';
    const dbName = 'KnowWeb';
    MongoClient.connect(url,function(err,client){
        if(err) throw err;
        const db = client.db(dbName);
        db.collection('people').find({}).toArray((e,result)=>{
            if(e)   throw e;
            result.forEach((value,i)=>{
                posts = [];
                value['FanPage_Posts'].forEach((ele)=>{
                    posts.push(ele);
                });
                sortTime1(posts);
                sortTime2(posts);
                db.collection('people').updateOne({_id:value['_id']},{'$set':{Fanpage_Posts:posts}});
            });
            client.close();
        });
    });
}

var docPrint = function(cName,query){
    const url = 'mongodb://localhost:27017';
    const dbName = 'KnowWeb';
    MongoClient.connect(url,function(err,client){
        if(err) throw err;
        const db = client.db(dbName);
        db.collection(cName).findOne(query,(e,result)=>{
            if(e)   throw e;
            if(result)
                console.log(result);
            else    console.log('no');    
            client.close();
        });
    });
}


 
dbTest = function(){
    const url = 'mongodb://localhost:27017';
    const dbName = 'KnowWeb';
    
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
                    posts.push(ele);
                });
            });
            //posts = result['FanPage_Posts'];
            sortTime1(posts);
            sortTime2(posts);
            fs.writeFile('postsFinal.json',JSON.stringify(posts),(error)=>{
                if(error) throw   error;
                console.log('OK!');
            });
            fs.readFile('postsFinal.json',(err,posts)=>{
                if(err) throw err;
                printTimes(JSON.parse(posts));
            });
            //console.log(posts);
            //pos = getSort(posts);
            //dates = getSort(posts);
            //console.log(dates[15].index)
            //console.log(dates);
            //posts = setSort(posts);
            
            client.close();
        });
    });
}

var test = function(){
    var a = [];
    for (var i = 0; i < 10; i++) {
        var t = {};
        t.value = Math.random();
        t.index = i; 
        a.push(t);
        console.log(a[i]);
    }
    a = a.slice(0,5);
    console.log(a);
}
test()
//dbTest();
//docPrint('people',{'_id':'asasd'});
//docsPrint('crawl_FB',{});
//dbSort();
/*a = [[6,8],[3,5],[0,2]];
var original = a.slice(0);
console.log(original)*/




