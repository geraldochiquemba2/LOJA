import { Router, type IRouter } from "express";
import { z } from "zod";

const router: IRouter = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/auth/login", (req, res) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, password } = result.data;

  // Hardcoded credentials as requested by user
  if (email === "admin@gmail.com" && password === "123456789") {
    return res.json({
      success: true,
      token: "admin-session-token-hardcoded",
      user: {
        email: "admin@gmail.com",
        role: "admin",
      },
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;
