# Architecture rules

- Render proposals as one continuous document using the ordered enabled sections; native CSS print pagination must determine physical A4 pages so long inputs are never clipped by fixed page containers.
- Use the browser print dialog for PDF export with print CSS and repeated header/footer; raster image export cannot honor CSS page fragmentation.
- Keep the cover in a dedicated flowing section using proposal scope and commercial fields; isolate cover presentation without changing section ordering or physical pagination.
- Render the two context subsections inside the existing object section so visibility and ordering remain user-controlled; use existing proposal fields and mark unavailable structural/history details as unconfirmed.