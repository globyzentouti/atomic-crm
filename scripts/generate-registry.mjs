#!/usr/bin/env node

import { globSync } from "glob";
import fs from "node:fs";
import path from "node:path";

const registryPath = "registry.json";
const basePath = "src";
// Glob patterns and registry paths must use forward slashes on Windows too.
const atomicCrmComponentsPath = path.posix.join(
  basePath,
  "components",
  "atomic-crm",
);
const supabaseComponentsPath = path.posix.join(
  basePath,
  "components",
  "supabase",
);
const hooksPath = path.posix.join(basePath, "hooks");
const libPath = path.posix.join(basePath, "lib");

const excludedHooks = [
  "filter-context.tsx",
  "saved-queries.tsx",
  "use-mobile.ts",
  "useSupportCreateSuggestion.tsx",
];

const excludedLibFiles = [
  "field.type.ts",
  "genericMemo.ts",
  "i18nProvider.ts",
  "sanitizeInputRestProps.ts",
  "utils.ts",
];

const testFilePattern = "**/*.{test,spec}.*";
const storyFilePattern = "**/*.stories.*";

const atomicCrmComponents = globSync(
  path.posix.join(atomicCrmComponentsPath, "**", "*.ts*"),
  { ignore: [testFilePattern, storyFilePattern] },
);
const supabaseComponents = globSync(
  path.posix.join(supabaseComponentsPath, "**", "*.ts*"),
  { ignore: [testFilePattern, storyFilePattern] },
);
const hooks = globSync(path.posix.join(hooksPath, "**", "*.ts*")).filter(
  (hook) => {
    return !excludedHooks.includes(path.basename(hook));
  },
);
const libFiles = globSync(path.posix.join(libPath, "**", "*.ts*")).filter(
  (file) => {
    return !excludedLibFiles.includes(path.basename(file));
  },
);
const changelogPath = "CHANGELOG.md";

const registryContent = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

const files = [
  ...atomicCrmComponents.map((path) => {
    return {
      path: path.replaceAll("\\", "/"),
      type: "registry:component",
    };
  }),
  ...supabaseComponents.map((path) => {
    return {
      path: path.replaceAll("\\", "/"),
      type: "registry:component",
    };
  }),
  ...hooks.map((path) => {
    return {
      path: path.replaceAll("\\", "/"),
      type: "registry:hook",
    };
  }),
  ...libFiles.map((path) => {
    return {
      path: path.replaceAll("\\", "/"),
      type: "registry:lib",
    };
  }),
  {
    path: changelogPath,
    type: "registry:file",
    target: "~/CHANGELOG.md",
  },
];

const newRegistryContent = {
  ...registryContent,
  items: registryContent.items.map((item) => {
    if (item.name === "atomic-crm") {
      // Keep the published order, so filesystem ordering does not cause
      // unrelated registry churn across Windows and Unix checkouts.
      const existingOrder = new Map(
        item.files.map((file, index) => [file.path, index]),
      );
      const orderedFiles = [...files].sort(
        (a, b) =>
          (existingOrder.get(a.path) ?? Infinity) -
            (existingOrder.get(b.path) ?? Infinity) ||
          a.path.localeCompare(b.path),
      );
      return {
        ...item,
        files: orderedFiles,
      };
    }

    return item;
  }),
};

fs.writeFileSync(
  registryPath,
  JSON.stringify(newRegistryContent, null, 2),
  "utf-8",
);
