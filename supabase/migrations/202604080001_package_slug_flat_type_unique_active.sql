-- Ensure package slugs are unique per flat type for active (non-deleted) rows.
-- This preserves soft-delete semantics by allowing duplicates once rows are archived.
CREATE UNIQUE INDEX IF NOT EXISTS package_slug_flat_type_active_uniq_idx
  ON public.package (slug, flat_type)
  WHERE deleted_at IS NULL;
