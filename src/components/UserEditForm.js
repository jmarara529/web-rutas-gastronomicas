// Importa React y el formulario dinámico reutilizable
import React from "react";
import DynamicUserForm from "./DynamicUserForm";
import "../styles/components/form.css";

// Componente para editar los datos de un usuario
// Recibe los valores iniciales, funciones de submit/cancel, y estados de carga y error
const UserEditForm = ({ initialValues, onSubmit, onCancel, loading, error }) => {
  return (
    <DynamicUserForm
      // Campos del formulario: nombre, correo y contraseña (opcional)
      fields={[
        { name: "nombre", label: "Nombre", type: "text", required: true, autoComplete: "name" },
        { name: "correo", label: "Correo", type: "email", required: true, autoComplete: "email" },
        { name: "password", label: "Contraseña", type: "password", required: false, autoComplete: "new-password", placeholder: "Nueva contraseña" }
      ]}
      initialValues={initialValues} // Valores iniciales del usuario
      onSubmit={onSubmit} // Función al guardar
      onCancel={onCancel} // Función al cancelar
      loading={loading} // Estado de carga para deshabilitar botones
      error={error} // Mensaje de error
      submitText="Guardar" // Texto del botón de guardar
      showCancel={true} // Muestra el botón cancelar
    />
  );
};

export default UserEditForm;
