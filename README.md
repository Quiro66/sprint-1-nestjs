# Sprint-1 - Adopción de Dragones

## Integrantes de equipo:

- Sharon Ortiz - @SOrtizRamirez
- David Zapata - @DavidZapata1312
- Juan Quiroz - @Quiro66

## Objetivo del Sprint

Desarrollar una API REST completa que permita a usuarios autenticados gestionar sus tareas personales mediante operaciones CRUD, con validaciones robustas, documentación Swagger y tests automatizados.

## Epic — API REST de Adopción de Dragones

Como desarrollador del equipo,
quiero construir una API REST en NestJS que permita crear, leer, actualizar y eliminar recursos relacionados con dragones y cuidadores,
para gestionar un sistema de adopción en el que cada dragón tenga un único cuidador activo,
con autenticación, validación, control de roles (admin/cuidador) y persistencia en PostgreSQL.

## 🎯 Contexto de negocio

El sistema “DragonKeep” busca conectar dragones en busca de hogar con cuidadores responsables.  
Cada dragón tiene un perfil (edad, raza, tipo de fuego, nivel de agresividad, etc.) y solo puede ser adoptado por un cuidador a la vez.  
Los cuidadores deben registrarse, cumplir ciertos requisitos y mantener un registro de las adopciones activas o finalizadas.  
Los administradores supervisan las adopciones, aprueban o revocan permisos y manejan reportes de bienestar.

## 🧱 HU-1 — Configurar base de datos, entidades y seeder inicial

**Como desarrollador**,  
quiero crear las tablas base y registrar algunos dragones iniciales  
**para iniciar el desarrollo y pruebas del sistema.**

### Endpoints/Migraciones
- Base de datos PostgreSQL
- Entidades: `Dragon`, `Caretaker`, `Adoption`

### 🔹 Issues HU-1

**Issue 1: Crear migraciones iniciales**
- [ ] Entidades: `dragons`, `caretakers`, `adoptions`
- [ ] Relaciones (1-n entre caretaker y adoption, n-1 entre adoption y dragon)
- [ ] Estados base (`available`, `adopted`, `inactive`)

**Issue 2: Seeder de datos**
- [ ] Crear seeder con 2–3 dragones de prueba
- [ ] Crear 1 admin y 1 caretaker demo
- [ ] Configurar script `npm run seed`

**Issue 3: Configuración inicial de módulo TypeORM**
- [ ] Integrar `TypeOrmModule` global
- [ ] Usar `.env` para credenciales
- [ ] Probar conexión y sincronización

---

## 🔐 HU-2 — Autenticación, roles y protección de rutas

**Como usuario**,  
quiero registrarme e iniciar sesión con JWT  
**para acceder según mi rol (admin o caretaker).**

### Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

### 🔹 Issues HU-2

**Issue 1: Registro y login con JWT**
- [ ] `bcrypt` para contraseñas
- [ ] `JWT` con payload `{ sub: userId, role }`
- [ ] Validar duplicados de email

**Issue 2: Guards y roles**
- [ ] `JwtAuthGuard`
- [ ] `RolesGuard`
- [ ] Decorador `@Roles()`

**Issue 3: Refresh y logout**
- [ ] Guardar refresh en BD
- [ ] Endpoint `/auth/refresh`
- [ ] Logout revoca token

---

## 🐲 HU-3 — Gestión de dragones (solo admin)

**Como administrador**,  
quiero registrar, listar y ver dragones  
**para mantener actualizado el catálogo.**

### Endpoints
- `POST /dragons`
- `GET /dragons?status=available&page=1&limit=10`
- `GET /dragons/:id`

### 🔹 Issues HU-3

**Issue 1: DTOs**
- [ ] `CreateDragonDto`, `ListDragonsQueryDto`, `DragonDetailDto`
- [ ] Validar tipos: `fire | ice | earth | storm`
- [ ] Defaults: `status = available`

**Issue 2: Controlador y servicio**
- [ ] `findAll()` con filtros (tipo, edad, estado)
- [ ] `findOne(id)` con cuidador si está adoptado
- [ ] `create()` validando duplicado por nombre

