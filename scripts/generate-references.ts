/**
 * generate-references.ts
 *
 * Reads JSON schemas and TypeScript source from a local clone of
 * doc-detective/doc-detective and generates:
 *   1. Schema .md pages in fern/pages/reference/schemas/
 *   2. API function .mdx stubs in fern/pages/reference/api/
 *
 * Usage: npx tsx scripts/generate-references.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SOURCE_REPO = path.resolve(ROOT, "..", "doc-detective");
const SCHEMAS_JSON = path.join(
  SOURCE_REPO,
  "src/common/src/schemas/schemas.json"
);
const SCHEMA_OUT_DIR = path.join(ROOT, "fern/pages/reference/schemas");
const API_OUT_DIR = path.join(ROOT, "fern/pages/reference/api");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SchemaLike {
  $schema?: string;
  title?: string;
  description?: string;
  type?: string | string[];
  anyOf?: SchemaLike[];
  oneOf?: SchemaLike[];
  allOf?: SchemaLike[];
  properties?: Record<string, SchemaLike>;
  items?: SchemaLike;
  required?: string[];
  enum?: (string | number | boolean)[];
  default?: unknown;
  pattern?: string;
  readOnly?: boolean;
  minimum?: number;
  maximum?: number;
  additionalProperties?: boolean | SchemaLike;
  components?: { schemas?: Record<string, SchemaLike> };
  examples?: unknown[];
  $comment?: string;
  transform?: string[];
  minItems?: number;
}

interface PageDef {
  /** Output filename, e.g. "checklink.md" */
  file: string;
  /** Display title for frontmatter */
  title: string;
  /** Optional description paragraph */
  description?: string;
  /** Schema object to render fields from */
  schema: SchemaLike;
  /**
   * "direct"   – render properties directly
   * "wrapper"  – step-level wrapper: one field named `wrapField` with type from schema
   * "empty"    – object with additionalProperties, no known properties
   */
  mode: "direct" | "wrapper" | "empty";
  /** For wrapper mode: the field name */
  wrapField?: string;
}

// ---------------------------------------------------------------------------
// Load schemas
// ---------------------------------------------------------------------------
const allSchemas: Record<string, SchemaLike> = JSON.parse(
  fs.readFileSync(SCHEMAS_JSON, "utf8")
);

// ---------------------------------------------------------------------------
// Helpers: title → slug → filename
// ---------------------------------------------------------------------------
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Map a (title, filename) so we can resolve cross-references */
const titleToFileMap = new Map<string, string>();
const fileToTitleMap = new Map<string, string>();

function registerPage(title: string, file: string) {
  titleToFileMap.set(title, file);
  fileToTitleMap.set(file, title);
}

// ---------------------------------------------------------------------------
// Build all page definitions
// ---------------------------------------------------------------------------

