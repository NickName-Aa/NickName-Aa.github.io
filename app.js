//Variables de entorno//

//Invocamos dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

//Importaciones//

//Invocamos express (server)
const express = require("express");
const app = express();

//
const session = require("express-session");

//
const crypto = require("crypto");

// 
const exceljs = require("exceljs");

// Multer para los archivos pdf
const multer = require("multer");
const path = require("path");

//Nodemailer
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const {
    correoAlumnoAprobado,
    correoAlumnoRechazado,
    correoDocenteAprobado,
    correoJefeAprobado,
} = require("./emails/templates");

function enviarCorreo(destinatarios, asunto, mensajeHtml, mensajeTexto) {
    const mailOptions = {
        from: `"Sistema Justificativos" <${process.env.EMAIL_USER}>`,
        to: destinatarios.join(","), // acepta array de correos
        subject: asunto,
        text: mensajeTexto,
        html: mensajeHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error al enviar correo:", error);
        } else {
            console.log("Correo enviado correctamente:", info.response);
        }
    });
}
//Conexion a base de datos
const conexion = require("./database/db");

//Middlewares globales//

//Seteamos urlencoded para capturar datos de formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Seteamos el directorio public
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

app.use("/ver-archivo", express.static("uploads"));

//establecemos el motor de plantillas
app.set("view engine", "ejs");

// Var de session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    }),
);

//Configuracion del Multer//

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

//limitante de archivos a solo pdf
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten archivos PDF"));
        }
    },
});

//Rutas de autenticacaion//

app.get("/login", (req, res) => {
    res.render("login");
});

//Autenticación
app.post("/auth", (req, res) => {
    const { user, pass } = req.body;

    // Validación básica
    if (!user || !pass) {
        return res.render("login", {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Por favor ingrese su RUT y contraseña",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: "login",
        });
    }

    conexion.query(
        "SELECT * FROM usuario WHERE rut = ?",
        [user],
        (error, results) => {
            //  Error SQL
            if (error) {
                console.error("Error SQL:", error);
                return res.send("Error de base de datos");
            }

            //  Usuario no existe
            if (!results || results.length === 0) {
                return res.render("login", {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrectos",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: "login",
                });
            }

            //  Password incorrecta
            if (pass !== results[0].contrasena) {
                return res.render("login", {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrectos",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: "login",
                });
            }
            
            //  Login correcto
            req.session.loggedin = true;
            req.session.user = {
                rut: results[0].rut,
                tipo: results[0].tipo,
            };

            res.redirect("/home");
        },
    );
});

// logaout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

//Rutas de vistas//

//auth pages
app.get("/", (req, res) => {
    if (req.session.loggedin) {
        res.render("home", {
            login: true,
        });
    } else {
        res.redirect("login");
    }
});

//Olvido Contraseña
app.get("/olvidoContrasenha", (req, res) => {
    res.render("olvidoContrasenha", {
        success: null,
        error: null
    });
});

//Cambio contraseña
app.get("/cambioContrasenha/:token", (req, res) => {
    const { token } = req.params;

    const sql = `
        SELECT rut
        FROM usuario
        WHERE reset_token = ?
        AND reset_token_expira > NOW()
    `;

    conexion.query(sql, [token], (err, rows) => {
        if (err || rows.length === 0) {
            return res.render("cambioContrasenha", {expired: true});
        }

            res.render("cambioContrasenha", {
                token,
                success: false,
                expired: false,
                error: null
            });


    });
});


//Home (Dashboard)
function buildHomeFilters(user, search) {
    let where = [];
    let params = [];

    if (user.tipo === "A") {
        where.push("a.rut = ?");
        params.push(user.rut);
    }

    if (user.tipo === "JC") {
        where.push("c.rut_jefe = ?");
        params.push(user.rut);
    }

    if (search && search.trim() !== "") {
        const term = `%${search.trim()}%`;

        where.push(`
            (
                LOWER(a.nombre_completo) LIKE ?
                OR LOWER(c.nombre) LIKE ?
                OR LOWER(asig.nombre) LIKE ?
                OR (j.tipo) LIKE ?
                OR a.rut LIKE ?
            )
        `);

        params.push(term, term, term, term, term);
    }

    const whereSQL = where.length ? " WHERE " + where.join(" AND ") : "";

    return { whereSQL, params };
}

