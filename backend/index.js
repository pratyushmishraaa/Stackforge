import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

import app from "./src/app.js";
import connectDB from "./src/database/mongo.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on the PORT ${PORT}`);
});