function buildPageDefs(): PageDef[] {
  const defs: PageDef[] = [];

  // Helper to get schema or throw
  const get = (key: string): SchemaLike => {
    const s = allSchemas[key];
    if (!s) throw new Error(`Schema not found: ${key}`);
    return s;
  };

  const comp = (key: string, compName: string): SchemaLike => {
    const s = get(key);
    const c = s.components?.schemas?.[compName];
    if (!c) throw new Error(`Component ${compName} not found in ${key}`);
    return c;
  };

  // ── Action step wrapper pages ──────────────────────────────────────────
  const actions: Array<{
    key: string;
    file: string;
    wrapField: string;
  }> = [
    { key: "checkLink_v3", file: "checklink.md", wrapField: "checkLink" },
    { key: "click_v3", file: "click.md", wrapField: "click" },
    {
      key: "dragAndDrop_v3",
      file: "draganddrop.md",
      wrapField: "dragAndDrop",
    },
    { key: "find_v3", file: "find.md", wrapField: "find" },
    { key: "goTo_v3", file: "goto.md", wrapField: "goTo" },
    { key: "httpRequest_v3", file: "httprequest.md", wrapField: "httpRequest" },
    { key: "loadCookie_v3", file: "loadcookie.md", wrapField: "loadCookie" },
    {
      key: "loadVariables_v3",
      file: "loadvariables.md",
      wrapField: "loadVariables",
    },
    { key: "record_v3", file: "record.md", wrapField: "record" },
    { key: "runCode_v3", file: "runcode.md", wrapField: "runCode" },
    { key: "runShell_v3", file: "runshell.md", wrapField: "runShell" },
    { key: "saveCookie_v3", file: "savecookie.md", wrapField: "saveCookie" },
    { key: "screenshot_v3", file: "screenshot.md", wrapField: "screenshot" },
    { key: "stopRecord_v3", file: "stoprecord.md", wrapField: "stopRecord" },
    { key: "type_v3", file: "type.md", wrapField: "type" },
    { key: "wait_v3", file: "wait.md", wrapField: "wait" },
  ];

  for (const a of actions) {
    const schema = get(a.key);
    defs.push({
      file: a.file,
      title: schema.title || a.wrapField,
      description: undefined, // wrapper pages don't show description
      schema,
      mode: "wrapper",
      wrapField: a.wrapField,
    });
  }

  // ── Action detailed/object pages ───────────────────────────────────────
  const detailedPages: Array<{
    key: string;
    compName: string;
    file: string;
  }> = [
    {
      key: "checkLink_v3",
      compName: "object",
      file: "check-link-detailed.md",
    },
    {
      key: "click_v3",
      compName: "object",
      file: "click-element-detailed.md",
    },
    {
      key: "find_v3",
      compName: "object",
      file: "find-element-detailed.md",
    },
    { key: "goTo_v3", compName: "object", file: "go-to-url-detailed.md" },
    {
      key: "httpRequest_v3",
      compName: "object",
      file: "http-request-detailed.md",
    },
    {
      key: "loadCookie_v3",
      compName: "object",
      file: "load-cookie-detailed.md",
    },
    { key: "record_v3", compName: "object", file: "record-detailed.md" },
    { key: "runCode_v3", compName: "object", file: "run-code-detailed.md" },
    {
      key: "runShell_v3",
      compName: "object",
      file: "run-shell-command-detailed.md",
    },
    {
      key: "saveCookie_v3",
      compName: "object",
      file: "save-cookie-detailed.md",
    },
    {
      key: "screenshot_v3",
      compName: "object",
      file: "capture-screenshot-detailed.md",
    },
    { key: "type_v3", compName: "object", file: "type-keys-detailed.md" },
  ];

  for (const d of detailedPages) {
    const schema = comp(d.key, d.compName);
    defs.push({
      file: d.file,
      title: schema.title || d.file.replace(".md", ""),
      description: schema.description,
      schema,
      mode: "direct",
    });
  }

  // ── Direct schemas ─────────────────────────────────────────────────────
  const directSchemas: Array<{ key: string; file: string }> = [
    { key: "config_v3", file: "config.md" },
    { key: "context_v3", file: "context.md" },
    { key: "test_v3", file: "test.md" },
    { key: "spec_v3", file: "specification.md" },
    { key: "openApi_v3", file: "openapi.md" },
    { key: "dragAndDrop_v3", file: "draganddrop.md" },
  ];

  for (const d of directSchemas) {
    // dragAndDrop is already registered as a wrapper above, skip re-adding
    if (d.file === "draganddrop.md") continue;
    const schema = get(d.key);
    defs.push({
      file: d.file,
      title: schema.title || d.key,
      description: schema.description,
      schema,
      mode: "direct",
    });
  }

  // ── step_v3 common fields ──────────────────────────────────────────────
  {
    const schema = comp("step_v3", "common");
    defs.push({
      file: "common.md",
      title: schema.title || "Common",
      description: schema.description,
      schema,
      mode: "direct",
    });
  }

  // ── context_v3 sub-schemas ─────────────────────────────────────────────
  {
    const browser = comp("context_v3", "browser");
    defs.push({
      file: "browser.md",
      title: browser.title || "Browser",
      description: browser.description,
      schema: browser,
      mode: "direct",
    });

    // Browser sub-schemas: window and viewport
    const window = browser.properties?.window;
    if (window) {
      defs.push({
        file: "browser-window.md",
        title: window.title || "Browser Window",
        description: window.description,
        schema: window,
        mode: "direct",
      });
    }
    const viewport = browser.properties?.viewport;
    if (viewport) {
      defs.push({
        file: "browser-viewport.md",
        title: viewport.title || "Browser Viewport",
        description: viewport.description,
        schema: viewport,
        mode: "direct",
      });
    }
  }

  // ── config_v3 sub-schemas ──────────────────────────────────────────────
  {
    const cfg = get("config_v3");

    // environment
    const env = comp("config_v3", "environment");
    defs.push({
      file: "environment-details.md",
      title: env.title || "Environment details",
      description: env.description,
      schema: env,
      mode: "direct",
    });

    // markupDefinition
    const markup = comp("config_v3", "markupDefinition");
    defs.push({
      file: "markup-definition.md",
      title: markup.title || "Markup definition",
      description: markup.description,
      schema: markup,
      mode: "direct",
    });

    // inlineStatements
    const inline = comp("config_v3", "inlineStatements");
    defs.push({
      file: "inline-statement-definition.md",
      title: inline.title || "Inline statement definition",
      description: inline.description,
      schema: inline,
      mode: "direct",
    });

    // integrations
    const integ = cfg.properties?.integrations;
    if (integ) {
      defs.push({
        file: "integrations-options.md",
        title: "Integrations options",
        description: integ.description,
        schema: integ,
        mode: "direct",
      });

      // docDetectiveApi
      const ddApi = integ.properties?.docDetectiveApi;
      if (ddApi) {
        defs.push({
          file: "doc-detective-orchestration-api.md",
          title: ddApi.title || "Doc Detective Orchestration API",
          description: ddApi.description,
          schema: ddApi,
          mode: "direct",
        });
      }
    }

    // telemetry
    const telem = cfg.properties?.telemetry;
    if (telem) {
      defs.push({
        file: "telemetry-options.md",
        title: "Telemetry options",
        description: telem.description,
        schema: telem,
        mode: "direct",
      });
    }

    // fileTypes sub-schemas: custom, executable
    const ft = cfg.properties?.fileTypes;
    if (ft?.anyOf?.[0]?.items?.anyOf) {
      const ftItems = ft.anyOf[0].items.anyOf;
      const custom = ftItems.find(
        (i: SchemaLike) => i.title === "File type (custom)"
      );
      if (custom) {
        defs.push({
          file: "file-type-custom.md",
          title: custom.title!,
          description: custom.description,
          schema: custom,
          mode: "direct",
        });
      }
      const exec = ftItems.find(
        (i: SchemaLike) => i.title === "File type (executable)"
      );
      if (exec) {
        defs.push({
          file: "file-type-executable.md",
          title: exec.title!,
          description: exec.description,
          schema: exec,
          mode: "direct",
        });
      }
    }
  }

  // ── httpRequest sub-schemas ────────────────────────────────────────────
  {
    const hrObj = comp("httpRequest_v3", "object");

    // request
    const request = hrObj.properties?.request;
    if (request) {
      defs.push({
        file: "request.md",
        title: request.title || "Request",
        description: request.description,
        schema: request,
        mode: "direct",
      });

      // request.headers (anyOf object variant)
      const reqHeaders = request.properties?.headers;
      if (reqHeaders?.anyOf) {
        const obj = reqHeaders.anyOf.find(
          (i: SchemaLike) => i.type === "object"
        );
        if (obj) {
          defs.push({
            file: "request-headers-object.md",
            title: obj.title || "Request headers (object)",
            description: obj.description,
            schema: obj,
            mode: "empty",
          });
        }
      }

      // request.parameters
      const reqParams = request.properties?.parameters;
      if (reqParams) {
        defs.push({
          file: "request-parameters.md",
          title: reqParams.title || "Request parameters",
          description: reqParams.description,
          schema: reqParams,
          mode: "empty",
        });
      }

      // request.body (anyOf object variant)
      const reqBody = request.properties?.body;
      if (reqBody?.anyOf) {
        const obj = reqBody.anyOf.find(
          (i: SchemaLike) => i.type === "object"
        );
        if (obj) {
          defs.push({
            file: "request-body-object.md",
            title: obj.title || "Request body (object)",
            description: obj.description,
            schema: obj,
            mode: "empty",
          });
        }
      }
    }

    // response
    const response = hrObj.properties?.response;
    if (response) {
      defs.push({
        file: "response.md",
        title: response.title || "Response",
        description: response.description,
        schema: response,
        mode: "direct",
      });

      // response.headers
      const respHeaders = response.properties?.headers;
      if (respHeaders) {
        defs.push({
          file: "response-headers.md",
          title: respHeaders.title || "Response headers",
          description: respHeaders.description,
          schema: respHeaders,
          mode: "empty",
        });
      }

      // response.body (anyOf object variant)
      const respBody = response.properties?.body;
      if (respBody?.anyOf) {
        const obj = respBody.anyOf.find(
          (i: SchemaLike) => i.type === "object"
        );
        if (obj) {
          defs.push({
            file: "response-body-object.md",
            title: obj.title || "Response body object",
            description: obj.description,
            schema: obj,
            mode: "empty",
          });
        }
      }
    }
  }

  // ── screenshot sub-schemas ─────────────────────────────────────────────
  {
    const cropEl = allSchemas.screenshot_v3?.components?.schemas?.crop_element;
    if (cropEl) {
      defs.push({
        file: "crop-by-element-detailed.md",
        title: cropEl.title || "Crop by element (detailed)",
        description: cropEl.description,
        schema: cropEl,
        mode: "direct",
      });
    }

    const padding = allSchemas.screenshot_v3?.components?.schemas?.padding;
    if (padding) {
      defs.push({
        file: "padding-detailed.md",
        title: padding.title || "Padding (detailed)",
        description: padding.description,
        schema: padding,
        mode: "direct",
      });
    }
  }

  // ── find sub-schemas ───────────────────────────────────────────────────
  {
    const findObj = comp("find_v3", "object");
    const clickProp = findObj.properties?.click;
    if (clickProp?.anyOf) {
      const feClick = clickProp.anyOf.find(
        (i: SchemaLike) => i.title === "Find element and click"
      );
      if (feClick) {
        defs.push({
          file: "find-element-and-click.md",
          title: feClick.title!,
          description: feClick.description,
          schema: feClick,
          mode: "direct",
        });
      }
    }
  }

  // ── resolved context ───────────────────────────────────────────────────
  {
    const test = get("test_v3");
    const ctxItems = test.properties?.contexts?.items;
    if (ctxItems) {
      defs.push({
        file: "resolved-context.md",
        title: "Resolved context",
        description: ctxItems.description,
        schema: ctxItems,
        mode: "direct",
      });
    }
  }

  return defs;
}

