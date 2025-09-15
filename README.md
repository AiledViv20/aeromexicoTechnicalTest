# Aeromexico Technical Test

Este proyecto fue creado con [Next.js](https://nextjs.org) y cumple con los requisitos de la prueba técnica:

- **React 19** mediante **Next.js**.  
- **TypeScript** para el desarrollo.  
- **CSS Modules / SCSS Modules** para manejo de estilos.  
- **JSON Server** para simular la API de personajes.
- Estado global con **Redux Toolkit** y persistencia de favoritos con **Thunk**.  
- **Pruebas unitarias** con Jest + React Testing Library.  

---

## 🛠️ ¿Cómo levantar el proyecto?

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Levantar el servidor de desarrollo**  
   La aplicación estará disponible en 👉 [http://localhost:3000](http://localhost:3000).
   ```bash
   npm run dev
   ```

---

## 🚀 Desarrollo
#### Generar base de datos local
Antes de levantar la API, es necesario generar el archivo `db.json` con los personajes.  
Este comando descarga datos desde la API pública de Rick & Morty y los guarda en el formato que usa la aplicación:

  ```bash
  npm run seed
  ```

#### Levantar la API simulada
Se utiliza [json-server](https://github.com/typicode/json-server) para servir los datos de personajes.

  ```bash
  npm run api  
  ```
Este comando levantará la API en http://localhost:3001

#### Limpiar favoritos
Para reiniciar la lista de favoritos en el archivo local db.json (útil si quieres empezar desde cero):

  ```bash
  npm run clean:favs
  ```
  Este comando eliminará y regenerará la base de datos con la información inicial desde db.template.json.

---

## 🧪 Pruebas unitarias

El proyecto incluye configuración de Jest + Testing Library.

- **Correr todos los tests**
  ```bash
  npm test
  ```

- **Modo interactivo (watch)**
  ```bash
  npm run test:watch
  ```

- **Ver reporte de cobertura**
  ```bash
  npm run test:coverage
  ```
  El reporte HTML detallado se genera en la carpeta `/coverage`.

---

## 📌 Preguntas de la prueba técnica

### ✅ ¿Qué es lo que más te gustó de tu desarrollo?
Lo que más me gustó fue integrar varias piezas (Next.js, Redux Toolkit, JSON Server) y ver cómo todo encajaba para simular una aplicación completa. También disfruté diseñar la funcionalidad de favoritos y comprobar que se persistiera en la API, porque le dio una sensación más real y completa al proyecto.

### ✅ Si hubieras tenido más tiempo, ¿qué hubieras mejorado o qué más hubieras hecho?
Con más tiempo me hubiera gustado agregar animaciones sutiles a la interfaz para hacerla más dinámica, además de optimizar la carga de imágenes con técnicas como lazy loading. También hubiera explorado agregar pruebas de integración más amplias o implementar un buscador avanzado con filtros adicionales.

### ✅ Descríbenos un **pain point** o bug con el que te hayas encontrado y cómo lo solucionaste.
- Uno de los bugs más curiosos fue que accidentalmente tenía un button dentro de otro button, lo cual provocaba errores de hidratación en Next.js. Lo solucioné reorganizando la estructura y usando div con role="button" en los casos necesarios.

- También me encontré con un problema donde los favoritos aparecían marcados de manera incorrecta al abrir en modo incógnito. Descubrí que era por cómo se estaba persistiendo el estado en el archivo db.json, lo resolví creando un script para limpiar los favoritos y asegurarme de que el estado siempre se reiniciara correctamente.

---

## 📚 Recursos útiles

- [Next.js Docs](https://nextjs.org/docs)  
- [Redux Toolkit](https://redux-toolkit.js.org/)  
- [JSON Server](https://www.npmjs.com/package/json-server)  
- [Jest](https://jestjs.io/)  
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)  
