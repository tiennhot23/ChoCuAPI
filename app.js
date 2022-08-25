const express = require('express')
const cors = require('cors')
const paypal = require('paypal-rest-sdk')

require('dotenv').config()

const upload = require('./routers/upload')
const location = require('./routers/location')
const otp = require('./routers/otp')
const user = require('./routers/user')
const errorHandling = require('./middlewares/errorHandling')
const responseHandling = require('./middlewares/responseHandling')
const post = require('./routers/post')
const category = require('./routers/category')
const details = require('./routers/details')
const admin = require('./routers/admin')
const deal = require('./routers/deal')
const payment = require('./routers/payment')
const notify = require('./routers/notify')
const mail = require('./middlewares/mail')
const services = require('./routers/services')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

function postTrimmer(req, res, next) {
  for (const [key, value] of Object.entries(req.body)) {
    if (typeof value === 'string') req.body[key] = value.trim()
  }
  next()
}

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
})
app.get('/paypal', (req, res) => {
  let {
    item_name = 'ao',
    price = 20000,
    recipient_name = 'Brian Robinson',
    address = 'Thu Duc'
  } = req.query
  price = (price / 23430).toFixed(2)
  var create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: 'http://192.168.1.7:3000/success',
      cancel_url: 'http://192.168.1.7:3000/cancel'
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: item_name,
              sku: 'item',
              price: price,
              currency: 'USD',
              quantity: 1
            }
          ],
          shipping_address: {
            recipient_name: recipient_name,
            line1: address,
            line2: '',
            city: 'Viet Nam',
            country_code: 'VN',
            phone: '011862212345678'
          }
        },
        amount: {
          currency: 'USD',
          total: price
        },
        description: 'This is the payment description.'
      }
    ]
  }

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error
    } else {
      console.log('Create Payment Response')
      console.log(payment)
      res.redirect(payment.links[1].href)
    }
  })
})
app.get('/success', (req, res) => res.send('Success'))
app.get('/cancel', (req, res) => res.send('Cancel'))
// app.get('/gmail', (req, res) => {
//   mail.sendMail('imagesaitama@gmail.com', 'TEST', 'Noij dug')
//   res.send('asd')
// })

app.use(postTrimmer)

app.use(responseHandling)

app.use('/location', location)
app.use('/otp', otp)
app.use('/user', user)
app.use('/post', post)
app.use('/deal', deal)
app.use('/category', category)
app.use('/details', details)
app.use('/upload', upload)
app.use('/admin', admin)
app.use('/payment', payment)
app.use('/notify', notify)
app.use('/services', services)
app.use('/', (req, res, next) => {
  res.json({message: 'HELLO STRANGER'})
})

app.use(errorHandling)

app.listen(port, () => console.log(`Listening on port ${port}`))
