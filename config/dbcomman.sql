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
    jam_selesai         TIME,
    selesai             BOOLEAN NOT NULL DEFAULT FALSE,
    nama_layanan        TEXT NOT NULL REFERENCES Layanan(nama_layanan) ON DELETE CASCADE ON UPDATE CASCADE,
    urutan_pos          INT NOT NULL CHECK (urutan_pos > 0),
    antre               INT NOT NULL CHECK (antre >= 0),
    nama_pos            TEXT NOT NULL REFERENCES Pos(nama_pos) ON DELETE CASCADE ON UPDATE CASCADE
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


-- functions dan trigger 

-- t1
CREATE OR REPLACE FUNCTION cek_ketersediaan_pekerja()
RETURNS TRIGGER AS $$
DECLARE
    current_dow     INT;
    dow_text        NAMAHARI;
BEGIN
    current_dow := date_part('dow',current_date);
    IF current_dow = 0 THEN
        current_dow := 7;
    END IF; 
    SELECT enumlabel INTO dow_text
        from pg_catalog.pg_enum
        WHERE enumtypid = 'NAMAHARI'::regtype 
        AND enumsortorder = current_dow;
    IF EXISTS (
        SELECT nama_pos 
        FROM Terdiri 
        WHERE nama_layanan = NEW.nama_layanan
        AND nama_pos NOT IN (SELECT nama_pos FROM Bertugas WHERE hari = dow_text)
    ) THEN
        RAISE EXCEPTION 'Pekerja Tidak Tersedia';
        RETURN NULL;
    ELSE
        RETURN NEW; 
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cekpekerja 
BEFORE INSERT ON Transaksi FOR EACH ROW EXECUTE PROCEDURE cek_ketersediaan_pekerja();

-- t2
CREATE OR REPLACE FUNCTION konfigurasi_awal_transaksi()
RETURNS TRIGGER AS $$
DECLARE
    new_antre INT;
BEGIN
    SELECT max(antre) INTO new_antre
        FROM Transaksi 
        WHERE nama_pos IN (
            SELECT nama_pos 
            FROM Terdiri 
            WHERE nama_layanan = NEW.nama_layanan AND urutan = 1
        ) AND Selesai = FALSE;
    IF new_antre IS NULL THEN
        new_antre := 0;
    END IF;
    NEW.antre := new_antre + 1;
    NEW.urutan_pos = 1;
    SELECT nama_pos INTO NEW.nama_pos 
        FROM Terdiri 
        WHERE nama_layanan = NEW.nama_layanan AND urutan = 1;
    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER konfigurasiawal
BEFORE INSERT ON Transaksi FOR EACH ROW EXECUTE PROCEDURE konfigurasi_awal_transaksi();

-- f3
CREATE OR REPLACE FUNCTION selesaikan_transaksi(pk INT)
RETURNS INT AS $$
DECLARE
BEGIN
    IF EXISTS (SELECT * FROM Transaksi WHERE no_transaksi = pk AND selesai = TRUE) THEN
        RAISE EXCEPTION 'Transaksi no : % sudah selesai',pk;
    END IF;
    UPDATE Transaksi
        SET selesai = TRUE,
        jam_selesai = localtime
        WHERE no_transaksi = pk;
    RETURN pk;
END;
$$ LANGUAGE plpgsql;

-- f4
CREATE OR REPLACE FUNCTION lanjut_progres(pk INT)
RETURNS INT AS $$
DECLARE
    new_antre INT;
    new_urutan_pos INT;
    old_nama_pos TEXT;
    new_nama_pos TEXT;
BEGIN
    IF EXISTS (SELECT * FROM Transaksi WHERE no_transaksi = pk AND (antre > 1 OR selesai = TRUE)) THEN
        RAISE EXCEPTION 'Tidak bisa lanjut karena sudah selesai atau masih menunggu giliran';
    END IF;
    SELECT urutan_pos, nama_pos INTO new_urutan_pos, old_nama_pos
        FROM Transaksi 
        WHERE no_transaksi = pk;
    new_urutan_pos := new_urutan_pos + 1;
    SELECT Terdiri.nama_pos INTO new_nama_pos 
        FROM Transaksi INNER JOIN Terdiri USING (nama_layanan) 
        WHERE no_transaksi = pk AND urutan = new_urutan_pos;    
    IF NOT FOUND THEN
        PERFORM * FROM selesaikan_transaksi(pk);
    ELSE
        SELECT max(antre) INTO new_antre
            FROM Transaksi 
            WHERE nama_pos = new_nama_pos AND selesai = FALSE;
        IF new_antre IS NULL THEN
            new_antre := 0;
        END IF;
        new_antre := new_antre + 1;
        UPDATE Transaksi SET
            urutan_pos = new_urutan_pos,
            antre = new_antre,
            nama_pos = new_nama_pos
            WHERE no_transaksi = pk;
    END IF; 
    UPDATE Transaksi SET antre = antre - 1 WHERE nama_pos = old_nama_pos AND SELESAI = FALSE;
    RETURN pk;
END;
$$ LANGUAGE plpgsql;






