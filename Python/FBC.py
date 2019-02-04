# -*- coding: utf-8 -*-
import facebook
from pymongo import MongoClient
#---DB INFO-----
dbName = 'KnowWeb'
cName = 'people'
FileName = 'people.txt'
crawl_FB = 'crawl_FB'
client = MongoClient('localhost', 27017)


def posts2docs(posts):
    docs = []
    keys = ['message','story']
    for post in posts:
        print('post_id:'+post['id'])
        doc = {'post_id':post['id'], 'time':post['created_time']}
        for key in keys:
            if(post[key] is not None):
                doc[key] = post[key]
        #if(post['message'] is not None):
        docs.append(doc)
    return posts


def insertCrawl_FB():#all new
    #people.txt 儲存fb名稱
    crawl_FB = 'crawl_FB'
    f = open(FileName, 'r', encoding='UTF-8')#open('people.txt','r')
    people=[]
    for line in f.readlines():
        line = line[:-1]
        people.append(line)
    f.close()
    print(people)
    token='528750284184452|AtHOXhvGbAyB79NWdV3yKMgnJYM'
    graph = facebook.GraphAPI(access_token = token)
    post_objs = []
    for name in people:
        fanpage_info = graph.get_object(name, field = 'id') #person
        post_obj = {'name':name,'fanpage_id':fanpage_info['id']}
        post_objs.append(post_obj)
    post_obj = {'people':post_objs}
    post_id = client[dbName][crawl_FB].insert_one(post_obj).inserted_id
    print(post_obj)
    #print(post_id)

def cleanCrawl_FB(name):#去除同名 且 fanpage_id == None
    docs = client[dbName]['crawl_FB'].find({'name':name})
    for doc in docs:
        if('fanpage_id' in doc) is False:
            client[dbName]['crawl_FB'].delete_one({'_id':doc['_id']})

def updateCrawl_FB():#crawl_FB has ['name'] | crawl_FB => people
    docs = client[dbName]['crawl_FB'].find({})
    token='528750284184452|AtHOXhvGbAyB79NWdV3yKMgnJYM'
    graph = facebook.GraphAPI(access_token = token)
    for doc in docs:
        try:
            fanpage_info = graph.get_object(doc['name'], field = 'id')
        except:
            client[dbName]['crawl_FB'].delete_one({'_id':doc['_id']})
            continue
        if(('fanpage_id' in doc) is False):            
            client[dbName]['crawl_FB'].update_one({'_id':doc['_id']},{'$set':{'fanpage_id':fanpage_info['id']}})
        result = client[dbName]['people'].update_one({'name':fanpage_info['name']},{'$set':{'FanPage_id':fanpage_info['id']}})
        print(result.matched_count)
        if(result.matched_count==0):
            client[dbName]['people'].insert_one({'name':fanpage_info['name'],'FanPage_id':fanpage_info['id']})
    

def crawl_FB():#[]['people'] has 'FanPage_id'
    docs = client[dbName]['people'].find({})
    token='528750284184452|AtHOXhvGbAyB79NWdV3yKMgnJYM'
    graph = facebook.GraphAPI(access_token = token)
    for doc in docs:#{'name':11,'FanPage_id':11,'FanPage_Post':posts}
        print(doc)
        post_data = graph.get_connections(id = doc['FanPage_id'], connection_name = 'posts', summary = True)
        posts = post_data['data']
        if 'FanPage_Posts' in doc:
            lastPosts = doc['FanPage_Posts']
            lastCrawl = lastPosts[0]['created_time']
            pos = -1
            for i, post in enumerate(posts):
                if(post['created_time']==lastCrawl):
                    pos=i
                if(pos!=-1):
                    print('Predict Success!')
                    posts = posts[:pos]
            for post in lastPosts:
                posts.append(post)
        #post_obj = {'name':fanpage_info['name'],'FanPage_id':fanpage_info['id'],'FanPage_Posts':posts}
        result = client[dbName][cName].update_one({'_id':doc['_id']},{'$set':{'FanPage_Posts':posts}})
        post_id = result.modified_count
        print(post_id)#1 => update ok

def test():
    token='528750284184452|AtHOXhvGbAyB79NWdV3yKMgnJYM'
    graph = facebook.GraphAPI(access_token = token)
    #fanpage_info = graph.get_object('ccckmit',field='id')
    #print(fanpage_info)
    #814251892
    #193480161484
    post_data = graph.get_connections(id = '814251892', connection_name = 'posts', summary = True)
    print(post_data)
    #result = client[dbName]['people'].update_one({'name':fanpage_info['name']},{'$set':{'FanPage_id':fanpage_info['id']}})
    #print(result.matched_count)
    #print(result.modified_count)


#insertCrawl_FB()
#cleanCrawl_FB('jay')

#test()

#updateCrawl_FB()
#crawl_FB()







    


        
    
    
                                                                            
                                                                            

    
    
    
        
