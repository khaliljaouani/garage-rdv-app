// AutoGrowTextarea.jsx
import React, { useRef, useLayoutEffect } from "react";
import { Form } from "react-bootstrap";

export default function AutoGrowTextarea({ value = "", className, style, ...props }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";                 // reset
    el.style.height = el.scrollHeight + "px"; // ajuste à la hauteur du contenu
  }, [value]);

  return (
    <Form.Control
      as="textarea"
      ref={ref}
      value={value}
      readOnly
      rows={1}                                // une seule ligne de base
      className={className}
      style={{
        overflow: "hidden",                   // pas de scrollbar verticale
        resize: "none",                       // empêche le redimensionnement manuel
        whiteSpace: "pre-wrap",               // garde les retours à la ligne
        ...style,
      }}
      {...props}
    />
  );
}
