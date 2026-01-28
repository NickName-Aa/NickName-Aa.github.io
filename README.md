Asegúrate de tener instalado:

Node.js (v18 o superior recomendado)
Git

Un gestor de base de datos (MySQL Workbench, phpMyAdmin, etc.)
---------------------------------------------------------------

Clonar el repositorio
(https://github.com/a-leexander/sistema_justificativo_node.git)
----------------------------------------------------------------

El proyecto NO incluye node_modules, por lo que debes instalarlas manualmente:
npm install 

Configurar variables de entorno

Debes crear el archivo de entorno manualmente.

Dentro del proyecto, crea la carpeta env (si no existe)

Dentro de env, crea el archivo .env

Contenido de ejemplo:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_DATABASE=justificativoPrueba

# este es el correo de pruebas
EMAIL_USER=actividadesyjustificativosucsc@gmail.com
# este es el correo de pruebas
EMAIL_PASS=ugmadcpsrbwjboyd x
----------------------------------------------------------------------

Configuración de la base de datos

Crear la base de datos en MySQL

Ejecutar los scripts SQL necesarios para crear las tablas

Verificar que los datos coincidan con la estructura usada en database/db.js

El sistema utiliza relaciones entre:

alumno

carrera

asignatura

sección

justificativo

docente

asistente académica
----------------------------------------------------------------------------

Carpeta de archivos subidos

El proyecto utiliza una carpeta uploads/ para almacenar certificados PDF.

Esta carpeta se crea automáticamente, pero Git solo versiona un archivo .gitkeep
Si no se crea automaticamente deberas crearla manualmente 
------------------------------------------------------------------------------

Ejecutar el proyecto

Para iniciar el servidor:

node app.js


O si usas nodemon:

nodemon app.js


El servidor quedará disponible en:

http://localhost:3000
--------------------------------------------------------------------------------------

El sistema utiliza sesiones y autenticación por base de datos.

Debes tener usuarios creados previamente en la tabla usuario, indicando su tipo:

A → Alumno

AA → Asistente Académica

JC → Jefe de Carrera
------------------------------------------------------------------------

Envío de correos

El sistema envía correos automáticamente cuando un justificativo es:

✅ Aprobado

❌ Rechazado

Usa Nodemailer con Gmail, por lo que es obligatorio:

Usar una contraseña de aplicación

No usar la contraseña real del correo