// ---------------------------------------------------------------------------
// Type rendering
// ---------------------------------------------------------------------------

/**
 * Check if an anyOf/oneOf is just conditional validation (different required
 * field combos) rather than actual type alternatives.
 */
function isConditionalValidation(variants: SchemaLike[]): boolean {
  return variants.every(
    (v) =>
      v.required &&
      !v.type &&
      !v.anyOf &&
      !v.oneOf &&
      !v.properties
  );
}

/** Render a JSON Schema type as markdown inline text */
function renderType(schema: SchemaLike, depth = 0): string {
  if (!schema) return "unknown";

  // Object type with title → always render as object reference (even if it has anyOf for validation)
  if (schema.type === "object" && schema.title) {
    const slug = titleToFileMap.get(schema.title);
    if (slug) {
      const ref = slug.replace(".md", "");
      return `object([${schema.title}](/reference/schemas/${ref}))`;
    }
    return `object(${schema.title})`;
  }

  // Object type without title but with anyOf that is just conditional validation
  if (
    schema.type === "object" &&
    schema.anyOf &&
    isConditionalValidation(schema.anyOf)
  ) {
    return "object";
  }

  // anyOf / oneOf (type alternatives)
  const variants = schema.anyOf || schema.oneOf;
  if (variants && variants.length > 0 && !isConditionalValidation(variants)) {
    // Flatten nested anyOf/oneOf (e.g., click_v3 anyOf containing another anyOf)
    const flatVariants: SchemaLike[] = [];
    for (const v of variants) {
      const inner = v.anyOf || v.oneOf;
      if (inner && inner.length > 0 && !isConditionalValidation(inner)) {
        flatVariants.push(...inner);
      } else {
        flatVariants.push(v);
      }
    }
    const rendered = flatVariants
      .map((v) => renderType(v, depth + 1))
      .filter((t) => t !== "unknown");
    if (rendered.length === 0) return "unknown";
    if (rendered.length === 1) return rendered[0];
    return "one of:<br/>" + rendered.map((t) => `- ${t}`).join("<br/>");
  }

  // allOf – mostly just pass through the first meaningful one
  if (schema.allOf && schema.allOf.length > 0) {
    return renderType(schema.allOf[0], depth);
  }

  // Array type
  if (schema.type === "array") {
    if (schema.items) {
      const itemType = renderType(schema.items, depth + 1);
      return `array of ${itemType}`;
    }
    return "array of unknown";
  }

  // Multi-type (e.g., ["boolean", "null"])
  if (Array.isArray(schema.type)) {
    return schema.type.filter((t) => t !== "null").join(",");
  }

  // Object type (no title)
  if (schema.type === "object") {
    if (
      schema.properties &&
      Object.keys(schema.properties).length === 0 &&
      schema.additionalProperties
    ) {
      return "object";
    }
    return "object";
  }

  // Primitive types
  if (schema.type) return schema.type as string;

  // Schema reference (has title but no explicit type)
  if (schema.title) {
    const slug = titleToFileMap.get(schema.title);
    if (slug) {
      const ref = slug.replace(".md", "");
      return `object([${schema.title}](/reference/schemas/${ref}))`;
    }
    return "unknown";
  }

  return "unknown";
}

