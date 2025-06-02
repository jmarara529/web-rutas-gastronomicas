import React from "react";

// Componente reutilizable para mostrar y gestionar comentarios con menú de opciones
const ReviewList = ({
  reviews = [],
  userId,
  isAdmin = false,
  menuOpen,
  setMenuOpen,
  editReviewId,
  editReviewText,
  editReviewStars,
  setEditReviewId,
  setEditReviewText,
  setEditReviewStars,
  reviewSubmitting,
  reviewError,
  onEditClick,
  onEditSave,
  onEditCancel,
  onDeleteReview,
  StarRating
}) => (
  <ul className="reviews-list">
    {reviews.map((r, i) => {
      const isOwner = userId && (String(r.id_usuario) === String(userId));
      const canEdit = isOwner;
      const canDelete = isOwner || isAdmin;
      const userLabel = r.nombre_lugar || r.nombre_usuario || r.usuario || "";
      return (
        <li key={i} className="review-app" style={{ position: 'relative' }}>
          <div style={{ fontWeight: 500 }}>{userLabel}</div>
          <div>⭐ {r.calificacion}</div>
          <div style={{ fontStyle: "italic" }}>{r.comentario}</div>
          <div style={{ fontSize: 12, color: "#aaa" }}>{r.fecha}</div>
          {(canEdit || canDelete) && (
            <div className="review-menu-trigger" style={{ position: 'absolute', top: 8, right: 8 }}>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#ff9800' }}
                onClick={() => setMenuOpen(menuOpen === i ? null : i)}
                title="Opciones"
              >
                &#8942;
              </button>
              {menuOpen === i && (
                <div className="review-menu" style={{ position: 'absolute', top: 24, right: 0 }}>
                  {canEdit && <div className="edit" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => onEditClick(r, i)}>Editar</div>}
                  {canDelete && <div className="delete" style={{ padding: '8px 16px', cursor: 'pointer', color: '#e53935' }} onClick={() => { onDeleteReview(r.id); setMenuOpen(null); }}>Eliminar</div>}
                </div>
              )}
            </div>
          )}
          {/* Formulario de edición inline */}
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
              {reviewError && <div style={{ color: '#e53935', marginTop: 8 }}>{reviewError}</div>}
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

export default ReviewList;
