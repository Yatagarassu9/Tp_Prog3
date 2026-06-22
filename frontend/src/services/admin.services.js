// servicios que usa el panel del admin para todas las operaciones de gestiÃ³n
const BASE_URL = import.meta.env.VITE_API_URL;

// siempre mandamos el token del admin en el header
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("barberia-token")}`,
});

// ===== USUARIOS =====

// trae todos los usuarios (clientes y barberos mezclados, filtramos en el frontend)
export const getAllUsersService = (onSuccess, onError) => {
  fetch(`${BASE_URL}/users`, {
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al obtener usuarios");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// crea un usuario nuevo desde el panel admin, el rol viene en el body
export const createUserAdminService = (userData, onSuccess, onError) => {
  fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear usuario");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// actualiza los datos de un usuario, no mandamos el mail porque no se puede cambiar
export const updateUserAdminService = (userId, userData, onSuccess, onError) => {
  fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al actualizar usuario");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// elimina un usuario por id
export const deleteUserAdminService = (userId, onSuccess, onError) => {
  fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar usuario");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// ===== BARBEROS =====

// trae todos los barberos (endpoint separado del de usuarios)
export const getAllBarbersAdminService = (onSuccess, onError) => {
  fetch(`${BASE_URL}/barbers`, {
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al obtener barberos");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// crea un barbero nuevo
export const createBarberAdminService = (barberData, onSuccess, onError) => {
  fetch(`${BASE_URL}/barbers`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(barberData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear barbero");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// actualiza los datos de un barbero, sin el mail
export const updateBarberAdminService = (barberId, barberData, onSuccess, onError) => {
  fetch(`${BASE_URL}/barbers/${barberId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(barberData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al actualizar barbero");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// elimina un barbero por id
export const deleteBarberAdminService = (barberId, onSuccess, onError) => {
  fetch(`${BASE_URL}/barbers/${barberId}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar barbero");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// ===== SUCURSALES =====

// trae todas las sucursales
export const getAllBranchesAdminService = (onSuccess, onError) => {
  fetch(`${BASE_URL}/branches`, {
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al obtener sucursales");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// crea una sucursal nueva
export const createBranchAdminService = (branchData, onSuccess, onError) => {
  fetch(`${BASE_URL}/branches`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(branchData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear sucursal");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// actualiza los datos de una sucursal
export const updateBranchAdminService = (branchId, branchData, onSuccess, onError) => {
  fetch(`${BASE_URL}/branches/${branchId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(branchData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al actualizar sucursal");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// elimina una sucursal por id
export const deleteBranchAdminService = (branchId, onSuccess, onError) => {
  fetch(`${BASE_URL}/branches/${branchId}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar sucursal");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// ===== SERVICIOS (cortes) =====

// trae todos los servicios
export const getAllCutsAdminService = (onSuccess, onError) => {
  fetch(`${BASE_URL}/cuts`, {
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al obtener servicios");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// crea un servicio nuevo
export const createCutAdminService = (cutData, onSuccess, onError) => {
  fetch(`${BASE_URL}/cuts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(cutData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear servicio");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// actualiza un servicio
export const updateCutAdminService = (cutId, cutData, onSuccess, onError) => {
  fetch(`${BASE_URL}/cuts/${cutId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(cutData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al actualizar servicio");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// elimina un servicio por id
export const deleteCutAdminService = (cutId, onSuccess, onError) => {
  fetch(`${BASE_URL}/cuts/${cutId}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar servicio");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// ===== TURNOS =====

// trae todos los turnos (el admin ve todos sin filtrar)
export const getAllAppointmentsAdminService = (onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments`, {
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al obtener turnos");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// crea un turno desde el panel admin
export const createAppointmentAdminService = (appointmentData, onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(appointmentData),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear turno");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};

// elimina un turno por id
export const deleteAppointmentAdminService = (appointmentId, onSuccess, onError) => {
  fetch(`${BASE_URL}/appointments/${appointmentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar turno");
      }
      return res.json();
    })
    .then(onSuccess)
    .catch(onError);
};