// ---------------------------------------------------------------------------
// Build "Referenced In" map
// ---------------------------------------------------------------------------
type RefMap = Map<string, Set<string>>; // file → set of referencing page files

function buildReferenceMap(pageDefs: PageDef[]): RefMap {
  const refMap: RefMap = new Map();

  // Initialize
  for (const pd of pageDefs) {
    refMap.set(pd.file, new Set());
  }

  // Action wrapper page files
  const actionWrapperFiles = new Set(
    pageDefs.filter((pd) => pd.mode === "wrapper").map((pd) => pd.file)
  );

  // For each page, scan its rendered type strings for cross-references
  for (const pd of pageDefs) {
    const referencedFiles = findReferencedFiles(pd);
    for (const refFile of referencedFiles) {
      if (refMap.has(refFile)) {
        refMap.get(refFile)!.add(pd.file);
      }
    }
  }

  // Action wrappers are referenced by step-using pages: markup-definition, test, resolved-context
  const stepParents = [
    "markup-definition.md",
    "test.md",
    "resolved-context.md",
  ];
  for (const wrapperFile of actionWrapperFiles) {
    const refs = refMap.get(wrapperFile)!;
    for (const parent of stepParents) {
      if (refMap.has(parent)) {
        refs.add(parent);
      }
    }
  }

  return refMap;
}

