"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function run() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/facility-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'manager.blr@ecocycle.in',
                password: 'password123'
            })
        });
        console.log("STATUS:", response.status);
        console.log("STATUS TEXT:", response.statusText);
        const body = await response.text();
        console.log("RESPONSE BODY:", body);
    }
    catch (err) {
        console.error("FETCH ERROR:", err);
    }
}
run();
