const parseJwtExpiration = (expString) => {
    const match = expString.match(/^(\d+)([smhd])$/);
    if (!match) {
        throw new Error("Formato de JWT_EXPIRATION inválido en .env. Usa valores como '30m', '1h', '7d'.");
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;         // Segundos
        case 'm': return value * 60 * 1000;    // Minutos
        case 'h': return value * 60 * 60 * 1000; // Horas
        case 'd': return value * 24 * 60 * 60 * 1000; // Días
        default: throw new Error("Unidad de tiempo no válida en JWT_EXPIRATION.");
    }
};

module.exports = { parseJwtExpiration };
