const { spawn } = require('child_process');

export function startServer() {
    return new Promise((resolve, reject) => {

        const reactServerProcess = spawn('ng', ['serve'], {
            stdio: 'inherit',
            shell: true,
            detached: true
        });

        reactServerProcess.on('error', (err) => {
            console.error('Failed to start angular server:', err);
            reject(err);
        });
        reactServerProcess.unref()

        const backServerProcess = spawn('node', ['index.js'], {
            stdio: 'inherit',
            shell: true,
            cwd: '../backend/',
            detached: true
        });

        backServerProcess.on('error', (err) => {
            console.error('Failed to start node server:', err);
            reject(err);
        });
        backServerProcess.unref()
        resolve({front:reactServerProcess, back: backServerProcess})
    });
}

