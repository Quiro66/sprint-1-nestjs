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

## 📘 Historias de Usuario

### HU-1 —  Listar dragones disponibles
- Rol: cuidador autenticado
- Endpoint: `GET /dragons?status=available&page=1&limit=10`
- Criterios:
    - Sólo dragones con `status=available`.
    - Filtros por tipo (fire, ice, earth, storm) y edad.
    - Paginación.
    - Respuesta: name, breed, age, type, image, status.

### HU-2 — Registrar un dragón (solo admin)
- Rol: admin
- Endpoint: `POST /dragons`
- Campos: `name, age, type, fire_power, temperament, status` (por defecto `available`)
- Criterios:
    - Solo admins.
    - Validación de duplicados por nombre.
    - DTOs para validación de campos.

### HU-3 — Ver detalle de un dragón
- Rol: cuidador autenticado
- Endpoint: `GET /dragons/:id`
- Criterios:
    - Si está adoptado, mostrar nombre del cuidador actual.
    - Si no existe, 404.

### HU-4 — Solicitar adopción
- Rol: cuidador autenticado
- Endpoint: `POST /adoptions`
- Campos: `dragonId` (caretakerId extraído del JWT)
- Criterios:
    - Solo si dragon está `available`.
    - Al aprobarse, dragon → `adopted`; fecha de adopción registrada.
    - Si ya tiene cuidador, retornar 409 Conflict.

### HU-5 — Ver mis dragones adoptados
- Rol: cuidador autenticado
- Endpoint: `GET /caretakers/:id/dragons`
- Criterios:
    - Solo ver mis propios dragones según JWT.
    - Mostrar campos básicos y fecha de adopción.

### HU-6 — Liberar un dragón
- Rol: cuidador autenticado
- Endpoint: `PATCH /adoptions/:id/release`
- Criterios:
    - Solo el cuidador actual puede liberar.
    - Estado del dragón → `available`.
    - Registrar fecha de liberación y guardar historial de adopciones.

### HU-7 — Gestión de cuidadores (solo admin)
- Rol: admin
- Endpoints:
    - `GET /caretakers` — lista paginada
    - `PATCH /caretakers/:id` — editar
    - `DELETE /caretakers/:id` — eliminar (marcar `inactive`)
- Criterios:
    - Solo admins.
    - No eliminar si tiene dragones activos; pedir liberación primero.

### HU-8 — Autenticación y roles
- Endpoints:
    - `POST /auth/register` — registro (rol por defecto: `caretaker`)
    - `POST /auth/login` — login con JWT
- Criterios:
    - JWT incluye `role` y `userId`.
    - Guards para validación de roles.
    - Contraseñas con bcrypt.

### HU-9 — Validación, documentación y trazabilidad
- Requisitos técnicos:
    - Validaciones con `class-validator` y DTOs.
    - Documentación con `@nestjs/swagger` en `/api/docs`.
    - Interceptor de logs para auditar acciones CRUD (usuario + timestamp).

## 🧩 Extras opcionales
- Notificaciones (WebSocket o email) al adoptar/liberar.
- Historial de bienestar: evaluaciones periódicas.
- Sistema de badges para cuidadores destacados.
- Integración con IA para descripciones automáticas.

---
