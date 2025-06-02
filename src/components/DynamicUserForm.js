import React, { useState } from "react";
import TextInput from "./TextInput";
import ErrorMessage from "./ErrorMessage";
import "../styles/components/form.css";

const FIELD_TYPES = {
  text: TextInput,
  email: TextInput,
  password: (props) => <input className="text-input" type="password" {...props} style={{ width: "100%", marginTop: 4, ...props.style }} />
};

const DynamicUserForm = ({
  fields = [], // [{name, label, type, required, autoComplete, placeholder}]
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  error = "",
  submitText = "Guardar",
  showCancel = false,
  title = ""
}) => {
  const [form, setForm] = useState(() => {
    const obj = {};
    fields.forEach(f => { obj[f.name] = initialValues[f.name] || ""; });
    return obj;
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="perfil-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
      {title && <h2 style={{ marginBottom: 8 }}>{title}</h2>}
      <ErrorMessage error={error} />
      {fields.map(f => {
        const Comp = FIELD_TYPES[f.type] || TextInput;
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
      <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "center" }}>
        <button className="btn" type="submit" disabled={loading}>{submitText}</button>
        {showCancel && <button className="btn" type="button" onClick={onCancel} disabled={loading}>Cancelar</button>}
      </div>
    </form>
  );
};

export default DynamicUserForm;
