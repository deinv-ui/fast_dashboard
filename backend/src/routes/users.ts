import { Router } from "express";
import { generateRandomUsers, getPaginatedUsers } from "../services/userServices";

const router = Router();

// Paginated users
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = (req.query.search as string) || "";
  try {
    const result = await getPaginatedUsers(page, limit, search);
    res.json({ data: result.data, meta: { total: result.total, page, lastPage: result.lastPage } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Generate random user
router.post("/random", async (req, res) => {
  try {
    const [user] = await generateRandomUsers(1);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

export default router;
