use proyectoucsc;

-- Inserto de datos en sedes
select * from sede;
delete from sede;
INSERT INTO sede(id_sistema, nombre)
VALUES 
(NULL, 'Chillán');


-- Inserto de datos en jefes_carrera
delete from jefe_carrera;
select * from jefe_carrera;
INSERT INTO jefe_carrera (rut, nombre, correo) VALUES
('12345678', 'Carlos Andrade Muñoz', '0kotsuu.nanamin@gmail.com'),
('98765432', 'María Fernanda Ríos', '0kotsuu.nanamin@gmail.com'),
('15234987', 'Juan Pablo Herrera', '0kotsuu.nanamin@gmail.com'),
('18123456', 'Patricia González Soto', '0kotsuu.nanamin@gmail.com'),
('16543210', 'Ricardo Fuentes Alarcón', '0kotsuu.nanamin@gmail.com');



-- Inserto de datos en docente
delete from docente;
select count(*) from  docente;
select * from docente;

INSERT INTO docente (rut, nombre, correo) VALUES
('20123456', 'Andrea Morales Pérez', '0kotsuu.nanamin@gmail.com'),
('20123457', 'Sebastián López Rivas', '0kotsuu.nanamin@gmail.com'),
('20123458', 'Valentina Castillo Núñez', '0kotsuu.nanamin@gmail.com'),
('20123459', 'Matías Rodríguez Silva', '0kotsuu.nanamin@gmail.com'),
('20123460', 'Camila Torres Fuentes', '0kotsuu.nanamin@gmail.com'),
('20123461', 'Francisco Araya Méndez', '0kotsuu.nanamin@gmail.com'),
('20123462', 'Daniela Pizarro Vega', '0kotsuu.nanamin@gmail.com'),
('20123463', 'Javiera Soto Albornoz', '0kotsuu.nanamin@gmail.com'),
('20123464', 'Ignacio Herrera Campos', '0kotsuu.nanamin@gmail.com'),
('20123465', 'Constanza Molina Cabrera', '0kotsuu.nanamin@gmail.com'),
('20123466', 'Cristóbal Navarrete Rojas', '0kotsuu.nanamin@gmail.com'),
('20123467', 'Fernanda Orellana Díaz', '0kotsuu.nanamin@gmail.com'),
('20123468', 'Tomás Escobar León', '0kotsuu.nanamin@gmail.com'),
('20123469', 'Paula Vergara Bustos', '0kotsuu.nanamin@gmail.com'),
('20123470', 'Nicolás Sepúlveda Contreras', '0kotsuu.nanamin@gmail.com');


-- Inserto de datos en carrera
delete from carrera;
select * from carrera;

INSERT INTO carrera (ua, nombre, jornada, rut_jefe) VALUES
('UA-INF-01', 'Ingeniería Civil en Informática', 'Diurna', '12345678'),
('UA-INF-02', 'Ingeniería en Informática', 'Vespertina', '98765432'),
('UA-CIV-01', 'Ingeniería Civil', 'Diurna', '15234987'),
('UA-ADM-01', 'Ingeniería Comercial', 'Diurna', '18123456'),
('UA-IND-01', 'Ingeniería Industrial', 'Vespertina', '16543210');

-- Insercion de datos en asignaturaasignatura
delete from asignatura;
select * from asignatura;
select count(*) from asignatura;

INSERT INTO asignatura (id_asignatura, nombre) VALUES
('ASI-INF-01', 'Introducción a la Programación'),
('ASI-INF-02', 'Programación I'),
('ASI-INF-03', 'Programación II'),
('ASI-INF-04', 'Estructuras de Datos'),
('ASI-INF-05', 'Bases de Datos'),
('ASI-INF-06', 'Ingeniería de Software'),
('ASI-INF-07', 'Sistemas Operativos'),
('ASI-INF-08', 'Redes de Computadores'),
('ASI-INF-09', 'Arquitectura de Computadores'),
('ASI-INF-10', 'Desarrollo Web'),
('ASI-MAT-01', 'Cálculo I'),
('ASI-MAT-02', 'Cálculo II'),
('ASI-MAT-03', 'Álgebra Lineal'),
('ASI-MAT-04', 'Probabilidad y Estadística'),
('ASI-FIS-01', 'Física I'),
('ASI-FIS-02', 'Física II'),
('ASI-GEN-01', 'Comunicación Efectiva'),
('ASI-GEN-02', 'Ética Profesional'),
('ASI-GEN-03', 'Metodología de la Investigación'),
('ASI-GEN-04', 'Gestión de Proyectos');

