import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";

const CURRENCIES = ["USD", "EUR", "INR", "GBP"];
const MAX_IMAGES = 7;

/* ─────────────────────────────────────────
   Shared design tokens
───────────────────────────────────────── */
const inputStyle = {
  background: "#2A2A2A",
  color: "#E5E2E1",
  border: "1px solid rgba(78,70,51,0.25)",
  fontSize: "0.875rem",
  letterSpacing: "0.01em",
};
const labelStyle = { color: "#D1C5AC", letterSpacing: "0.08em" };
const inputCls =
  "w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200 " +
  "focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400";
const labelCls = "block text-xs font-bold uppercase tracking-widest mb-2";

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });

  // Each image: { id, file, preview }
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Drag-to-add (from OS) state
  const [dropActive, setDropActive] = useState(false);

  // Drag-to-reorder state
  const dragIndexRef = useRef(null);   // index being dragged
  const dragOverRef = useRef(null);    // index hovered over

  const fileInputRef = useRef(null);
  const idCounter = useRef(0);

  /* ── helpers ── */
  const makeId = () => `img-${++idCounter.current}`;

  const addFiles = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const toAdd = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining)
        .map((file) => ({ id: makeId(), file, preview: URL.createObjectURL(file) }));
      setImages((prev) => [...prev, ...toAdd]);
    },
    [images.length]
  );

  /* ── Form change ── */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── File input ── */
  const handleFileInput = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  /* ── Remove image ── */
  const handleImageRemove = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  /* ── Click slot ── */
  const handleSlotClick = () => {
    if (images.length < MAX_IMAGES) fileInputRef.current?.click();
  };

  /* ── OS drag-and-drop (add files) ── */
  const onDragOver = (e) => {
    e.preventDefault();
    setDropActive(true);
  };
  const onDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDropActive(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDropActive(false);
    addFiles(e.dataTransfer.files);
  };

  /* ── Drag-to-reorder ── */
  const onItemDragStart = (e, index) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    // Transparent ghost so we don't see the default drag image
    const ghost = document.createElement("div");
    ghost.style.width = "0";
    ghost.style.height = "0";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };
  const onItemDragEnter = (index) => {
    dragOverRef.current = index;
    if (dragIndexRef.current === null || dragIndexRef.current === index) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndexRef.current, 1);
      next.splice(index, 0, moved);
      dragIndexRef.current = index;
      return next;
    });
  };
  const onItemDragEnd = () => {
    dragIndexRef.current = null;
    dragOverRef.current = null;
  };

  /* ── Submit ── */
  const handleSubmit = async (e, draft = false) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("priceAmount", form.priceAmount);
      formData.append("priceCurrency", form.priceCurrency);
      if (draft) formData.append("status", "draft");
      images.forEach(({ file }) => formData.append("images", file));
      await handleCreateProduct(formData);
      navigate("/seller/products");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────────
     Image grid — 7 slots
     Layout: slot 0 = large (col-span-2, row-span-2)
              slots 1-6 = small (2×3 compact)
  ─────────────────────────────────────────*/
  const renderImageGrid = () => {
    const slots = Array.from({ length: MAX_IMAGES });

    return (
      <div
        className="relative rounded-xl p-2 transition-all duration-200"
        style={{
          background: dropActive ? "rgba(245,197,24,0.04)" : "transparent",
          outline: dropActive ? "2px dashed rgba(245,197,24,0.4)" : "2px dashed transparent",
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Drop overlay hint */}
        {dropActive && images.length < MAX_IMAGES && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl pointer-events-none"
            style={{ background: "rgba(19,19,19,0.65)", backdropFilter: "blur(4px)" }}
          >
            <span className="text-3xl mb-2" style={{ color: "#F5C518" }}>↓</span>
            <span className="text-sm font-medium" style={{ color: "#E5E2E1" }}>
              Drop to add photos
            </span>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2" style={{ gridTemplateRows: "repeat(3, 80px)" }}>
          {/* ── Slot 0 — large ── */}
          <ImageSlot
            image={images[0]}
            isLarge
            onRemove={() => handleImageRemove(0)}
            onClick={handleSlotClick}
            onDragStart={(e) => onItemDragStart(e, 0)}
            onDragEnter={() => onItemDragEnter(0)}
            onDragEnd={onItemDragEnd}
          />

          {/* ── Slots 1-6 — small ── */}
          {slots.slice(1).map((_, i) => (
            <ImageSlot
              key={i + 1}
              image={images[i + 1]}
              onRemove={() => handleImageRemove(i + 1)}
              onClick={handleSlotClick}
              onDragStart={(e) => onItemDragStart(e, i + 1)}
              onDragEnter={() => onItemDragEnter(i + 1)}
              onDragEnd={onItemDragEnd}
            />
          ))}
        </div>

        <p className="mt-2 text-xs" style={{ color: "#9a9078" }}>
          {images.length}/{MAX_IMAGES} photos
          {images.length > 1 && (
            <span className="ml-2 opacity-60">· drag to reorder</span>
          )}
        </p>
      </div>
    );
  };

  /* ─── Render ─── */
  return (
    <div
      className="min-h-screen"
      style={{ background: "#131313", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      {/* ── Navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4 flex items-center justify-between"
        style={{
          background: "rgba(19,19,19,0.72)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(78,70,51,0.12)",
        }}
      >
        <span
          className="text-lg font-semibold"
          style={{ color: "#F5C518", letterSpacing: "-0.02em" }}
        >
          snitch
        </span>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm transition-colors duration-200 hover:text-yellow-300"
          style={{ color: "#9a9078" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </header>

      {/* ── Main ── */}
      <main className="pt-24 pb-20 px-4 lg:px-8">
        {/*
          RESPONSIVE WRAPPER
          • Mobile  : single column, max-w-xl centered
          • Desktop : two columns side-by-side, max-w-screen-lg centered
        */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "1100px",
            animation: "fadeSlideUp 0.35s ease-out both",
          }}
        >
          {/* Page heading */}
          <div className="mb-10">
            <h1
              className="text-3xl font-semibold mb-1"
              style={{ color: "#E5E2E1", letterSpacing: "-0.02em" }}
            >
              Create Product
            </h1>
            <p className="text-sm" style={{ color: "#9a9078" }}>
              List a new item on Snitch
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="mb-8 px-4 py-3 rounded-lg text-sm"
              style={{
                background: "rgba(147,0,10,0.22)",
                border: "1px solid rgba(255,180,171,0.18)",
                color: "#ffb4ab",
              }}
            >
              {error}
            </div>
          )}

          {/*
            ┌──────────────────────┬──────────────────────┐
            │   LEFT — form fields │  RIGHT — images+CTA  │
            └──────────────────────┴──────────────────────┘
            On mobile: stack vertically.
          */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row lg:gap-12 gap-8"
          >
            {/* ═══════════════ LEFT COLUMN ═══════════════ */}
            <div className="flex flex-col gap-7 lg:flex-1">

              {/* Title */}
              <div>
                <label className={labelCls} style={labelStyle}>
                  Title
                </label>
                <input
                  id="product-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="What are you selling?"
                  className={inputCls}
                  style={inputStyle}
                  autoComplete="off"
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelCls} style={labelStyle}>
                  Description
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell buyers what makes this item special..."
                  rows={5}
                  className={inputCls}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              {/* Price + Currency */}
              <div className="flex gap-4">
                <div style={{ flex: "7" }}>
                  <label className={labelCls} style={labelStyle}>
                    Price
                  </label>
                  <input
                    id="product-price"
                    name="priceAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.priceAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: "3" }}>
                  <label className={labelCls} style={labelStyle}>
                    Currency
                  </label>
                  <select
                    id="product-currency"
                    name="priceCurrency"
                    value={form.priceCurrency}
                    onChange={handleChange}
                    className={inputCls}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} style={{ background: "#2A2A2A" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CTA — appears in LEFT column on desktop, hidden on mobile (shown in right) */}
              <div className="hidden lg:block pt-2 space-y-4">
                <SubmitButtons loading={loading} onDraft={(e) => handleSubmit(e, true)} />
              </div>
            </div>

            {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
            <div className="lg:w-[420px] flex flex-col gap-5">

              {/* Images label */}
              <div className="flex items-baseline gap-3">
                <label
                  className={labelCls}
                  style={{ ...labelStyle, marginBottom: 0 }}
                >
                  Images
                </label>
                <span className="text-xs" style={{ color: "#9a9078" }}>
                  up to {MAX_IMAGES} · JPG, PNG, WEBP
                </span>
              </div>

              {/* Drag-zone + grid */}
              {renderImageGrid()}

              {/* "Click to add" button row */}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={handleSlotClick}
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:brightness-110"
                  style={{
                    background: "rgba(245,197,24,0.08)",
                    color: "#FFE5A0",
                    border: "1px dashed rgba(245,197,24,0.25)",
                  }}
                >
                  + Add photos
                </button>
              )}

              {/* CTA — appears in RIGHT column on mobile, hidden on desktop */}
              <div className="lg:hidden pt-2 space-y-4">
                <SubmitButtons loading={loading} onDraft={(e) => handleSubmit(e, true)} />
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none; margin: 0;
        }
        input[type=number] { -moz-appearance: textfield; }

        input::placeholder, textarea::placeholder {
          color: #9a9078 !important;
          opacity: 1;
        }
        select option { background: #2A2A2A; color: #E5E2E1; }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────
   ImageSlot sub-component
───────────────────────────────────────── */
const ImageSlot = ({
  image,
  isLarge,
  onRemove,
  onClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) => {
  const [hovering, setHovering] = useState(false);

  const colSpan = isLarge ? "col-span-2 row-span-3" : "";

  return (
    <div
      className={`${colSpan} relative rounded-lg overflow-hidden transition-all duration-200`}
      style={{
        border: hovering && !image
          ? "1px dashed rgba(245,197,24,0.5)"
          : "1px dashed rgba(78,70,51,0.35)",
        background: "#1C1B1B",
        cursor: image ? "grab" : "pointer",
        userSelect: "none",
      }}
      draggable={!!image}
      onDragStart={image ? onDragStart : undefined}
      onDragEnter={onDragEnter}
      onDragEnd={image ? onDragEnd : undefined}
      onClick={!image ? onClick : undefined}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {image ? (
        <>
          <img
            src={image.preview}
            alt="product"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          {/* Remove button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-150"
            style={{
              background: "rgba(19,19,19,0.82)",
              color: "#E5E2E1",
              backdropFilter: "blur(4px)",
              // always visible on mobile, fade on desktop via parent hover
              opacity: 1,
            }}
          >
            ✕
          </button>
          {/* Drag handle hint */}
          {isLarge && (
            <div
              className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded"
              style={{
                background: "rgba(19,19,19,0.6)",
                backdropFilter: "blur(4px)",
              }}
            >
              <span className="text-xs" style={{ color: "#9a9078" }}>
                ⠿ main
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-1">
          <span
            className="text-xl font-light transition-colors duration-200"
            style={{ color: hovering ? "#F5C518" : "#9a9078" }}
          >
            +
          </span>
          {isLarge && (
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "#9a9078", fontSize: "0.6rem" }}
            >
              Main
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   CTA buttons — reused in both columns
───────────────────────────────────────── */
const SubmitButtons = ({ loading, onDraft }) => (
  <>
    <button
      id="publish-product-btn"
      type="submit"
      disabled={loading}
      className="w-full py-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ background: "#F5C518", color: "#3D2F00", letterSpacing: "0.01em" }}
    >
      {loading ? "Publishing…" : "Publish Product"}
    </button>
    <div className="text-center">
      <button
        id="save-draft-btn"
        type="button"
        disabled={loading}
        onClick={onDraft}
        className="text-sm transition-colors duration-200 hover:opacity-70 disabled:opacity-40"
        style={{ color: "#FFE5A0" }}
      >
        Save as Draft
      </button>
    </div>
  </>
);

export default CreateProduct;