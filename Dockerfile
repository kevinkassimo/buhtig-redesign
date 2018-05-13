FROM golang:1.9.2-alpine3.6
RUN apk add --no-cache git

RUN mkdir /app 
ADD ./backend /app/
RUN mkdir /site
ADD ./build /site/
WORKDIR /app 
ENV GOPATH /app

RUN cd src && go get -d buhtig.com
RUN go build -o app src/main.go
CMD ["/app/main"]
