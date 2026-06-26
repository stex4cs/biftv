/**
 * Server-rendered JSON-LD script tag. Use within page or layout to inject
 * schema.org structured data.
 *
 * Multiple schemas? Pass an array. Single schema? Pass an object.
 */
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  return (
    <script
      type="application/ld+json"
      // Stringify on server; safe because we control inputs.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(data) ? data : data),
      }}
    />
  );
}
