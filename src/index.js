const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require('passport'); // Asegura que passport esté inicializado si se usa en el proyecto

const {database} = require('./keys');

//inicialisaciones
const app = express();
require('./lib/passport'); // Asegura que las estrategias de passport se carguen

//settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

//middlewares - ORDEN CORRECTO
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: "carlosmysqlnodesession",
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables - DESPUÉS de session y flash
app.use((req, res, next) => {
  res.locals.success = req.session.successMessage || req.flash("success")[0] || null;
  res.locals.error = req.session.errorMessage || req.flash("error")[0] || null;
  res.locals.user = req.user || null;
  
  // Limpiar los mensajes de la sesión después de mostrarlos
  delete req.session.successMessage;
  delete req.session.errorMessage;
  
  next();
});

//rutas
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/authentication");
const linksRoutes = require("./routes/links");

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/links", linksRoutes);

//archivos publicos
app.use(express.static(path.join(__dirname, "public")));

//arrancar el servidor
app.listen(app.get("port"), () => {
  console.log(`Servidor en el puerto ${app.get("port")}`);
});