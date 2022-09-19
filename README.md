![Logo](src/assets/images/Logo.svg)


# Cryptobud Client

This is the client application for the cryptobud social media site. It requires to be connected to the cryptobud server application in order to function properly. 

## Architecture

Cryptobud client is a single page application that consumes APIs for all of its functionality. Sessions are maintained using JWT tokens sent to the server with each API request. Checkout my YouTube video this project here: https://www.youtube.com/watch?v=Ndd44XDcJlw&t=145s

## Functionality

Cryptobud includes the following features: 

* Users can register to create an account, including data such as an avatar and location information
* Users can publish posts, either with textual information, and/or with images and/or with charts connected to real-world crypto data
* Those posts can be public or private. Only followers can see private posts (named "Cluster only" posts in the application)
* Users can follow other users
* Users can comment on each other's posts

## Project Structure

All of the source files are in the src folder. 

The react components are divided into two large subgroups/folders within the src folder: pages & components. Pages each have a unique url and hold state - they do not reside inside of other components (they are the top level component). Components in the components folder are used by pages or other components and do not hold state (only props). 

The styles all go in the styles subfolder of the src folder. SaSS partials are in a partial subfolder of the styles folder. There is a partial for holding color variables, fonts and screen sizes for SaaS media queries.

All static assets go in the assets subfolder of the src files. 

App.js mostly just handles routing to the appropriate page based on the given URL. 

## Charts

The user can post charts that connect to real world crypto data for a variety of coins. This data comes from the CoinCap API. The project uses the proxy pattern, so to do this, the client application first calls an API on the cryptobud server, which in turns calls the CoinCap API. 

## The Feed

The homepage for authenticated users displays a "feed" of posts the user has access to. This uses an infinite scroll, such that posts are retrieved from the server as the user scrolls down (10 at a time). Some specific data for the posts is obtained with subsequent API requests, namely data for displaying charts and DUMP/HODL data to display on each post. 

## Tech Stack

### Client Side

* REACT
* JAVASCRIPT
* SASS
* AXIOS
* J PARTICLES
* REACT INFINITE SCROLL COMPONENT
* HTML REACT PARSER
* REACT ROUTER DOM
* REACT VIS (CHARTS) - FROM UBER

### Server side

* NODE.JS
* EXPRESS
* KNEX
* MYSQL
* JWT TOKENS

### EXTERNAL APIs
* COINCAP
