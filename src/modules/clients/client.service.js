import * as clientRepo from './client.repo.js';

export async function createClient(userId, data) {
  return clientRepo.createClient(userId, data);
}

export async function getClients(userId) {
  return clientRepo.getClientsByUser(userId);
}