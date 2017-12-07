# React Progressive Web App (PWA) Example

I thought, why not build one ourselves. If you are familiar with React an a bit
about its ecosystem such as Create-React-App. This guide is for you.

If you spend your at least third quater of your day on internet you know you are
getting to see progressive web apps here and there. No? PWA are fast,
performance focused web applications that are especially streamlined for a
mobile device. They can be saved over device's home screen and tends to consist
a native app feeling. The first PWA app I used on my mobile device is Twitter
one which got released a few months back. Here is the link if you want to try:
[https://lite.twitter.com/](https://lite.twitter.com/). They even support push
notifications and offline support these days.

## Getting Started

Let us create a basic React app using Create-React-App generator. To install
command line tool:

```shell
npm install --global create-react-app
```

Once the installation process is complete, go to your desired directory and
create an empty project. Run this from your commandline:

```shell
create-react-app react-pwa-example

# and cd in that directory
cd react-pwa-example
```

Go ahead and take a look at the directory structre and package.json file. See
what dependencies come with this scaffolding tool.

CRA or Create React App is one of the best with minimum hassle tool that I am
currently using to build apps and protoypes with React. It is running all that
Babel, Webpack stuff behind the scenes. If you want more information or want to
customize, read
[here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject).

I hope, regardless of the timeline, your package.json file looks like this:

```json
{
  "name": "react-pwa-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-scripts": "1.0.17"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

We need to one more dependency and that is React-Router: Go Back to your
terminal:

```shell
npm install --save react-router-dom@4.2.2
```

You can now try running the application from terminal by:

```shell
npm run start
```

The boilerplate code will and look like this:

![image-1](https://i.imgur.com/S7xFCI4.png)

## Building the PWA App

Since the sole purpose of this guide is to make you familiar with the build
process, I am not going to work out a complex application. For sake of
simplicity and your precious time, we will build a simple app. Go to
`src/App.js` file and make amendments exactly like below:

```JavaScript
import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import About from "./components/About";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React App</h2>
        </div>
        <BrowserRouter>
          <div>
            <Route path="/" exact component={Home} />
            <Route path="/about" exact component={About} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
```

Further we will define Home and About Components in `src/components/` directory.
It is always a best practice to use this approach that make sure that react
components are short and readable.

For `Home.js`:

```javascript
import React from "react";
import { Link } from "react-router-dom";

const home = () => {
  return (
    <div title="Home">
      <h1>Home Page</h1>
      <p>
        <Link to="/about">About</Link>
      </p>
    </div>
  );
};

export default home;
```

And for `About.js`:

```javascript
import React from "react";
import { Link } from "react-router-dom";

const about = () => {
  return (
    <div title="About">
      <h1>About Page</h1>
      <p>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
};

export default about;
```

Now to see it working, run `npm start` from your terminal window, and you will
get a similar result:

![image-2](https://i.imgur.com/8YR4QCW.png)

If you click on the about button, the react-router-dom with react will render
the about page without changing the common Header part that is defined in
`App.js`. This is a bare minimum single page application.

Our main job is still yet to be done. Let's convert this bare minimum React
application to a PWA.

## Installing Lighthouse

Lighthouse is a free tool from Google that evaluates your app based on their PWA
checklist. Add it to your Chrome browser from
[here](https://developers.google.com/web/tools/lighthouse/). Once installed as
an extension we can start the auditiing process by clicking on the Lighthouse at
top right corner where other extension might exist in your browser. Click on the
icon and then make sure you are on right tab by checking the URL shown in the
lighthouse popup. Also, make sure that development server of Create-react-app
from terminal is running. Otherwise Lighthouse won't be able to generate report.
The report that is generated by the Lighthouse is based on a checklist that
available to view
[here](https://developers.google.com/web/progressive-web-apps/checklist).

![image-3](https://i.imgur.com/7ljAVBa.png)

Click on the Generate Report button. After the process is completed, a new
window will open where Lighthouse has generated a report. By the looks of it, it
does not look pleasing to the Lighthouse and as a Progressive Web App.

![image-4](https://i.imgur.com/WZu9h5I.png)

![image-5](https://i.imgur.com/pgrp9Mh.png)

We will be solving these issues one by one.

## Setting up a Serive Worker

Let's setup a service worker first. That is the first thing Lighthouse audited.
What is a service worker, you ask? Well, it is a proxy server that sit between
web applications, browsers and the network. We can use it to make React Apps
work offline (remember the earlier point we discussed. Progressive Web Apps are
focused on performance). You can definitey read details about it on
[Google's Web Fundamental Docs](https://developers.google.com/web/fundamentals/primers/service-workers/?hl=en).

It is a two step process. First we will create `service-worker.js` file (yes,
service worker, after all is JavaScript code) and then register that worker in
our `index.html`.

In the `public` directory of our app strucutre, create a file
`service-worker.js`. I am going to use Addy Osmani's service worker
configuraiton and I will recommend you to do so, at least for this one. You can
find the complete thing in much much detail
[here](https://medium.com/@addyosmani/progressive-web-apps-with-react-js-part-3-offline-support-and-network-resilience-c84db889162c).
To continue, make sure you add the following code in `service-worker.js` file:

```javascript
var doCache = false;

var CACHE_NAME = "my-pwa-cache-v1";

self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log("Deleting cache: " + key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("install", function(event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        fetch("manifest.json")
          .then(response => {
            response.json();
          })
          .then(assets => {
            const urlsToCache = ["/", assets["main.js"]];
            cache.addAll(urlsToCache);
            console.log("cached");
          });
      })
    );
  }
});

