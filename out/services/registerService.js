"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerService;
const baseURL_1 = require("./baseURL");
async function registerService(name, email, password) {
    try {
        const response = await fetch(`${baseURL_1.default}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Register error:", error);
        throw error;
    }
}
