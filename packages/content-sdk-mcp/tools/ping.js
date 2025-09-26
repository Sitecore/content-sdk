export default async function pingTool({ client }) {
  return { ok: true, mode: client ? 'client' : 'demo' };
}
