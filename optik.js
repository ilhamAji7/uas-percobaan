const express = require("express");
const app = express();
const axios = require("axios");
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jaya_terang",
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi ke MySQL gagal: " + err.message);
  } else {
    console.log("Terhubung ke MySQL");
  }
});

app.use(express.json());
// apkah /transaksi = nama table
app.post("/transaksi", async (req, res) => {
  const { id_barang, id_karyawan, nama_pelanggan, jumlah_barang } = req.body;


  let diskon = 0;

  try {
    const response = await axios.get(//digunakan untuk
      `http://localhost:3001/karyawan/${id_karyawan}`
    );
    const karyawanData = response.data;
    console.log("karyawanData", karyawanData);

    const namaKaryawan = karyawanData.data.nama_karyawan;
    console.log("namaKaryawan", namaKaryawan);

      if (karyawanData && karyawanData.data) {
        diskon = 0.2;
      }

  const idPenjualan = uuidv4();

  const barang = db.query(`SELECT * FROM table_barang WHERE id_barang = ${id_barang}`);
  if (!barang || !barang.length || !karyawanData) {
    return res.status(404).json({
      code: 404,
      status: "Error",
      error: true,
      message: "Barang or Karyawan not found",
    });
  }
  
  const hargaBarang = barang.harga_barang;
  const total_harga = hargaBarang * jumlah_barang;
  const hargaDiskon = total_harga * diskon;
  //id barang & karyawan
  //masih perlu diperbaiki di bagian jumlah_barang
  const total_bayar = total_harga - hargaDiskon;
  
  // await db.query(`
  //   INSERT INTO table_transaksi (id_transaksi, id_barang, id_karyawan, nama_pembeli, nama_karyawan, jumlah_beli, total_harga, diskon, total_bayar)
  //   VALUES (${idPenjualan}, ${id_barang}, ${id_karyawan}, '${nama_pelanggan}', '${namaKaryawan}', ${jumlah_barang}, ${total_harga}, ${diskon}, ${total_bayar})
  // `);
   
  await db.query(`
   INSERT INTO table_transaksi (id_transaksi, id_barang, id_karyawan, nama_pembeli, nama_karyawan, jumlah_beli, total_harga, diskon, total_bayar) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`, [idPenjualan, id_barang, id_karyawan, nama_pelanggan, namaKaryawan, jumlah_barang, total_harga, diskon, total_bayar]);


  res.status(201).json({
    code: 201,
    status: "Success",
    error: false,
    message: "Create transaksi success",
  });
} catch (error) {
  res.status(500).json({
    code: 500,
    status: "Error",
    error: true,
    message: error.message,
  });
}
});

app.listen(port, () => {
  console.log(`Server JAYA TERANG berjalan di http://localhost:${port}`);
});
