# -*- coding: cp950 -*-
#執行環境 Python 3,並安裝套件
#請先開啟MongoDB (mongod.exe)
import requests
from urllib.parse import urljoin
from pymongo import MongoClient
from bs4     import BeautifulSoup


class Crawler:
    def __init__(self, start_page):
        self.visited_url = []
        self.queue_url = [start_page]
        self.client = MongoClient('localhost', 27017)
        self.db     = self.client.db
        self.c      = self.db.c

    def get_url_list(self, url):
        print('crawling: %s'%(url))
        
        try:
            response = requests.get(url, timeout=10.0)
            raw_html = response.text
            soup = BeautifulSoup(raw_html, 'html.parser')    
        except:
            print('except happen')
            raise
        
        for a in soup.find_all('a'):
            raw_url = a['href']
            if raw_url is None:
                continue
            if raw_url.find('/watch')==-1 :
                continue

            parsed_url = urljoin(url, raw_url)
            print('new link :' + parsed_url)
            if parsed_url not in self.visited_url and parsed_url not in self.queue_url:
                self.queue_url.append(parsed_url)
                
        self.visited_url.append(url)
        try:
            #url = soup.find('meta',property="og:url")['content']
            name = soup.find('meta',itemprop="name")['content']
            videoId = soup.find('meta',itemprop="videoId")['content']
            genre = soup.find('meta',itemprop="videoId")['content']
            interactionCount =  int(soup.find('meta',itemprop="interactionCount")['content'])
            img = soup.find(itemprop="thumbnailUrl")['href']
            datePublished = soup.find(itemprop="datePublished")['content']
            
            post = {'url':url,'name':name,'videoId':videoId,'genre':genre,'interactionCount':interactionCount,
                    'img':img,'datePublished':datePublished}
            if(self.c.find_one({'videoId':videoId})is None) == False:
                print('has Visited!')
                raise  
        except:
            print('tag not find!')
            raise  
        return post

    def start_crawling(self,threshold=-1):
        while threshold is not 0:
            this_url = self.queue_url[0]
            try:
                post = self.get_url_list(this_url)
                post_id = self.c.insert_one(post).inserted_id
                print ("insert :" + str(post_id))
            except:
                pass
            
            if len(self.queue_url) == 1:
               break
            else:
                self.queue_url = self.queue_url[1:]
                #print('crawling...' + this_url)
                threshold -= 1
                continue
                                        
        print('DONE!')

myCrawler = Crawler('https://www.youtube.com/?gl=TW')
myCrawler.start_crawling()
