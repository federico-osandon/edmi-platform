# API de Cursos - Documentación

## Endpoint: Crear Curso

**POST** `/api/courses`

### Autenticación
Requiere token de autenticación en el header:
```
Authorization: Bearer mock-token-{userId}
```

### Permisos
Solo usuarios con rol `superadmin` o `admin` pueden crear cursos.

### Body (JSON)

#### Campos requeridos:
- `title` (string): Título del curso

#### Campos opcionales:
- `slug` (string): URL-friendly slug (se genera automáticamente desde el título si no se proporciona)
- `description` (string): Descripción del curso
- `teacherId` (number): ID del profesor (por defecto usa el ID del usuario autenticado)
- `category` (string): Categoría del curso
- `level` (string): Nivel del curso (`beginner`, `intermediate`, `advanced`)
- `capacity` (number): Capacidad máxima de estudiantes (default: 0)
- `startAt` (string/date): Fecha de inicio del curso
- `endAt` (string/date): Fecha de fin del curso
- `published` (boolean): Si el curso está publicado (default: false)
- `thumbnailUrl` (string): URL de la imagen del curso
- `language` (string): Idioma del curso
- `priceCents` (number): Precio en centavos
- `currency` (string): Moneda del precio
- `requirements` (string): Requisitos previos
- `isOnline` (boolean): Si el curso es en línea (default: true)
- `location` (string): Ubicación física del curso

### Ejemplo de Request:

```json
{
  "title": "Introducción a la Programación",
  "description": "Curso básico de programación para principiantes",
  "level": "beginner",
  "capacity": 30,
  "startAt": "2025-01-15T09:00:00Z",
  "endAt": "2025-03-15T17:00:00Z",
  "published": true,
  "isOnline": true,
  "language": "español",
  "category": "Tecnología"
}
```

### Ejemplo de Response exitoso:

```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "id": 1,
    "title": "Introducción a la Programación",
    "slug": "introduccion-a-la-programacion",
    "description": "Curso básico de programación para principiantes",
    "teacherId": 2,
    "category": "Tecnología",
    "level": "beginner",
    "capacity": 30,
    "startAt": "2025-01-15T09:00:00.000Z",
    "endAt": "2025-03-15T17:00:00.000Z",
    "published": true,
    "thumbnailUrl": null,
    "language": "español",
    "priceCents": null,
    "currency": null,
    "requirements": null,
    "isOnline": true,
    "location": null,
    "enrollmentCount": 0,
    "createdAt": "2025-12-10T...",
    "updatedAt": "2025-12-10T...",
    "createdBy": 2,
    "updatedBy": 2,
    "deletedAt": null
  }
}
```

### Errores posibles:

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "statusMessage": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "statusMessage": "Forbidden: Insufficient permissions"
}
```

#### 400 Bad Request - Campo requerido faltante
```json
{
  "statusCode": 400,
  "statusMessage": "Validation error",
  "data": {
    "errors": ["title is required"]
  }
}
```

#### 400 Bad Request - Fechas inválidas
```json
{
  "statusCode": 400,
  "statusMessage": "End date must be after start date"
}
```

## Endpoint: Listar Cursos

**GET** `/api/courses`

### Query Parameters:
- `all` (boolean): Si es `true`, muestra todos los cursos incluyendo no publicados (requiere ser admin)

### Ejemplo:
```
GET /api/courses
GET /api/courses?all=true
```

### Response:
```json
[
  {
    "id": 1,
    "title": "Introducción a la Programación",
    "slug": "introduccion-a-la-programacion",
    "description": "Curso básico de programación",
    "teacherId": 2,
    "teacherName": "Juan Pérez",
    "category": "Tecnología",
    "level": "beginner",
    "capacity": 30,
    "startAt": "2025-01-15T09:00:00.000Z",
    "endAt": "2025-03-15T17:00:00.000Z",
    "published": true,
    "thumbnailUrl": null,
    "language": "español",
    "priceCents": null,
    "currency": null,
    "isOnline": true,
    "location": null,
    "enrollmentCount": 0,
    "createdAt": "2025-12-10T..."
  }
]
```

## Notas sobre Soft Delete

Todos los cursos tienen un campo `deletedAt`. Los cursos "eliminados" tienen este campo con una fecha, y no se mostrarán en las consultas normales. Los registros nunca se borran físicamente de la base de datos.

## Índices creados

Para mejorar el rendimiento, se han creado los siguientes índices:
- `courses_slug_unique`: Índice único en el slug
- `courses_teacher_id_idx`: Para búsquedas por profesor
- `courses_published_idx`: Para filtrar cursos publicados
- `courses_category_idx`: Para filtrar por categoría
- `courses_start_at_idx`: Para ordenar por fecha de inicio
- `courses_deleted_at_idx`: Para filtrar registros no eliminados
