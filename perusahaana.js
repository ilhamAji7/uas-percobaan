const express = require("express");
const app = express();
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

const port = 3001;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "perusahaana",
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi ke MySQL gagal: " + err.message);
  } else {
    console.log("Terhubung ke MySQL");
  }
});

app.use(express.json());

app.get("/karyawan", (req, res) => {
  const { id_karyawan } = req.query;

  if (!id_karyawan) {
    return res.status(400).send("Parameter 'id' tidak ditemukan");
  }

  const sql = "SELECT * FROM karyawan WHERE id_karyawan= ?";
  db.query(sql, [id_karyawan], (err, result) => {
    if (err) {
      return res.status(500).send("Gagal mencari karyawan");
    } else {
      if (result.length > 0) {
        const karyawan = result[0];
        return res.json({
          id: karyawan.id_karyawan,
          nama: karyawan.nama,
          posisi: karyawan.posisi,
        });
      } else {
        return res.status(404).send("Karyawan tidak ditemukan");
      }
    }
  });
});

app.post("/karyawan", (req, res) => {
  const { nama, posisi } = req.body;

  const idKaryawan = uuidv4();

  const sql =
    "INSERT INTO karyawan (id_karyawan, nama_karyawan, posisi) VALUES (?, ?, ?)";
  db.query(sql, [idKaryawan, nama, posisi], (err, result) => {
    if (err) {
      return res.status(500).send("Gagal membuat karyawan baru");
    } else {
      return res.json({
        message: "Karyawan berhasil dibuat",
        idKaryawan,
        nama,
        posisi,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server PERUSAHAAN A berjalan di http://localhost:${port}`);
});
