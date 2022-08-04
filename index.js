const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const express = require("express");

const { User } = require("./models");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "maytheforcebewithyou!", // Esto lo pueden guardar en .env
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ where: { firstname: username } });
    // Si el usuario no existe en nuestra BBDD (me retorna null)...
    if (!user) {
      return done(null, false, { message: "Credenciales inválidas" });
    }
    // Si su contraseña no coincide con la de la BBDD...
    if (user.password !== password) {
      return done(null, false, { message: "Credenciales inválidas" });
    }
    // Si ninguno de los errores expuesto arriba se ejecutó...
    // Entonces la validación del usuario es correcta...
    return done(null, user);
  })
);
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, user);
    });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/register", (req, res) => {
  User.create({
    firstname: req.body.firstname,
    password: req.body.password,
  });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  })
);

app.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Te damos la bienvenida al panel de administración");
  } else {
    res.redirect("/login");
  }
});

app.get("/");

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
