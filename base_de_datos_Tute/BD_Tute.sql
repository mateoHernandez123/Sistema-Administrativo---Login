create database SSAA2;
use SSAA2;

-- Tabla Roles:
create table roles
(
	idrol int not null auto_increment primary key,
    tipo varchar(45) not null
);
ALTER TABLE roles
ADD CONSTRAINT tipo_uniquetipo UNIQUE (tipo);


-- Tabla usuarios: 
create table usuarios
(
	idusuarios INT NOT NULL AUTO_INCREMENT primary key,
    email varchar(45) not null unique,
	nombre_usuario VARCHAR(45) NOT NULL,
	contrasenia VARCHAR(100) NOT NULL,
	roles_idrol INT NOT NULL,
    constraint `fk_usuarios_roles`
    foreign key (`roles_idrol`)
    references`roles`(`idrol`)
);

SELECT * FROM usuarios;
use SSAA2;

-- Tabla de permisos: 

create table permisos(
idpermiso int auto_increment primary key,
nombre varchar(50) unique not null
);
SELECT * FROM permisos;
-- Tabla Roles Permisos: 
create table roles_permisos(
	rol_id int not null,
    permiso_id int not null,
    valor boolean not null,
    constraint `fk_rp_roles` foreign key (rol_id) references roles(idrol),
    constraint `fk_rp_permisos` foreign key (permiso_id) references permisos (idpermiso),
    primary key (rol_id, permiso_id)
);
SELECT * FROM roles_permisos;

-- Tabla Cuentas: 
CREATE TABLE cuentas (
  idcuentas INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  tipo ENUM('A', 'P', 'PN', 'R+', 'R-') NOT NULL,
  recibe_saldo boolean not null,
  codigo varchar(20) not null,
  descripcion varchar(255) not null,
  activa boolean not null,
  padre_id INT,
  FOREIGN KEY (padre_id) REFERENCES cuentas(idcuentas)
);

Alter table cuentas add column monto_actual double(10,2) not null default 0;
SELECT * FROM cuentas;

alter table cuentas add constraint UQ_codigo unique (codigo);
alter table cuentas add CONSTRAINT UQ_nombre_recibe_saldo unique (nombre,recibe_saldo);


-- Tabla Asiento: 

CREATE TABLE asientos (
  idasiento INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  descripcion VARCHAR(50),
  usuario_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios (idusuarios),
  CONSTRAINT uq_fecha_hora UNIQUE (fecha, hora)
);

-- Tabla cuenta_asiento: 
CREATE TABLE cuenta_asiento (
  asiento_id int NOT NULL,
  cuenta_id int NOT NULL,
  saldo int NOT NULL default 0,
  debe int NOT NULL,
  haber int NOT NULL,
  FOREIGN KEY (asiento_id) REFERENCES asientos (idasiento),
  FOREIGN KEY (cuenta_id) REFERENCES cuentas (idcuentas)
);

-- Tabla proveedores:

create table proveedores(
	idproveedor int not null primary key auto_increment,
    nombre varchar(100) not null,
    cuit varchar(20) not null unique,
    razon_social varchar(100) not null,
    telefono VARCHAR(20) not null, 
    correo VARCHAR(100) not null, 
    direccion VARCHAR(200) not null, 
    ciudad VARCHAR(100) not null, 
    provincia VARCHAR(100) not null, 
    codigo_postal VARCHAR(10) not null, 
    banco VARCHAR(100) not null, 
    nro_cuenta VARCHAR(22) not null,
    cbu varchar(22) not null,
    tipo_proveedor VARCHAR(50) not null, 
    rubro VARCHAR(100) not null, 
    calificacion INT , 
    comentarios text,
    activo boolean not null
);

-- Tablas productos:

create table productos(
	idproducto int auto_increment not null primary key,
    codigo varchar(25) not null unique,
    codigo_barra varchar(15) not null unique,
    activo boolean not null,
    nombre varchar(100) not null,
    marca varchar(50) not null,
    modelo varchar(50) not null,
    precio_venta double not null,
    precio_compra double not null,
    iva_porcentaje int not null,
    stock_actual int not null,
    stock_minimo int not null,
    stock_maximo int not null,
    punto_reposicion varchar(3) not null,
    categoria varchar(50) not null,
    almacen varchar(20) not null,
    url_imagen varchar(100) not null
);

