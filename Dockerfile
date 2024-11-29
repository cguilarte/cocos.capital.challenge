# Etapa base
FROM node:22.11.0-bullseye-slim  as base

# Establecer zona horaria en UTC
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Crear directorio de trabajo
WORKDIR /app

COPY package*.json ./
# Instalar dependencias necesarias para la construcción
RUN npm install
RUN npm run build

COPY . .

# Exponer puerto
EXPOSE 9001
 
# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]