insert into Pekerja (nama_pekerja) values ('Alwi'), ('Sukra');
insert into Pekerja (nama_pekerja) values ('Ganteng');

insert into Pos values 
('Pencucian Luar','Pos untuk mencuci mobi bagian luar',20),
('Pengeringan',NULL,15);
insert into Pos values ('Interior',NULL,10);

insert into Layanan values ('Paket Sedang','Hanya dilakukan pencucian bagian luar',40000);
insert into Layanan values ('Paket Komplit','Hanya dilakukan pencucian bagian luar',50000);

insert into Bertugas values 
(1,'senin','Pencucian Luar'),
(2,'senin','Pengeringan');
insert into Bertugas values (4,'rabu','Interior');

insert into Terdiri values 
('Paket Sedang',1,'Pencucian Luar'),
('Paket Sedang',2,'Pengeringan');
insert into Terdiri values 
('Paket Komplit',1,'Pencucian Luar'),
('Paket Komplit',2,'Pengeringan'),
('Paket Komplit',3,'Interior');

insert into Transaksi (merk_mobil, no_kendaraan, nama_layanan) values ('BMW','B 4 LWI','Paket Sedang');
insert into Transaksi (merk_mobil, no_kendaraan, nama_layanan) values ('MERCY','BK 1 ALWI','Paket Sedang');
insert into Transaksi (merk_mobil, no_kendaraan, nama_layanan) values ('MAYBACH','BK 3 MAS','Paket Komplit');


