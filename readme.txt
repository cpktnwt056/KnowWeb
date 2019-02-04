mongodb:
['KnowWeb']['crawl_FB'] = #crawl_FB : [{'name':'JJLin','fanpage_id':123},{'name':'Amei','fanpage_id':123},{'name':'Doctor,'fanpage_id':123}}
['KnowWeb']['people'] = {'name':'A','FanPage_id':'id','FanPage_Posts':posts}}

客戶端 post -> (insert [][Crawl_FB]) -> updateCrawl_FB 
=> (更新Crawl_FB+people) -> update_FB

星座 NBA  MLB  桌游  景點  Star 手機 打工資訊 小說


    //
        .row
        .col-md-3
        .col-md-6
            ul.list-group
                each post,i in posts
                    li.list-group-item
                        .post
                            .ups
                                p.position-relative #{post['name']}
                                    span.position-absolute(style="right:8px") #{post['created_time']}
                                
                            .content
                                if post['story']
                                    p #{post['story']}
                                if post['message']
                                    p #{post['message']}
        .col-md-3