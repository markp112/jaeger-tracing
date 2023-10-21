import { app } from './app';

const port = process.env.PORT ?? 3012;

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
