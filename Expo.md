# 🛡️ Autenticación y Autorización en NestJS (JWT + Guards)

## 🎯 Objetivo
Documento explicativo sobre cómo implementar y entender la seguridad en NestJS usando JWT, Passport y Guards. Incluye ejemplos prácticos y pasos para probar endpoints protegidos con roles y decoradores personalizados.

---

## 📚 Conceptos clave

### Passport
NestJS integra Passport.js para estrategias de autenticación (por ejemplo, `passport-local`, `passport-jwt`).

Ejemplo de estrategia JWT:
```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
```

### JWT (JSON Web Token)
JWT es un token firmado que permite autenticar sin mantener sesión en servidor.

- Authorization: Bearer <token>
- Ventajas: stateless, seguro (firma), portátil y rápido.

### Guards
Los Guards deciden si una petición puede ejecutarse. Nest proporciona `AuthGuard('jwt')` y permite crear Guards para control por roles.

Ejemplo:
```ts
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
@Get('users')
findAllUsers() {
  return this.userService.findAll();
}
```

### Decoradores
Facilitan acceso a datos dentro de handlers.

roles.decorator.ts:
```ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

user.decorator.ts:
```ts
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
```

### Middleware vs Guard
- Middleware: corre antes del enrutamiento; suele usarse para logging, CORS, parsing. No tiene acceso a DI.
- Guard: corre antes del handler; se usa para autenticación/autorizar; permite DI.

---

## 💻 Ejemplo práctico — Endpoints
- POST /auth/register — Registro de usuario
- POST /auth/login — Devuelve token JWT
- GET /profile — Protegido con `AuthGuard('jwt')`

Controlador de ejemplo:
```ts
@UseGuards(AuthGuard('jwt'))
@Get('profile')
getProfile(@GetUser() user) {
  return user;
}
```

---

## ⚙️ Cómo probar (rápido)
1. Instalar dependencias:
```bash
pnpm install
```
2. Levantar servidor en dev:
```bash
pnpm start:dev
```
3. Registrar usuario:
POST /auth/register
```json
{
  "username": "capu",
  "password": "123456",
  "role": "admin"
}
```
4. Login:
POST /auth/login
```json
{
  "username": "capu",
  "password": "123456"
}
```
Respuesta:
```json
{
  "access_token": "eyJhbGciOi..."
}
```
5. Probar endpoint protegido:
GET /profile
Header:
Authorization: Bearer <access_token>

---

## ✅ Buenas prácticas
- Usar variables de entorno (JWT_SECRET).
- No almacenar contraseñas en texto plano — usar bcrypt.
- Separar módulos (auth, user, guards).
- Crear Guards personalizados para roles/permisos.
- Definir expiración del token: `sign(payload, { expiresIn: '1h' })`.
- Implementar refresh tokens si se necesita persistencia de sesión.
- No incluir datos sensibles en el payload del token.

---

## 🧠 Importancia en proyectos de equipo
- Seguridad consistente en endpoints.
- Control por roles y permisos.
- Arquitectura escalable sin sesiones.
- Facilita colaboración con estándares claros.

---

## 📦 Stack
- NestJS
- Passport.js
- JWT
- TypeScript

Autor: [Tu Nombre]  
Repositorio: [Añade tu URL de GitHub aquí]  
Licencia: MIT

---

