import { app } from './app';
import { logger } from '@logger/logger';

const port = process.env.PORT ?? 3000;

logger.info('app is starting');

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});