-- Ingreso de asignaturas-carrera
select * from asignatura_carrera;
INSERT INTO asignatura_carrera (id_asignatura, ua, semestre) VALUES
-- Ingeniería Civil en Informática (Diurna)
('ASI-INF-01', 'UA-INF-01', 1),
('ASI-INF-02', 'UA-INF-01', 2),
('ASI-INF-03', 'UA-INF-01', 3),
('ASI-INF-04', 'UA-INF-01', 4),
('ASI-INF-05', 'UA-INF-01', 5),

-- Ingeniería en Informática (Vespertina)
('ASI-INF-01', 'UA-INF-02', 1),
('ASI-INF-02', 'UA-INF-02', 2),
('ASI-INF-03', 'UA-INF-02', 3),
('ASI-INF-05', 'UA-INF-02', 4),

-- Ingeniería Civil
('ASI-MAT-01', 'UA-CIV-01', 1),
('ASI-MAT-02', 'UA-CIV-01', 2),
('ASI-FIS-01', 'UA-CIV-01', 1),
('ASI-FIS-02', 'UA-CIV-01', 2),
('ASI-GEN-04', 'UA-CIV-01', 5),

-- Ingeniería Comercial
('ASI-MAT-01', 'UA-ADM-01', 1),
('ASI-MAT-04', 'UA-ADM-01', 2),
('ASI-GEN-01', 'UA-ADM-01', 1),
('ASI-GEN-02', 'UA-ADM-01', 3),
('ASI-GEN-04', 'UA-ADM-01', 4),

-- Ingeniería Industrial
('ASI-MAT-01', 'UA-IND-01', 1),
('ASI-MAT-02', 'UA-IND-01', 2),
('ASI-MAT-04', 'UA-IND-01', 3),
('ASI-INF-10', 'UA-IND-01', 4),
('ASI-GEN-04', 'UA-IND-01', 5);


-- Ingreso de asistentes
select * from asistente;
INSERT INTO asistente (rut, nombre, correo, id_sistema) VALUES
('11111111', 'Paula Contreras Molina', '0kotsuu.nanamin@gmail.com', 1),
('22222222', 'Rodrigo Salinas Pérez', '0kotsuu.nanamin@gmail.com', 1),
('33333333', 'Camila Oyarzún Fuentes', '0kotsuu.nanamin@gmail.com', 1);


-- Ingreso de Alumnos
select * from alumno;
INSERT INTO alumno (rut, nombre_completo, correo, telefono, ua_carrera) VALUES
-- Ingeniería Civil en Informática
('30100001', 'Alumno Uno', '0kotsuu.nanamin@gmail.com', '912345001', 'UA-INF-01'),
('30100002', 'Alumno Dos', '0kotsuu.nanamin@gmail.com', '912345002', 'UA-INF-01'),
('30100003', 'Alumno Tres', '0kotsuu.nanamin@gmail.com', '912345003', 'UA-INF-01'),
('30100004', 'Alumno Cuatro', '0kotsuu.nanamin@gmail.com', '912345004', 'UA-INF-01'),
('30100005', 'Alumno Cinco', '0kotsuu.nanamin@gmail.com', '912345005', 'UA-INF-01'),
('30100006', 'Alumno Seis', '0kotsuu.nanamin@gmail.com', '912345006', 'UA-INF-01'),
('30100007', 'Alumno Siete', '0kotsuu.nanamin@gmail.com', '912345007', 'UA-INF-01'),
('30100008', 'Alumno Ocho', '0kotsuu.nanamin@gmail.com', '912345008', 'UA-INF-01'),

-- Ingeniería en Informática
('30200001', 'Alumno Nueve', '0kotsuu.nanamin@gmail.com', '912345009', 'UA-INF-02'),
('30200002', 'Alumno Diez', '0kotsuu.nanamin@gmail.com', '912345010', 'UA-INF-02'),
('30200003', 'Alumno Once', '0kotsuu.nanamin@gmail.com', '912345011', 'UA-INF-02'),
('30200004', 'Alumno Doce', '0kotsuu.nanamin@gmail.com', '912345012', 'UA-INF-02'),
('30200005', 'Alumno Trece', '0kotsuu.nanamin@gmail.com', '912345013', 'UA-INF-02'),
('30200006', 'Alumno Catorce', '0kotsuu.nanamin@gmail.com', '912345014', 'UA-INF-02'),
('30200007', 'Alumno Quince', '0kotsuu.nanamin@gmail.com', '912345015', 'UA-INF-02'),
('30200008', 'Alumno Dieciséis', '0kotsuu.nanamin@gmail.com', '912345016', 'UA-INF-02'),

