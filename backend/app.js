const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');


const app = express();
const port = 3000;

// Configurar Express para servir archivos estáticos desde una carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Permitir que el servidor maneje datos JSON en el cuerpo de las solicitudes
app.use(express.json());


// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener las tareas desde tareas.json
app.get('/tasks', (req, res) => {
    fs.readFile(path.join(__dirname, 'tareas.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error leyendo tareas.json', err);
            res.status(500).send('Error al leer las tareas');
            return;
        }

        try {
            const tasks = JSON.parse(data);
            res.json(tasks);
        } catch (parseError) {
            console.error('Error al parsear tareas.json', parseError);
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

    fs.writeFile(path.join(__dirname, 'tareas.json'), JSON.stringify(updatedTasks, null, 2), (err) => {
        if (err) {
            console.error('Error escribiendo tareas.json', err);
            return res.status(500).send('Error al actualizar las tareas');
        }
        res.status(200).send('Tareas actualizadas correctamente');
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
