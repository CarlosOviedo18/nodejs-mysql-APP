
// Importación de módulos principales
const express = require("express"); // Framework web principal
const morgan = require("morgan"); // Middleware para logs HTTP
const exphbs = require("express-handlebars"); // Motor de plantillas Handlebars
const path = require("path"); // Utilidad para rutas de archivos
const flash = require("connect-flash"); // Mensajes flash entre vistas
const session = require("express-session"); // Manejo de sesiones
const MySQLStore = require("express-mysql-session")(session); // Sesiones almacenadas en MySQL
const passport = require('passport'); // Middleware de autenticación

const {database} = require('./keys'); // Configuración de la base de datos


// Inicialización de la aplicación Express
const app = express();

// Carga la configuración de Passport (estrategias de autenticación)
require('./lib/passport');


// Configuraciones de la aplicación
app.set("port", process.env.PORT || 3000); // Puerto del servidor
app.set("views", path.join(__dirname, "views")); // Carpeta de vistas

// Configuración del motor de plantillas Handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main", // Layout principal
    layoutsDir: path.join(app.get("views"), "layouts"), // Carpeta de layouts
    partialsDir: path.join(app.get("views"), "partials"), // Carpeta de parciales
    extname: ".hbs", // Extensión de archivos de vista
    helpers: require("./lib/handlebars"), // Helpers personalizados
  })
);
app.set("view engine", ".hbs"); // Usa Handlebars como motor de vistas


// Middlewares (en el orden correcto)
app.use(morgan("dev")); // Muestra logs HTTP en consola
app.use(express.urlencoded({ extended: false })); // Para recibir datos de formularios
app.use(express.json()); // Para recibir datos en formato JSON

// Configuración de sesiones
app.use(session({
  secret: "carlosmysqlnodesession", // Clave secreta para firmar la cookie de sesión
  resave: false, // No guardar sesión si no hay cambios
  saveUninitialized: false, // No guardar sesiones vacías
  store: new MySQLStore(database) // Almacena sesiones en MySQL
}));

// Inicializa Passport y manejo de sesiones con Passport
app.use(passport.initialize());
app.use(passport.session());

// Habilita mensajes flash (mensajes temporales entre vistas)
app.use(flash());


// Variables globales para las vistas (después de session y flash)
app.use((req, res, next) => {
  // Mensajes de éxito y error disponibles en todas las vistas
  res.locals.success = req.session.successMessage || req.flash("success")[0] || null;
  res.locals.error = req.session.errorMessage || req.flash("error")[0] || null;

  // Usuario autenticado disponible globalmente
  app.locals.user = req.user;
  res.locals.user = req.user || null;
  
  // Limpia los mensajes de la sesión después de mostrarlos
  delete req.session.successMessage;
  delete req.session.errorMessage;
  
  next();
});


// Importa las rutas principales de la aplicación
const indexRoutes = require("./routes/index"); // Rutas generales
const authRoutes = require("./routes/authentication"); // Rutas de autenticación
const linksRoutes = require("./routes/links"); // Rutas para links

// Usa las rutas importadas
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/links", linksRoutes);


// Archivos estáticos (CSS, imágenes, JS)
app.use(express.static(path.join(__dirname, "public")));


// Arranca el servidor en el puerto configurado
app.listen(app.get("port"), () => {
  console.log(`Servidor en el puerto ${app.get("port")}`);
});