CREATE DATABASE POS;
USE POS;

CREATE TABLE Clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE Mesas (
    mesa_id INT AUTO_INCREMENT PRIMARY KEY,
    capacidad INT NOT NULL,
    estado VARCHAR(20) NOT NULL
);

CREATE TABLE Categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    cantidad_disponible INT NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(categoria_id)
);

CREATE TABLE Ventas (
    venta_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha_hora DATETIME,
    total DECIMAL(10, 2),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
);

CREATE TABLE Detalles_Venta (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT,
    valor_total DECIMAL(10 , 2 ),
    precio_venta DECIMAL(10 , 2 ),
    FOREIGN KEY (venta_id)
        REFERENCES Ventas (venta_id),
    FOREIGN KEY (producto_id)
        REFERENCES Productos (producto_id)
);

CREATE TABLE Carrito_Compras (
    carrito_id INT AUTO_INCREMENT PRIMARY KEY,
    mesa_id INT,
    producto_id INT,
    cantidad INT,
    precio_venta DECIMAL(10, 2),
    FOREIGN KEY (mesa_id) REFERENCES Mesas(mesa_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);
