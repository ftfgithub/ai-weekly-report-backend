import http from 'http';

const ports = [3001, 3002, 3003, 4000, 5000, 8000, 9000, 12345, 18000, 9999];

async function testPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      res.end('OK');
    });

    server.on('error', (err) => {
      console.log(`Port ${port}: ERROR - ${err.message}`);
      resolve(false);
    });

    server.listen(port, () => {
      console.log(`Port ${port}: SUCCESS`);
      server.close();
      resolve(true);
    });

    setTimeout(() => {
      server.close();
      resolve(false);
    }, 1000);
  });
}

async function main() {
  console.log('Testing ports without address binding...');
  for (const port of ports) {
    await testPort(port);
  }
  console.log('\nDone!');
}

main().catch(console.error);
