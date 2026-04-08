import { lazy, Suspense } from "react";

const Pages = (import.meta as any).glob("/src/pages/**/*.tsx");
const lazyComponentCache = new Map<string, React.LazyExoticComponent<any>>();

export const Component = (path: string, props?: any) => {
  if (!path) return null;

  let importFn = Pages[`/src${path}.tsx`];
  if (!importFn) importFn = Pages[`/src${path}/index.tsx`];

  if (!importFn) {
    console.warn("Component not found:", path);
    return null;
  }

  let LazyElement = lazyComponentCache.get(path);
  if (!LazyElement) {
    LazyElement = lazy(importFn as any);
    lazyComponentCache.set(path, LazyElement);
  }

  // BU YERDA DIQQAT QILING:
  const Element = LazyElement;

  return (
    <Suspense fallback={null}>
      <Element {...props} />
    </Suspense>
  );
};