# Demo Dockploy - Hello World

Aplicación de demostración para aprender a desplegar con Docker y Dockploy usando **Docker Compose**.

## 🎯 Características

- ✅ Aplicación Node.js + Express simple
- 🐳 Totalmente dockerizada con **Docker Compose**
- 📁 Soporte para subdirectorios configurables (ej: `/DemoDockploy`)
- 🏥 Health checks integrados
- 🎨 Interfaz web moderna y responsive
- 🔄 **Paridad local-producción**: Mismo setup en desarrollo y producción

## 🚀 Desarrollo Local

### Opción 1: Docker Compose Local (Recomendado)

```bash
# Usar la configuración local (sin subdirectorio)
docker-compose -f docker-compose.local.yml up --build

# Acceder en: http://localhost:3000
```

### Opción 2: Docker Compose Producción (para probar)

```bash
# Usar la configuración de producción (con subdirectorio)
docker-compose up --build

# Acceder en: http://localhost:3000/DemoDockploy
```

### Opción 3: Con Node.js directamente

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Acceder en: http://localhost:3000
```

## 🐳 Comandos Docker Compose Útiles

```bash
# Levantar en background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs solo de la app
docker-compose logs -f app

# Parar servicios
docker-compose stop

# Parar y eliminar contenedores
docker-compose down

# Rebuild forzado
docker-compose up --build --force-recreate

# Ver estado de servicios
docker-compose ps
```

## 📦 Despliegue en Dockploy

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas paso a paso.

**Resumen rápido:**
1. Crear proyecto en Dockploy
2. Seleccionar **"Compose"** como tipo de servicio
3. Conectar con GitHub: `https://github.com/IT-DAG/DemoDockploy.git`
4. Dockploy ejecutará automáticamente `docker-compose up`

## 🌐 Acceso

### Desarrollo Local
- Sin subdirectorio: `http://localhost:3000`
- Con subdirectorio: `http://localhost:3000/DemoDockploy`
- Health check: `http://localhost:3000/health` o `http://localhost:3000/DemoDockploy/health`

### Producción (Dockploy)
- URL: `http://dockploy.domingoalonsoit.com/DemoDockploy`
- Health check: `http://dockploy.domingoalonsoit.com/DemoDockploy/health`
- API Info: `http://dockploy.domingoalonsoit.com/DemoDockploy/api/info`

## 🔧 Variables de Entorno

| Variable | Desarrollo | Producción | Descripción |
|----------|-----------|------------|-------------|
| `PORT` | 3000 | 3000 | Puerto interno del contenedor |
| `BASE_PATH` | ` ` (vacío) | `/DemoDockploy` | Ruta base para subdirectorios |
| `NODE_ENV` | development | production | Entorno de Node.js |

## 📁 Estructura del Proyecto

```
DemoDocploy/
├── server.js                  # Servidor Express
├── package.json               # Dependencias Node.js
├── Dockerfile                 # Configuración Docker
├── docker-compose.yml         # Configuración producción
├── docker-compose.local.yml   # Configuración desarrollo local
├── .dockerignore              # Archivos excluidos de Docker
├── .gitignore                 # Archivos excluidos de Git
├── README.md                  # Este archivo
└── DEPLOYMENT.md              # Guía de despliegue en Dockploy
```

## 🔄 Diferencias Local vs Producción

| Aspecto | Local (`docker-compose.local.yml`) | Producción (`docker-compose.yml`) |
|---------|-----------------------------------|-----------------------------------|
| BASE_PATH | Vacío (raíz `/`) | `/DemoDockploy` |
| Container name | demo-dockploy-local | demo-dockploy |
| Hot reload | Habilitado (volume mount) | Deshabilitado |
| NODE_ENV | development | production |

## 🎓 Ampliando el Proyecto

### Agregando una Base de Datos

Ejemplo de cómo agregar PostgreSQL:

```yaml
# docker-compose.yml
services:
  app:
    # ... configuración existente
    environment:
      - DB_HOST=postgres
      - DB_USER=myapp
      - DB_NAME=myapp_db
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=myapp
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Ventajas de Docker Compose

- ✅ **Paridad**: Lo que funciona en local funciona en producción
- ✅ **Multi-servicio**: Fácil agregar BD, Redis, etc.
- ✅ **Versionado**: Todo en Git, infraestructura como código
- ✅ **Portable**: Migrar a otros servidores es trivial
- ✅ **Declarativo**: Configuración clara y legible

## 📝 Licencia

MIT
