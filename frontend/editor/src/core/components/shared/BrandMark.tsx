import "@app/components/shared/BrandMark.css";
import markUrl from "@app/assets/brand/branding-logo/cerradopdf-mark.png";

interface BrandMarkProps {
  /** Height of the mark (CSS length). */
  height?: string;
  className?: string;
}

/**
 * The CerradoPDF logo mark. Rendered as an image (the UniCerrado cerrado-tree
 * page mark) rather than inline SVG: the upstream morph affordance does not
 * apply to this asset.
 */
export function BrandMark({ height = "1.6rem", className }: BrandMarkProps) {
  return (
    <img
      className={`sui-brandmark${className ? ` ${className}` : ""}`}
      src={markUrl}
      style={{ height }}
      role="img"
      aria-label="CerradoPDF"
      alt=""
    />
  );
}
