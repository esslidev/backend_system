# projekt0_backend

HTTP status codes convey the result of a request and are divided into several classes:

1xx (Informational): Request received, continuing process.
2xx (Successful): The action was successfully received, understood, and accepted.
3xx (Redirection): Further action needs to be taken in order to complete the request.
4xx (Client Error): The request contains bad syntax or cannot be fulfilled.
5xx (Server Error): The server failed to fulfill a valid request.
For error responses (4xx and 5xx status codes), it's good practice to use standard HTTP status codes to indicate the nature of the error. For example:

400 Bad Request: The server cannot or will not process the request due to an apparent client error.
401 Unauthorized: Similar to 403 Forbidden, but specifically for authentication.
403 Forbidden: The server understood the request, but it refuses to authorize it.
404 Not Found: The requested resource could not be found on the server.
500 Internal Server Error: A generic error message returned when an unexpected condition was encountered.
