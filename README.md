# Cloud Functions Appointments API - HTTPS function with Firebase URL.
## Introduction

There are 5 endpoints:

- GET List specialty
- GET List staff (supports filter specialtyID)
- GET List payment method
- GET List slot (supports filter staffID)
- POST Create appointment

## Initial setup, build tools and dependencies

### 1. Clone this repo

Clone or download this repo and open the `appointments-functions` directory.
### 2. Create a Firebase project and configure the quickstart

Create a Firebase Project on the [Firebase Console](https://console.firebase.google.com).

Set up your Firebase project by running `firebase use --add`, select your Project ID and follow the instructions.
### 3. Install the Firebase CLI

You need to have installed the Firebase CLI, and it always helps to be on the latest version. Run:

```bash
npm install -g firebase-tools
```

> Doesn't work? You may need to [change npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

### 4. Config the env vars

There is only one apikey env var.

```bash
firebase functions:config:set app.apikey="XXXX"
```
## Try the sample locally

First you need to install the `npm` dependencies of the functions:

```bash
cd functions && npm install; cd ..
```

Start serving your project locally using `firebase serve` or `npm run serve`

Open the app in a browser at [https://localhost:5000/](https://localhost:5000/). Also, you should modify the Postman collection with the given URL.

You can make requests to the API directly from Postman.

## Deploy the app to prod

First you need to install the `npm` dependencies of the functions:

```bash
cd functions && npm install; cd ..
```

This installs locally the Firebase SDK and the Firebase Functions SDK.

Deploy to Firebase using the following command:

```bash
firebase deploy
```

or

```bash
npm run deploy
```

This deploys and activates the `api` Function.

> The first time you call `firebase deploy` on a new project with Functions will take longer than usual.

## Try the sample on prod

After deploying the function you can open the following URL in your browser:

```
https://us-central1-<your-project-id>.cloudfunctions.net/api
```
## License

© Google, 2016. Licensed under an [Apache-2](../../LICENSE) license.