app.get("/home", (req, res) => {
    if (!req.session.loggedin) return res.redirect("/login");

    const { tipo, rut } = req.session.user;
    const { search } = req.query;
    const { whereSQL, params } = buildHomeFilters(req.session.user, search);


    let sqlDatos = `
    SELECT 
        j.id_inasistencia,
        j.motivo,
        j.ruta_archivo,
        j.tipo,
        a.rut,
        a.nombre_completo,
        a.correo,
        c.nombre AS carrera,
        asig.nombre AS asignatura,
        s.codigo_seccion,
        j.fecha_prueba,
        j.estado
    FROM justificativo j
    JOIN alumno a ON j.rut_alumno = a.rut
    JOIN carrera c ON a.ua_carrera = c.ua
    JOIN seccion s ON j.id_seccion = s.id_seccion
    JOIN asignatura asig ON s.id_asignatura = asig.id_asignatura
    ${whereSQL}
    ORDER BY j.estado ASC, j.fecha_prueba ASC
`;
let sqlStats = `SELECT
                            COUNT(*) AS total,
                            SUM(j.estado = 1) AS pendientes,
                            SUM(j.estado = 2) AS aprobados,
                            SUM(j.estado = 3) AS rechazados
                        FROM justificativo j
                        JOIN alumno a ON j.rut_alumno = a.rut
                        JOIN carrera c ON a.ua_carrera = c.ua
                        JOIN seccion s ON j.id_seccion = s.id_seccion
                        JOIN asignatura asig ON s.id_asignatura = asig.id_asignatura
                        ${whereSQL}`;


    conexion.query(sqlDatos, params, (err, datos) => {
        if (err) return res.send("Error dashboard");

        



        conexion.query(sqlStats, params, (err2, statsResult) => {
            if (err2) return res.send("Error estadísticas");

            const stats = statsResult[0];

            res.render("home", {
                datos,
                user: req.session.user,
                stats,
                search
            });
        });
    });
});


//Exportar a excel
app.get("/export-excel", (req, res) => {
    if (!req.session.loggedin) return res.redirect("/login");

    const { whereSQL, params } = buildHomeFilters(
    req.session.user,
    req.query.search
);

let sql = `SELECT
                a.rut,
                a.nombre_completo,
                a.correo,
                c.nombre AS carrera,
                asig.nombre AS asignatura,
                j.fecha_prueba,
                j.tipo
            FROM justificativo j
            JOIN alumno a ON j.rut_alumno = a.rut
            JOIN carrera c ON a.ua_carrera = c.ua
            JOIN seccion s ON j.id_seccion = s.id_seccion
            JOIN asignatura asig ON s.id_asignatura = asig.id_asignatura

                ${whereSQL}
                ORDER BY j.estado ASC, j.fecha_prueba ASC`;
    conexion.query(sql, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error export");
        }
        const workbook = new exceljs.Workbook();
        const sheet = workbook.addWorksheet("Justificativos");

        sheet.columns = [
            { header: "RUT", key: "rut", width: 15 },
            { header: "Nombre", key: "nombre", width: 30 },
            { header: "Correo", key: "correo", width: 30 },
            { header: "Carrera", key: "carrera", width: 25 },
            { header: "Asignatura", key: "asignatura", width: 25 },
            { header: "Fecha Prueba", key: "fecha", width: 15 },
            { header: "Tipo Justificativo", key: "tipo", width: 20 },
        ];

        rows.forEach(r => {
            sheet.addRow({
                rut: r.rut,
                nombre: r.nombre_completo,
                correo: r.correo,
                carrera: r.carrera,
                asignatura: r.asignatura,
                fecha: r.fecha_prueba
                    ? new Date(r.fecha_prueba).toLocaleDateString("es-CL")
                    : "N/A",
                tipo: r.tipo
            });
        });
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=justificativos.xlsx"
        );

        workbook.xlsx.write(res).then(() => {
            res.end();
        });

        
    });
});

