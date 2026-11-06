/* PAK RAZ V16.9 — short-lived, same-tab Product Finder handoff.
   This is browser-local session storage, not encryption and not a server submission. */
(function (w) {
  'use strict';
  var KEY = 'pakraz_finder_handoff_v1';
  var VERSION = 1;
  var TTL_MS = 45 * 60 * 1000;
  var ENUMS = {
    app: ['ready', 'precast', 'stone', 'other'],
    goal: ['water', 'flow', 'retention', 'cycle', 'other'],
    cement: ['known', 'unknown'],
    scm: ['none', 'flyash', 'slag', 'silica', 'limestone', 'mixed', 'other', 'unknown'],
    volume: ['small', 'mid', 'large', 'unknown'],
    supply: ['raw', 'concentrate', 'ready', 'unknown'],
    pack: ['20', 'drum', 'ibc', 'bulk', 'unknown'],
    docs: ['tds', 'sds', 'coa', 'sample', 'other']
  };
  function cleanText(value, max, keepLines) {
    var s = String(value == null ? '' : value);
    s = s.replace(/\r\n?/g, '\n');
    s = keepLines ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') : s.replace(/[\u0000-\u001F\u007F]/g, ' ');
    return s.trim().slice(0, max);
  }
  function pickEnum(key, value) {
    return ENUMS[key].indexOf(value) >= 0 ? value : 'unknown';
  }
  function sanitize(input) {
    input = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    var docs = Array.isArray(input.docs) ? input.docs.filter(function (x) { return ENUMS.docs.indexOf(x) >= 0; }).slice(0, 5) : [];
    return {
      app: pickEnum('app', input.app),
      goal: pickEnum('goal', input.goal),
      cement: pickEnum('cement', input.cement),
      cementSource: cleanText(input.cementSource, 160, false),
      scm: pickEnum('scm', input.scm),
      conditions: cleanText(input.conditions, 600, true),
      volume: pickEnum('volume', input.volume),
      supply: pickEnum('supply', input.supply),
      pack: pickEnum('pack', input.pack),
      docs: docs,
      summary: cleanText(input.summary, 1800, true),
      lang: ['fa', 'en', 'zh', 'ar', 'ru', 'tr'].indexOf(input.lang) >= 0 ? input.lang : 'fa'
    };
  }
  function getStorage() {
    try { return w.sessionStorage; } catch (e) { return null; }
  }
  function write(input) {
    var storage = getStorage();
    if (!storage) return false;
    try {
      var record = { version: VERSION, createdAt: Date.now(), data: sanitize(input) };
      storage.setItem(KEY, JSON.stringify(record));
      return true;
    } catch (e) { return false; }
  }
  function read() {
    var storage = getStorage();
    if (!storage) return { ok: false, reason: 'unavailable' };
    var raw;
    try { raw = storage.getItem(KEY); } catch (e) { return { ok: false, reason: 'unavailable' }; }
    if (!raw) return { ok: false, reason: 'missing' };
    try {
      var record = JSON.parse(raw);
      if (!record || record.version !== VERSION || !record.data || typeof record.data !== 'object') {
        clear(); return { ok: false, reason: 'invalid' };
      }
      var age = Date.now() - Number(record.createdAt);
      if (!Number.isFinite(age) || age < -300000 || age > TTL_MS) {
        clear(); return { ok: false, reason: 'expired' };
      }
      var data = sanitize(record.data);
      if (!data.summary) { clear(); return { ok: false, reason: 'invalid' }; }
      return { ok: true, data: data, createdAt: Number(record.createdAt), expiresAt: Number(record.createdAt) + TTL_MS };
    } catch (e) { clear(); return { ok: false, reason: 'invalid' }; }
  }
  function clear() {
    var storage = getStorage();
    if (!storage) return false;
    try { storage.removeItem(KEY); return true; } catch (e) { return false; }
  }
  w.PAKRAZ_HANDOFF = { KEY: KEY, VERSION: VERSION, TTL_MS: TTL_MS, write: write, read: read, clear: clear };
})(window);
