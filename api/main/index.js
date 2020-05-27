require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors')
const pool = require('./db')
const axios = require('axios')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/steps', (req, res) => {
  const username = 'MikeD425'
  pool.query(
    `SELECT steps, steps_spent FROM users
     WHERE username=$1`, [ username ],
     (q_err, q_res) => {
       res.send(q_res.rows)
     })
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

searchNearby = async (req, res, next) => {
  const lat = req.query.lat, 
        lng = req.query.lng, 
        radius = req.query.radius;
  let firstPage, secondPage, thirdPage;
  let results = [];
  firstPage = await axios.get(
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        key: process.env.KEY,
        location: lat + ',' + lng,
        radius: radius
      }
    })
  results = results.concat(firstPage.data.results)
  if (firstPage && firstPage.data.next_page_token) {
    await sleep(1250)
    secondPage = await axios.get(
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        key: process.env.KEY,
        location: lat + ',' + lng,
        radius: radius,
        pagetoken: firstPage.data.next_page_token
      }
    })
    results = results.concat(secondPage.data.results)
  }
  if (secondPage && secondPage.data.next_page_token) {
    await sleep(1250)
    thirdPage = await axios.get(
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        key: process.env.KEY,
        location: lat + ',' + lng,
        radius: radius,
        pagetoken: secondPage.data.next_page_token
      }
    })
    results = results.concat(thirdPage.data.results)
  }
  res.send(results)
}

app.put('/steps', (req, res) => {
  const username = 'MikeD425'
  const steps = req.body.updatedSteps
  const date = req.body.updatedDate
  pool.query(
    `UPDATE users 
     SET steps = steps + $1, 
     steps_last_update = $2
     WHERE username = $3`, [ steps, date, username ],
     (q_err, q_res) => {
       res.send(q_res.rows)
     })
})

app.get('/stepsLastUpdate', (req, res) => {
  const username = 'MikeD425'
  pool.query(
    `SELECT steps_last_update FROM users
     WHERE username=$1`, [ username ],
       (q_err, q_res) => {
         res.send(q_res.rows)
      })
})

app.get('/searchNearby', searchNearby)

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});