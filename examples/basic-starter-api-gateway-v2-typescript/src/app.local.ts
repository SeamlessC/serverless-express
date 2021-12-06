import app  from "./configurations/server-config";

const port = 3010;

app.listen(port, () => {
  console.log(`Competition app listening at http://localhost:${port}`);
});