/** Find which other pages a given page's fields reference */
function findReferencedFiles(pd: PageDef): Set<string> {
  const refs = new Set<string>();

  if (pd.mode === "wrapper") {
    // The wrapper type references the schema's type variants
    scanSchemaForRefs(pd.schema, refs, 0);
  } else if (pd.schema.properties) {
    for (const prop of Object.values(pd.schema.properties)) {
      scanSchemaForRefs(prop, refs, 0);
    }
  }

  return refs;
}

function scanSchemaForRefs(schema: SchemaLike, refs: Set<string>, depth: number) {
  if (!schema || depth > 3) return;

  // Object with title → potential cross-reference to a page
  if (schema.type === "object" && schema.title) {
    const slug = titleToFileMap.get(schema.title);
    if (slug) refs.add(slug);
    return; // Don't recurse into the object's properties
  }

  // Title without type → also a potential reference
  if (schema.title && !schema.type) {
    const slug = titleToFileMap.get(schema.title);
    if (slug) refs.add(slug);
  }

  if (schema.anyOf)
    for (const s of schema.anyOf) scanSchemaForRefs(s, refs, depth + 1);
  if (schema.oneOf)
    for (const s of schema.oneOf) scanSchemaForRefs(s, refs, depth + 1);
  if (schema.allOf)
    for (const s of schema.allOf) scanSchemaForRefs(s, refs, depth + 1);
  if (schema.items) scanSchemaForRefs(schema.items, refs, depth + 1);
}

// ---------------------------------------------------------------------------
// Render a schema page to markdown
// ---------------------------------------------------------------------------

function renderSchemaPage(pd: PageDef, refMap: RefMap): string {
  const lines: string[] = [];

  // Frontmatter
  lines.push("---");
  lines.push(`title: "${pd.title}"`);
  lines.push("---");
  lines.push("");

  // Description
  if (pd.description) {
    lines.push(pd.description);
    lines.push("");
  }

  // Referenced In
  const refs = refMap.get(pd.file);
  if (refs && refs.size > 0) {
    lines.push("## Referenced In");
    lines.push("");
    const sorted = [...refs].filter((r) => r !== pd.file).sort();
    for (const refFile of sorted) {
      const refTitle = fileToTitleMap.get(refFile) || refFile;
      const refSlug = refFile.replace(".md", "");
      lines.push(`- [${refTitle}](/reference/schemas/${refSlug})`);
    }
    lines.push("");
  }

  // Fields
  lines.push("## Fields");
  lines.push("");
  lines.push("Field | Type | Description | Default");
  lines.push(":-- | :-- | :-- | :--");

  if (pd.mode === "wrapper") {
    // Single field row for step wrapper
    const fieldName = pd.wrapField!;
    const typeStr = renderWrapperType(pd.schema);
    const desc = buildDescription(pd.schema, true);
    const def = renderDefault(pd.schema);
    lines.push(`${fieldName} | ${typeStr} | ${desc} | ${def}`);
  } else if (pd.mode === "direct" && pd.schema.properties) {
    // Only use top-level required array; anyOf required is conditional validation
    const required = new Set(pd.schema.required || []);

    for (const [fieldName, fieldSchema] of Object.entries(
      pd.schema.properties
    )) {
      const typeStr = renderType(fieldSchema);
      const isRequired = required.has(fieldName);
      const isReadOnly = !!fieldSchema.readOnly;
      const desc = buildFieldDescription(fieldSchema, isRequired, isReadOnly);
      const def = renderDefault(fieldSchema);
      lines.push(`${fieldName} | ${typeStr} | ${desc} | ${def}`);
    }
  }
  // "empty" mode: no field rows (just the table header)

  lines.push("");

  // Examples
  lines.push("## Examples");

  const examples = pd.mode === "wrapper"
    ? getWrapperExamples(pd)
    : getDirectExamples(pd);

  if (examples.length > 0) {
    for (const ex of examples) {
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(ex, null, 2));
      lines.push("```");
    }
  }

  // Ensure file ends with newline
  return lines.join("\n") + "\n";
}

/** Render the type string for a step wrapper page's single field */
function renderWrapperType(schema: SchemaLike): string {
  // For schemas with anyOf at top level (type alternatives, not conditional validation)
  if (schema.anyOf && !isConditionalValidation(schema.anyOf)) {
    const parts: string[] = [];
    for (const variant of schema.anyOf) {
      const rendered = renderType(variant);
      if (rendered !== "unknown") parts.push(rendered);
    }
    if (parts.length === 1) return parts[0];
    if (parts.length > 1) {
      return "one of:<br/>" + parts.map((p) => `- ${p}`).join("<br/>");
    }
  }

  // For direct type schemas (like loadVariables_v3 which is just "string")
  if (Array.isArray(schema.type)) {
    return schema.type.filter((t) => t !== "null").join(",");
  }
  if (schema.type === "object") {
    // Self-referencing like dragAndDrop
    const title = schema.title;
    if (title) {
      const slug = titleToFileMap.get(title);
      if (slug) {
        const ref = slug.replace(".md", "");
        return `object([${title}](/reference/schemas/${ref}))`;
      }
    }
    return "object";
  }
  if (schema.type) return schema.type as string;
  return "unknown";
}

