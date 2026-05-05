const PIPELINE_EMAILS = [
  'charlesdotdirect@gmail.com',
  'hello@charlesjackson.dev',
  'jay@charlesjackson.dev',
] as const

export function hasPipelineAccess(email: string | undefined): boolean {
  if (!email) return false
  return (PIPELINE_EMAILS as readonly string[]).includes(email.toLowerCase())
}