//Formulario
app.get("/formulario", (req, res) => {
    if (!req.session.loggedin || req.session.user.tipo !== "A") {
        return res.redirect("/login");
    }

    const rutAlumno = req.session.user.rut;

    const sqlAlumno = `SELECT
                            a.rut,
                            a.nombre_completo,
                            a.correo,
                            a.telefono,
                            c.ua AS ua_carrera,
                            c.nombre AS nombre_carrera,
                            c.jornada
                            FROM alumno a
                            JOIN carrera c ON a.ua_carrera = c.ua
                            WHERE a.rut = ?`;

    conexion.query(sqlAlumno, [rutAlumno], (error, results) => {
        if (error || results.length === 0) {
            return res.send("Error alumno");
        }

        const alumno = results[0];

        const sqlAsignaturas = `SELECT 
                                    asig.id_asignatura,
                                    asig.nombre
                                        FROM asignatura asig
                                        JOIN asignatura_carrera ac 
                                    ON asig.id_asignatura = ac.id_asignatura
                                        WHERE ac.ua = ?`;

        conexion.query(sqlAsignaturas, [alumno.ua_carrera], (err2, asignaturas) => {
            if (err2) {
                return res.send("Error asignaturas");
            }
            console.log(asignaturas);
            res.render("formulario", {
                alumno,
                asignaturas,
            });
        });
    });
});

//Vista de detallesJustificativo
app.get("/justificativo/:id", (req, res) => {
    if (!req.session.loggedin) {
        return res.redirect("/login");
    }
    const id = req.params.id;

    const sql = `SELECT 
                    j.id_inasistencia,
                    j.motivo,
                    j.tipo,
                    j.estado,
                    j.observaciones,
                    j.fecha_emision,
                    j.fecha_respuesta,
                    j.fecha_prueba,
                    j.ruta_archivo,

                    -- Nombre de la AA que dio respuesta
                    ast.nombre AS nombre_asistente, 

                    -- Alumno
                    a.nombre_completo,  
                    a.rut,
                    a.correo,
                    a.telefono,

                    -- Carrera
                    c.nombre AS carrera,
                    c.jornada,
                    
                    -- Informacion Academica
                    asig.nombre AS asignatura,
                    s.codigo_seccion AS seccion,
                    
                    -- Docente real del justificativo
                    d.nombre AS docente

                FROM justificativo j
                JOIN alumno a ON j.rut_alumno = a.rut
                JOIN carrera c ON a.ua_carrera = c.ua
                JOIN seccion s ON j.id_seccion = s.id_seccion
                JOIN asignatura asig ON s.id_asignatura = asig.id_asignatura
                JOIN docente d ON j.rut_docente = d.rut
                LEFT JOIN asistente ast ON j.rut_asistente = ast.rut
                WHERE j.id_inasistencia = ?`;

    conexion.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.send("Error al cargar justificativo");
        }
        if (err || result.length === 0) {
            return res.send("Justificativo no encontrado");
        }

        res.render("detalleJustificativo", {
            justificativo: result[0],
            user: req.session.user,
        });
    });
});

//Rutas API//

app.get("/api/secciones/:idAsignatura", (req, res) => {
    const { idAsignatura } = req.params;

    const sql = `SELECT 
                    id_seccion,
                    codigo_seccion
                FROM seccion
                WHERE id_asignatura = ?`;

    conexion.query(sql, [idAsignatura], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener secciones" });
        }

        res.json(results);
    });
});

app.get("/api/docentes/:idSeccion", (req, res) => {
    const { idSeccion } = req.params;

    const sql = `SELECT 
                    d.rut,
                    d.nombre
                FROM seccion_docente sd
                JOIN docente d ON sd.rut_docente = d.rut
                WHERE sd.id_seccion = ?`;

    conexion.query(sql, [idSeccion], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener docentes" });
        }

        res.json(results);
    });
});

//Acciones post importantes//

//Enviar justificativo
app.post("/enviar-justificativo", upload.single("certificado"), (req, res) => {
    if (!req.session.loggedin || req.session.user.tipo !== "A") {
        return res.redirect("/login");
    }

    if (!req.file) {
        return res.send("Debe adjuntar un certificado PDF");
    }
    const {
        fecha_evaluacion,
        id_seccion,
        rut_docente,
        motivo,
        tipo_certificado,
    } = req.body;

    const rut_alumno = req.session.user.rut;
    const estado = 1; // Pendiente
    const ruta_archivo = req.file.filename;

    const sqlInsert = `INSERT INTO justificativo
        (motivo, tipo, estado, fecha_prueba, ruta_archivo, rut_alumno, rut_docente, id_seccion) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)`;

    conexion.query(
        sqlInsert,
        [
            motivo,
            tipo_certificado,
            estado,
            fecha_evaluacion,
            ruta_archivo,
            rut_alumno,
            rut_docente,
            id_seccion,
        ],
        (error) => {
            if (error) {
                console.log(error);
                return res.send("Error al guardar justificativo");
            }
            console.log(req.body);

            res.redirect("/home");
        },
    );
});

