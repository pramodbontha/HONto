import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }
};

startServer();
