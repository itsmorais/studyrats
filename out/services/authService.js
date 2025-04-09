"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loginService;
const baseURL_1 = require("./baseURL");
async function loginService(name, email, password) {
    try {
        const response = await fetch(`${baseURL_1.default}/session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.token;
    }
    catch (error) {
        console.error("Register error:", error);
        throw error;
    }
}
