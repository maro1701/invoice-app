import * as userService from './user.service.js';

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await userService.registerUser(email, password);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}