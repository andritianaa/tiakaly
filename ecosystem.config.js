module.exports = {
    apps: [
        {
            name: "Tiakaly prod",
            script: "npm",
            args: "start",
            env: {
                PORT: 3000,
                NODE_ENV: "production"
            }
        }
    ]
}