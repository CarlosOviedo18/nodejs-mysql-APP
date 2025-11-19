
//esto es para proteger rutas que requieren autenticación, esto l
// uego se utiliza en routes/authentication.js
//  para proteer las rutas de inicar sesion y q no se pueda entra por
//  la URL directamente
module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/auth/signin");
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect("/auth/profile");
    } 
    
    

};