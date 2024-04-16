
# URL Shortener
This is a basic URL shortener project, including basic CRUD operations allowing users to create shortened URLs, Modify currently created URLs and remove them.

# Database
For this project I decided to use Redis for simplicity of implementation. This is not a good choice for a production ready service, but for this test assessment, it could be good enough.

# User
Currently there's nothing such an actual user, but I'm creating a unique ID for each device (browser) which is stored in localstorage, and I'm considering it as the userId. So this is the way that I'm saving saving shortened URLs based on user. If you use a different device/browser/profile, you'll be known as a new user and will have you own shortened URLs list. 
Obviously, there's no permission handling implemented, so you can easily remove/modify another user's url by having their userId, but again, this is a test project!


# Getting Started
## Pre-reqs
You must have docker and docker-compose running on your system, which you can get [here](https://www.docker.com/products/docker-desktop) for windows & mac.

## To run
```sh
docker-compose up
```

Your changes will automatically reflect in both the server and the client.

You can find your client at
http://localhost:3000
and your server at
http://localhost:3001
