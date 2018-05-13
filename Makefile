dev:
	NODE_ENV="development" npm start
prod:
	NODE_ENV="production" npm start
run:
	docker build -t buhtig/buhtig .
