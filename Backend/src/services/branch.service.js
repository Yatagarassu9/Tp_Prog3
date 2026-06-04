import { Branch } from "../models/relations.js";

export const getBranches = async () => {
  return await Branch.findAll();
};

export const getBranchById = async (id) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw new Error("Branch not found");
  return branch;
};

export const createBranch = async (data) => {
  return await Branch.create({
    ...data,
  });
};

export const updateBranch = async (id, data) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw new Error("Branch not found");
  return await branch.update(data);
};

export const deleteBranch = async (id) => {
  const branch = await Branch.findByPk(id);
  if (!branch) throw new Error("Branch not found");
  return await branch.destroy();
};
