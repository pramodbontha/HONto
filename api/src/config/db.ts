import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const db = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  )
);

export default db;
