// emails/templates.js

function correoAlumnoAprobado({ alumno, asignatura }) {
    return `
        <p>Hola ${alumno},</p>
        <p>Tu justificativo para la asignatura <strong>${asignatura}</strong>
        ha sido <strong>APROBADO</strong>.</p>
        <p>Saludos,<br>Sistema de Justificativos</p>
    `;
}

function correoAlumnoRechazado({ alumno, motivo, observaciones }) {
    return `
        <p>Hola ${alumno},</p>
        <p>Tu justificativo fue <strong>RECHAZADO</strong>.</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p><strong>Observaciones:</strong> ${observaciones}</p>
        <p>Saludos,<br>Sistema de Justificativos</p>
    `;
}

function correoDocenteAprobado({ alumno, asignatura }) {
    return `
        <p>Estimado/a Docente,</p>
        <p>Se informa que el justificativo del alumno
        <strong>${alumno}</strong> para la asignatura
        <strong>${asignatura}</strong> ha sido aprobado.</p>
    `;
}

function correoJefeAprobado({ alumno, asignatura }) {
    return `
        <p>Estimado/a Jefe de Carrera,</p>
        <p>Se informa que el justificativo del alumno
        <strong>${alumno}</strong> en la asignatura
        <strong>${asignatura}</strong> ha sido aprobado.</p>
    `;
}

module.exports = {
    correoAlumnoAprobado,
    correoAlumnoRechazado,
    correoDocenteAprobado,
    correoJefeAprobado
};
