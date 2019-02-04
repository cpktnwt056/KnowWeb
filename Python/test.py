from pymongo import MongoClient
from bson import ObjectId

FileName = 'people.txt'
dbName = 'KnowWeb'
cName = 'people'
client = MongoClient('localhost', 27017)

def crawl():
    import requests
    import json
    token = 'EAAHg5UTdG4QBANs5ghTZBIaJmiugNPlGNHWugBKSVkBXgBetyNRmr6YMnscsIbIbgbIIhMUYRznSpKaC9fVPS9zzi8ZCroHYJqmEITM2IXGZCokL0mVEBRxuWsPaQmHuxST9a7UFeQnXYwEe0JqmiZCpnACGNJ4OQyRpRjKSPcc4kbpZAtF0puy9pslDZAs9kZD'
    #url = 'https://graph.facebook.com/v2.9/1759525920983198?fields=id,posts&access_token={}'.format(token)
    url = 'https://graph.facebook.com/v2.11/72447883975?fields=id,posts&access_token={}'.format(token)
    response = requests.get(url)
    #print(response.text)
    html = json.loads(response.text)
    print(html)
    #message = html['posts']['data'][0]['message']
    #print(message)

def docsPrint(cName,query):
    #docs = client[dbName][cName].find_one({})
    #client[dbName][cName].delete_many({})
    docs = client[dbName][cName].find(query)
    i = 0
    for doc in docs:
        i+=1
        print(doc)
    print(i)
def peoplePrint():
    docs = client['KnowWeb']['people'].find()
    i = 0
    for doc in docs:
        i+=1
        print(doc['name'])
        print(doc['FanPage_id'])
    print(i)
def docPrint(cName,query):
    doc = client[dbName][cName].find_one(query)
    print(doc)
def postsPrint(name):
    doc = client['KnowWeb']['people'].find_one({'name':name})
    print(len(doc['FanPage_Posts']))
    print(doc['FanPage_Posts'])
def dbInsert(cName,obj):
    post_id = client[dbName][cName].insert_one(obj).inserted_id
    print(post_id)
def dbUpdate():
    doc = client[dbName]['test'].update_one({},{'$addToSet':{'a':3}})
    #post_id = client[dbName]['test'].insert_one({'a':[1,2,5,7]}).post_id
    #post_id = client[dbName]['test'].update_one({'_id':'5a6eb10e22e8961c3048e8e0'})
    
def dbTest():
    #docs = client[dbName][cName].find_one({})
    #client[dbName][cName].delete_many({})
    print(client[dbName][cName].find_one({}))
    #print(client[dbName][cName].find({}).count())
    #print(client[dbName][cName].find_one()['FanPage_id'])
def dbDelete(cName):
    client = MongoClient('localhost', 27017)
    client[dbName][cName].delete_many({})

def docDelete(cName,query):
    client[dbName][cName].delete_one({query})

def fileTest():
    f = open(FileName, 'r', encoding='UTF-8')#open('people.txt','r')
    people=[]
    for line in f.readlines():
        line = line[:-1]
        people.append(line)
    f.close()
    print(people)

def addUser(account,password):
    obj = {'account':account,'password':password}
    doc = client[dbName]['users'].find_one(obj)
    if(doc is None):
        id = client[dbName]['users'].insert_one({'account':account,'password':password}).inserted_id
        print('add success! ')
    else:
        print('already exist')

def FBTest():
    import facebook
    isAbort = True #如果DB 有相同人物則跳過
    #peope
    token = 'EAAHg5UTdG4QBANs5ghTZBIaJmiugNPlGNHWugBKSVkBXgBetyNRmr6YMnscsIbIbgbIIhMUYRznSpKaC9fVPS9zzi8ZCroHYJqmEITM2IXGZCokL0mVEBRxuWsPaQmHuxST9a7UFeQnXYwEe0JqmiZCpnACGNJ4OQyRpRjKSPcc4kbpZAtF0puy9pslDZAs9kZD'
    graph = facebook.GraphAPI(access_token = token)
    fanpage_info = graph.get_object('DoctorKoWJ', field = 'id')  
    print(fanpage_info)
    post_data = graph.get_connections(id = fanpage_info['id'], connection_name = 'posts', summary = True)
    posts = post_data['data']
    docs = []
    for post in posts:
        doc = {'post_id':post['id'], 'text':post['message'], 'time':post['created_time']}
        docs.append(doc)
    print(docs)
    
    print(doc)
    #fanpage_info['id'] fanpage_info['name'] = '柯文哲'

    #post = graph.get_object(id='136845026417486_1228569593911685', fields='message')
    #print(post['message'])
    #post = posts['data'][0]
    #post['message'] post['create_time']='2018-01-27T13:15:49+0000' post['id']

    #print(posts['data'][0]['message'])   #這行會印出一大堆貼文的資料

    #print ("共有", len(posts['data']), "篇PO文")



#crawl()
#sdbDelete('people')
#dbTest()
#FBTest()
#test()
#addUser('root','root')

a = (1,2,3)
if isinstance(a,list):
    print('ha')

#dbUpdate()
#dbDelete('test')
#dbInsert('test',{'a':[1,2,5,7]})
#postsPrint('林俊傑  JJ Lin')
#docPrint('people',{})
#docsPrint('crawl_FB',{})

#postsPrint('柯文哲')


#docsPrint('crawl_FB',{})
#docsPrint('people',{})
#peoplePrint()
#docs = client['KnowWeb']['people'].find()
#for doc in docs:
   # print(doc['FanPage_id'])
    #print(doc['F'])