-- Ingeniería Civil
('30300001', 'Alumno Diecisiete', '0kotsuu.nanamin@gmail.com', '912345017', 'UA-CIV-01'),
('30300002', 'Alumno Dieciocho', '0kotsuu.nanamin@gmail.com', '912345018', 'UA-CIV-01'),
('30300003', 'Alumno Diecinueve', '0kotsuu.nanamin@gmail.com', '912345019', 'UA-CIV-01'),
('30300004', 'Alumno Veinte', '0kotsuu.nanamin@gmail.com', '912345020', 'UA-CIV-01'),
('30300005', 'Alumno Veintiuno', '0kotsuu.nanamin@gmail.com', '912345021', 'UA-CIV-01'),
('30300006', 'Alumno Veintidós', '0kotsuu.nanamin@gmail.com', '912345022', 'UA-CIV-01'),
('30300007', 'Alumno Veintitrés', '0kotsuu.nanamin@gmail.com', '912345023', 'UA-CIV-01'),
('30300008', 'Alumno Veinticuatro', '0kotsuu.nanamin@gmail.com', '912345024', 'UA-CIV-01'),

-- Ingeniería Comercial
('30400001', 'Alumno Veinticinco', '0kotsuu.nanamin@gmail.com', '912345025', 'UA-ADM-01'),
('30400002', 'Alumno Veintiséis', '0kotsuu.nanamin@gmail.com', '912345026', 'UA-ADM-01'),
('30400003', 'Alumno Veintisiete', '0kotsuu.nanamin@gmail.com', '912345027', 'UA-ADM-01'),
('30400004', 'Alumno Veintiocho', '0kotsuu.nanamin@gmail.com', '912345028', 'UA-ADM-01'),
('30400005', 'Alumno Veintinueve', '0kotsuu.nanamin@gmail.com', '912345029', 'UA-ADM-01'),
('30400006', 'Alumno Treinta', '0kotsuu.nanamin@gmail.com', '912345030', 'UA-ADM-01'),
('30400007', 'Alumno Treinta y Uno', '0kotsuu.nanamin@gmail.com', '912345031', 'UA-ADM-01'),
('30400008', 'Alumno Treinta y Dos', '0kotsuu.nanamin@gmail.com', '912345032', 'UA-ADM-01'),

-- Ingeniería Industrial
('30500001', 'Alumno Treinta y Tres', '0kotsuu.nanamin@gmail.com', '912345033', 'UA-IND-01'),
('30500002', 'Alumno Treinta y Cuatro', '0kotsuu.nanamin@gmail.com', '912345034', 'UA-IND-01'),
('30500003', 'Alumno Treinta y Cinco', '0kotsuu.nanamin@gmail.com', '912345035', 'UA-IND-01'),
('30500004', 'Alumno Treinta y Seis', '0kotsuu.nanamin@gmail.com', '912345036', 'UA-IND-01'),
('30500005', 'Alumno Treinta y Siete', '0kotsuu.nanamin@gmail.com', '912345037', 'UA-IND-01'),
('30500006', 'Alumno Treinta y Ocho', '0kotsuu.nanamin@gmail.com', '912345038', 'UA-IND-01'),
('30500007', 'Alumno Treinta y Nueve', '0kotsuu.nanamin@gmail.com', '912345039', 'UA-IND-01'),
('30500008', 'Alumno Cuarenta', '0kotsuu.nanamin@gmail.com', '912345040', 'UA-IND-01');


--  Ingreso de seccion
select * from seccion;

INSERT INTO seccion (codigo_seccion, id_asignatura, ua) VALUES
-- Ingeniería Civil en Informática (misma asignatura, varias secciones)
('5',  'ASI-INF-01', 'UA-INF-01'),
('6',  'ASI-INF-01', 'UA-INF-01'),
('31', 'ASI-INF-02', 'UA-INF-01'),
('32', 'ASI-INF-02', 'UA-INF-01'),
('42', 'ASI-INF-03', 'UA-INF-01'),

-- Ingeniería en Informática (Vespertina)
('7',  'ASI-INF-01', 'UA-INF-02'),
('8',  'ASI-INF-01', 'UA-INF-02'),
('18', 'ASI-INF-02', 'UA-INF-02'),
('25', 'ASI-INF-03', 'UA-INF-02'),

-- Ingeniería Civil
('9',  'ASI-MAT-01', 'UA-CIV-01'),
('10', 'ASI-MAT-01', 'UA-CIV-01'),
('14', 'ASI-FIS-01', 'UA-CIV-01'),
('22', 'ASI-MAT-02', 'UA-CIV-01'),

-- Ingeniería Comercial
('11', 'ASI-MAT-01', 'UA-ADM-01'),
('12', 'ASI-MAT-01', 'UA-ADM-01'),
('27', 'ASI-MAT-04', 'UA-ADM-01'),
('33', 'ASI-GEN-02', 'UA-ADM-01'),