**Issue 3: Pruebas y seeder**
- [ ] Tests e2e para listar, filtrar y crear
- [ ] Migración y seeder de dragones iniciales

---

## 🪶 HU-4 — Adopciones (crear, aprobar y liberar)

**Como cuidador autenticado**,  
quiero solicitar, aprobar o liberar adopciones  
**para gestionar la relación con los dragones.**

### Endpoints
- `POST /adoptions`
- `POST /adoptions/:id/approve`
- `PATCH /adoptions/:id/release`

### 🔹 Issues HU-4

**Issue 1: Crear entidad y endpoint /adoptions**
- [ ] `Adoption` con `caretakerId`, `dragonId`, `adoptedAt`, `releasedAt`
- [ ] Validar que el dragón esté disponible
- [ ] Extraer `caretakerId` del JWT

**Issue 2: Flujo de aprobación y liberación**
- [ ] `approve`: cambia `status = adopted`, guarda `adoptedAt`
- [ ] `release`: valida cuidador, cambia a `available`, guarda `releasedAt`
- [ ] Registro histórico (no eliminar datos)

**Issue 3: Concurrencia**
- [ ] Transacción DB o lock al adoptar
- [ ] Simular adopciones simultáneas
- [ ] Validar respuesta `409 Conflict`

---

## 🐾 HU-5 — Ver mis dragones adoptados

**Como cuidador autenticado**,  
quiero listar los dragones que he adoptado  
**para consultar su estado y fechas de adopción.**

### Endpoint
- `GET /caretakers/:id/dragons`

### 🔹 Issues HU-5

**Issue 1: Endpoint y permisos**
- [ ] Validar que `userId === :id`
- [ ] Admin puede ver todos
- [ ] Soportar paginación y filtros (`active`, `finished`)

**Issue 2: Servicio**
- [ ] Consultar adopciones activas
- [ ] Incluir datos básicos del dragón
- [ ] Mostrar `adoptedAt` y `releasedAt`

**Issue 3: Tests**
- [ ] Caretaker A no puede ver dragones de B (403)
- [ ] Admin accede correctamente

---

## 🧍‍♂️ HU-6 — Gestión de cuidadores (solo admin)

**Como administrador**,  
quiero ver, editar o eliminar cuidadores  
**para mantener la seguridad del sistema.**

### Endpoints
- `GET /caretakers`
- `PATCH /caretakers/:id`
- `DELETE /caretakers/:id`

### 🔹 Issues HU-6

**Issue 1: CRUD de cuidadores**
- [ ] Implementar endpoints base con rol admin
- [ ] Soportar paginación

**Issue 2: Validar eliminación**
- [ ] Revisar adopciones activas antes de eliminar
- [ ] Si existen, devolver `409 Conflict` con lista de dragones

**Issue 3: Log de auditoría**
- [ ] Registrar `adminId`, acción, `caretakerId`, timestamp
- [ ] Guardar log en archivo o consola

---

## 📑 HU-7 — Validación global, documentación y auditoría

**Como desarrollador**,  
quiero validar solicitudes y documentar toda la API  
**para garantizar trazabilidad y control.**

### 🔹 Issues HU-7

**Issue 1: Validaciones globales**
- [ ] `ValidationPipe` global
- [ ] Mensajes de error personalizados
- [ ] Uso obligatorio de DTOs

**Issue 2: Documentación Swagger**
- [ ] Integrar `@nestjs/swagger`
- [ ] Documentar DTOs y endpoints
- [ ] Configurar autenticación JWT en Swagger

**Issue 3: Interceptor de auditoría**
- [ ] Interceptor global que registre acción, usuario y timestamp
- [ ] Guardar en archivo o BD

---

## 🚀 Orden sugerido de desarrollo

1️⃣ **HU-1:** BD + entidades + seeder  
2️⃣ **HU-2:** Auth + roles + guards  
3️⃣ **HU-3:** CRUD básico de dragones  
4️⃣ **HU-4:** Sistema de adopciones  
5️⃣ **HU-5:** Ver dragones adoptados  
6️⃣ **HU-6:** Gestión de cuidadores  
7️⃣ **HU-7:** Validaciones + Swagger + Logs

---

