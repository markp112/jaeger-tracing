import { app } from './app';

const port = 3010;

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
