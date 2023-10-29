import { logger } from '@logger/logger';
import { app } from './app';

const port = process.env.PORT ?? 3012;

logger.info('app is starting');
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