-- Ingeniería Industrial
('4',  'ASI-MAT-01', 'UA-IND-01'),
('5',  'ASI-MAT-01', 'UA-IND-01'),
('16', 'ASI-MAT-02', 'UA-IND-01'),
('29', 'ASI-INF-10', 'UA-IND-01'),
('38', 'ASI-GEN-04', 'UA-IND-01');

-- Ingrese de seccion-docente
select * from seccion_docente;
INSERT INTO seccion_docente (id_seccion, rut_docente) VALUES
-- ASI-INF-01 / UA-INF-01
(1, '20123456'),
(1, '20123457'),

(2, '20123458'),
(2, '20123459'),

-- ASI-INF-02 / UA-INF-01
(3, '20123460'),

(4, '20123461'),
(4, '20123462'),

-- ASI-INF-03 / UA-INF-01
(5, '20123463'),
(5, '20123464'),
(5, '20123465'),

-- ASI-INF-01 / UA-INF-02
(6, '20123456'),
(6, '20123466'),

(7, '20123467'),

-- ASI-INF-02 / UA-INF-02
(8, '20123468'),

-- ASI-INF-03 / UA-INF-02
(9, '20123469'),
(9, '20123470'),

-- ASI-MAT-01 / UA-CIV-01
(10, '20123457'),
(10, '20123458'),

(11, '20123459'),

-- ASI-FIS-01 / UA-CIV-01
(12, '20123460'),

-- ASI-MAT-02 / UA-CIV-01
(13, '20123461'),
(13, '20123462'),

-- ASI-MAT-01 / UA-ADM-01
(14, '20123463'),

(15, '20123464'),
(15, '20123465'),

-- ASI-MAT-04 / UA-ADM-01
(16, '20123466'),

-- ASI-GEN-02 / UA-ADM-01
(17, '20123467'),
(17, '20123468'),

-- ASI-MAT-01 / UA-IND-01
(18, '20123469'),

(19, '20123470'),
(19, '20123456'),

-- ASI-MAT-02 / UA-IND-01
(20, '20123457'),

-- ASI-INF-10 / UA-IND-01
(21, '20123458'),
(21, '20123459'),

-- ASI-GEN-04 / UA-IND-01
(22, '20123460');


-- Ingreso de Usuarios
select * from usuario;

INSERT INTO usuario (rut, contrasena, tipo) VALUES
('12345678', '12345', 'JC'),
('98765432', '12345', 'JC'),
('15234987', '12345', 'JC'),
('18123456', '12345', 'JC'),
('16543210', '12345', 'JC');

INSERT INTO usuario (rut, contrasena, tipo) VALUES
('11111111', '12345', 'AA'),
('22222222', '12345', 'AA'),
('33333333', '12345', 'AA');

INSERT INTO usuario (rut, contrasena, tipo) VALUES
-- UA-INF-01
('30100001', '12345', 'A'),
('30100002', '12345', 'A'),
('30100003', '12345', 'A'),
('30100004', '12345', 'A'),
('30100005', '12345', 'A'),
('30100006', '12345', 'A'),
('30100007', '12345', 'A'),
('30100008', '12345', 'A'),

-- UA-INF-02
('30200001', '12345', 'A'),
('30200002', '12345', 'A'),
('30200003', '12345', 'A'),
('30200004', '12345', 'A'),
('30200005', '12345', 'A'),
('30200006', '12345', 'A'),
('30200007', '12345', 'A'),
('30200008', '12345', 'A'),

-- UA-CIV-01
('30300001', '12345', 'A'),
('30300002', '12345', 'A'),
('30300003', '12345', 'A'),
('30300004', '12345', 'A'),
('30300005', '12345', 'A'),
('30300006', '12345', 'A'),
('30300007', '12345', 'A'),
('30300008', '12345', 'A'),

-- UA-ADM-01
('30400001', '12345', 'A'),
('30400002', '12345', 'A'),
('30400003', '12345', 'A'),
('30400004', '12345', 'A'),
('30400005', '12345', 'A'),
('30400006', '12345', 'A'),
('30400007', '12345', 'A'),
('30400008', '12345', 'A'),

-- UA-IND-01
('30500001', '12345', 'A'),
('30500002', '12345', 'A'),
('30500003', '12345', 'A'),
('30500004', '12345', 'A'),
('30500005', '12345', 'A'),
('30500006', '12345', 'A'),
('30500007', '12345', 'A'),
('30500008', '12345', 'A');

INSERT INTO usuario (rut, contrasena, tipo) VALUES
('99999999', '12345', 'SD'),
('77777777', '12345', 'D');
