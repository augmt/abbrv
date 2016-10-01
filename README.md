# URL Shortener Microservice

URL Shortener Microservice is a REST API which generates short aliases for HTTP
and HTTPS URLs.

## Resources

### GET /:url

Returns a shortened URL.

Example request URLs:

`https://url-shortener-microservice.example.com/http://zombo.com`

#### Responses

**STATUS 200** - application/json

##### EXAMPLE

    {
      shortened_url: https://url-shortener-microservice.example.com/H2O
    }

**STATUS 403** Returned if url is a shortened url.

### GET /:alias

Redirects to the original URL.

Example request URLs:

`https://url-shortener-microservice.example.com/H2O`

#### Responses

**STATUS 301** - text/html

**STATUS 404** Returned if alias does not point to a URL.
