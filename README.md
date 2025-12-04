# Demo Dockploy - Hello World

Aplicación de demostración para aprender a desplegar con Docker y Dockploy.

## 🎯 Características

- ✅ Aplicación Node.js + Express simple
- 🐳 Totalmente dockerizada
- 📁 Soporte para subdirectorios configurables (ej: `/DemoDockploy`)
- 🏥 Health checks integrados
- 🎨 Interfaz web moderna y responsive

## 🚀 Desarrollo Local

### Opción 1: Con Docker Compose (Recomendado)

```bash
# Construir y ejecutar
docker-compose up --build

# Acceder en el navegador
# Con subdirectorio: http://localhost:3000/DemoDockploy
# Sin subdirectorio: edita docker-compose.yml y comenta BASE_PATH
```

### Opción 2: Con Node.js directamente

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Acceder en: http://localhost:3000
```

## 🐳 Comandos Docker Útiles

```bash
# Construir la imagen
docker build -t demo-dockploy .

# Ejecutar el contenedor sin subdirectorio
docker run -p 3000:3000 demo-dockploy

# Ejecutar con subdirectorio
docker run -p 3000:3000 -e BASE_PATH=/DemoDockploy demo-dockploy

# Ver logs
docker-compose logs -f

# Parar y eliminar contenedores
docker-compose down
```

## 📦 Despliegue en Dockploy

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas paso a paso.

## 🌐 Acceso

Una vez desplegado en Dockploy:
- URL: `http://dockploy.domingoalonsoit.com/DemoDockploy`
- Health check: `http://dockploy.domingoalonsoit.com/DemoDockploy/health`
- API Info: `http://dockploy.domingoalonsoit.com/DemoDockploy/api/info`

## 🔧 Variables de Entorno

- `PORT`: Puerto en el que corre la aplicación (por defecto: 3000)
- `BASE_PATH`: Ruta base para subdirectorios (ej: `/DemoDockploy`)

## 📁 Estructura del Proyecto

```
DemoDocploy/
├── server.js           # Servidor Express
├── package.json        # Dependencias Node.js
├── Dockerfile          # Configuración Docker
├── docker-compose.yml  # Orquestación local
├── .dockerignore       # Archivos excluidos de Docker
├── .gitignore          # Archivos excluidos de Git
├── README.md           # Este archivo
└── DEPLOYMENT.md       # Guía de despliegue en Dockploy
```

## 📝 Licencia

MIT
