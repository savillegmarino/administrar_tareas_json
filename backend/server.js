const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS para permitir ciertos dominios (ajustar según necesidades)
app.use(cors({ origin: '*' }));

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Permitir que el servidor maneje datos JSON en el cuerpo de las solicitudes
app.use(express.json());

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener las tareas desde tareas.json
app.get('/tasks', (req, res) => {
    const tasksFile = path.join(__dirname, 'tareas.json');
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo tareas.json:', err);
            return res.status(500).send('Error al leer las tareas');
        }

        try {
            const tasks = JSON.parse(data);
            res.json(tasks);
        } catch (parseError) {
            console.error('Error al parsear tareas.json:', parseError);
            res.status(500).send('Error al procesar las tareas');
        }
    });
});

// Ruta para actualizar tareas en tareas.json
app.post('/tasks', (req, res) => {
    const updatedTasks = req.body;

    if (!Array.isArray(updatedTasks)) {
        return res.status(400).send('El cuerpo de la solicitud debe ser un arreglo de tareas');
    }

    const tasksFile = path.join(__dirname, 'tareas.json');
    fs.writeFile(tasksFile, JSON.stringify(updatedTasks, null, 2), (err) => {
        if (err) {
            console.error('Error escribiendo tareas.json:', err);
            return res.status(500).send('Error al actualizar las tareas');
        }
        res.status(200).send('Tareas actualizadas correctamente');
    });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar el servidor en el puerto configurado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