-- precio_compra double not null,

-- Si tienen registros, para no borrar los datos hagan
-- ALTER TABLE productos add descripcion text;
-- ALTER TABLE productos drop column precio_compra;

-- Tabla N a N de productos y proveedores

create table producto_proveedor(
	producto_id int not null,
    proveedor_id int not null,
    constraint `UQ_producto_proveedor` unique(producto_id, proveedor_id),
    constraint `FK_producto_producto_proveedor` foreign key(producto_id) references productos(idproducto),
    constraint `FK_proveedor_producto_proveedor` foreign key(proveedor_id) references proveedores(idproveedor)
);

-- Tabla de historial de compras
create table historial_compra(
	idhistorialcompra int auto_increment primary key not null,
    producto_id int not null,
    proveedor_id int not null,
    fecha_hora datetime not null,
    cantidad int not null,
    precio_unitario double not null,
    constraint `FK_historial_compra_proveedor`
    foreign key (proveedor_id) references proveedores(idproveedor),
    constraint `FK_historial_compra_producto` 
    foreign key (producto_id) references productos(idproducto)
);


/*
INSERT INTO historial_compra (producto_id, proveedor_id, fecha_hora, cantidad, precio_unitario) VALUES (..., ..., '2025-03-01 17:13:00', ..., ...);

SELECT 
    producto_id, 
    proveedor_id, 
    DATE_FORMAT(fecha_hora, '%Y-%m-%d %H:%i:%s') AS fecha_formateada, 
    cantidad, 
    precio_unitario 
FROM historial_compra;
*/

create table solicitud_compra(
	idsolicitud int auto_increment not null primary key,
    codigo varchar(20) not null,
    constraint `UQ_solicitud_compra_codigo` unique (codigo),
    fecha datetime not null,
    obvservacion text,
    usuario_id int not null,
    constraint `FK_solicitud_compra_usuario` foreign key (usuario_id) references usuarios(idusuarios)
);

create table presupuesto_compra(
	idpresupuesto int auto_increment not null primary key,
    codigo varchar(20) not null,
    constraint `UQ_presupuesto_compra_codigo` unique (codigo),
    fecha datetime not null,
    activo boolean not null,
    proveedor_id int not null,
    constraint `FK_presupuesto_compra_proveedor` foreign key (proveedor_id) references proveedores(idproveedor),
    usuario_id int not null,
    constraint `FK_presupuesto_compra_usuario` foreign key (usuario_id) references usuarios(idusuarios)
);

create table orden_compra(
	idorden int auto_increment not null primary key,
    codigo varchar(20) not null,
    constraint `UQ_orden_compra_codigo` unique (codigo),
    fecha datetime not null,
    subtotal double not null,
    iva double not null,
    total double not null,
    forma_pago varchar(50) not null,
    plazo_pago varchar(50) not null,
    envio boolean not null,
    fecha_entrega date,
    lugar_entrega varchar(100),
    obvservaciones text,
    usuario_id int not null,
    constraint `FK_orden_compra_usuario` foreign key (usuario_id) references usuarios(idusuarios),
    presupuesto_id int not null,
    constraint `FK_orden_compra_presupuesto` foreign key (presupuesto_id) references presupuesto_compra(idpresupuesto)
);

create table estado_pedido(
	valor int not null primary key,
    nombre_estado varchar(15) not null
);
INSERT INTO estado_pedido (valor, nombre_estado) VALUES
(1, 'Pendiente'),
(2, 'Presupuestado'),
(3, 'Comprometido'),
(4, 'Ingresado'),
(5, 'Finalizado'),
(6, 'Cancelado');

create table pedido_compra(
	idpedido int auto_increment not null primary key,
	codigo varchar(20) not null,
    constraint `UQ_pedido_compra_codigo` unique (codigo),
    cantidad int not null,
    precio_unitario double,
    estado int not null,
    constraint `FK_pedido_compra_estado` foreign key (estado) references estado_pedido(valor),
    solicitud_id int not null,
    constraint `FK_pedido_compra_solicitud` foreign key (solicitud_id) references solicitud_compra(idsolicitud),
    producto_id int not null,
    constraint `FK_pedido_compra_producto` foreign key (producto_id) references productos(idproducto),
    orden_id int,
    constraint `FK_pedido_compra_orden` foreign key (orden_id) references orden_compra(idorden)
);

