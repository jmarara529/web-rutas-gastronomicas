import React from "react";
import DynamicUserForm from "./DynamicUserForm";
import "../styles/components/form.css";

const UserEditForm = ({ initialValues, onSubmit, onCancel, loading, error }) => {
  return (
    <DynamicUserForm
      fields={[
        { name: "nombre", label: "Nombre", type: "text", required: true, autoComplete: "name" },
        { name: "correo", label: "Correo", type: "email", required: true, autoComplete: "email" },
        { name: "password", label: "Contraseña", type: "password", required: false, autoComplete: "new-password", placeholder: "Nueva contraseña" }
      ]}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
      error={error}
      submitText="Guardar"
      showCancel={true}
    />
  );
};

export default UserEditForm;
