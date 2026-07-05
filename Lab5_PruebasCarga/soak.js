import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 80 },   // Incremento gradual
        { duration: '10m', target: 80 },  // Carga constante
        { duration: '2m', target: 0 },    // Descenso gradual
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