create table historial_pedido(
	idhistorial_pedido int not null auto_increment primary key,
	pedido_id int not null,
    constraint `FK_historial_pedido_pedido_compra` foreign key (pedido_id) references pedido_compra(idpedido),
    fecha datetime not null,
    cantidad_anterior int,
    cantidad_actual int not null,
    precio_unitario_anterior double,
    precio_unitario_actual double,
    estado_anterior int,
    constraint `FK_historial_pedido_compra_estado_anterior` foreign key (estado_anterior) references estado_pedido(valor),
    estado_actual int not null,
    constraint `FK_historial_pedido_compra_estado_actual` foreign key (estado_actual) references estado_pedido(valor),
    usuario_id_anterior int ,
    constraint `FK_historial_pedido_usuario_anterior` foreign key (usuario_id_anterior) references usuarios(idusuarios),
    usuario_id_actual int not null,
    constraint `FK_historial_pedido_usuario_actual` foreign key (usuario_id_actual) references usuarios(idusuarios)
);

create table presupuesto_pedido(
	idpresupuesto_pedido int not null auto_increment primary key,
	presupuesto_id int not null,
    constraint `FK_presupuesto_pedido_presupuesto` foreign key (presupuesto_id) references presupuesto_compra(idpresupuesto),
    pedido_id int not null,
    constraint `FK_presupuesto_pedido_pedido` foreign key (pedido_id) references pedido_compra(idpedido)
);

create table remito(
	idremito int auto_increment primary key not null,
    fecha datetime not null,
    nro_remito int not null,
    constraint `UQ_remito_nro_remito` unique (nro_remito),
    orden_id int not null,
    constraint `FK_remito_orden_compra` foreign key (orden_id) references orden_compra(idorden)
);

create table remito_pedido(
	idremito_pedido int not null auto_increment primary key,
	remito_id int not null,
    constraint `FK_remito_pedido_remito` foreign key (remito_id) references remito(idremito),
    pedido_id int not null,
    constraint `FK_remito_pedido_pedido` foreign key (pedido_id) references pedido_compra(idpedido),
    cantidad int not null
);

create table factura(
	idfactura int not null auto_increment primary key,
    fecha datetime not null,
    nro_factura int not null,
    constraint `UQ_factura_nro_factura` unique (nro_factura),
    orden_id int not null,
    constraint `FK_factura_orden_compra` foreign key (orden_id) references orden_compra(idorden)
);

create table factura_pedido(
	idfactura_pedido int not null auto_increment primary key,
	factura_id int not null,
    constraint `FK_factura_pedido_factura` foreign key (factura_id) references factura(idfactura),
    pedido_id int not null,
    constraint `FK_factura_pedido_pedido` foreign key (pedido_id) references pedido_compra(idpedido),
    cantidad int not null
);


--------------------------------------- INSERTS / UPDATES / DELETES -----------------------------------------

INSERT INTO roles(tipo)
VALUES ("admin");

UPDATE roles
SET tipo = 'basico' -- Lo tenia como admin antes
WHERE idrol = 2;
SELECT * FROM roles;

INSERT INTO usuarios (mail, nombre_usuario, contrasenia, roles_idrol)
VALUES ('mateo@hernandez', 'mateo', '173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705', 1);

INSERT INTO usuarios (mail, nombre_usuario, contrasenia, roles_idrol)
VALUES ('franco@liciaga', 'Franco Liciaga', '173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705', 2);

INSERT INTO usuarios (mail, nombre_usuario, contrasenia, roles_idrol)
VALUES ('leandro@chivel', 'Leandro Chivel', '173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705', 1);

INSERT INTO usuarios (mail, nombre_usuario, contrasenia, roles_idrol)
VALUES ('fernando@balbi', 'Fernando Balbi', '173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705', 2);



