CREATE DATABASE sip;

-- buat tipe data hari
CREATE TYPE NAMAHARI AS enum ('senin','selasa','rabu','kamis','jumat','sabtu','minggu');

-- membuat tabel entity
CREATE TABLE Pengguna (
    username    TEXT PRIMARY KEY,
    password    TEXT NOT NULL,
    jenis_user  TEXT NOT NULL
);

CREATE TABLE Pekerja (
    id_pekerja      SERIAL PRIMARY KEY,
    nama_pekerja    TEXT NOT NULL
);

CREATE TABLE Pos (
    nama_pos    TEXT PRIMARY KEY,
    deskripsi   TEXT,
    durasi      INT NOT NULL CHECK (durasi >= 0)
);

CREATE TABLE Layanan (
    nama_layanan    TEXT PRIMARY KEY,
    deskripsi       TEXT,
    harga           INT NOT NULL CHECK (harga >= 0)
);

CREATE TABLE Transaksi (
    no_transaksi        SERIAL PRIMARY KEY,
    tanggal             DATE NOT NULL DEFAULT current_date,
    merk_mobil          TEXT,
    no_kendaraan        TEXT,
    jam_masuk           TIME NOT NULL DEFAULT localtime,
    estimasi_selesai    TIME,
    selesai             BOOLEAN NOT NULL DEFAULT FALSE
);

-- membuat tabel relasi
CREATE TABLE Bertugas (
    id_pekerja      INT NOT NULL REFERENCES Pekerja(id_pekerja) ON DELETE CASCADE ON UPDATE CASCADE,
    hari            NAMAHARI NOT NULL,
    nama_pos        TEXT NOT NULL REFERENCES Pos(nama_pos) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (id_pekerja, hari)
);

CREATE TABLE Terdiri (
    nama_layanan    TEXT NOT NULL REFERENCES Layanan(nama_layanan) ON DELETE CASCADE ON UPDATE CASCADE,
    urutan          INT NOT NULL CHECK (urutan > 0),
    nama_pos        TEXT NOT NULL REFERENCES Pos(nama_pos) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (nama_layanan, urutan)
);

CREATE TABLE Melakukan (
    nama_layanan    TEXT NOT NULL REFERENCES Layanan(nama_layanan) ON DELETE CASCADE ON UPDATE CASCADE,
    no_transaksi    INT NOT NULL PRIMARY KEY REFERENCES Transaksi(no_transaksi) ON DELETE CASCADE ON UPDATE CASCADE,
    nama_pos        TEXT REFERENCES Pos(nama_pos) ON DELETE CASCADE ON UPDATE CASCADE,
    urutan          INT NOT NULL CHECK (urutan > 0),
    antre          INT NOT NULL CHECK (antre >= 0)
);

-- functions dan trigger 
-- 
-- mencari tahu pos selanjutnya dan nomor antrean nya saat ingin mengganti apabila sudah terakhir maka ubah jadi null
-- setelah pos diganti maka cari tahu sisa waktu dan update estimasi waktu jika menjadi null maka ubah status menjadi selesai



 



