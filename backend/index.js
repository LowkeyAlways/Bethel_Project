require("dotenv").config();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log("Connected to MySQL");
  });

app.get("/", (req, res) => {
if (req.session.firstname) {
    return res.json({
    valid: true,
    username: req.session.firstname,
    id: req.session.user_id,
    role: req.session.role
    });
} else {
    return res.json({ valid: false });
}
});

app.post("/api/login", (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const { email, password } = req.body;
    const sql = "SELECT * FROM UTILISATEUR WHERE EMAIL = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
      if (err) {
        return res.json("Erreur");
      }
      if (data.length > 0) {
        bcrypt.compare(password, data[0].MDP, (error, response) => {
          if (response) {
            req.session.firstname = data[0].PRENOM; 
            const userId = data[0].IDUSER;
            req.session.user_id = userId;
            req.session.role = data[0].ROLE;
            console.log(req.session.firstname); 
            return res.json({ username: req.session.firstname });
          } else {
            return res.json("Email ou mot de passe invalide");
          }
        });
      } else {
        return res.json("L'utilisateur n'existe pas");
      }
    });
});

app.post("/api/check-email", (req, res) => {
    const { email } = req.body;
    const sql = "SELECT COUNT(*) AS count FROM UTILISATEUR WHERE EMAIL = ?";
    db.query(sql, [email], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Erreur lors de la vérification de l'email" });
      }
      const emailExists = result[0].count > 0;
      res.json({ exists: emailExists });
    });
});

app.post("/api/register", (req, res) => {
    const sql =
      "INSERT INTO UTILISATEUR (`NOM`, `PRENOM`, `EMAIL`, `MDP`, `ROLE`) VALUES (?,?,?,?,'2')";
    const values = [
      req.body.lastname,
      req.body.firstname,
      req.body.email,
      req.body.password,
    ];
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) {
        return res.json({ error: "Erreur lors du cryptage du mot de passe" });
      }
      values[3] = hash;
      db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erreur lors de l'enregistrement de l'utilisateur :", err);
            return res.json({ error: "Erreur lors de l'enregistrement de l'utilisateur", details: err.message });
        }
        res.json({ success: true });
    });
    });
});

app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Erreur lors de la déconnexion :", err);
        return res.status(500).json({ error: "Erreur lors de la déconnexion" });
      }
      res.clearCookie("connect.sid"); 
      res.json({ success: true });
    });
});

app.get("/api/events", (req, res) => {
  const sql = "SELECT * FROM EVENEMENT";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
    res.json(result);
  });
});




app.post("/api/add-event", (req, res) => {
  const { userId, title, description, start, end, location } = req.body;

  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }

  
  if (!userId || !title || !start || !end || !location) {
      return res.status(400).json({ error: "Données d'événement incomplètes" });
  }

  const sql = "INSERT INTO EVENEMENT (IDUSER, TITRE, DESCRIPTION, DATE_DEBUT, DATE_FIN, LIEU) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [userId, title, description, start, end, location];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error("Erreur lors de l'ajout de l'événement :", err);
          return res.status(500).json({ error: "Erreur lors de l'ajout de l'événement", details: err.message });
      }
      res.json({ success: true });
  });
});

app.delete("/api/events/delete/:id", (req, res) => {
  const eventId = req.params.id;
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const sql = "DELETE FROM EVENEMENT WHERE IDEVENT = ?";
  db.query(sql, [eventId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la suppression de l'événement" });
    }
    res.json({ success: true });
  });
}
);

app.get("/api/songs", (req, res) => {
  const sql = "SELECT IDCHANT, TITRE FROM CHANT";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la récupération des chants" });
    }
    res.json(result);
  });
});



app.get("/api/songs/:id", (req, res) => {
  const songId = req.params.id;
  const sql = "SELECT * FROM CHANT WHERE IDCHANT = ?";
  db.query(sql, [songId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la récupération du chant" });
    }
    res.json(result[0]);
  });
});

