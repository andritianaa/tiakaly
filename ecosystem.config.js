module.exports = {
    apps: [
        {
            name: "Tiakaly prod",
            script: "npm",
            args: "start",
            env: {
                PORT: 8877,
                NODE_ENV: "production"
            }
        }
    ]
}