self.addEventListener("fetch", function(event) {
  if (doCache) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});
```

Our next step is to register the our service worker by loading the one we just
wrote in `service-worker.js`. Add this before the closing `</body>` tag in
`index.html`.

```javascript
<script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('service-worker.js').then(function (registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
          console.log('ServiceWorker registration failed: ', err);
        }).catch(function (err) {
          console.log(err)
        });
      });
    } else {
      console.log('service worker is not supported');
    }
  </script>
```

Make sure you restart the dev server by running `npm run start` from the
terminal. You must see this line if you open Chrome's DevTools > Console:

![image-6](https://i.imgur.com/j3bSJr2.png)

If we run the Lighthouse audit process again, I hope we will get a better
result.

![image-7](https://i.imgur.com/ZKxR4IJ.png)

Yes, you can clearly compare the above with our previous audit. It has imporved,
and our previous first issue is now coming under Passed Audits. Now let's move
and add some enhancement.

## Adding Progressive Enhancement

Progessive Enhancement is way to improve the app/site since it will work without
any JavaScript loading. Now, we want to display a loading message and some CSS
or none (your choice) before the React app initializes the DOM. Let's add a the
required CSS and a loading message to our `index.html`. To increase performance,
I am also adding all our CSS (that is CSS contained inside `App.css` and
`index.css`) in our `index.html` file.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#000000">
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
  <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  <title>React App</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }

    .App {
      text-align: center;
    }

    .App-logo {
      height: 80px;
    }

    .App-header {
      background-color: #222;
      height: 150px;
      padding: 20px;
      color: white;
    }

    .App-title {
      font-size: 1.5em;
    }

    .App-intro {
      font-size: large;
    }

    @keyframes App-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  </style>
</head>

<body>
  <div id="root">
    <div class="App">
      <p>
        Loading...
      </p>
    </div>

    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('service-worker.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
          }).catch(function (err) {
            console.log(err)
          });
        });
      } else {
        console.log('service worker is not supported');
      }
    </script>

</body>

</html>
```

We can now delete `App.css` and `index.css` file from out project directory and
also remove their import references from `App.js` and `index.js`.

The above process improves the performance of our app by 10 points. The overall
PWA score is same though:

![image-8](https://i.imgur.com/Q2353Py.png)

## Adding it to Device's Home Screen

The creators of create-react-app is so good to us that they have already
included a `manifest.json` file in `public` directory with some basic
configuration. This feature that we are currently adding allows a user to save
our PWA site page on their device's home screen. In future, if the user wish to
open the app, they can do that just by using PWA as a normal application and it
will open in their phone's default browser.

For this purpose, we are going to edit `public/manifest.json`:

```json
{
  "short_name": "PWA React App",
  "name": "Progressive React App Example",
  "icons": [
    {
      "src": "logo.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "logo-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000",
  "background_color": "#000"
}
```

Let's talk about this file a bit. The `short_name` is the name of app that will
appear on Home Screen of device. `name` will appear on the splash screen.
`icons` is important and is the main icon of our app and will appear along the
`short_name` on home screen, just like a native mobile application. The size of
the icon must be `192x192`. I haven't played around with other image formats but
you can. [Here](https://i.imgur.com/RaN7Qey.png) is the link to a dummy logo for
this walkthrough we are working on. Add it to the `public` directory. The 512
setting is for splash screen and is a requirement in auditing process. So here
is the [link](https://i.imgur.com/TmblrhM.png) to download that.

Next is `start_url` that notifies that the app was started frome Home Screen.
Below it there are three more properties. `display` is for the appearance of the
app, and I am making `theme_color` and `background_color` to be same since I
want the application to match header background.

We will now solve one of our issue in the previous audit. We are left with only
some of them to resolve.

![image-9](https://i.imgur.com/vxzNbmX.png)

## Deployment
