"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
// Función para manejar errores de forma centralizada en los controladores
const handleError = (res, error, defaultMessage = 'Ocurrió un error en el servidor') => {
    // Registra el error completo en la consola del servidor para depuración
    console.error('API Error:', error);
    // Determina el código de estado y mensaje de error basado en el tipo de error
    if (error instanceof Error) {
        // Errores de lógica de negocio o validación personalizada
        // Ejemplo: si el error.message contiene "No se puede eliminar..." o "El usuario ya tiene..."
        if (error.message.includes('No se puede') || error.message.includes('El usuario ya') || error.message.includes('El libro no está')) {
            return res.status(409).json({ message: error.message }); // 409 Conflict
        }
        // Para errores de base de datos específicos, como duplicados
        // 'ER_DUP_ENTRY' es el código de error de MySQL para entradas duplicadas (ej. email o ISBN único)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El recurso que intentas crear ya existe (posiblemente email o ISBN duplicado).' });
        }
    }
    // Para cualquier otro error no manejado específicamente, devuelve un 500
    res.status(500).json({ message: defaultMessage });
};
exports.handleError = handleError;
