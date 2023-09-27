const path = require('path')
const express = require('express')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const session = require('express-session')
const app = express()
const route = require('./routes/index')
const port = 3000


app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.engine('hbs', engine({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'resources/views'));

route(app)


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})