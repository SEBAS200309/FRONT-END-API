# FRONT-END-API

**Frontend de prueba para un CRUD vía API REST**

Este proyecto es una interfaz web (HTML + JavaScript) que consume un back-end desplegado en Railway para probar operaciones CRUD sobre una base de datos. El back-end está implementado en Spring Boot.

---

## 📋 Características

- Interfaz responsiva con Bootstrap 5.
- CRUD completo para entidades: Bands, Cities, Countries, Music Genres, Stadiums, Ticket Categories y Tickets.
- Consumo de endpoints REST via `fetch` en JavaScript.
- Modo *fallback* con datos mock si la API no responde.
- Toasts de notificación con Toastify.js.
- No incluye lógica de autenticación ni validación de credenciales.

---


---

## 🛠️ Tecnologías

- **Spring Boot** (Java)
- **HTML5**, **CSS3**, **Bootstrap 5**
- **JavaScript** (vanilla)
- **Toastify.js** para notificaciones

---

## 🚀 Instalación y Ejecución

1. Clona el repositorio  
   ```bash
   git clone https://github.com/SEBAS200309/FRONT-END-API.git
   cd FRONT-END-API

2. Arranca la aplicación
  ```bash
  mvn spring-boot:run
  ```
## 🔧 Uso
* Selecciona la entidad (Bands, Cities, Countries…) en el navbar.
* Crea, edita o elimina registros (Por el momento solo es posible con Bands); las llamadas se hacen contra:
 ```bash
  http://localhost:8080/api_rest/v1/WEB3_Ticketer/{endpoint}
  ```
* Si la API falla se mostraran datos de prueba (mockdata)
