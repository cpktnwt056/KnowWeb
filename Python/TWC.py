import tweepy  
  
consumer_key = 'xxxxxxxxxxxxxxxxx'  
consumer_secret = 'xxxxxxxxxxxxxxxxxxxxxxxxx'  
access_token = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'  
access_token_secret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'  
  
#提交你的Key和secret  
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)  
auth.set_access_token(access_token, access_token_secret)  
  
#获取类似于内容句柄的东西  
api = tweepy.API(auth)  
  
#打印我自己主页上的时间轴里的内容  
public_tweets = api.home_timeline()  
for tweet in public_tweets:  
    print tweet.text  
