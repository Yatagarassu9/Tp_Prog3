import { Cut } from "../models/relations.js";


// obtener todos los cortes
export const getCuts = async () => {

  return await Cut.findAll();

};


// obtener corte por id
export const getCutById = async (id) => {

  const cut = await Cut.findByPk(id);

  if (!cut) {
    throw new Error("Cut not found");
  }

  return cut;

};


// crear corte
export const createCut = async (data) => {

  return await Cut.create(data);

};


// actualizar corte
export const updateCut = async (
  id,
  data
) => {

  const cut = await Cut.findByPk(id);

  if (!cut) {
    throw new Error("Cut not found");
  }

  return await cut.update(data);

};


// eliminar corte
export const deleteCut = async (id) => {

  const cut = await Cut.findByPk(id);

  if (!cut) {
    throw new Error("Cut not found");
  }

  return await cut.destroy();

};