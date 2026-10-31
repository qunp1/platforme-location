import React, { useEffect, useRef, useState } from 'react';
export function Icon({ name = 'arrow', size = 'normal', ...props }) {
  const paths = {
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    back: 'M20 12H4m6-6-6 6 6 6',
    chevron: 'm9 5 7 7-7 7',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    calendar: 'M5 5h14v16H5zM8 3v4m8-4v4M5 10h14m-10 4h2m2 0h2',
    close: 'm6 6 12 12M6 18 18 6',
    check: 'm5 12 4 4L19 6',
    search: 'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
    filters: 'M4 7h16M4 17h16M8 4v6m8 4v6',
    gear: 'M7 3v7m10-7v7M7 7h10m-5 0v14M4 3h6m4 0h6M9 21h6',
    bag: 'M5 7h14v14H5zM9 7V3h6v4',
    people:
      'M16 21v-3a4 4 0 0 0-8 0v3M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm3 6a4 4 0 0 1 3 4v3M2 21v-3a4 4 0 0 1 3-4',
    shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z M8 12l3 3 5-6',
    info: 'M12 11v6m0-10v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    clock: 'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    menu: 'M4 6h16M4 12h16M4 18h16',
    home: 'm3 10 9-7 9 7v11h-6v-7H9v7H3Z',
    help: 'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    photo: 'M3 4h18v16H3zM3 16l6-6 5 5 3-3 4 4M16 8h1',
    expand: 'M9 3H3v6m0-6 6 6m6-6h6v6m0-6-6 6M3 15v6h6m-6 0 6-6m12 0v6h-6m6 0-6-6',
    car: 'M3 16v-6l3-6h12l3 6v6H3Zm2 0v4m14-4v4M3 10h18M6 13h2m8 0h2',
    fuel: 'M4 21V3h9v18M4 10h9m2-7 4 4v9c0 3-4 3-4 0v-4h-2M2 21h13',
    plane: 'M22 2 9 15m13-13-5 20-4-9-11-4Z',
    anchor:
      'M12 7v14M8 4a4 4 0 1 0 8 0 4 4 0 0 0-8 0M4 12v2a8 8 0 0 0 16 0v-2M2 14l2-2 2 2m12 0 2-2 2 2',
    external: 'M13 3h8v8m0-8L10 14M10 3H3v18h18v-7',
  };
  return (
    <svg
      className={`icon icon-${size}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
export function Button({
  variant = 'primary',
  children,
  className = '',
  pending,
  disabled,
  ...props
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      {children}
    </button>
  );
}
export function Modal({ title, children, onClose, className = '' }) {
  const ref = useRef(null),
    motion = useRef(null),
    closing = useRef(false),
    closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    const element = ref.current;
    element.showModal();
    document.body.style.overflow = 'hidden';
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const scale = matchMedia('(min-width: 768px)').matches;
      motion.current = element.animate(
        [
          { opacity: 0, transform: scale ? 'scale(.98)' : 'none' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 180, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );
    }
    return () => {
      motion.current?.cancel();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  function dismiss() {
    if (closing.current) return;
    closing.current = true;
    const element = ref.current;
    const opacity = getComputedStyle(element).opacity;
    motion.current?.cancel();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      closeCallback.current();
      return;
    }
    element.dataset.closing = 'true';
    motion.current = element.animate([{ opacity }, { opacity: 0 }], {
      duration: 120,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    });
    motion.current.onfinish = () => closeCallback.current();
  }
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-labelledby="modal-heading"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            dismiss();
        }
      }}
    >
      <div className="modal-header">
        <h2 id="modal-heading">{title}</h2>
        <Button
          variant="quiet"
          className="icon-button"
          style={{ minWidth: 48, minHeight: 48 }}
          onClick={dismiss}
          aria-label="Fermer"
        >
          <Icon name="close" />
        </Button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
export function Notice({ children, tone = 'info', ...props }) {
  return (
    <div className={`notice notice-${tone}`} {...props}>
      <Icon name="info" />
      <div>{children}</div>
    </div>
  );
}
export function CarPhoto({ src, name, className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  return failed || !src ? (
    <div
      className={`photo-fallback ${className}`}
      role="img"
      aria-label={`Photo indisponible pour ${name}`}
    >
      <Icon name="car" />
      <span>Photo à venir</span>
    </div>
  ) : (
    <img
      src={src}
      alt={`${name} · illustration du modèle`}
      className={className}
      width="800"
      height="520"
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
export function Skeletons({ count = 3 }) {
  return (
    <div className="skeleton-grid" aria-busy="true" role="status">
      <span className="sr-only">Chargement des offres…</span>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" aria-hidden="true">
          <div />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
export function EmptyState({ title, children, action, headingAs: Heading = 'h2', titleProps }) {
  return (
    <div className="empty-state">
      <Icon name="search" />
      <Heading {...titleProps}>{title}</Heading>
      <p>{children}</p>
      {action}
    </div>
  );
}
