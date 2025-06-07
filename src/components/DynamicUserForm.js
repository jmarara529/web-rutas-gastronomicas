// Importa React y hooks necesarios
import React, { useState } from "react";
import TextInput from "./TextInput";
import ErrorMessage from "./ErrorMessage";
import "../styles/components/form.css";

// Diccionario para mapear tipos de campo a componentes
const FIELD_TYPES = {
  text: TextInput, // Campo de texto estándar
  email: TextInput, // Campo de email reutiliza TextInput
  password: (props) => <input className="text-input" type="password" {...props} style={{ width: "100%", marginTop: 4, ...props.style }} /> // Campo de contraseña personalizado
};

// Componente de formulario dinámico para usuarios
// Permite renderizar cualquier conjunto de campos definido en 'fields'
const DynamicUserForm = ({
  fields = [], // Lista de campos a renderizar [{name, label, type, required, autoComplete, placeholder}]
  initialValues = {}, // Valores iniciales del formulario
  onSubmit, // Función a ejecutar al enviar el formulario
  onCancel, // Función a ejecutar al cancelar
  loading = false, // Estado de carga para deshabilitar botones
  error = "", // Mensaje de error a mostrar
  submitText = "Guardar", // Texto del botón de submit
  showCancel = false, // Mostrar botón cancelar
  title = "", // Título opcional del formulario
  renderExtraFields // Función para renderizar campos extra personalizados
}) => {
  // Estado local para los valores del formulario
  const [form, setForm] = useState(() => {
    const obj = {};
    fields.forEach(f => { obj[f.name] = initialValues[f.name] || (f.type === 'checkbox' ? false : ""); });
    return obj;
  });

  // Maneja los cambios en los campos del formulario
  const handleChange = e => {
    // Soporte para checkbox
    if (e.target && e.target.type === 'checkbox') {
      setForm({ ...form, [e.target.name]: e.target.checked });
    } else if (e.target) {
      setForm({ ...form, [e.target.name]: e.target.value });
    } else if (e.name && typeof e.value !== 'undefined') {
      setForm({ ...form, [e.name]: e.value });
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  // Renderiza el formulario
  return (
    <form className="perfil-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
      {title && <h2 style={{ marginBottom: 8 }}>{title}</h2>}
      <ErrorMessage error={error} />
      {/* Renderiza cada campo definido en 'fields' */}
      {fields.map(f => {
        const Comp = FIELD_TYPES[f.type] || TextInput;
        if (f.type === 'checkbox') {
          return (
            <label key={f.name} style={{ width: "100%", textAlign: "left", display: 'flex', alignItems: 'center', gap: 8 }}>
              {f.label}:
              <input
                type="checkbox"
                name={f.name}
                checked={!!form[f.name]}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
              />
            </label>
          );
        }
        return (
          <label key={f.name} style={{ width: "100%", textAlign: "left" }}>
            {f.label}:
            <Comp
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder || f.label}
              type={f.type}
              autoComplete={f.autoComplete}
              required={f.required}
            />
          </label>
        );
      })}
      {/* Renderizar campos extra personalizados si se pasan */}
      {renderExtraFields && renderExtraFields(form, handleChange)}
      <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "center" }}>
        <button className="btn" type="submit" disabled={loading}>{submitText}</button>
        {showCancel && <button className="btn" type="button" onClick={onCancel} disabled={loading}>Cancelar</button>}
      </div>
    </form>
  );
};

export default DynamicUserForm;
