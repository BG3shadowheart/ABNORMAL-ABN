PRODUCT ARTWORK
===============

Built-in product visuals are mapped one-by-one by product slug in:
  src/components/product-visual.tsx

DRIP products alone keep the existing `logo` overlay configured in
  src/data/products.ts

All other built-in products use an exact, matching product artwork file. Do not
add a shared ABN logo as a product fallback. The store-wide logo is separate:
  public/brand/logo.png

Product artwork files are PNG/WebP. Keep filenames in sync with the mapping.
