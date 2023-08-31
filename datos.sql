-- Insertar registros en la tabla mesas
INSERT INTO mesas (capacidad, estado) VALUES 
(4, 'Disponible'), (4, 'Disponible'), (4, 'Disponible'), (4, 'Disponible'),
(4, 'Disponible'), (4, 'Disponible'), (4, 'Disponible'), (4, 'Disponible'), 
(4, 'Disponible'), (4, 'Disponible');

INSERT INTO medios_de_pago (nombre) VALUES 
('Efectivo'), ('Tarjeta'), ('Nequi'), ('Transferencia');

-- Insertar registros en la tabla categorias
INSERT INTO categorias (nombre) VALUES 
('Cerveza'), ('Aguardiente'), ('Bebidas'),('Ron'),('Whisky'),('Tequila'), ('Snacks'), ('Adicionales'), ('Hamburguesas');

-- Insertar registros en la tabla productos
INSERT INTO productos (nombre, precio_unitario, cantidad_disponible, categoria_id) VALUES
('Club colombia', 5000, 10, 1),
('Costeña bacana ', 3000, 10, 1),
('Poker', 4000, 10, 1),
('Aguila', 4000, 10, 1),
('Aguila light', 4000, 10, 1),
('Smirnoff', 10000, 10, 1),
('Budweiser', 4000, 10, 1),
('Corona', 10000, 10, 1),
('Coronita', 5000, 10, 1),

('Tapa azul', 40000, 10, 2),
('Tapa negra', 40000, 10, 2),
('Tapa verde', 40000, 10, 2),

('Gatorade', 5000, 10, 3),
('Agua carbonatada', 3000, 10, 3),
('Speed max', 5000, 10, 3),
('Colombiana', 4000, 10, 3),
('Jugo hit', 5000, 10, 3),
('Agua knela', 3000, 10, 3),
('Coca-Cola', 4000, 10, 3),

('Viejo de caldas', 50000, 10, 4),

('Jose cuervo 750ml', 200000, 10, 6),
('Jose cuervo 375ml', 120000, 10, 6),

('Buchanan\'s', 230000, 10, 5),

('De todito', 4000, 10, 7),
('Margaritas', 3000, 10, 7),
('Kythos', 2000, 10, 7),
('Chicles', 500, 10, 7),
('Cigarrilos', 1000, 10, 7),

('Michelada', 2000, 10, 8),
('Hamburguesa Americana', 9000, 20, 9);

-- Insertar registros en la tabla clientes
INSERT INTO clientes (nombre, telefono, email) VALUES ('Jose Bautista', '3012235489', 'josebautiista@gmail.com');

INSERT INTO ingredientes (nombre, cantidad, unidad_medida, precio_compra) VALUES
('Club colombia', 10, 'ml',  2000),
('Costeña bacana ', 10, 'ml',  2000),
('Poker', 10, 'ml',  2000),
('Aguila', 10, 'ml',  2000),
('Aguila light',10, 'ml',  2000),
('Smirnoff', 10, 'ml',  2000),
('Budweiser', 10, 'ml',  2000),
('Corona', 10, 'ml',  2000),
('Coronita', 10, 'ml',  2000),
('Tapa azul', 10, 'ml',  2000),
('Tapa negra',10, 'ml',  2000),
('Tapa verde', 10, 'ml',  2000),
('Gatorade', 10, 'ml',  2000),
('Agua carbonatada', 10, 'ml',  2000),
('Speed max', 10, 'ml',  2000),
('Colombiana', 10, 'ml',  2000),
('Jugo hit', 10, 'ml',  2000),
('Agua knela', 10, 'ml',  2000),
('Coca-Cola', 10, 'ml',  2000),
('Viejo de caldas', 10, 'ml',  2000),
('Jose cuervo 750ml', 10, 'ml',  2000),
('Jose cuervo 375ml', 10, 'ml',  2000),
('Buchanan\'s', 10, 'ml',  2000),
('De todito', 10, 'ml',  2000),
('Margaritas', 10, 'ml',  2000),
('Kythos', 10, 'ml',  2000),
('Chicles',10, 'ml',  2000),
('Cigarrilos', 10, 'ml',  2000),
('Michelada', 10, 'ml',  2000),
('Carne hamburguesa', 100, 'unidad', 1000), 
('Tomate', 100, 'kg', 2000),
('Pan hamburguesa', 100, 'unidad', 1000),
('Maiz tierno', 100, 'kg', 10000),
('Salsa tomate', 100, 'kg', 10000);

INSERT INTO producto_ingrediente (producto_id, ingrediente_id, cantidad_ingrediente) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(11, 11, 1),
(12, 12, 1),
(13, 13, 1),
(14, 14, 1),
(15, 15, 1),
(16, 16, 1),
(17, 17, 1),
(18, 18, 1),
(19, 19, 1),
(20, 20, 1),
(21, 21, 1),
(22, 22, 1),
(23, 23, 1),
(24, 24, 1),
(25, 25, 1),
(26, 26, 1),
(27, 27, 1),
(28, 28, 1),
(29, 29, 1),
(30, 30, 1),
(30, 31, 1),
(30, 32, 1),
(30, 33, 1),
(30, 34, 1)
;
