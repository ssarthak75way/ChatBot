import { Request, Response } from "express";
import { User } from "./user.model";
import { hashPassword, comparePassword } from "../../utils/password";
import { signAccessToken, signRefreshToken, verifyToken } from "../../utils/jwt";
import { RegisterInput, LoginInput } from "./auth.validation";

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as RegisterInput;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ email, password: hashedPassword });

  const accessToken = signAccessToken({ userId: user._id.toString() });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({ accessToken, refreshToken });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const accessToken = signAccessToken({ userId: user._id.toString() });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  user.refreshToken = refreshToken;
  await user.save();

  res.json({ accessToken, refreshToken });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token required" });
    return;
  }

  try {
    const decoded = verifyToken(refreshToken, "refresh");
    const user = await User.findOne({ _id: decoded.userId, refreshToken });

    if (!user) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = signAccessToken({ userId: user._id.toString() });
    const newRefreshToken = signRefreshToken({ userId: user._id.toString() });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
}
