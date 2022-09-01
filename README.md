This is a simple full stack application implementing
the client/server model. 

I'm using React w/ bootstrap for the frontend. On the backend I'm using NodeJS with the built in HTTP and Crypto libraries to implement login functionality.


<h3>Client</h3>

- build and run: `npm start` in `/client`

<h3>Server</h3>

- build and run: `npm start` in `/server`



<h3> Hot reloading & Debugging </h3>

- Client: React has hot reloading built-in. To debug react, use the developer console in Chrome.
- Server: In VSCode launch "Javascript Debug Terminal" under the run and debug tab. Once launched run: `nodemon start` in `/server` If not installed, run: `npm install -g nodemon`.