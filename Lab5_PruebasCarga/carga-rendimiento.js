import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración del test
export let options = {
    stages: [
        { duration: '10s', target: 100 }, // Etapa de calentamiento
        { duration: '30s', target: 5000}, // Etapa de carga sostenida
        { duration: '10s', target: 0 },  // Etapa de enfriamiento
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // El 95% de solicitudes completas < 500ms
        http_req_failed: ['rate<0.01'], // Menos del 1% de solicitudes fallidas
    },
};

export default function () {
    // Enviamos solicitud HTTP GET
    const res = http.get('http://localhost:3000/api/hello');

    // Validar la respuesta
    check(res, {
        'status is 200': (r) => r.status === 200,
        'respuesta en < de 500 ms': (r) => r.timings.duration < 500
    });

    // Enviamos solicitud HTTP POST
    const payload = JSON.stringify({
        id: 1,
        nombre: 'Domenica',
        carrera: 'Software'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const postRes = http.post(
        'http://localhost:3000/api/data',
        payload,
        params
    );

    check(postRes, {
        'POST status 201': (r) => r.status === 201,
        'POST < 500 ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}

