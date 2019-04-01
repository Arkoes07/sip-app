insert into Pekerja (nama_pekerja) values ('Alwi'), ('Sukra');

insert into Pos values 
('Pencucian Luar','Pos untuk mencuci mobi bagian luar',20),
('Pengeringan',NULL,15);

insert into Layanan values ('Paket Sedang','Hanya dilakukan pencucian bagian luar',40000);

insert into Bertugas values 
(1,'senin','Pencucian Luar'),
(2,'senin','Pengeringan');

insert into Terdiri values 
('Paket Sedang',1,'Pencucian Luar'),
('Paket Sedang',2,'Pengeringan');

insert into Transaksi (merk_mobil, no_kendaraan) values ('BMW','B 4 LWI');

insert into Melakukan values ('Paket Sedang',1,'Pencucian Luar',1,0);

