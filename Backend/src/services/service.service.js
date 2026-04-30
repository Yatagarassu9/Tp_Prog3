import { Service } from "../models/index.js";

export const getServices = async () => {
  return await Service.findAll();
};

export const getServiceById = async (id) => {
  const service = await Service.findByPk(id);
  if (!service) throw new Error("Service not found");
  return service;
};

export const createService = async (data) => {
  return await Service.create(data);
};

export const updateService = async (id, data) => {
  const service = await Service.findByPk(id);
  if (!service) throw new Error("Service not found");
  return await service.update(data);
};

export const deleteService = async (id) => {
  const service = await Service.findByPk(id);
  if (!service) throw new Error("Service not found");
  return await service.destroy();
};