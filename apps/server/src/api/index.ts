import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

// Get port from environment variable or use default port 8080
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

const MONGO_URL = ""; // DB URI

app.use("/api", (req, res) => {
  const path = `/api/item/`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});