//Actualizar estado
app.post("/actualizar-estado", (req, res) => {
    if (!req.session.loggedin || req.session.user.tipo !== "AA") {
        return res.status(403).send("No autorizado");
    }

    const { id, estado, observaciones } = req.body;
    const rut_asistente = req.session.user.rut;

    if (estado == 3 && (!observaciones || observaciones.trim() === "")) {
        return res.status(400).json({
            success: false,
            message: "Las observaciones son obligatorias al rechazar.",
        });
    }

    const sqlUpdate = `
            UPDATE justificativo
            SET estado = ?, observaciones = ?, rut_asistente = ?, fecha_respuesta = NOW()
            WHERE id_inasistencia = ?
        `;

    conexion.query(
        sqlUpdate,
        [estado, observaciones, rut_asistente, id],
        (err, result) => {
            if (err) {
                console.error("Error SQL update:", err);
                return res.status(500).json({ success: false });
            }

            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: "Justificativo no encontrado" });
            }

            const sqlDestinatarios = `SELECT 
                                        a.correo AS correo_alumno,
                                        a.nombre_completo AS alumno,
                                        asig.nombre AS asignatura,
                                        d.correo AS correo_docente,
                                        jc.correo AS correo_jefe,
                                        j.motivo
                                    FROM Justificativo j
                                    JOIN Alumno a ON j.rut_alumno = a.rut
                                    JOIN Carrera c ON a.ua_carrera = c.ua
                                    JOIN jefe_carrera jc ON c.rut_jefe = jc.rut
                                    JOIN Docente d ON j.rut_docente = d.rut
                                    JOIN Seccion s ON j.id_seccion = s.id_seccion
                                    JOIN Asignatura asig ON s.id_asignatura = asig.id_asignatura
                                    WHERE j.id_inasistencia = ?`;

            conexion.query(sqlDestinatarios, [id], (err2, rows) => {
                if (err2 || rows.length === 0) {
                    console.log("No se pudieron obtener datos para los correos");
                    return res.json({ success: true });
                }

                const datos = rows[0];

                if (estado == 3) {
                    enviarCorreo(
                        [datos.correo_alumno],
                        "Justificativo rechazado",
                        correoAlumnoRechazado({
                            alumno: datos.alumno,
                            motivo: datos.motivo,
                            observaciones,
                        }),
                        `Tu justificativo fue rechazado. Motivo: ${datos.motivo}. Observaciones: ${observaciones || "Ninguna"}`,
                    );

                    console.log(
                        "Correo de rechazo enviado al alumno:",
                        datos.correo_alumno,
                    );
                }

                if (estado == 2) {
                    enviarCorreo(
                        [datos.correo_alumno],
                        "Justificativo aprobado",
                        correoAlumnoAprobado({
                            alumno: datos.alumno,
                            asignatura: datos.asignatura,
                        }),
                        `Tu justificativo fue aprobado.`,
                    );

                    enviarCorreo(
                        [datos.correo_docente],
                        "Justificativo aprobado",
                        correoDocenteAprobado({
                            alumno: datos.alumno,
                            asignatura: datos.asignatura,
                        }),
                        `Justificativo aprobado`,
                    );

                    enviarCorreo(
                        [datos.correo_jefe],
                        "Justificativo aprobado",
                        correoJefeAprobado({
                            alumno: datos.alumno,
                            asignatura: datos.asignatura,
                        }),
                        `Justificativo aprobado`,
                    );

                    console.log(
                        "Correos de aprobación enviados a alumno, docente y jefe",
                    );
                }

                return res.json({ success: true });
            });
        },
    );
});