function buildDescription(
  schema: SchemaLike,
  isRequired: boolean
): string {
  const parts: string[] = [];
  parts.push(isRequired ? "Required." : "Optional.");

  if (schema.description) {
    parts.push(schema.description);
  } else {
    parts.push("No description provided.");
  }

  return parts.join(" ");
}

function buildFieldDescription(
  schema: SchemaLike,
  isRequired: boolean,
  isReadOnly: boolean
): string {
  const parts: string[] = [];

  if (isReadOnly) {
    parts.push("ReadOnly.");
  } else {
    parts.push(isRequired ? "Required." : "Optional.");
  }

  if (schema.description) {
    parts.push(schema.description);
  } else {
    parts.push("No description provided.");
  }

  // Build suffix separately to avoid extra spaces before <br/>
  const suffixes: string[] = [];

  // Pattern
  if (schema.pattern) {
    // Clean up pattern for display - remove extra escapes
    const displayPattern = schema.pattern
      .replace(/\\\\/g, "\\")
      .replace(/^\^/, "")
      .replace(/\$$/, "");
    suffixes.push(`Pattern: \`${displayPattern}\``);
  }

  // Accepted values (enum)
  if (schema.enum && schema.enum.length > 0) {
    const vals = schema.enum.map((v) => `\`${v}\``).join(", ");
    suffixes.push(`Accepted values: ${vals}`);
  }

  // Minimum / Maximum
  if (schema.minimum !== undefined || schema.maximum !== undefined) {
    const constraints: string[] = [];
    if (schema.minimum !== undefined)
      constraints.push(`Minimum: ${schema.minimum}`);
    if (schema.maximum !== undefined)
      constraints.push(`Maximum: ${schema.maximum}`);
    suffixes.push(constraints.join(". "));
  }

  let result = parts.join(" ");
  if (suffixes.length > 0) {
    result += "<br/><br/>" + suffixes.join("<br/><br/>");
  }
  return result;
}

function renderDefault(schema: SchemaLike): string {
  if (schema.default === undefined) return "";
  if (schema.default === null) return "`null`";
  if (typeof schema.default === "string") return `\`${schema.default}\``;
  if (typeof schema.default === "boolean")
    return `\`${schema.default}\``;
  if (typeof schema.default === "number")
    return `\`${schema.default}\``;
  // Complex defaults (arrays, objects)
  return `\`\`${JSON.stringify(schema.default)}\`\``;
}

/** Get examples for wrapper pages - wrap each example in {actionName: example} */
function getWrapperExamples(pd: PageDef): unknown[] {
  const schema = pd.schema;
  const fieldName = pd.wrapField!;

  if (schema.examples && schema.examples.length > 0) {
    return schema.examples.map((ex) => ({ [fieldName]: ex }));
  }

  // Fallback: generate a simple example
  return [{ [fieldName]: generateExample(schema) }];
}

/** Get examples for direct schema pages */
function getDirectExamples(pd: PageDef): unknown[] {
  const schema = pd.schema;

  if (schema.examples && schema.examples.length > 0) {
    return schema.examples as unknown[];
  }

  // Fallback: generate from properties
  if (schema.properties) {
    const ex: Record<string, unknown> = {};
    for (const [name, prop] of Object.entries(schema.properties)) {
      ex[name] = generateExample(prop);
    }
    return [ex];
  }

  return [];
}

function generateExample(schema: SchemaLike): unknown {
  if (schema.default !== undefined) return schema.default;
  if (schema.enum && schema.enum.length > 0) return schema.enum[0];
  if (schema.examples && schema.examples.length > 0)
    return schema.examples[0];

  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  switch (type) {
    case "string":
      return "example";
    case "integer":
    case "number":
      return 42;
    case "boolean":
      return true;
    case "array":
      return [];
    case "object":
      return {};
    default:
      if (schema.anyOf) return generateExample(schema.anyOf[0]);
      return "example";
  }
}

// ---------------------------------------------------------------------------
// Phase 2: API function page generation
// ---------------------------------------------------------------------------

interface FunctionSig {
  name: string;
  params: Array<{ name: string; type: string; required: boolean }>;
  returnType: string;
  jsdoc?: string;
  isAsync: boolean;
}

