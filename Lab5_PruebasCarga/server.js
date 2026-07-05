const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

// Ruta GET para simular una respuesta simple
app.get('/api/hello', (req, res) => {
    setTimeout(() => {
        res.json({ message: 'Hola Mundo' });
    }, Math.random() * 500);
});

// Ruta POST para recibir datos y responder con lo recibido
app.post('/api/data', (req, res) => {
    const data = req.body;
    setTimeout(() => {
        res.status(201).json({ received: data });
    }, Math.random() * 500);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});