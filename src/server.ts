import app from "./app.js";
import "dotenv/config";

const { APP_PORT } = process.env;

app.listen(APP_PORT, () => {
  console.log(`Server running on http://localhost:${APP_PORT}`);
});