function parseTsFunctions(): FunctionSig[] {
  const functions: FunctionSig[] = [];

  const files = [
    path.join(SOURCE_REPO, "src/core/index.ts"),
    path.join(SOURCE_REPO, "src/core/tests.ts"),
    path.join(SOURCE_REPO, "src/core/detectTests.ts"),
    path.join(SOURCE_REPO, "src/core/resolveTests.ts"),
    path.join(SOURCE_REPO, "src/core/files.ts"),
  ];

  const exportedNames = new Set([
    "runTests",
    "getRunner",
    "detectTests",
    "detectAndResolveTests",
    "resolveTests",
    "readFile",
    "resolvePaths",
  ]);

  for (const filePath of files) {
    if (!fs.existsSync(filePath)) continue;

    const sourceText = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    ts.forEachChild(sourceFile, (node) => {
      if (ts.isFunctionDeclaration(node) && node.name) {
        const name = node.name.text;
        if (!exportedNames.has(name)) return;

        const sig = extractFunctionSig(node, sourceFile);
        if (sig) functions.push(sig);
      }
    });
  }

  return functions;
}

function extractFunctionSig(
  node: ts.FunctionDeclaration,
  sourceFile: ts.SourceFile
): FunctionSig | null {
  const name = node.name?.text;
  if (!name) return null;

  const isAsync = !!node.modifiers?.some(
    (m) => m.kind === ts.SyntaxKind.AsyncKeyword
  );

  const params: FunctionSig["params"] = [];

  for (const param of node.parameters) {
    const paramName = param.name.getText(sourceFile);
    const paramType = param.type
      ? param.type.getText(sourceFile)
      : "any";
    const required = !param.questionToken && !param.initializer;

    // Handle destructured params
    if (ts.isObjectBindingPattern(param.name)) {
      // Extract from type annotation if available
      if (param.type && ts.isTypeLiteralNode(param.type)) {
        for (const member of param.type.members) {
          if (ts.isPropertySignature(member) && member.name) {
            const mName = member.name.getText(sourceFile);
            const mType = member.type
              ? member.type.getText(sourceFile)
              : "any";
            const mRequired = !member.questionToken;
            params.push({ name: mName, type: mType, required: mRequired });
          }
        }
      } else {
        // Fallback: just use the parameter text
        params.push({ name: paramName, type: paramType, required });
      }
    } else {
      params.push({ name: paramName, type: paramType, required });
    }
  }

  const returnType = node.type
    ? node.type.getText(sourceFile)
    : "any";

  // Extract JSDoc
  let jsdoc: string | undefined;
  const jsDocNodes = ts.getJSDocCommentsAndTags(node);
  for (const doc of jsDocNodes) {
    if (ts.isJSDoc(doc) && doc.comment) {
      jsdoc =
        typeof doc.comment === "string"
          ? doc.comment
          : doc.comment
              .map((c) => ("text" in c ? c.text : ""))
              .join("");
    }
  }

  return { name, params, returnType, jsdoc, isAsync };
}

// ---------------------------------------------------------------------------
// API page generation
// ---------------------------------------------------------------------------

const CUSTOM_START = "<!-- CUSTOM CONTENT START -->";
const CUSTOM_END = "<!-- CUSTOM CONTENT END -->";

interface ApiPageDef {
  file: string;
  functionName: string;
  sidebarTitle?: string;
}

const API_PAGES: ApiPageDef[] = [
  { file: "run-tests.mdx", functionName: "runTests" },
  { file: "get-runner.mdx", functionName: "getRunner" },
  { file: "detect-tests.mdx", functionName: "detectTests" },
  {
    file: "detect-and-resolve-tests.mdx",
    functionName: "detectAndResolveTests",
  },
  { file: "resolve-tests.mdx", functionName: "resolveTests" },
  { file: "read-file.mdx", functionName: "readFile" },
  { file: "resolve-paths.mdx", functionName: "resolvePaths" },
];

