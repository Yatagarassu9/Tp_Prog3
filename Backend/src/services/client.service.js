import { Client } from "../models/index.js";

export const getClients = async () => {
  return await Client.findAll();
};

export const getClientById = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");
  return client;
};

export const createClient = async (data) => {
  return await Client.create(data);
};

export const updateClient = async (id, data) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");
  return await client.update(data);
};

export const deleteClient = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) throw new Error("Client not found");
  return await client.destroy();
};