UPDATE usuarios  set contrasenia = '173af653133d964edfc16cafe0aba33c8f500a07f3ba3f81943916910c257705' where mail = 'mateo@hernandez'; 


insert into permisos(nombre)
values('Cuentas'), ('Asientos'), ('Diarios'), ('Mayores'), ('Resultados'), ('Usuarios'),('Proveedores');

/*INSERTS DE Productos*/

insert into permisos(nombre)
values('Productos');

insert into roles_permisos(rol_id, permiso_id, valor)
values(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Productos' ),
    1
);

select * from roles_permisos;

insert into roles_permisos(rol_id, permiso_id, valor)
values(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Proveedores' ),
    1
);

insert into roles_permisos(rol_id, permiso_id, valor)
values
(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Cuentas' ),
    1
),
(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Asientos' ),
    1
),
(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Diarios' ),
    1
),
(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Mayores' ),
    1
),
(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Resultados' ),
    1
),
(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Usuarios' ),
    1
),
(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'Proveedores' ),
    1
),
(
	(select idrol from roles where tipo = 'basico' ),
    (select idpermiso from permisos where nombre = 'Cuentas' ),
    0
),
(
	(select idrol from roles where tipo = 'basico' ),
    (select idpermiso from permisos where nombre = 'Asientos' ),
    1
),
(
	(select idrol from roles where tipo = 'basico' ),
    (select idpermiso from permisos where nombre = 'Diarios' ),
    0
),
(
	(select idrol from roles where tipo = 'basico' ),
    (select idpermiso from permisos where nombre = 'Mayores' ),
    0
),
(
	(select idrol from roles where tipo = 'basico' ),
    (select idpermiso from permisos where nombre = 'Resultados' ),
    0
),
(
	(select idrol from roles where tipo = 'basico' ),
    (select idpermiso from permisos where nombre = 'Usuarios' ),
    0
);


insert into cuentas(nombre, tipo, recibe_saldo, codigo, descripcion, activa)
values
('Activo', 'A', 0, '1', 'Cuenta padre de los Activos', 1),
('Pasivo', 'P', 0, '2', 'Cuenta padre de los Pasivos', 1), 
('Patrimonio Neto', 'PN', 0, '3', 'Cuenta padre de Patrimonio Neto', 1),
('Resultados Positivos', 'R+', 0, '4', 'Cuenta padre de los Resultados Positivos', 1),
('Resultados Negativos', 'R-', 0, '5', 'Cuenta padre de los Resultados Negativos', 1);


insert into cuentas(nombre, tipo, recibe_saldo, codigo, descripcion, activa, padre_id)
values('Cajas y Bancos', 'A', 0, '1.1', 'Subcategoria de Activo que engloba caja y banco', 1, (select c.idcuentas from cuentas as c where c.nombre = 'Activo'));


insert into permisos(nombre)
values('SolicitudCompra');

insert into roles_permisos(rol_id, permiso_id, valor)
values(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'SolicitudCompra' ),
    1
);

insert into permisos(nombre)
values('PresupuestoCompra');

insert into roles_permisos(rol_id, permiso_id, valor)
values(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'PresupuestoCompra' ),
    1
);

insert into permisos(nombre)
values('OrdenCompra');

insert into roles_permisos(rol_id, permiso_id, valor)
values(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'OrdenCompra' ),
    1
);

SELECT * FROM permisos;

insert into permisos(nombre)
values('RemitoCompra');

insert into roles_permisos(rol_id, permiso_id, valor)
values(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'RemitoCompra' ),
    1
);

insert into permisos(nombre)
values('FacturaCompra');

insert into roles_permisos(rol_id, permiso_id, valor)
values(
	(select idrol from roles where tipo = 'admin' ),
    (select idpermiso from permisos where nombre = 'FacturaCompra' ),
    1
);
------------------------------------------- SELECT ---------------------------------------------------------

-- Obtener los permisos de un usuario mediante el mail
select  p.nombre, rp.valor  
from roles as r inner join roles_permisos as rp on rp.rol_id = r.idrol 
    inner join permisos as p 
        on rp.permiso_id = p.idpermiso 
where r.idrol= (select u.roles_idrol 
                from usuarios as u 
                    where mail = 'email');

SELECT * FROM cuentas;

