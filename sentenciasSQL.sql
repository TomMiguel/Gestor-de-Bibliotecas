CREATE DATABASE IF NOT EXISTS biblioteca_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleccionamos la base de datos para trabajar en ella
USE biblioteca_db;

-- -----------------------------------------------------
-- Table `Usuarios`
-- Almacena la información de los usuarios de la biblioteca.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL COMMENT 'El email debe ser único para cada usuario y se usa para el login o identificación.',
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora en que el usuario fue registrado.'
) ENGINE = InnoDB;

-- Índice para mejorar el rendimiento en búsquedas por nombre de usuario
CREATE INDEX idx_usuario_nombre ON `Usuarios`(`nombre`);

-- -----------------------------------------------------
-- Table `Libros`
-- Almacena la información de los libros disponibles en la biblioteca.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Libros` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(255) NOT NULL,
  `autor` VARCHAR(255) NOT NULL,
  `isbn` VARCHAR(20) UNIQUE NOT NULL COMMENT 'Número Internacional Normalizado del Libro, debe ser único para cada libro.',
  `anio_publicacion` INT COMMENT 'Año en que el libro fue publicado.',
  `disponible` BOOLEAN DEFAULT TRUE NOT NULL COMMENT 'Indica si el libro está disponible para ser prestado (TRUE) o no (FALSE).'
) ENGINE = InnoDB;

-- Índices para mejorar el rendimiento en búsquedas por título y autor
CREATE INDEX idx_libro_titulo ON `Libros`(`titulo`);
CREATE INDEX idx_libro_autor ON `Libros`(`autor`);

-- -----------------------------------------------------
-- Table `Prestamos`
-- Registra cada préstamo de un libro a un usuario.
-- Un usuario puede tener un libro prestado a la vez, y un libro solo puede estar prestado a un usuario a la vez.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Prestamos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `id_libro` INT NOT NULL,
  `fecha_prestamo` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora en que se realizó el préstamo.',
  `fecha_devolucion` DATE NULL COMMENT 'Fecha en que el libro fue devuelto. Nulo si el préstamo está activo.',
  
  -- Claves Foráneas
  CONSTRAINT `fk_prestamos_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `Usuarios` (`id`)
    ON DELETE RESTRICT -- No permite eliminar un usuario si tiene préstamos activos o históricos
    ON UPDATE CASCADE, -- Si el ID del usuario cambia, se actualiza en la tabla de préstamos
  
  CONSTRAINT `fk_prestamos_libro`
    FOREIGN KEY (`id_libro`)
    REFERENCES `Libros` (`id`)
    ON DELETE RESTRICT -- No permite eliminar un libro si tiene préstamos activos o históricos
    ON UPDATE CASCADE, -- Si el ID del libro cambia, se actualiza en la tabla de préstamos
    
  -- Restricción Única para Préstamos Activos
  -- Esta restricción asegura que un libro solo puede tener un préstamo ACTIVO a la vez.
  -- Combinamos id_libro y una condición donde fecha_devolucion es NULL.
  -- Para lograr esto en MySQL de forma declarativa, es un poco tricky.
  -- La aproximación más común y robusta es manejar la lógica de "disponible" en la API,
  -- junto con la columna `disponible` en la tabla `Libros`.
  -- Sin embargo, si quisiéramos una restricción puramente de BD para evitar un libro
  -- en múltiples préstamos simultáneos (sin fecha_devolucion), una forma es un índice único
  -- sobre id_libro si `fecha_devolucion` *no* es NULL, y luego manejar los NULLs en la API.
  -- Pero el campo `disponible` en `Libros` es más directo para esto.
  -- La siguiente restricción `UQ_Libro_Activo_Manual` no es nativamente soportada
  -- para NULLs condicionales en UNIQUE INDEX directamente en todas las versiones de MySQL.
  -- Para este escenario, la lógica en la API que verifica `Libros.disponible` es clave.
  -- La restricción `UNIQUE (id_libro)` sin más, implicaría que un libro solo podría
  -- aparecer una vez en toda la tabla, lo cual no es lo que queremos (puede tener muchos préstamos históricos).
  -- Por lo tanto, nos apoyaremos en la columna `disponible` de `Libros` y la lógica de la API.
  
  -- Para la limitación de 1 libro por usuario a la vez:
  -- Esta se manejará en la API. Cuando un usuario intente tomar un préstamo,
  -- la API verificará si ya tiene un `Prestamo` con `fecha_devolucion IS NULL`.
  
  -- Agregamos un índice para acelerar las búsquedas de préstamos por usuario y por libro
  INDEX `idx_prestamo_usuario` (`id_usuario`),
  INDEX `idx_prestamo_libro` (`id_libro`)
) ENGINE = InnoDB;


---------------------------------------------------------------------------------------------

USE biblioteca_db;

-- Insertar datos de ejemplo en la tabla Usuarios
INSERT INTO Usuarios (nombre, email) VALUES
('Ana García', 'ana.garcia@example.com'),
('Pedro López', 'pedro.lopez@example.com'),
('María Rodríguez', 'maria.rodriguez@example.com');

-- Insertar datos de ejemplo en la tabla Libros
INSERT INTO Libros (titulo, autor, isbn, anio_publicacion, disponible) VALUES
('Don Quijote de la Mancha', 'Miguel de Cervantes', '978-8424119932', 1605, TRUE),
('Orgullo y Prejuicio', 'Jane Austen', '978-0141439518', 1813, TRUE),
('1984', 'George Orwell', '978-0451524935', 1949, TRUE),
('Cien años de soledad', 'Gabriel García Márquez', '978-0307474728', 1967, TRUE),
('El Principito', 'Antoine de Saint-Exupéry', '978-0156013915', 1943, TRUE);

-- Insertar un préstamo de ejemplo (opcional, puedes crearlo con la API después)
-- Asegúrate de que los IDs de usuario y libro existan de las inserciones anteriores
-- INSERT INTO Prestamos (id_usuario, id_libro, fecha_prestamo) VALUES (1, 3, '2025-07-23 10:00:00');
-- UPDATE Libros SET disponible = FALSE WHERE id = 3; -- Marcar el libro como no disponible si lo prestas aquí



-- Primero, asegurémonos de que el libro que vamos a prestar esté disponible.
-- En un escenario real, esto se manejaría en la API, pero para inserción manual es bueno verificar.
UPDATE Libros
SET disponible = TRUE
WHERE id = 3; -- Cambia 3 por el ID del libro que quieres prestar si es diferente

-- Insertar un préstamo para un usuario y un libro específicos
-- Asumimos que el usuario con ID 1 (Ana García) y el libro con ID 3 (1984) existen.
INSERT INTO Prestamos (id_usuario, id_libro, fecha_prestamo, fecha_devolucion) VALUES
(1, 3, NOW(), NULL); -- 'NOW()' registra la fecha y hora actual, NULL indica que está activo

-- IMPORTANTE: Una vez que el libro es prestado, actualiza su estado a NO disponible.
-- Esta lógica la maneja la API automáticamente al usar el endpoint de préstamo,
-- pero para una inserción manual, debes hacerlo aquí también para mantener la coherencia.
UPDATE Libros
SET disponible = FALSE
WHERE id = 3; -- Cambia 3 por el ID del libro que prestaste