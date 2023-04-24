import App from './app';
import config from './utils/config';

async function main() {
  const app = await App();

  app.listen({ port: config.api_port, host: '0.0.0.0' });
}

main();