app.post("/api/songs", (req, res) => {
  const { titre, paroles, compositeur, createur, userId } = req.body;
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const sql = "INSERT INTO CHANT (TITRE, PAROLES, COMPOSITEUR, CREATEUR, IDUSER) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [titre, paroles, compositeur, createur, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la création du chant" });
    }
    res.json({ success: true });
  });
});

app.post("/api/songs/update/:id", (req, res) => {
  const id = req.params.id; 
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const { PAROLES } = req.body; 

  const sql = "UPDATE CHANT SET PAROLES = ? WHERE IDCHANT = ?";
  db.query(sql, [PAROLES, id], (err, result) => {
    if (err) {
      console.error("Error updating song lyrics:", err);
      return res.status(500).json({ error: "Error updating song lyrics" });
    }
    res.json({ success: true });
  });
});


app.get("/api/articles", (req, res) => {
  const sql = "SELECT * FROM ARTICLE ORDER BY DATE DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des articles :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des articles" });
    }
    res.json(result);
  });
});

app.get("/api/article/:id", (req, res) => {
  const articleId = req.params.id;
  const sql = "SELECT * FROM ARTICLE WHERE IDARTICLE = ?";
  db.query(sql, [articleId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la récupération de l'article" });
    }
    res.json(result[0]);
  });
});

app.post("/api/article", (req, res) => {
  const { userId, titre, contenu, auteur } = req.body;
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const sql = "INSERT INTO ARTICLE (IDUSER, TITRE, CONTENU, AUTEUR) VALUES (?, ?, ?, ?)";
  db.query(sql, [userId, titre, contenu, auteur], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la création de l'article" });
    }
    res.json({ success: true });
  });
});

app.post("/api/article/update/:id", (req, res) => {
  const id = req.params;
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const { TITRE, CONTENU } = req.body;

  const sql = "UPDATE ARTICLE SET TITRE = ?, CONTENU = ? WHERE IDARTICLE = ?";
  db.query(sql, [TITRE, CONTENU, id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de l'article :", err);
      return res.status(500).json({ error: "Erreur lors de la mise à jour de l'article" });
    }
    res.json({ success: true });
  });
});

app.delete("/api/article/delete/:id", (req, res) => {
  const id  = req.params.id;
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const sql = "DELETE FROM ARTICLE WHERE IDARTICLE = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'article :", err);
      return res.status(500).json({ error: "Erreur lors de la suppression de l'article" });
    }
    res.json({ success: true });
  });
});

app.get("/api/news", (req, res) => {
  const sql = "SELECT * FROM ACTUALITE ORDER BY DATE DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des actualités :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des actualités" });
    }
    res.json(result);
  });
});

app.get("/api/news/:id", (req, res) => {
  const newsId = req.params.id;
  const sql = "SELECT * FROM ACTUALITE WHERE IDACTUALITE = ?";
  db.query(sql, [newsId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la récupération de l'actualité" });
    }
    res.json(result[0]);
  });
});

app.post("/api/news", (req, res) => {
  const { userId, titre, description, auteur } = req.body;
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const sql = "INSERT INTO ACTUALITE (IDUSER, TITRE, DESCRIPTION, AUTEUR) VALUES (?, ?, ?, ?)";
  db.query(sql, [userId, titre, description, auteur], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la création de l'actualité" });
    }
    res.json({ success: true });
  });
});

app.put("/api/news/:id", (req, res) => {
  const newsId = req.params.id;
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const { titre, description, auteur } = req.body;
  const sql = "UPDATE ACTUALITE SET TITRE = ?, DESCRIPTION = ?, AUTEUR = ? WHERE IDACTUALITE = ?";
  db.query(sql, [titre, description, auteur, newsId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de la mise à jour de l'actualité" });
    }
    res.json({ success: true });
  });
});

app.delete("/api/news/:id", (req, res) => {
  const newsId = req.params.id;
  if (req.session.role !== 1) {
    return res.status(403).json("Vous ne possédez pas des droits admins");
  }
  const sql = "DELETE FROM ACTUALITE WHERE IDACTUALITE = ?";
  db.query(sql, [newsId], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'actualité :", err);
      return res.status(500).json({ error: "Erreur lors de la suppression de l'actualité" });
    }
    res.json({ success: true });
  });
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});