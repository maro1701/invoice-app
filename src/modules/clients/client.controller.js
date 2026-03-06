import * as clientService from './client.service.js';

export async function createClient(req, res, next) {
  try {
    const client = await clientService.createClient(
      req.user.id,
      req.body
    );
    return res.status(201).json({ client });
  } catch (err) {
    next(err);
  }
}

export async function getClient(req, res, next) {
  try {
    const clients = await clientService.getClients(req.user.id);
    return res.status(200).json({ clients });
  } catch (err) {
    next(err);
  }
}