// backend\server.js

import dotenv from 'dotenv';
dotenv.config();

import { app } from "./index.js";

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
