import * as userRepo from './user.repo.js';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt.js';

function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export async function registerUser(email, password) {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error('User already exists');

  const hash = await bcrypt.hash(password, 10);
  const user = await userRepo.createUser(email, hash);

  const token = signToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
}

export async function loginUser(email, password) {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid credentials');

  const token = signToken(user);

  return {
    user: sanitizeUser(user),
    token
  };
}