//Olvido de contraseña
app.post("/olvidoContrasenha", (req, res) => {
    const { rut } = req.body;

    if (!rut) {
        return res.render("olvidoContrasenha", {
            success: null,
            error: "Debes ingresar tu RUT"
        });
    }

    // Verificamos que exista el usuario
    const sqlUsuario = `SELECT rut, tipo FROM usuario WHERE rut = ?`;

    conexion.query(sqlUsuario, [rut], (err, rows) => {
        if (err) {
            console.error(err);
            return res.render("olvidoContrasenha", {
                success: null,
                error: "Error al consultar la base de datos"
            });
        }

        // Si no existe el RUT, **no mostramos nada**
        if (rows.length === 0) {
            return res.render("olvidoContrasenha", {
                success: null,
                error: null
            });
        }

        const { tipo } = rows[0];

        // Generamos token
        const token = crypto.randomBytes(32).toString("hex");
        const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        const sqlToken = `
            UPDATE usuario
            SET reset_token = ?, reset_token_expira = ?
            WHERE rut = ?
        `;

        conexion.query(sqlToken, [token, expira, rut], (err2) => {
            if (err2) {
                console.error(err2);
                return res.render("olvidoContrasenha", {
                    success: null,
                    error: "No se pudo generar el enlace"
                });
            }

            // Obtenemos correo real según tipo
            let tabla = "";
            if (tipo === "A") tabla = "alumno";
            if (tipo === "D") tabla = "docente";
            if (tipo === "JC") tabla = "jefe_carrera";
            if (tipo === "AA") tabla = "asistente";

            const sqlCorreo = `SELECT correo FROM ${tabla} WHERE rut = ?`;

            conexion.query(sqlCorreo, [rut], (err3, correoRows) => {
                if (err3 || correoRows.length === 0) {
                    console.error(err3);
                    return res.render("olvidoContrasenha", {
                        success: null,
                        error: "No se pudo obtener el correo"
                    });
                }

                const correo = correoRows[0].correo;
                const link = `http://localhost:3000/cambioContrasenha/${token}`;

                const mailOptions = {
                    from: `"Sistema Justificativos" <${process.env.EMAIL_USER}>`,
                    to: correo,
                    subject: "Recuperación de contraseña",
                    html: `
                        <h2>Recuperación de contraseña</h2>
                        <p>Se solicitó un cambio de contraseña para tu cuenta.</p>
                        <p>Haz clic en el siguiente enlace para continuar:</p>
                        <a href="${link}">Cambiar contraseña</a>
                        <p>Este enlace expira en 1 hora.</p>
                        <br>
                        <p>Si no solicitaste esto, ignora este correo.</p>
                    `
                };

                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.error("Error enviando correo:", error);
                        return res.render("olvidoContrasenha", {
                            success: null,
                            error: "No se pudo enviar el correo"
                        });
                    }

                    // Si se envió correctamente, mostramos mensaje de éxito
                    return res.render("olvidoContrasenha", {
                        success: "Se ha enviado un enlace a tu correo",
                        error: null
                    });
                });
            });
        });
    });
});


// Cambio contraseña
app.post("/cambioContrasenha/:token", (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Campos vacíos
    if (!password || !confirmPassword) {
        return res.render("cambioContrasenha", {
            token,
            error: "Debes completar todos los campos",
            success: false,
            expired: false
        });
    }

    // Contraseñas distintas
    if (password !== confirmPassword) {
        return res.render("cambioContrasenha", {
            token,
            error: "Las contraseñas no coinciden",
            success: false,
            expired: false
        });
    }

    // Verificamos token
    const sqlToken = `
        SELECT rut
        FROM usuario
        WHERE reset_token = ?
        AND reset_token_expira > NOW()
    `;

    conexion.query(sqlToken, [token], (err, rows) => {
        if (err || rows.length === 0) {
            return res.render("cambioContrasenha", {
                token: null,
                error: null,
                success: false,
                expired: true
            });
        }

        const { rut } = rows[0];

        // Actualizamos contraseña
        const sqlUpdate = `
            UPDATE usuario
            SET contrasena = ?,
                reset_token = NULL,
                reset_token_expira = NULL
            WHERE rut = ?
        `;

        conexion.query(sqlUpdate, [password, rut], (err2) => {
            if (err2) {
                return res.render("cambioContrasenha", {
                    token,
                    error: "Error al actualizar la contraseña",
                    success: false,
                    expired: false
                });
            }

            // Éxito
            return res.render("cambioContrasenha", {
                token: null,
                error: null,
                success: true,
                expired: false
            });
        });
    });
});



//Manejo de errores//

//Limitante de peso en archivos
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.send("El archivo supera el tamaño máximo permitido");
        }
    }

    if (err) {
        return res.send(err.message);
    }

    next();
});

//Servidor
app.listen(3000 , function () {
    console.log("Servidor creado http://localhost:3000");
});
