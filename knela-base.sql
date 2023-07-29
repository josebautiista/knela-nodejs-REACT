-- Crear la base de datos knela (asegúrate de estar conectado a tu servidor de bases de datos)
CREATE DATABASE knela;

-- Usar la base de datos knela
USE knela;

-- Crear la tabla "Clientes"
CREATE TABLE Clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

-- Crear la tabla "Mesas"
CREATE TABLE Mesas (
    mesa_id INT AUTO_INCREMENT PRIMARY KEY,
    capacidad INT NOT NULL,
    estado VARCHAR(20) NOT NULL
);

-- Crear la tabla "Reservas"
CREATE TABLE Reservas (
    reserva_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    mesa_id INT,
    fecha_hora_inicio DATETIME,
    fecha_hora_fin DATETIME,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id),
    FOREIGN KEY (mesa_id) REFERENCES Mesas(mesa_id)
);

-- Crear la tabla "Categorias"
CREATE TABLE Categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Crear la tabla "Productos"
CREATE TABLE Productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    cantidad_disponible INT NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(categoria_id)
);

-- Crear la tabla "Ventas"
CREATE TABLE Ventas (
    venta_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha_hora DATETIME,
    total DECIMAL(10, 2),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
);

-- Crear la tabla "Detalles_Venta"
CREATE TABLE Detalles_Venta (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT,
    valor_total DECIMAL(10, 2),
    precio_venta DECIMAL(10, 2),
    FOREIGN KEY (venta_id) REFERENCES Ventas(venta_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);

-- Crear la tabla "Carrito_Compras"
CREATE TABLE Carrito_Compras (
    carrito_id INT AUTO_INCREMENT PRIMARY KEY,
    mesa_id INT,
    producto_id INT,
    cantidad INT,
    precio_venta DECIMAL(10, 2),
    FOREIGN KEY (mesa_id) REFERENCES Mesas(mesa_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);
