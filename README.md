# URL Shortener Microservice

Shorten long URLs.

## How it Works

This microservice uses [Monk][1] to store and retrieve objects,
[normalize-url][2] and [random-js][3] to normalize URLs and generate unique
aliases, the [WHATWG URL API][4] to validate URLs, and [Koa][5] and
[koa-router][6] to serve requests.

[1]: https://github.com/Automattic/monk
[2]: https://github.com/sindresorhus/normalize-url
[3]: https://github.com/ckknight/random-js
[4]: https://nodejs.org/api/url.html#url_the_whatwg_url_api
[5]: http://koajs.com/
[6]: https://github.com/alexmingoia/koa-router

## How to Use

`app.js` exports a Koa app. Koa apps have an [`app.listen()`][7] method that is
identical to Node's [http.Server.listen()][8].

Import `app.js` and call `app.listen()` to start up the microservice.

[7]: http://koajs.com/#app-listen-
[8]: https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback

### Environment Variables

* `MONGO_URI` - your Mongo database's connection string

## API Resources

### POST /new/:url

Returns a `ShortUrl` object.

#### REQUEST

__Sample__: `https://url-shortener-microservice.example.com/new/http://example.com`

#### RESPONSE

__Status__: 200 - `application-json`

__Response__:

    {  
      "originalurl": "http://example.com/",
      "shorturl": "http://url-shortener-microservice.example.com/6uZ"
    }

### GET /:alias

Redirects the client to the corresponding long URL.

#### REQUEST

__Sample__: `https://url-shortener-microservice.example.com/6uZ`

#### RESPONSE

__Status__: 302

__Location__: `http://example.com/`