function generateApiPage(apd: ApiPageDef, sig: FunctionSig | undefined): string {
  const existingPath = path.join(API_OUT_DIR, apd.file);
  let customContent = "";

  // Preserve existing custom content between markers
  if (fs.existsSync(existingPath)) {
    const existing = fs.readFileSync(existingPath, "utf8");
    const startIdx = existing.indexOf(CUSTOM_START);
    const endIdx = existing.indexOf(CUSTOM_END);
    if (startIdx !== -1 && endIdx !== -1) {
      customContent = existing.substring(
        startIdx + CUSTOM_START.length,
        endIdx
      );
    } else {
      // No markers yet – preserve everything after the generated sections
      // Find where custom content starts (after ## Return value section)
      const returnIdx = existing.indexOf("## Return value");
      if (returnIdx !== -1) {
        // Find end of return value section (next ## or end)
        const afterReturn = existing.substring(returnIdx);
        const nextSection = afterReturn.indexOf("\n## ", 1);
        if (nextSection !== -1) {
          customContent =
            "\n" + afterReturn.substring(nextSection).trimEnd() + "\n";
        }
      } else {
        // Preserve everything after frontmatter and first paragraph
        const fmEnd = existing.indexOf("---", 4);
        if (fmEnd !== -1) {
          const afterFm = existing.substring(fmEnd + 3);
          customContent = "\n" + afterFm.trimEnd() + "\n";
        }
      }
    }
  }

  const lines: string[] = [];

  // Frontmatter
  lines.push("---");
  lines.push(`title: ${apd.functionName}()`);
  if (sig?.jsdoc) {
    lines.push(`description: ${sig.jsdoc.split("\n")[0]}`);
  }
  lines.push("---");
  lines.push("");

  if (sig) {
    // Signature
    const paramStr = sig.params
      .map((p) => `${p.name}${p.required ? "" : "?"}`)
      .join(", ");
    const retType = sig.returnType.replace(/Promise<(.+)>/, "$1");
    lines.push("## Signature");
    lines.push("");
    lines.push("```javascript");
    lines.push(
      `${sig.isAsync ? "async " : ""}${sig.name}(${paramStr}) → ${retType}`
    );
    lines.push("```");
    lines.push("");

    // Parameters
    if (sig.params.length > 0) {
      lines.push("## Parameters");
      lines.push("");
      lines.push(
        "| Parameter | Type | Required | Description |"
      );
      lines.push("|-----------|------|----------|-------------|");
      for (const p of sig.params) {
        lines.push(
          `| \`${p.name}\` | ${p.type} | ${p.required ? "Yes" : "No"} | |`
        );
      }
      lines.push("");
    }

    // Return value
    lines.push("## Return value");
    lines.push("");
    lines.push(
      `Returns \`${sig.returnType}\`.`
    );
    lines.push("");
  }

  // Custom content
  lines.push(CUSTOM_START);
  lines.push(customContent || "");
  lines.push(CUSTOM_END);

  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("Building page definitions...");
  const pageDefs = buildPageDefs();

  // Register all pages for cross-reference resolution
  for (const pd of pageDefs) {
    registerPage(pd.title, pd.file);
  }

  // Also register known titles that map to pages via schema components
  // (for object types referenced in field types)
  registerExtraComponentTitles();

  console.log(`Registered ${titleToFileMap.size} page titles`);

  // Build reference map
  console.log("Building cross-reference map...");
  const refMap = buildReferenceMap(pageDefs);

  // Generate schema pages
  console.log(`Generating ${pageDefs.length} schema pages...`);
  fs.mkdirSync(SCHEMA_OUT_DIR, { recursive: true });

  for (const pd of pageDefs) {
    const content = renderSchemaPage(pd, refMap);
    const outPath = path.join(SCHEMA_OUT_DIR, pd.file);
    fs.writeFileSync(outPath, content, "utf8");
  }

  console.log("Schema pages generated.");

  // Parse TS functions and generate API pages
  console.log("Parsing TypeScript function signatures...");
  const functions = parseTsFunctions();
  console.log(`Found ${functions.length} functions`);

  const funcMap = new Map(functions.map((f) => [f.name, f]));

  fs.mkdirSync(API_OUT_DIR, { recursive: true });

  for (const apd of API_PAGES) {
    const sig = funcMap.get(apd.functionName);
    const content = generateApiPage(apd, sig);
    const outPath = path.join(API_OUT_DIR, apd.file);
    fs.writeFileSync(outPath, content, "utf8");
    if (!sig) {
      console.warn(`  Warning: No function signature found for ${apd.functionName}`);
    }
  }

  console.log("API pages generated.");
  console.log("Done!");
}

/** Register extra title→file mappings for component schemas */
function registerExtraComponentTitles() {
  // Walk all v3 schemas and register component schema titles
  const v3keys = Object.keys(allSchemas).filter((k) => k.endsWith("_v3"));
  for (const key of v3keys) {
    const schema = allSchemas[key];
    if (schema.components?.schemas) {
      for (const [, compSchema] of Object.entries(
        schema.components.schemas
      )) {
        if (compSchema.title && !titleToFileMap.has(compSchema.title)) {
          // Try to find a matching registered page
          const slug = titleToSlug(compSchema.title);
          const possibleFile = slug + ".md";
          // Only register if we actually have this page
          if (fileToTitleMap.has(possibleFile)) {
            titleToFileMap.set(compSchema.title, possibleFile);
          }
        }
      }
    }
  }

  // Walk nested properties for titles
  for (const pd of buildPageDefs()) {
    if (pd.schema.properties) {
      for (const prop of Object.values(pd.schema.properties)) {
        registerNestedTitles(prop);
      }
    }
  }
}

function registerNestedTitles(schema: SchemaLike) {
  if (!schema) return;

  if (schema.title && !titleToFileMap.has(schema.title)) {
    const slug = titleToSlug(schema.title);
    const possibleFile = slug + ".md";
    if (fileToTitleMap.has(possibleFile)) {
      titleToFileMap.set(schema.title, possibleFile);
    }
  }

  if (schema.anyOf) for (const s of schema.anyOf) registerNestedTitles(s);
  if (schema.oneOf) for (const s of schema.oneOf) registerNestedTitles(s);
  if (schema.allOf) for (const s of schema.allOf) registerNestedTitles(s);
  if (schema.items) registerNestedTitles(schema.items);
}

main();
