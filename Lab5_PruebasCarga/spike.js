import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '5s', target: 50 },    // Carga inicial
        { duration: '10s', target: 800 },   // Pico repentino
        { duration: '30s', target: 800 },   // Mantener el pico
        { duration: '10s', target: 50 },    // Regreso rápido
        { duration: '5s', target: 0 },     // Finalizar
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {

    // GET
    let res = http.get('http://localhost:3000/api/hello');

    check(res, {
        'GET 200': (r) => r.status === 200,
    });

    // POST
    const payload = JSON.stringify({
        id: __VU * 1000 + __ITER,
        nombre: `Usuario_${__VU}_${__ITER}`
    });

    res = http.post(
        'http://localhost:3000/api/data',
        payload,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    check(res, {
        'POST 201': (r) => r.status === 201,
    });

    sleep(1);
}