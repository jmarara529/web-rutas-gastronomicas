// Importa React para usar JSX
import React from "react";

// Componente reutilizable para mostrar y gestionar una lista de reseñas con menú de opciones y edición inline
const ReviewList = ({
  reviews = [], // Array de reseñas a mostrar
  userId, // ID del usuario actual
  isAdmin = false, // Si el usuario es administrador
  menuOpen, // Índice de la reseña cuyo menú está abierto
  setMenuOpen, // Función para cambiar el menú abierto
  editReviewId, // ID de la reseña en modo edición
  editReviewText, // Texto de la reseña en edición
  editReviewStars, // Calificación de la reseña en edición
  setEditReviewId, // Setter para el ID de edición
  setEditReviewText, // Setter para el texto de edición
  setEditReviewStars, // Setter para la calificación de edición
  reviewSubmitting, // Estado de envío de reseña
  reviewError, // Mensaje de error en edición
  onEditClick, // Handler para iniciar edición
  onEditSave, // Handler para guardar edición
  onEditCancel, // Handler para cancelar edición
  onDeleteReview, // Handler para eliminar reseña
  StarRating, // Componente para mostrar/editar estrellas
  allowEdit = true, // Permitir edición solo al dueño
  onReviewClick // Handler para click en la reseña (opcional)
}) => (
  <ul className="reviews-list">
    {/* Itera sobre cada reseña */}
    {reviews.map((r, i) => {
      // Determina permisos de edición y borrado
      const isOwner = userId && (String(r.id_usuario) === String(userId));
      const canEdit = isOwner && allowEdit; // Solo el dueño puede editar si allowEdit es true
      const canDelete = isOwner || isAdmin; // El dueño o el admin pueden borrar
      // Etiqueta de usuario o lugar
      const userLabel = r.nombre_lugar || r.nombre_usuario || r.usuario || "";
      // Si la reseña está en modo edición
      const isEditing = editReviewId === r.id;
      return (
        <li key={i} className="review-app" style={{ position: 'relative', cursor: r.id_lugar ? 'pointer' : 'default' }}
          // Permite navegación al detalle del lugar si la reseña tiene id_lugar
          onClick={r.id_lugar ? async (e) => {
            // Evita navegación si el click fue en el menú de opciones o si está en modo edición
            if (e.target.closest('.review-menu-trigger, .review-menu')) return;
            if (isEditing) return;
            if (onReviewClick) { onReviewClick(r); return; }
            e.stopPropagation();
            try {
              const token = localStorage.getItem("token");
              const lugarRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lugares/byid/${r.id_lugar}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const lugar = await lugarRes.json();
              if (lugar && lugar.place_id) {
                window.location.href = `/sitio/${lugar.place_id}`;
              }
            } catch {}
          } : undefined}
        >
          {/* Nombre del usuario o lugar */}
          <div style={{ fontWeight: 500 }}>{userLabel}</div>
          {/* Calificación */}
          <div>⭐ {r.calificacion}</div>
          {/* Comentario */}
          <div style={{ fontStyle: "italic" }}>{r.comentario}</div>
          {/* Fecha de la reseña */}
          <div style={{ fontSize: 12, color: "#aaa" }}>{r.fecha}</div>
          {/* Menú de opciones para editar/borrar si corresponde */}
          {(canEdit || canDelete) && (
            <div className="review-menu-trigger" style={{ position: 'absolute', top: 8, right: 8 }}>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#ff9800' }}
                onClick={() => setMenuOpen(menuOpen === i ? null : i)}
                title="Opciones"
              >
                &#8942;
              </button>
              {/* Menú desplegable de opciones */}
              {menuOpen === i && (
                <div className="review-menu" style={{ position: 'absolute', top: 24, right: 0 }}>
                  {canEdit && <div className="edit" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => onEditClick(r, i)}>Editar</div>}
                  {canDelete && <div className="delete" style={{ padding: '8px 16px', cursor: 'pointer', color: '#e53935' }} onClick={() => { onDeleteReview(r.id); setMenuOpen(null); }}>Eliminar</div>}
                </div>
              )}
            </div>
          )}
          {/* Formulario de edición inline si la reseña está en modo edición */}
          {editReviewId === r.id && (
            <div style={{ marginTop: 12, background: '#181818', borderRadius: 6, padding: 12 }}>
              <textarea
                value={editReviewText}
                onChange={e => setEditReviewText(e.target.value)}
                rows={3}
                style={{ width: '100%', marginBottom: 8 }}
              />
              <div style={{ marginBottom: 8 }}>
                <span>Calificación: </span>
                {StarRating && <StarRating value={editReviewStars} onChange={setEditReviewStars} />}
              </div>
              <button onClick={onEditSave} disabled={reviewSubmitting} style={{ marginRight: 8 }}>Guardar</button>
              <button onClick={onEditCancel} disabled={reviewSubmitting}>Cancelar</button>
              {/* Mensaje de error si ocurre al editar */}
              {reviewError && <div style={{ color: '#e53935', marginTop: 8 }}>{reviewError}</div>}
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

export default ReviewList;
