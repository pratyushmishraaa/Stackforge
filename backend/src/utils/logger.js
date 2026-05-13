// Structured logger — drop-in replacement for console.log
// Format: [LEVEL] timestamp | message | meta
const fmt = (level, message, meta = {}) => {
  const ts = new Date().toISOString();
  const base = `[${level}] ${ts} | ${message}`;
  const extra = Object.keys(meta).length ? ' | ' + JSON.stringify(meta) : '';
  return base + extra;
};

const logger = {
  info:  (msg, meta)  => console.log(fmt('INFO',  msg, meta)),
  warn:  (msg, meta)  => console.warn(fmt('WARN',  msg, meta)),
  error: (msg, meta)  => console.error(fmt('ERROR', msg, meta)),
};

export default logger;
