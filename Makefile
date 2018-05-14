dev:
	NODE_ENV="development" npm start
prod:
	NODE_ENV="production" npm start
build-img:
	docker build -t kevinkassimo/buhtig .
run:
	- docker rm $$(docker ps -aq)
	docker run -d --net buhtig-net --name buhtig-mongo mongo
	docker run -d --net buhtig-net -p 8000:80 --name buhtig kevinkassimo/buhtig
kill:
	- docker stop $$(docker ps -aq)
	- docker rm $$(docker ps -aq)
unbuild-img:
	docker rmi kevinkassimo/buhtig:latest
upgrade:
    docker stop buhtig
    docker rm buhtig
    docker rmi kevinkassimo/buhtig:latest
    docker build -t kevinkassimo/buhtig .
    docker run -d --net buhtig-net -p 8000:80 --name buhtig kevinkassimo/buhtig
