# buHtiG: Go To Any Commit, this time Redesigned

## What is this
A small online tool for getting N-th commit (sequentially) of a github repository
Link: [https://buhtig.com](https://buhtig.com)
(Why I registered this domain name...)  

This site has been completely rewritten, migrated from original jQuery + Node stack to the current React + Go version.  

The current site is still not quite stable, but should serve minimal functionality. Will work on further polishing.  

(I know some of you guys just feels the OAuth thing insecure (even if the OAuth scope is just accessing the public data though...). I know how that feels (I have friends actually acts that way), so the old site is still up at [http://old.buhtig.com](http://old.buhtig.com). BUT I still strongly recommend you to use the new site, as it is far more performant; and, seriously, it's GO! With React! Under SSL!)

## Reason I Created This
More than a year ago, as a Node newbie at that time, I planned to learn code through inspecting the development of successful modules and framework. Then I noticed that it is extremely tiring to find the early commits through possibly 1000+ ones (and good job GitHub, only displaying most recent commits and leaving a small "Older" button so that I can waste my time clicking it. Don't ask me why not download and use git. I just don't want to...).
Through searching I noticed a small website called [www.first-commit.com](www.first-commit.com) (no longer maintained by its original author), which quickly finds the first commit of any GitHub repository. SO... I made this so that I can browse sequentially from start.  

After the whole year of web development experiments, I came back to this. I have seen some new tools/extensions such as [FarhadG/init](https://github.com/FarhadG/init). These actually inspires me to review my old code and see if I could actually make buHtiG more performant, and use this change to learn more about Golang. And here comes the NEW SITE (Completed in 3 days)!

## What's New
+ OAuth, increasing rate limit per user  
+ HTTPS
+ A redesigned UI (using Material Design)
+ Front-end commit info caching, browse faster

## Tech Stack
Frontend: React, Redux, React-Router, Material Design  
Backend: Go, JWT, MongoDB, OAuth, Docker, Nginx  
(Sorry for the two lock files, I unexpectedly bootstrapped the project with yarn at the beginning while keep using npm later on)
