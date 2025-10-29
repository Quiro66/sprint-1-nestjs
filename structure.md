src/
├── app.module.ts
├── main.ts
│
├── config/
│   ├── database.config.ts        # Variables y setup de TypeORM
│   ├── jwt.config.ts             # Configuración de JWT (expiración, secretos)
│   └── swagger.config.ts         # Configuración de Swagger
│
├── common/
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── user.decorator.ts     # Extraer usuario del token
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   └── audit.interceptor.ts  # Auditoría global (HU-7)
│   ├── pipes/
│   │   └── validation.pipe.ts    # ValidationPipe global
│   ├── constants/
│   │   └── roles.constant.ts
│   ├── enums/
│   │   ├── dragon-status.enum.ts
│   │   └── fire-type.enum.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── utils/
│       └── date.utils.ts
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dtos/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── refresh.strategy.ts
│   └── entities/
│       └── user.entity.ts
│
├── dragons/
│   ├── dragons.module.ts
│   ├── dragons.controller.ts
│   ├── dragons.service.ts
│   ├── dtos/
│   │   ├── create-dragon.dto.ts
│   │   ├── list-dragons-query.dto.ts
│   │   └── dragon-detail.dto.ts
│   └── entities/
│       └── dragon.entity.ts
│
├── caretakers/
│   ├── caretakers.module.ts
│   ├── caretakers.controller.ts
│   ├── caretakers.service.ts
│   ├── dtos/
│   │   └── update-caretaker.dto.ts
│   └── entities/
│       └── caretaker.entity.ts
│
├── adoptions/
│   ├── adoptions.module.ts
│   ├── adoptions.controller.ts
│   ├── adoptions.service.ts
│   ├── dtos/
│   │   └── create-adoption.dto.ts
│   └── entities/
│       └── adoption.entity.ts
│
├── seed/
│   ├── seed.module.ts
│   ├── seed.service.ts
│   └── data/
│       ├── dragons.seed.ts
│       └── users.seed.ts
│
└── shared/
├── base.entity.ts            # Campos comunes (id, createdAt, updatedAt)
└── pagination.dto.ts
