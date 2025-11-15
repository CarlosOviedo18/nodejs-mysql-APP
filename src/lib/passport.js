const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;
const pool = require ('../database');

const helpers = require ('../lib/helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username', 
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        console.log('Intento de login con username:', username);
        const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        console.log('Usuario encontrado:', rows.length > 0);
        
        if (rows.length > 0) {
            const user = rows[0];
            console.log('Usuario en BD:', user);
            console.log('Contraseña ingresada:', password);
            console.log('Contraseña en BD:', user.password);
            
            const validPassword = await helpers.matchPassword(password, user.password);
            console.log('¿Contraseña válida?:', validPassword);
            
            if (validPassword) {
                req.session.successMessage = 'Welcome ' + user.username;
                return done(null, user);
            } else {
                req.session.errorMessage = 'Incorrect Password';
                return done(null, false);
            }
        } else {
            req.session.errorMessage = 'The Username does not exists.';
            return done(null, false);
        }
    } catch (error) {
        console.error('Error en signin:', error);
        req.session.errorMessage = 'Error al iniciar sesión';
        return done(null, false);
    }
}));


// Custom strategy implementation
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const {fullname} = req.body;
    const newUser = {
        username: username,
        password: password,
        fullname: fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    req.session.successMessage = 'User created successfully';
    return done(null, newUser);
}));
  
passport.serializeUser((user, done) => { 
    console.log('Serializando usuario con ID:', user.id);
    done(null, user.id);
}); 

passport.deserializeUser(async (id, done) => { 
    try {
        console.log('Deserializando usuario con ID:', id);
        const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        console.log('Usuario deserializado:', rows[0]);
        
        if (rows.length > 0) {
            done(null, rows[0]);
        } else {
            done(null, null);
        }
    } catch (error) {
        console.error('Error en deserializeUser:', error);
        done(error);
    }
});
