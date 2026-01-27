#create database proyectoucsc;
use proyectoucsc;

CREATE TABLE sede (
    id_sistema INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);


select * from usuario;
CREATE TABLE usuario (
    rut VARCHAR(12) PRIMARY KEY,
    contrasena VARCHAR(255),
    tipo VARCHAR(50)
);
ALTER TABLE usuario
ADD reset_token VARCHAR(255),
ADD reset_token_expira DATETIME;

CREATE TABLE jefe_carrera (
    rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100)
);

CREATE TABLE docente (
    rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100)
);

CREATE TABLE carrera (
    ua VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100),
    jornada VARCHAR(50),
    rut_jefe VARCHAR(12),
    
    FOREIGN KEY (rut_jefe) REFERENCES Jefe_Carrera(rut)
);

CREATE TABLE asignatura (
    id_asignatura VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE asignatura_carrera(
	id_asignatura VARCHAR(50),
	ua VARCHAR(50),
    semestre INT NULL,
    
	PRIMARY KEY (id_asignatura, ua),
    FOREIGN KEY (id_asignatura) REFERENCES asignatura(id_asignatura),
    FOREIGN KEY (ua) REFERENCES carrera(ua)
);

CREATE TABLE asistente (
    rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    id_sistema INT,
    
    FOREIGN KEY (id_sistema) REFERENCES Sede(id_sistema)
);

CREATE TABLE alumno (
    rut VARCHAR(12) PRIMARY KEY,
    nombre_completo VARCHAR(150),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    ua_carrera VARCHAR(50),
    FOREIGN KEY (ua_carrera) REFERENCES Carrera(ua)
);

CREATE TABLE seccion(
	id_seccion INT AUTO_INCREMENT PRIMARY KEY,
	codigo_seccion VARCHAR(20) NOT NULL,
    id_asignatura VARCHAR(50) NOT NULL,
    ua VARCHAR(50),
    
	FOREIGN KEY (id_asignatura, ua) references asignatura_carrera (id_asignatura, ua)
);

CREATE TABLE seccion_docente (
    id_seccion INT NOT NULL,
    rut_docente VARCHAR(12) NOT NULL,
    
    PRIMARY KEY (id_seccion, rut_docente),
    FOREIGN KEY (id_seccion) REFERENCES Seccion(id_seccion),
    FOREIGN KEY (rut_docente) REFERENCES Docente(rut)
);

CREATE TABLE justificativo (
    id_inasistencia INT AUTO_INCREMENT PRIMARY KEY,

    motivo VARCHAR(255) NOT NULL,
    tipo VARCHAR(50),

    estado TINYINT NOT NULL DEFAULT 1,
    observaciones VARCHAR(255) NULL,

    fecha_emision DATE NOT NULL DEFAULT (CURRENT_DATE),
    fecha_respuesta DATE NULL,
    fecha_prueba DATE NOT NULL,

    ruta_archivo VARCHAR(255) NOT NULL,

    rut_alumno VARCHAR(12) NOT NULL,
    rut_asistente VARCHAR(12) NULL,
    rut_docente VARCHAR(12) NOT NULL,
    id_seccion INT NOT NULL,

    FOREIGN KEY (rut_alumno) REFERENCES Alumno(rut),
    FOREIGN KEY (rut_asistente) REFERENCES Asistente(rut),
    FOREIGN KEY (rut_docente) REFERENCES docente(rut),
    FOREIGN KEY (id_seccion) REFERENCES seccion(id_seccion)
);
ALTER TABLE justificativo
MODIFY fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
MODIFY fecha_respuesta DATETIME NULL;
