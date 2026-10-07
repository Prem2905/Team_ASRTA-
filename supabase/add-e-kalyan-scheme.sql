insert into public.services(name,slug,description,category,requirements)
values (
  'E-Kalyan Scholarship',
  'e-kalyan-scholarship',
  'Explore e-Kalyan student scholarship application guidance. Eligibility and requirements vary by state and scholarship programme.',
  'Education',
  '["Identity proof","Domicile / residence proof","Student ID or admission proof","Bank account details","Income or caste certificate, if applicable","Academic records"]'::jsonb
)
on conflict (slug) do nothing;
