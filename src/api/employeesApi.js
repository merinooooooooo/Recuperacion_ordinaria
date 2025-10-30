// ================================
// 📦 API DE EMPLEADOS (CRUD COMPLETO)
// ================================

// 🔗 URL base del API en Retool
const BASE_URL = 'https://retoolapi.dev/Vv50y8/recuperacion';

/**
 * 🧩 Función auxiliar para manejar las respuestas del servidor.
 * Si la respuesta tiene un error, lanza una excepción con el mensaje detallado.
 * @param {Response} response - Respuesta obtenida del fetch.
 * @returns {Promise<object>} - Devuelve el JSON si la respuesta es correcta.
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }
  return response.json();
}

/**
 * 📋 Obtiene todos los empleados registrados en el API.
 * @returns {Promise<object[]>} - Lista de empleados.
 */
export async function getEmployees() {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
}

/**
 * 🔍 Filtra empleados por nombre.
 * Si no se pasa un nombre, devuelve todos los empleados.
 * @param {string} name - Nombre o parte del nombre a buscar.
 * @returns {Promise<object[]>} - Empleados que coinciden con el nombre.
 */
export async function filterEmployeesByName(name) {
  // Si no se proporciona un nombre, retorna todos
  if (!name) return getEmployees();

  // Construye la URL con parámetro de búsqueda
  const url = `${BASE_URL}?Name=${encodeURIComponent(name)}`;
  const response = await fetch(url);
  return handleResponse(response);
}

/**
 * 🧾 Obtiene un empleado específico por su ID.
 * @param {number|string} id - ID del empleado a buscar.
 * @returns {Promise<object>} - Datos del empleado encontrado.
 */
export async function getEmployeeById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(response);
}

/**
 * ➕ Crea un nuevo empleado en el API.
 * @param {object} employeeData - Objeto con los datos del nuevo empleado.
 * @returns {Promise<object>} - Empleado creado.
 */
export async function createEmployee(employeeData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData),
  });
  return handleResponse(response);
}

/**
 * ✏️ Actualiza la información de un empleado existente.
 * @param {number|string} id - ID del empleado a actualizar.
 * @param {object} updatedData - Nuevos datos del empleado.
 * @returns {Promise<object>} - Empleado actualizado.
 */
export async function updateEmployee(id, updatedData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
}

/**
 * ❌ Elimina un empleado del sistema.
 * @param {number|string} id - ID del empleado a eliminar.
 * @returns {Promise<void>} - Confirmación de eliminación.
 */
export async function deleteEmployee(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse(response);
}

/**
 * 🧹 Normaliza un objeto de empleado para un formato uniforme.
 * Esto es útil si los nombres de las propiedades varían en distintas fuentes.
 * @param {object} raw - Objeto original (sin normalizar).
 * @returns {object} - Empleado con propiedades consistentes.
 */
export function normalizeEmployee(raw) {
  return {
    id: raw.id,
    Name: raw.Name || raw.nombre || '',
    Age: raw.Age !== undefined
      ? Number(raw.Age)
      : (raw.edad ? Number(raw.edad) : undefined),
    Job: raw.Job || raw.puesto || raw.Workstation || '',
    Phone: raw.Phone || raw.telefono || raw.PhoneNumber || '',
  };
}