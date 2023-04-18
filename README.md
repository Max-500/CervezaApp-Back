### Bienvenido

**Instalación: **

- Debes de tener RabbitMq ejecutandose correctamente ya sea de forma local o por docker (docker run -d -v $(pwd)/rabbit-db:/var/lib/rabbitmq --hostname rabbit -p 5672:5672 -p 8081:15672 --name rabbit rabbitmq:3-management)

- Realizar el comando **npm install**

**Pasos para ejecutar: **

- Debes ejecutar primero el archivo ApiGateway.js
- - nodemon --experimental-modules ApiGateway.js
- Luego debes ejecutar Server.js
- - cd Register
- - nodemon --experimental-modules Server.js

**Nota: **

Este README es provisional

###End