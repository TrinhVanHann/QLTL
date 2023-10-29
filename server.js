const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { engine } = require('express-handlebars')
const app = express()
const route = require('./routes/index')
require("./config/db").connect();
const port = 3000


app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.engine('hbs', engine({
  extname: '.hbs',
  helpers: require('./helpers/helpers')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'resources/views'));

route(app)


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})