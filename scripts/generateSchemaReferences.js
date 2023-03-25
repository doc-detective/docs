const fs = require("fs");
const path = require("path");
const parser = require("@apidevtools/json-schema-ref-parser");
const { exit } = require("process");
const { type } = require("os");

main();
// console.log(schemas);

async function main() {
  const dirPath = path.resolve(`${__dirname}/../_includes/schemas`);
  const files = fs.readdirSync(dirPath);
  for await (const file of files) {
    const filePath = path.resolve(`${dirPath}/${file}`);
    // Load from file
    let schema = fs.readFileSync(filePath).toString();
    // Convert to JSON
    schema = JSON.parse(schema);
    // Set ID
    schema.$id = `${filePath}`;
    // Update references to current relative path
    schema = updateRefPaths(schema, dirPath);
    // Dereference schema
    schema = await parser.dereference(schema);
    // Format
    // TODO
    // Fields
    let fields = [
      "## Fields",
      "",
      "Field | Type | Description | Default",
      ":-- | :-- | :-- | :--",
    ];
    const keys = Object.keys(schema.properties);
    for (const key in keys) {
      let field = keys[key];
      let fieldDetails = parseField(schema, field);
      fields = fields.concat(fieldDetails);
    }
    fields.push("");
    // Examples
    let examples = ["## Examples", ""];
    for (const example in schema.examples) {
      let snippet = [
        "```json",
        JSON.stringify(schema.examples[example], null, 2),
        "```",
        "",
      ];
      examples = examples.concat(snippet);
    }
    // Metadata
    let metadata = [
      "---",
      `title: ${schema.title}`,
      "layout: default",
      "nav_order: 1",
      "parent: Reference",
      "---",
    ];
    // Heading
    let heading = ["", `# ${schema.title}`, "", schema.description, ""];
    // Putting it all together
    let output = metadata
      .concat(heading)
      .concat(fields)
      .concat(examples)
      .join("\n");
    // Identify output path
    const outputPath = path.resolve(
      `${__dirname}/../reference/schemas/${schema.title}.md`
    );
    // Write file
    fs.writeFileSync(outputPath, output);
  }
  console.log("Documents generated.");
}

// Prepend path to referenced relative paths
function updateRefPaths(schema, dirPath) {
  for (let [key, value] of Object.entries(schema)) {
    if (typeof value === "object") {
      updateRefPaths(value, dirPath);
    }
    if (key === "$ref") {
      schema[key] = `${dirPath}/${value}`;
    }
  }
  return schema;
}

function parseField(schema, fieldName, fieldNameBase) {
  debug = false;
  let details = [];
  let name;
  if (fieldNameBase) {
    name = `${fieldNameBase}.${fieldName}`;
  } else {
    name = fieldName;
  }
  let property = schema.properties[fieldName];
  let type = getTypes(property);
  let description = property.description;
  // Get required
  if (schema.required.includes(fieldName)) {
    description = "Required. " + description;
  } else {
    description = "Optional. " + description;
  }
  // Get enums
  if (property.enum) {
    let enums = `<br><br>Accepted values: \`${property.enum.join("`, `")}\``;
    description = description + enums;
  }
  let defaultValue;
  if (
    // JSON object
    typeof property.default === "object" &&
    !Array.isArray(property.default)
  ) {
    defaultValue = `\`${JSON.stringify(property.default)}\``;
  } else if (
    // Array
    typeof property.default === "object" &&
    Array.isArray(property.default)
  ) {
    defaultValue = `\`${JSON.stringify(property.default)}\``;
  } else if (
    // UUID
    schema.dynamicDefaults &&
    Object.keys(schema.dynamicDefaults).includes(fieldName) &&
    schema.dynamicDefaults[fieldName] === "uuid"
  ) {
    defaultValue = "Generated UUID";
  } else if (
    // Undefined
    property.default === undefined
  ) {
    defaultValue = "";
  } else {
    // Default
    defaultValue = `\`${property.default}\``;
  }
  details.push(`${name} | ${type} |  ${description} | ${defaultValue}`);
  // Parse child object
  if (property.properties) {
    const keys = Object.keys(property.properties);
    for (const key in keys) {
      let field = keys[key];
      let fieldDetails = parseField(property, field, name);
      details.push(fieldDetails);
    }
  }
  return details;
}

function getTypes(property) {
  // TODO: Include supported subtypes within array
  let type;
  let types = [];
  // Get types
  if (!property.type && (property.anyOf || property.oneOf)) {
    typesArray = property.anyOf || property.oneOf;
    typesArray.forEach((item) => {
      if (!types.includes(item.type)) types.push(item.type);
    });
  } else if (property.type) {
    types.push(property.type);
  }

  // Output type string
  if (types.length > 1) {
    type = "One of";
    types.forEach((typeItem) => {
      type = type + `<br>- ${typeItem}`
    });
  } else { 
    type = types[0];
  }
  return type;
}
