(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) s(i);
  new MutationObserver((i) => {
    for (const r of i)
      if (r.type === "childList")
        for (const o of r.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && s(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(i) {
    const r = {};
    return (
      i.integrity && (r.integrity = i.integrity),
      i.referrerPolicy && (r.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : i.crossOrigin === "anonymous"
        ? (r.credentials = "omit")
        : (r.credentials = "same-origin"),
      r
    );
  }
  function s(i) {
    if (i.ep) return;
    i.ep = !0;
    const r = n(i);
    fetch(i.href, r);
  }
})();
/**
 * @vue/shared v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function Qn(e) {
  const t = Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Z = {},
  mt = [],
  je = () => {},
  ei = () => !1,
  fn = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  Kn = (e) => e.startsWith("onUpdate:"),
  pe = Object.assign,
  Wn = (e, t) => {
    const n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  },
  pr = Object.prototype.hasOwnProperty,
  V = (e, t) => pr.call(e, t),
  F = Array.isArray,
  vt = (e) => dn(e) === "[object Map]",
  ti = (e) => dn(e) === "[object Set]",
  U = (e) => typeof e == "function",
  ne = (e) => typeof e == "string",
  Je = (e) => typeof e == "symbol",
  Y = (e) => e !== null && typeof e == "object",
  ni = (e) => (Y(e) || U(e)) && U(e.then) && U(e.catch),
  si = Object.prototype.toString,
  dn = (e) => si.call(e),
  gr = (e) => dn(e).slice(8, -1),
  ii = (e) => dn(e) === "[object Object]",
  Zn = (e) =>
    ne(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  Mt = Qn(
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  ),
  hn = (e) => {
    const t = Object.create(null);
    return (n) => t[n] || (t[n] = e(n));
  },
  mr = /-\w/g,
  Ge = hn((e) => e.replace(mr, (t) => t.slice(1).toUpperCase())),
  vr = /\B([A-Z])/g,
  ht = hn((e) => e.replace(vr, "-$1").toLowerCase()),
  ri = hn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  Sn = hn((e) => (e ? `on${ri(e)}` : "")),
  Ye = (e, t) => !Object.is(e, t),
  Cn = (e, ...t) => {
    for (let n = 0; n < e.length; n++) e[n](...t);
  },
  oi = (e, t, n, s = !1) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      writable: s,
      value: n,
    });
  },
  br = (e) => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  };
let ys;
const pn = () =>
  ys ||
  (ys =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : typeof global < "u"
      ? global
      : {});
function Le(e) {
  if (F(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n],
        i = ne(s) ? xr(s) : Le(s);
      if (i) for (const r in i) t[r] = i[r];
    }
    return t;
  } else if (ne(e) || Y(e)) return e;
}
const wr = /;(?![^(]*\))/g,
  _r = /:([^]+)/,
  yr = /\/\*[^]*?\*\//g;
function xr(e) {
  const t = {};
  return (
    e
      .replace(yr, "")
      .split(wr)
      .forEach((n) => {
        if (n) {
          const s = n.split(_r);
          s.length > 1 && (t[s[0].trim()] = s[1].trim());
        }
      }),
    t
  );
}
function he(e) {
  let t = "";
  if (ne(e)) t = e;
  else if (F(e))
    for (let n = 0; n < e.length; n++) {
      const s = he(e[n]);
      s && (t += s + " ");
    }
  else if (Y(e)) for (const n in e) e[n] && (t += n + " ");
  return t.trim();
}
const Ar =
    "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  Sr = Qn(Ar);
function li(e) {
  return !!e || e === "";
}
const ci = (e) => !!(e && e.__v_isRef === !0),
  ee = (e) =>
    ne(e)
      ? e
      : e == null
      ? ""
      : F(e) || (Y(e) && (e.toString === si || !U(e.toString)))
      ? ci(e)
        ? ee(e.value)
        : JSON.stringify(e, ai, 2)
      : String(e),
  ai = (e, t) =>
    ci(t)
      ? ai(e, t.value)
      : vt(t)
      ? {
          [`Map(${t.size})`]: [...t.entries()].reduce(
            (n, [s, i], r) => ((n[En(s, r) + " =>"] = i), n),
            {}
          ),
        }
      : ti(t)
      ? { [`Set(${t.size})`]: [...t.values()].map((n) => En(n)) }
      : Je(t)
      ? En(t)
      : Y(t) && !F(t) && !ii(t)
      ? String(t)
      : t,
  En = (e, t = "") => {
    var n;
    return Je(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
  };
/**
 * @vue/reactivity v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let be;
class Cr {
  constructor(t = !1) {
    (this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = be),
      !t && be && (this.index = (be.scopes || (be.scopes = [])).push(this) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = be;
      try {
        return (be = this), t();
      } finally {
        be = n;
      }
    }
  }
  on() {
    ++this._on === 1 && ((this.prevScope = be), (be = this));
  }
  off() {
    this._on > 0 &&
      --this._on === 0 &&
      ((be = this.prevScope), (this.prevScope = void 0));
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (((this.cleanups.length = 0), this.scopes)) {
        for (n = 0, s = this.scopes.length; n < s; n++) this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i &&
          i !== this &&
          ((this.parent.scopes[this.index] = i), (i.index = this.index));
      }
      this.parent = void 0;
    }
  }
}
function Er() {
  return be;
}
let W;
const In = new WeakSet();
class ui {
  constructor(t) {
    (this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      be && be.active && be.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 &&
      ((this.flags &= -65), In.has(this) && (In.delete(this), this.trigger()));
  }
  notify() {
    (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || di(this);
  }
  run() {
    if (!(this.flags & 1)) return this.fn();
    (this.flags |= 2), xs(this), hi(this);
    const t = W,
      n = Ce;
    (W = this), (Ce = !0);
    try {
      return this.fn();
    } finally {
      pi(this), (W = t), (Ce = n), (this.flags &= -3);
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) es(t);
      (this.deps = this.depsTail = void 0),
        xs(this),
        this.onStop && this.onStop(),
        (this.flags &= -2);
    }
  }
  trigger() {
    this.flags & 64
      ? In.add(this)
      : this.scheduler
      ? this.scheduler()
      : this.runIfDirty();
  }
  runIfDirty() {
    Fn(this) && this.run();
  }
  get dirty() {
    return Fn(this);
  }
}
let fi = 0,
  Ot,
  jt;
function di(e, t = !1) {
  if (((e.flags |= 8), t)) {
    (e.next = jt), (jt = e);
    return;
  }
  (e.next = Ot), (Ot = e);
}
function Yn() {
  fi++;
}
function Gn() {
  if (--fi > 0) return;
  if (jt) {
    let t = jt;
    for (jt = void 0; t; ) {
      const n = t.next;
      (t.next = void 0), (t.flags &= -9), (t = n);
    }
  }
  let e;
  for (; Ot; ) {
    let t = Ot;
    for (Ot = void 0; t; ) {
      const n = t.next;
      if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function hi(e) {
  for (let t = e.deps; t; t = t.nextDep)
    (t.version = -1),
      (t.prevActiveLink = t.dep.activeLink),
      (t.dep.activeLink = t);
}
function pi(e) {
  let t,
    n = e.depsTail,
    s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), es(s), Ir(s)) : (t = s),
      (s.dep.activeLink = s.prevActiveLink),
      (s.prevActiveLink = void 0),
      (s = i);
  }
  (e.deps = t), (e.depsTail = n);
}
function Fn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (
      t.dep.version !== t.version ||
      (t.dep.computed && (gi(t.dep.computed) || t.dep.version !== t.version))
    )
      return !0;
  return !!e._dirty;
}
function gi(e) {
  if (
    (e.flags & 4 && !(e.flags & 16)) ||
    ((e.flags &= -17), e.globalVersion === Ut) ||
    ((e.globalVersion = Ut),
    !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !Fn(e)))
  )
    return;
  e.flags |= 2;
  const t = e.dep,
    n = W,
    s = Ce;
  (W = e), (Ce = !0);
  try {
    hi(e);
    const i = e.fn(e._value);
    (t.version === 0 || Ye(i, e._value)) &&
      ((e.flags |= 128), (e._value = i), t.version++);
  } catch (i) {
    throw (t.version++, i);
  } finally {
    (W = n), (Ce = s), pi(e), (e.flags &= -3);
  }
}
function es(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (
    (s && ((s.nextSub = i), (e.prevSub = void 0)),
    i && ((i.prevSub = s), (e.nextSub = void 0)),
    n.subs === e && ((n.subs = s), !s && n.computed))
  ) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep) es(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ir(e) {
  const { prevDep: t, nextDep: n } = e;
  t && ((t.nextDep = n), (e.prevDep = void 0)),
    n && ((n.prevDep = t), (e.nextDep = void 0));
}
let Ce = !0;
const mi = [];
function $e() {
  mi.push(Ce), (Ce = !1);
}
function qe() {
  const e = mi.pop();
  Ce = e === void 0 ? !0 : e;
}
function xs(e) {
  const { cleanup: t } = e;
  if (((e.cleanup = void 0), t)) {
    const n = W;
    W = void 0;
    try {
      t();
    } finally {
      W = n;
    }
  }
}
let Ut = 0;
class kr {
  constructor(t, n) {
    (this.sub = t),
      (this.dep = n),
      (this.version = n.version),
      (this.nextDep =
        this.prevDep =
        this.nextSub =
        this.prevSub =
        this.prevActiveLink =
          void 0);
  }
}
class ts {
  constructor(t) {
    (this.computed = t),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0);
  }
  track(t) {
    if (!W || !Ce || W === this.computed) return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== W)
      (n = this.activeLink = new kr(W, this)),
        W.deps
          ? ((n.prevDep = W.depsTail),
            (W.depsTail.nextDep = n),
            (W.depsTail = n))
          : (W.deps = W.depsTail = n),
        vi(n);
    else if (n.version === -1 && ((n.version = this.version), n.nextDep)) {
      const s = n.nextDep;
      (s.prevDep = n.prevDep),
        n.prevDep && (n.prevDep.nextDep = s),
        (n.prevDep = W.depsTail),
        (n.nextDep = void 0),
        (W.depsTail.nextDep = n),
        (W.depsTail = n),
        W.deps === n && (W.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, Ut++, this.notify(t);
  }
  notify(t) {
    Yn();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Gn();
    }
  }
}
function vi(e) {
  if ((e.dep.sc++, e.sub.flags & 4)) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep) vi(s);
    }
    const n = e.dep.subs;
    n !== e && ((e.prevSub = n), n && (n.nextSub = e)), (e.dep.subs = e);
  }
}
const Hn = new WeakMap(),
  ft = Symbol(""),
  Un = Symbol(""),
  Bt = Symbol("");
function oe(e, t, n) {
  if (Ce && W) {
    let s = Hn.get(e);
    s || Hn.set(e, (s = new Map()));
    let i = s.get(n);
    i || (s.set(n, (i = new ts())), (i.map = s), (i.key = n)), i.track();
  }
}
function Be(e, t, n, s, i, r) {
  const o = Hn.get(e);
  if (!o) {
    Ut++;
    return;
  }
  const l = (c) => {
    c && c.trigger();
  };
  if ((Yn(), t === "clear")) o.forEach(l);
  else {
    const c = F(e),
      f = c && Zn(n);
    if (c && n === "length") {
      const u = Number(s);
      o.forEach((h, p) => {
        (p === "length" || p === Bt || (!Je(p) && p >= u)) && l(h);
      });
    } else
      switch (
        ((n !== void 0 || o.has(void 0)) && l(o.get(n)), f && l(o.get(Bt)), t)
      ) {
        case "add":
          c ? f && l(o.get("length")) : (l(o.get(ft)), vt(e) && l(o.get(Un)));
          break;
        case "delete":
          c || (l(o.get(ft)), vt(e) && l(o.get(Un)));
          break;
        case "set":
          vt(e) && l(o.get(ft));
          break;
      }
  }
  Gn();
}
function pt(e) {
  const t = J(e);
  return t === e ? t : (oe(t, "iterate", Bt), Ae(e) ? t : t.map(ie));
}
function gn(e) {
  return oe((e = J(e)), "iterate", Bt), e;
}
const Tr = {
  __proto__: null,
  [Symbol.iterator]() {
    return kn(this, Symbol.iterator, ie);
  },
  concat(...e) {
    return pt(this).concat(...e.map((t) => (F(t) ? pt(t) : t)));
  },
  entries() {
    return kn(this, "entries", (e) => ((e[1] = ie(e[1])), e));
  },
  every(e, t) {
    return He(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return He(this, "filter", e, t, (n) => n.map(ie), arguments);
  },
  find(e, t) {
    return He(this, "find", e, t, ie, arguments);
  },
  findIndex(e, t) {
    return He(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return He(this, "findLast", e, t, ie, arguments);
  },
  findLastIndex(e, t) {
    return He(this, "findLastIndex", e, t, void 0, arguments);
  },
  forEach(e, t) {
    return He(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Tn(this, "includes", e);
  },
  indexOf(...e) {
    return Tn(this, "indexOf", e);
  },
  join(e) {
    return pt(this).join(e);
  },
  lastIndexOf(...e) {
    return Tn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return He(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return kt(this, "pop");
  },
  push(...e) {
    return kt(this, "push", e);
  },
  reduce(e, ...t) {
    return As(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return As(this, "reduceRight", e, t);
  },
  shift() {
    return kt(this, "shift");
  },
  some(e, t) {
    return He(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return kt(this, "splice", e);
  },
  toReversed() {
    return pt(this).toReversed();
  },
  toSorted(e) {
    return pt(this).toSorted(e);
  },
  toSpliced(...e) {
    return pt(this).toSpliced(...e);
  },
  unshift(...e) {
    return kt(this, "unshift", e);
  },
  values() {
    return kn(this, "values", ie);
  },
};
function kn(e, t, n) {
  const s = gn(e),
    i = s[t]();
  return (
    s !== e &&
      !Ae(e) &&
      ((i._next = i.next),
      (i.next = () => {
        const r = i._next();
        return r.done || (r.value = n(r.value)), r;
      })),
    i
  );
}
const Rr = Array.prototype;
function He(e, t, n, s, i, r) {
  const o = gn(e),
    l = o !== e && !Ae(e),
    c = o[t];
  if (c !== Rr[t]) {
    const h = c.apply(e, r);
    return l ? ie(h) : h;
  }
  let f = n;
  o !== e &&
    (l
      ? (f = function (h, p) {
          return n.call(this, ie(h), p, e);
        })
      : n.length > 2 &&
        (f = function (h, p) {
          return n.call(this, h, p, e);
        }));
  const u = c.call(o, f, s);
  return l && i ? i(u) : u;
}
function As(e, t, n, s) {
  const i = gn(e);
  let r = n;
  return (
    i !== e &&
      (Ae(e)
        ? n.length > 3 &&
          (r = function (o, l, c) {
            return n.call(this, o, l, c, e);
          })
        : (r = function (o, l, c) {
            return n.call(this, o, ie(l), c, e);
          })),
    i[t](r, ...s)
  );
}
function Tn(e, t, n) {
  const s = J(e);
  oe(s, "iterate", Bt);
  const i = s[t](...n);
  return (i === -1 || i === !1) && rs(n[0])
    ? ((n[0] = J(n[0])), s[t](...n))
    : i;
}
function kt(e, t, n = []) {
  $e(), Yn();
  const s = J(e)[t].apply(e, n);
  return Gn(), qe(), s;
}
const Pr = Qn("__proto__,__v_isRef,__isVue"),
  bi = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((e) => e !== "arguments" && e !== "caller")
      .map((e) => Symbol[e])
      .filter(Je)
  );
function Mr(e) {
  Je(e) || (e = String(e));
  const t = J(this);
  return oe(t, "has", e), t.hasOwnProperty(e);
}
class wi {
  constructor(t = !1, n = !1) {
    (this._isReadonly = t), (this._isShallow = n);
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly,
      r = this._isShallow;
    if (n === "__v_isReactive") return !i;
    if (n === "__v_isReadonly") return i;
    if (n === "__v_isShallow") return r;
    if (n === "__v_raw")
      return s === (i ? (r ? qr : Ai) : r ? xi : yi).get(t) ||
        Object.getPrototypeOf(t) === Object.getPrototypeOf(s)
        ? t
        : void 0;
    const o = F(t);
    if (!i) {
      let c;
      if (o && (c = Tr[n])) return c;
      if (n === "hasOwnProperty") return Mr;
    }
    const l = Reflect.get(t, n, le(t) ? t : s);
    if ((Je(n) ? bi.has(n) : Pr(n)) || (i || oe(t, "get", n), r)) return l;
    if (le(l)) {
      const c = o && Zn(n) ? l : l.value;
      return i && Y(c) ? $n(c) : c;
    }
    return Y(l) ? (i ? $n(l) : ss(l)) : l;
  }
}
class _i extends wi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    if (!this._isShallow) {
      const c = et(r);
      if (
        (!Ae(s) && !et(s) && ((r = J(r)), (s = J(s))), !F(t) && le(r) && !le(s))
      )
        return c || (r.value = s), !0;
    }
    const o = F(t) && Zn(n) ? Number(n) < t.length : V(t, n),
      l = Reflect.set(t, n, s, le(t) ? t : i);
    return (
      t === J(i) && (o ? Ye(s, r) && Be(t, "set", n, s) : Be(t, "add", n, s)), l
    );
  }
  deleteProperty(t, n) {
    const s = V(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && Be(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Je(n) || !bi.has(n)) && oe(t, "has", n), s;
  }
  ownKeys(t) {
    return oe(t, "iterate", F(t) ? "length" : ft), Reflect.ownKeys(t);
  }
}
class Or extends wi {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const jr = new _i(),
  Lr = new Or(),
  Dr = new _i(!0);
const Bn = (e) => e,
  Zt = (e) => Reflect.getPrototypeOf(e);
function Fr(e, t, n) {
  return function (...s) {
    const i = this.__v_raw,
      r = J(i),
      o = vt(r),
      l = e === "entries" || (e === Symbol.iterator && o),
      c = e === "keys" && o,
      f = i[e](...s),
      u = n ? Bn : t ? sn : ie;
    return (
      !t && oe(r, "iterate", c ? Un : ft),
      {
        next() {
          const { value: h, done: p } = f.next();
          return p
            ? { value: h, done: p }
            : { value: l ? [u(h[0]), u(h[1])] : u(h), done: p };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}
function Yt(e) {
  return function (...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Hr(e, t) {
  const n = {
    get(i) {
      const r = this.__v_raw,
        o = J(r),
        l = J(i);
      e || (Ye(i, l) && oe(o, "get", i), oe(o, "get", l));
      const { has: c } = Zt(o),
        f = t ? Bn : e ? sn : ie;
      if (c.call(o, i)) return f(r.get(i));
      if (c.call(o, l)) return f(r.get(l));
      r !== o && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && oe(J(i), "iterate", ft), i.size;
    },
    has(i) {
      const r = this.__v_raw,
        o = J(r),
        l = J(i);
      return (
        e || (Ye(i, l) && oe(o, "has", i), oe(o, "has", l)),
        i === l ? r.has(i) : r.has(i) || r.has(l)
      );
    },
    forEach(i, r) {
      const o = this,
        l = o.__v_raw,
        c = J(l),
        f = t ? Bn : e ? sn : ie;
      return (
        !e && oe(c, "iterate", ft),
        l.forEach((u, h) => i.call(r, f(u), f(h), o))
      );
    },
  };
  return (
    pe(
      n,
      e
        ? {
            add: Yt("add"),
            set: Yt("set"),
            delete: Yt("delete"),
            clear: Yt("clear"),
          }
        : {
            add(i) {
              !t && !Ae(i) && !et(i) && (i = J(i));
              const r = J(this);
              return (
                Zt(r).has.call(r, i) || (r.add(i), Be(r, "add", i, i)), this
              );
            },
            set(i, r) {
              !t && !Ae(r) && !et(r) && (r = J(r));
              const o = J(this),
                { has: l, get: c } = Zt(o);
              let f = l.call(o, i);
              f || ((i = J(i)), (f = l.call(o, i)));
              const u = c.call(o, i);
              return (
                o.set(i, r),
                f ? Ye(r, u) && Be(o, "set", i, r) : Be(o, "add", i, r),
                this
              );
            },
            delete(i) {
              const r = J(this),
                { has: o, get: l } = Zt(r);
              let c = o.call(r, i);
              c || ((i = J(i)), (c = o.call(r, i))), l && l.call(r, i);
              const f = r.delete(i);
              return c && Be(r, "delete", i, void 0), f;
            },
            clear() {
              const i = J(this),
                r = i.size !== 0,
                o = i.clear();
              return r && Be(i, "clear", void 0, void 0), o;
            },
          }
    ),
    ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
      n[i] = Fr(i, e, t);
    }),
    n
  );
}
function ns(e, t) {
  const n = Hr(e, t);
  return (s, i, r) =>
    i === "__v_isReactive"
      ? !e
      : i === "__v_isReadonly"
      ? e
      : i === "__v_raw"
      ? s
      : Reflect.get(V(n, i) && i in s ? n : s, i, r);
}
const Ur = { get: ns(!1, !1) },
  Br = { get: ns(!1, !0) },
  $r = { get: ns(!0, !1) };
const yi = new WeakMap(),
  xi = new WeakMap(),
  Ai = new WeakMap(),
  qr = new WeakMap();
function Nr(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Jr(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Nr(gr(e));
}
function ss(e) {
  return et(e) ? e : is(e, !1, jr, Ur, yi);
}
function Vr(e) {
  return is(e, !1, Dr, Br, xi);
}
function $n(e) {
  return is(e, !0, Lr, $r, Ai);
}
function is(e, t, n, s, i) {
  if (!Y(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const r = Jr(e);
  if (r === 0) return e;
  const o = i.get(e);
  if (o) return o;
  const l = new Proxy(e, r === 2 ? s : n);
  return i.set(e, l), l;
}
function bt(e) {
  return et(e) ? bt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function et(e) {
  return !!(e && e.__v_isReadonly);
}
function Ae(e) {
  return !!(e && e.__v_isShallow);
}
function rs(e) {
  return e ? !!e.__v_raw : !1;
}
function J(e) {
  const t = e && e.__v_raw;
  return t ? J(t) : e;
}
function zr(e) {
  return (
    !V(e, "__v_skip") && Object.isExtensible(e) && oi(e, "__v_skip", !0), e
  );
}
const ie = (e) => (Y(e) ? ss(e) : e),
  sn = (e) => (Y(e) ? $n(e) : e);
function le(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function I(e) {
  return Xr(e, !1);
}
function Xr(e, t) {
  return le(e) ? e : new Qr(e, t);
}
class Qr {
  constructor(t, n) {
    (this.dep = new ts()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = n ? t : J(t)),
      (this._value = n ? t : ie(t)),
      (this.__v_isShallow = n);
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue,
      s = this.__v_isShallow || Ae(t) || et(t);
    (t = s ? t : J(t)),
      Ye(t, n) &&
        ((this._rawValue = t),
        (this._value = s ? t : ie(t)),
        this.dep.trigger());
  }
}
function q(e) {
  return le(e) ? e.value : e;
}
const Kr = {
  get: (e, t, n) => (t === "__v_raw" ? e : q(Reflect.get(e, t, n))),
  set: (e, t, n, s) => {
    const i = e[t];
    return le(i) && !le(n) ? ((i.value = n), !0) : Reflect.set(e, t, n, s);
  },
};
function Si(e) {
  return bt(e) ? e : new Proxy(e, Kr);
}
class Wr {
  constructor(t, n, s) {
    (this.fn = t),
      (this.setter = n),
      (this._value = void 0),
      (this.dep = new ts(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = Ut - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !n),
      (this.isSSR = s);
  }
  notify() {
    if (((this.flags |= 16), !(this.flags & 8) && W !== this))
      return di(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return gi(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function Zr(e, t, n = !1) {
  let s, i;
  return U(e) ? (s = e) : ((s = e.get), (i = e.set)), new Wr(s, i, n);
}
const Gt = {},
  rn = new WeakMap();
let ct;
function Yr(e, t = !1, n = ct) {
  if (n) {
    let s = rn.get(n);
    s || rn.set(n, (s = [])), s.push(e);
  }
}
function Gr(e, t, n = Z) {
  const {
      immediate: s,
      deep: i,
      once: r,
      scheduler: o,
      augmentJob: l,
      call: c,
    } = n,
    f = (L) => (i ? L : Ae(L) || i === !1 || i === 0 ? Ze(L, 1) : Ze(L));
  let u,
    h,
    p,
    w,
    _ = !1,
    A = !1;
  if (
    (le(e)
      ? ((h = () => e.value), (_ = Ae(e)))
      : bt(e)
      ? ((h = () => f(e)), (_ = !0))
      : F(e)
      ? ((A = !0),
        (_ = e.some((L) => bt(L) || Ae(L))),
        (h = () =>
          e.map((L) => {
            if (le(L)) return L.value;
            if (bt(L)) return f(L);
            if (U(L)) return c ? c(L, 2) : L();
          })))
      : U(e)
      ? t
        ? (h = c ? () => c(e, 2) : e)
        : (h = () => {
            if (p) {
              $e();
              try {
                p();
              } finally {
                qe();
              }
            }
            const L = ct;
            ct = u;
            try {
              return c ? c(e, 3, [w]) : e(w);
            } finally {
              ct = L;
            }
          })
      : (h = je),
    t && i)
  ) {
    const L = h,
      se = i === !0 ? 1 / 0 : i;
    h = () => Ze(L(), se);
  }
  const j = Er(),
    R = () => {
      u.stop(), j && j.active && Wn(j.effects, u);
    };
  if (r && t) {
    const L = t;
    t = (...se) => {
      L(...se), R();
    };
  }
  let H = A ? new Array(e.length).fill(Gt) : Gt;
  const X = (L) => {
    if (!(!(u.flags & 1) || (!u.dirty && !L)))
      if (t) {
        const se = u.run();
        if (i || _ || (A ? se.some((Xe, Ee) => Ye(Xe, H[Ee])) : Ye(se, H))) {
          p && p();
          const Xe = ct;
          ct = u;
          try {
            const Ee = [se, H === Gt ? void 0 : A && H[0] === Gt ? [] : H, w];
            (H = se), c ? c(t, 3, Ee) : t(...Ee);
          } finally {
            ct = Xe;
          }
        }
      } else u.run();
  };
  return (
    l && l(X),
    (u = new ui(h)),
    (u.scheduler = o ? () => o(X, !1) : X),
    (w = (L) => Yr(L, !1, u)),
    (p = u.onStop =
      () => {
        const L = rn.get(u);
        if (L) {
          if (c) c(L, 4);
          else for (const se of L) se();
          rn.delete(u);
        }
      }),
    t ? (s ? X(!0) : (H = u.run())) : o ? o(X.bind(null, !0), !0) : u.run(),
    (R.pause = u.pause.bind(u)),
    (R.resume = u.resume.bind(u)),
    (R.stop = R),
    R
  );
}
function Ze(e, t = 1 / 0, n) {
  if (
    t <= 0 ||
    !Y(e) ||
    e.__v_skip ||
    ((n = n || new Map()), (n.get(e) || 0) >= t)
  )
    return e;
  if ((n.set(e, t), t--, le(e))) Ze(e.value, t, n);
  else if (F(e)) for (let s = 0; s < e.length; s++) Ze(e[s], t, n);
  else if (ti(e) || vt(e))
    e.forEach((s) => {
      Ze(s, t, n);
    });
  else if (ii(e)) {
    for (const s in e) Ze(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Ze(e[s], t, n);
  }
  return e;
}
/**
 * @vue/runtime-core v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function Jt(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (i) {
    mn(i, t, n);
  }
}
function De(e, t, n, s) {
  if (U(e)) {
    const i = Jt(e, t, n, s);
    return (
      i &&
        ni(i) &&
        i.catch((r) => {
          mn(r, t, n);
        }),
      i
    );
  }
  if (F(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++) i.push(De(e[r], t, n, s));
    return i;
  }
}
function mn(e, t, n, s = !0) {
  const i = t ? t.vnode : null,
    { errorHandler: r, throwUnhandledErrorInProduction: o } =
      (t && t.appContext.config) || Z;
  if (t) {
    let l = t.parent;
    const c = t.proxy,
      f = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const u = l.ec;
      if (u) {
        for (let h = 0; h < u.length; h++) if (u[h](e, c, f) === !1) return;
      }
      l = l.parent;
    }
    if (r) {
      $e(), Jt(r, null, 10, [e, c, f]), qe();
      return;
    }
  }
  eo(e, n, i, s, o);
}
function eo(e, t, n, s = !0, i = !1) {
  if (i) throw e;
  console.error(e);
}
const fe = [];
let Me = -1;
const wt = [];
let Ke = null,
  gt = 0;
const Ci = Promise.resolve();
let on = null;
function Ei(e) {
  const t = on || Ci;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function to(e) {
  let t = Me + 1,
    n = fe.length;
  for (; t < n; ) {
    const s = (t + n) >>> 1,
      i = fe[s],
      r = $t(i);
    r < e || (r === e && i.flags & 2) ? (t = s + 1) : (n = s);
  }
  return t;
}
function os(e) {
  if (!(e.flags & 1)) {
    const t = $t(e),
      n = fe[fe.length - 1];
    !n || (!(e.flags & 2) && t >= $t(n)) ? fe.push(e) : fe.splice(to(t), 0, e),
      (e.flags |= 1),
      Ii();
  }
}
function Ii() {
  on || (on = Ci.then(Ti));
}
function no(e) {
  F(e)
    ? wt.push(...e)
    : Ke && e.id === -1
    ? Ke.splice(gt + 1, 0, e)
    : e.flags & 1 || (wt.push(e), (e.flags |= 1)),
    Ii();
}
function Ss(e, t, n = Me + 1) {
  for (; n < fe.length; n++) {
    const s = fe[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid) continue;
      fe.splice(n, 1),
        n--,
        s.flags & 4 && (s.flags &= -2),
        s(),
        s.flags & 4 || (s.flags &= -2);
    }
  }
}
function ki(e) {
  if (wt.length) {
    const t = [...new Set(wt)].sort((n, s) => $t(n) - $t(s));
    if (((wt.length = 0), Ke)) {
      Ke.push(...t);
      return;
    }
    for (Ke = t, gt = 0; gt < Ke.length; gt++) {
      const n = Ke[gt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), (n.flags &= -2);
    }
    (Ke = null), (gt = 0);
  }
}
const $t = (e) => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
function Ti(e) {
  try {
    for (Me = 0; Me < fe.length; Me++) {
      const t = fe[Me];
      t &&
        !(t.flags & 8) &&
        (t.flags & 4 && (t.flags &= -2),
        Jt(t, t.i, t.i ? 15 : 14),
        t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Me < fe.length; Me++) {
      const t = fe[Me];
      t && (t.flags &= -2);
    }
    (Me = -1),
      (fe.length = 0),
      ki(),
      (on = null),
      (fe.length || wt.length) && Ti();
  }
}
let we = null,
  Ri = null;
function ln(e) {
  const t = we;
  return (we = e), (Ri = (e && e.type.__scopeId) || null), t;
}
function re(e, t = we, n) {
  if (!t || e._n) return e;
  const s = (...i) => {
    s._d && js(-1);
    const r = ln(t);
    let o;
    try {
      o = e(...i);
    } finally {
      ln(r), s._d && js(1);
    }
    return o;
  };
  return (s._n = !0), (s._c = !0), (s._d = !0), s;
}
function ot(e, t, n, s) {
  const i = e.dirs,
    r = t && t.dirs;
  for (let o = 0; o < i.length; o++) {
    const l = i[o];
    r && (l.oldValue = r[o].value);
    let c = l.dir[s];
    c && ($e(), De(c, n, 8, [e.el, l, e, t]), qe());
  }
}
const so = Symbol("_vte"),
  io = (e) => e.__isTeleport,
  ro = Symbol("_leaveCb");
function ls(e, t) {
  e.shapeFlag & 6 && e.component
    ? ((e.transition = t), ls(e.component.subTree, t))
    : e.shapeFlag & 128
    ? ((e.ssContent.transition = t.clone(e.ssContent)),
      (e.ssFallback.transition = t.clone(e.ssFallback)))
    : (e.transition = t);
}
function oo() {
  const e = tr();
  return e
    ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++
    : "";
}
function Pi(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const cn = new WeakMap();
function Lt(e, t, n, s, i = !1) {
  if (F(e)) {
    e.forEach((_, A) => Lt(_, t && (F(t) ? t[A] : t), n, s, i));
    return;
  }
  if (_t(s) && !i) {
    s.shapeFlag & 512 &&
      s.type.__asyncResolved &&
      s.component.subTree.component &&
      Lt(e, t, n, s.component.subTree);
    return;
  }
  const r = s.shapeFlag & 4 ? hs(s.component) : s.el,
    o = i ? null : r,
    { i: l, r: c } = e,
    f = t && t.r,
    u = l.refs === Z ? (l.refs = {}) : l.refs,
    h = l.setupState,
    p = J(h),
    w = h === Z ? ei : (_) => V(p, _);
  if (f != null && f !== c) {
    if ((Cs(t), ne(f))) (u[f] = null), w(f) && (h[f] = null);
    else if (le(f)) {
      f.value = null;
      const _ = t;
      _.k && (u[_.k] = null);
    }
  }
  if (U(c)) Jt(c, l, 12, [o, u]);
  else {
    const _ = ne(c),
      A = le(c);
    if (_ || A) {
      const j = () => {
        if (e.f) {
          const R = _ ? (w(c) ? h[c] : u[c]) : c.value;
          if (i) F(R) && Wn(R, r);
          else if (F(R)) R.includes(r) || R.push(r);
          else if (_) (u[c] = [r]), w(c) && (h[c] = u[c]);
          else {
            const H = [r];
            (c.value = H), e.k && (u[e.k] = H);
          }
        } else
          _
            ? ((u[c] = o), w(c) && (h[c] = o))
            : A && ((c.value = o), e.k && (u[e.k] = o));
      };
      if (o) {
        const R = () => {
          j(), cn.delete(e);
        };
        (R.id = -1), cn.set(e, R), ye(R, n);
      } else Cs(e), j();
    }
  }
}
function Cs(e) {
  const t = cn.get(e);
  t && ((t.flags |= 8), cn.delete(e));
}
pn().requestIdleCallback;
pn().cancelIdleCallback;
const _t = (e) => !!e.type.__asyncLoader,
  Mi = (e) => e.type.__isKeepAlive;
function lo(e, t) {
  Oi(e, "a", t);
}
function co(e, t) {
  Oi(e, "da", t);
}
function Oi(e, t, n = de) {
  const s =
    e.__wdc ||
    (e.__wdc = () => {
      let i = n;
      for (; i; ) {
        if (i.isDeactivated) return;
        i = i.parent;
      }
      return e();
    });
  if ((vn(t, s, n), n)) {
    let i = n.parent;
    for (; i && i.parent; )
      Mi(i.parent.vnode) && ao(s, t, n, i), (i = i.parent);
  }
}
function ao(e, t, n, s) {
  const i = vn(t, e, s, !0);
  cs(() => {
    Wn(s[t], i);
  }, n);
}
function vn(e, t, n = de, s = !1) {
  if (n) {
    const i = n[e] || (n[e] = []),
      r =
        t.__weh ||
        (t.__weh = (...o) => {
          $e();
          const l = Vt(n),
            c = De(t, n, e, o);
          return l(), qe(), c;
        });
    return s ? i.unshift(r) : i.push(r), r;
  }
}
const Ve =
    (e) =>
    (t, n = de) => {
      (!Nt || e === "sp") && vn(e, (...s) => t(...s), n);
    },
  uo = Ve("bm"),
  ge = Ve("m"),
  fo = Ve("bu"),
  ho = Ve("u"),
  Fe = Ve("bum"),
  cs = Ve("um"),
  po = Ve("sp"),
  go = Ve("rtg"),
  mo = Ve("rtc");
function vo(e, t = de) {
  vn("ec", e, t);
}
const bo = Symbol.for("v-ndc");
function ce(e, t, n, s) {
  let i;
  const r = n,
    o = F(e);
  if (o || ne(e)) {
    const l = o && bt(e);
    let c = !1,
      f = !1;
    l && ((c = !Ae(e)), (f = et(e)), (e = gn(e))), (i = new Array(e.length));
    for (let u = 0, h = e.length; u < h; u++)
      i[u] = t(c ? (f ? sn(ie(e[u])) : ie(e[u])) : e[u], u, void 0, r);
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let l = 0; l < e; l++) i[l] = t(l + 1, l, void 0, r);
  } else if (Y(e))
    if (e[Symbol.iterator]) i = Array.from(e, (l, c) => t(l, c, void 0, r));
    else {
      const l = Object.keys(e);
      i = new Array(l.length);
      for (let c = 0, f = l.length; c < f; c++) {
        const u = l[c];
        i[c] = t(e[u], u, c, r);
      }
    }
  else i = [];
  return i;
}
function dt(e, t, n = {}, s, i) {
  if (we.ce || (we.parent && _t(we.parent) && we.parent.ce)) {
    const f = Object.keys(n).length > 0;
    return (
      t !== "default" && (n.name = t),
      k(),
      te($, null, [N("slot", n, s)], f ? -2 : 64)
    );
  }
  let r = e[t];
  r && r._c && (r._d = !1), k();
  const o = r && ji(r(n)),
    l = n.key || (o && o.key),
    c = te(
      $,
      { key: (l && !Je(l) ? l : `_${t}`) + (!o && s ? "_fb" : "") },
      o || [],
      o && e._ === 1 ? 64 : -2
    );
  return (
    c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]),
    r && r._c && (r._d = !0),
    c
  );
}
function ji(e) {
  return e.some((t) =>
    fs(t) ? !(t.type === Ne || (t.type === $ && !ji(t.children))) : !0
  )
    ? e
    : null;
}
const qn = (e) => (e ? (nr(e) ? hs(e) : qn(e.parent)) : null),
  Dt = pe(Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => qn(e.parent),
    $root: (e) => qn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Di(e),
    $forceUpdate: (e) =>
      e.f ||
      (e.f = () => {
        os(e.update);
      }),
    $nextTick: (e) => e.n || (e.n = Ei.bind(e.proxy)),
    $watch: (e) => Uo.bind(e),
  }),
  Rn = (e, t) => e !== Z && !e.__isScriptSetup && V(e, t),
  wo = {
    get({ _: e }, t) {
      if (t === "__v_skip") return !0;
      const {
        ctx: n,
        setupState: s,
        data: i,
        props: r,
        accessCache: o,
        type: l,
        appContext: c,
      } = e;
      let f;
      if (t[0] !== "$") {
        const w = o[t];
        if (w !== void 0)
          switch (w) {
            case 1:
              return s[t];
            case 2:
              return i[t];
            case 4:
              return n[t];
            case 3:
              return r[t];
          }
        else {
          if (Rn(s, t)) return (o[t] = 1), s[t];
          if (i !== Z && V(i, t)) return (o[t] = 2), i[t];
          if ((f = e.propsOptions[0]) && V(f, t)) return (o[t] = 3), r[t];
          if (n !== Z && V(n, t)) return (o[t] = 4), n[t];
          Nn && (o[t] = 0);
        }
      }
      const u = Dt[t];
      let h, p;
      if (u) return t === "$attrs" && oe(e.attrs, "get", ""), u(e);
      if ((h = l.__cssModules) && (h = h[t])) return h;
      if (n !== Z && V(n, t)) return (o[t] = 4), n[t];
      if (((p = c.config.globalProperties), V(p, t))) return p[t];
    },
    set({ _: e }, t, n) {
      const { data: s, setupState: i, ctx: r } = e;
      return Rn(i, t)
        ? ((i[t] = n), !0)
        : s !== Z && V(s, t)
        ? ((s[t] = n), !0)
        : V(e.props, t) || (t[0] === "$" && t.slice(1) in e)
        ? !1
        : ((r[t] = n), !0);
    },
    has(
      {
        _: {
          data: e,
          setupState: t,
          accessCache: n,
          ctx: s,
          appContext: i,
          propsOptions: r,
          type: o,
        },
      },
      l
    ) {
      let c, f;
      return !!(
        n[l] ||
        (e !== Z && l[0] !== "$" && V(e, l)) ||
        Rn(t, l) ||
        ((c = r[0]) && V(c, l)) ||
        V(s, l) ||
        V(Dt, l) ||
        V(i.config.globalProperties, l) ||
        ((f = o.__cssModules) && f[l])
      );
    },
    defineProperty(e, t, n) {
      return (
        n.get != null
          ? (e._.accessCache[t] = 0)
          : V(n, "value") && this.set(e, t, n.value, null),
        Reflect.defineProperty(e, t, n)
      );
    },
  };
function Es(e) {
  return F(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e;
}
let Nn = !0;
function _o(e) {
  const t = Di(e),
    n = e.proxy,
    s = e.ctx;
  (Nn = !1), t.beforeCreate && Is(t.beforeCreate, e, "bc");
  const {
    data: i,
    computed: r,
    methods: o,
    watch: l,
    provide: c,
    inject: f,
    created: u,
    beforeMount: h,
    mounted: p,
    beforeUpdate: w,
    updated: _,
    activated: A,
    deactivated: j,
    beforeDestroy: R,
    beforeUnmount: H,
    destroyed: X,
    unmounted: L,
    render: se,
    renderTracked: Xe,
    renderTriggered: Ee,
    errorCaptured: Qe,
    serverPrefetch: zt,
    expose: st,
    inheritAttrs: St,
    components: Xt,
    directives: Qt,
    filters: xn,
  } = t;
  if ((f && yo(f, s, null), o))
    for (const G in o) {
      const Q = o[G];
      U(Q) && (s[G] = Q.bind(n));
    }
  if (i) {
    const G = i.call(n, n);
    Y(G) && (e.data = ss(G));
  }
  if (((Nn = !0), r))
    for (const G in r) {
      const Q = r[G],
        it = U(Q) ? Q.bind(n, n) : U(Q.get) ? Q.get.bind(n, n) : je,
        Kt = !U(Q) && U(Q.set) ? Q.set.bind(n) : je,
        rt = _n({ get: it, set: Kt });
      Object.defineProperty(s, G, {
        enumerable: !0,
        configurable: !0,
        get: () => rt.value,
        set: (Ie) => (rt.value = Ie),
      });
    }
  if (l) for (const G in l) Li(l[G], s, n, G);
  if (c) {
    const G = U(c) ? c.call(n) : c;
    Reflect.ownKeys(G).forEach((Q) => {
      Hi(Q, G[Q]);
    });
  }
  u && Is(u, e, "c");
  function ae(G, Q) {
    F(Q) ? Q.forEach((it) => G(it.bind(n))) : Q && G(Q.bind(n));
  }
  if (
    (ae(uo, h),
    ae(ge, p),
    ae(fo, w),
    ae(ho, _),
    ae(lo, A),
    ae(co, j),
    ae(vo, Qe),
    ae(mo, Xe),
    ae(go, Ee),
    ae(Fe, H),
    ae(cs, L),
    ae(po, zt),
    F(st))
  )
    if (st.length) {
      const G = e.exposed || (e.exposed = {});
      st.forEach((Q) => {
        Object.defineProperty(G, Q, {
          get: () => n[Q],
          set: (it) => (n[Q] = it),
          enumerable: !0,
        });
      });
    } else e.exposed || (e.exposed = {});
  se && e.render === je && (e.render = se),
    St != null && (e.inheritAttrs = St),
    Xt && (e.components = Xt),
    Qt && (e.directives = Qt),
    zt && Pi(e);
}
function yo(e, t, n = je) {
  F(e) && (e = Jn(e));
  for (const s in e) {
    const i = e[s];
    let r;
    Y(i)
      ? "default" in i
        ? (r = Ft(i.from || s, i.default, !0))
        : (r = Ft(i.from || s))
      : (r = Ft(i)),
      le(r)
        ? Object.defineProperty(t, s, {
            enumerable: !0,
            configurable: !0,
            get: () => r.value,
            set: (o) => (r.value = o),
          })
        : (t[s] = r);
  }
}
function Is(e, t, n) {
  De(F(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Li(e, t, n, s) {
  let i = s.includes(".") ? Wi(n, s) : () => n[s];
  if (ne(e)) {
    const r = t[e];
    U(r) && Mn(i, r);
  } else if (U(e)) Mn(i, e.bind(n));
  else if (Y(e))
    if (F(e)) e.forEach((r) => Li(r, t, n, s));
    else {
      const r = U(e.handler) ? e.handler.bind(n) : t[e.handler];
      U(r) && Mn(i, r, e);
    }
}
function Di(e) {
  const t = e.type,
    { mixins: n, extends: s } = t,
    {
      mixins: i,
      optionsCache: r,
      config: { optionMergeStrategies: o },
    } = e.appContext,
    l = r.get(t);
  let c;
  return (
    l
      ? (c = l)
      : !i.length && !n && !s
      ? (c = t)
      : ((c = {}), i.length && i.forEach((f) => an(c, f, o, !0)), an(c, t, o)),
    Y(t) && r.set(t, c),
    c
  );
}
function an(e, t, n, s = !1) {
  const { mixins: i, extends: r } = t;
  r && an(e, r, n, !0), i && i.forEach((o) => an(e, o, n, !0));
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = xo[o] || (n && n[o]);
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const xo = {
  data: ks,
  props: Ts,
  emits: Ts,
  methods: Rt,
  computed: Rt,
  beforeCreate: ue,
  created: ue,
  beforeMount: ue,
  mounted: ue,
  beforeUpdate: ue,
  updated: ue,
  beforeDestroy: ue,
  beforeUnmount: ue,
  destroyed: ue,
  unmounted: ue,
  activated: ue,
  deactivated: ue,
  errorCaptured: ue,
  serverPrefetch: ue,
  components: Rt,
  directives: Rt,
  watch: So,
  provide: ks,
  inject: Ao,
};
function ks(e, t) {
  return t
    ? e
      ? function () {
          return pe(
            U(e) ? e.call(this, this) : e,
            U(t) ? t.call(this, this) : t
          );
        }
      : t
    : e;
}
function Ao(e, t) {
  return Rt(Jn(e), Jn(t));
}
function Jn(e) {
  if (F(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
    return t;
  }
  return e;
}
function ue(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Rt(e, t) {
  return e ? pe(Object.create(null), e, t) : t;
}
function Ts(e, t) {
  return e
    ? F(e) && F(t)
      ? [...new Set([...e, ...t])]
      : pe(Object.create(null), Es(e), Es(t ?? {}))
    : t;
}
function So(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = pe(Object.create(null), e);
  for (const s in t) n[s] = ue(e[s], t[s]);
  return n;
}
function Fi() {
  return {
    app: null,
    config: {
      isNativeTag: ei,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}
let Co = 0;
function Eo(e, t) {
  return function (s, i = null) {
    U(s) || (s = pe({}, s)), i != null && !Y(i) && (i = null);
    const r = Fi(),
      o = new WeakSet(),
      l = [];
    let c = !1;
    const f = (r.app = {
      _uid: Co++,
      _component: s,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: ll,
      get config() {
        return r.config;
      },
      set config(u) {},
      use(u, ...h) {
        return (
          o.has(u) ||
            (u && U(u.install)
              ? (o.add(u), u.install(f, ...h))
              : U(u) && (o.add(u), u(f, ...h))),
          f
        );
      },
      mixin(u) {
        return r.mixins.includes(u) || r.mixins.push(u), f;
      },
      component(u, h) {
        return h ? ((r.components[u] = h), f) : r.components[u];
      },
      directive(u, h) {
        return h ? ((r.directives[u] = h), f) : r.directives[u];
      },
      mount(u, h, p) {
        if (!c) {
          const w = f._ceVNode || N(s, i);
          return (
            (w.appContext = r),
            p === !0 ? (p = "svg") : p === !1 && (p = void 0),
            e(w, u, p),
            (c = !0),
            (f._container = u),
            (u.__vue_app__ = f),
            hs(w.component)
          );
        }
      },
      onUnmount(u) {
        l.push(u);
      },
      unmount() {
        c &&
          (De(l, f._instance, 16),
          e(null, f._container),
          delete f._container.__vue_app__);
      },
      provide(u, h) {
        return (r.provides[u] = h), f;
      },
      runWithContext(u) {
        const h = yt;
        yt = f;
        try {
          return u();
        } finally {
          yt = h;
        }
      },
    });
    return f;
  };
}
let yt = null;
function Hi(e, t) {
  if (de) {
    let n = de.provides;
    const s = de.parent && de.parent.provides;
    s === n && (n = de.provides = Object.create(s)), (n[e] = t);
  }
}
function Ft(e, t, n = !1) {
  const s = tr();
  if (s || yt) {
    let i = yt
      ? yt._context.provides
      : s
      ? s.parent == null || s.ce
        ? s.vnode.appContext && s.vnode.appContext.provides
        : s.parent.provides
      : void 0;
    if (i && e in i) return i[e];
    if (arguments.length > 1) return n && U(t) ? t.call(s && s.proxy) : t;
  }
}
const Ui = {},
  Bi = () => Object.create(Ui),
  $i = (e) => Object.getPrototypeOf(e) === Ui;
function Io(e, t, n, s = !1) {
  const i = {},
    r = Bi();
  (e.propsDefaults = Object.create(null)), qi(e, t, i, r);
  for (const o in e.propsOptions[0]) o in i || (i[o] = void 0);
  n ? (e.props = s ? i : Vr(i)) : e.type.props ? (e.props = i) : (e.props = r),
    (e.attrs = r);
}
function ko(e, t, n, s) {
  const {
      props: i,
      attrs: r,
      vnode: { patchFlag: o },
    } = e,
    l = J(i),
    [c] = e.propsOptions;
  let f = !1;
  if ((s || o > 0) && !(o & 16)) {
    if (o & 8) {
      const u = e.vnode.dynamicProps;
      for (let h = 0; h < u.length; h++) {
        let p = u[h];
        if (bn(e.emitsOptions, p)) continue;
        const w = t[p];
        if (c)
          if (V(r, p)) w !== r[p] && ((r[p] = w), (f = !0));
          else {
            const _ = Ge(p);
            i[_] = Vn(c, l, _, w, e, !1);
          }
        else w !== r[p] && ((r[p] = w), (f = !0));
      }
    }
  } else {
    qi(e, t, i, r) && (f = !0);
    let u;
    for (const h in l)
      (!t || (!V(t, h) && ((u = ht(h)) === h || !V(t, u)))) &&
        (c
          ? n &&
            (n[h] !== void 0 || n[u] !== void 0) &&
            (i[h] = Vn(c, l, h, void 0, e, !0))
          : delete i[h]);
    if (r !== l) for (const h in r) (!t || !V(t, h)) && (delete r[h], (f = !0));
  }
  f && Be(e.attrs, "set", "");
}
function qi(e, t, n, s) {
  const [i, r] = e.propsOptions;
  let o = !1,
    l;
  if (t)
    for (let c in t) {
      if (Mt(c)) continue;
      const f = t[c];
      let u;
      i && V(i, (u = Ge(c)))
        ? !r || !r.includes(u)
          ? (n[u] = f)
          : ((l || (l = {}))[u] = f)
        : bn(e.emitsOptions, c) ||
          ((!(c in s) || f !== s[c]) && ((s[c] = f), (o = !0)));
    }
  if (r) {
    const c = J(n),
      f = l || Z;
    for (let u = 0; u < r.length; u++) {
      const h = r[u];
      n[h] = Vn(i, c, h, f[h], e, !V(f, h));
    }
  }
  return o;
}
function Vn(e, t, n, s, i, r) {
  const o = e[n];
  if (o != null) {
    const l = V(o, "default");
    if (l && s === void 0) {
      const c = o.default;
      if (o.type !== Function && !o.skipFactory && U(c)) {
        const { propsDefaults: f } = i;
        if (n in f) s = f[n];
        else {
          const u = Vt(i);
          (s = f[n] = c.call(null, t)), u();
        }
      } else s = c;
      i.ce && i.ce._setProp(n, s);
    }
    o[0] &&
      (r && !l ? (s = !1) : o[1] && (s === "" || s === ht(n)) && (s = !0));
  }
  return s;
}
const To = new WeakMap();
function Ni(e, t, n = !1) {
  const s = n ? To : t.propsCache,
    i = s.get(e);
  if (i) return i;
  const r = e.props,
    o = {},
    l = [];
  let c = !1;
  if (!U(e)) {
    const u = (h) => {
      c = !0;
      const [p, w] = Ni(h, t, !0);
      pe(o, p), w && l.push(...w);
    };
    !n && t.mixins.length && t.mixins.forEach(u),
      e.extends && u(e.extends),
      e.mixins && e.mixins.forEach(u);
  }
  if (!r && !c) return Y(e) && s.set(e, mt), mt;
  if (F(r))
    for (let u = 0; u < r.length; u++) {
      const h = Ge(r[u]);
      Rs(h) && (o[h] = Z);
    }
  else if (r)
    for (const u in r) {
      const h = Ge(u);
      if (Rs(h)) {
        const p = r[u],
          w = (o[h] = F(p) || U(p) ? { type: p } : pe({}, p)),
          _ = w.type;
        let A = !1,
          j = !0;
        if (F(_))
          for (let R = 0; R < _.length; ++R) {
            const H = _[R],
              X = U(H) && H.name;
            if (X === "Boolean") {
              A = !0;
              break;
            } else X === "String" && (j = !1);
          }
        else A = U(_) && _.name === "Boolean";
        (w[0] = A), (w[1] = j), (A || V(w, "default")) && l.push(h);
      }
    }
  const f = [o, l];
  return Y(e) && s.set(e, f), f;
}
function Rs(e) {
  return e[0] !== "$" && !Mt(e);
}
const as = (e) => e === "_" || e === "_ctx" || e === "$stable",
  us = (e) => (F(e) ? e.map(Oe) : [Oe(e)]),
  Ro = (e, t, n) => {
    if (t._n) return t;
    const s = re((...i) => us(t(...i)), n);
    return (s._c = !1), s;
  },
  Ji = (e, t, n) => {
    const s = e._ctx;
    for (const i in e) {
      if (as(i)) continue;
      const r = e[i];
      if (U(r)) t[i] = Ro(i, r, s);
      else if (r != null) {
        const o = us(r);
        t[i] = () => o;
      }
    }
  },
  Vi = (e, t) => {
    const n = us(t);
    e.slots.default = () => n;
  },
  zi = (e, t, n) => {
    for (const s in t) (n || !as(s)) && (e[s] = t[s]);
  },
  Po = (e, t, n) => {
    const s = (e.slots = Bi());
    if (e.vnode.shapeFlag & 32) {
      const i = t._;
      i ? (zi(s, t, n), n && oi(s, "_", i, !0)) : Ji(t, s);
    } else t && Vi(e, t);
  },
  Mo = (e, t, n) => {
    const { vnode: s, slots: i } = e;
    let r = !0,
      o = Z;
    if (s.shapeFlag & 32) {
      const l = t._;
      l
        ? n && l === 1
          ? (r = !1)
          : zi(i, t, n)
        : ((r = !t.$stable), Ji(t, i)),
        (o = t);
    } else t && (Vi(e, t), (o = { default: 1 }));
    if (r) for (const l in i) !as(l) && o[l] == null && delete i[l];
  },
  ye = Xo;
function Oo(e) {
  return jo(e);
}
function jo(e, t) {
  const n = pn();
  n.__VUE__ = !0;
  const {
      insert: s,
      remove: i,
      patchProp: r,
      createElement: o,
      createText: l,
      createComment: c,
      setText: f,
      setElementText: u,
      parentNode: h,
      nextSibling: p,
      setScopeId: w = je,
      insertStaticContent: _,
    } = e,
    A = (
      a,
      d,
      g,
      y = null,
      v = null,
      b = null,
      E = void 0,
      C = null,
      S = !!d.dynamicChildren
    ) => {
      if (a === d) return;
      a && !Tt(a, d) && ((y = Wt(a)), Ie(a, v, b, !0), (a = null)),
        d.patchFlag === -2 && ((S = !1), (d.dynamicChildren = null));
      const { type: x, ref: M, shapeFlag: T } = d;
      switch (x) {
        case wn:
          j(a, d, g, y);
          break;
        case Ne:
          R(a, d, g, y);
          break;
        case On:
          a == null && H(d, g, y, E);
          break;
        case $:
          Xt(a, d, g, y, v, b, E, C, S);
          break;
        default:
          T & 1
            ? se(a, d, g, y, v, b, E, C, S)
            : T & 6
            ? Qt(a, d, g, y, v, b, E, C, S)
            : (T & 64 || T & 128) && x.process(a, d, g, y, v, b, E, C, S, Et);
      }
      M != null && v
        ? Lt(M, a && a.ref, b, d || a, !d)
        : M == null && a && a.ref != null && Lt(a.ref, null, b, a, !0);
    },
    j = (a, d, g, y) => {
      if (a == null) s((d.el = l(d.children)), g, y);
      else {
        const v = (d.el = a.el);
        d.children !== a.children && f(v, d.children);
      }
    },
    R = (a, d, g, y) => {
      a == null ? s((d.el = c(d.children || "")), g, y) : (d.el = a.el);
    },
    H = (a, d, g, y) => {
      [a.el, a.anchor] = _(a.children, d, g, y, a.el, a.anchor);
    },
    X = ({ el: a, anchor: d }, g, y) => {
      let v;
      for (; a && a !== d; ) (v = p(a)), s(a, g, y), (a = v);
      s(d, g, y);
    },
    L = ({ el: a, anchor: d }) => {
      let g;
      for (; a && a !== d; ) (g = p(a)), i(a), (a = g);
      i(d);
    },
    se = (a, d, g, y, v, b, E, C, S) => {
      d.type === "svg" ? (E = "svg") : d.type === "math" && (E = "mathml"),
        a == null ? Xe(d, g, y, v, b, E, C, S) : zt(a, d, v, b, E, C, S);
    },
    Xe = (a, d, g, y, v, b, E, C) => {
      let S, x;
      const { props: M, shapeFlag: T, transition: P, dirs: D } = a;
      if (
        ((S = a.el = o(a.type, b, M && M.is, M)),
        T & 8
          ? u(S, a.children)
          : T & 16 && Qe(a.children, S, null, y, v, Pn(a, b), E, C),
        D && ot(a, null, y, "created"),
        Ee(S, a, a.scopeId, E, y),
        M)
      ) {
        for (const K in M) K !== "value" && !Mt(K) && r(S, K, null, M[K], b, y);
        "value" in M && r(S, "value", null, M.value, b),
          (x = M.onVnodeBeforeMount) && Pe(x, y, a);
      }
      D && ot(a, null, y, "beforeMount");
      const B = Lo(v, P);
      B && P.beforeEnter(S),
        s(S, d, g),
        ((x = M && M.onVnodeMounted) || B || D) &&
          ye(() => {
            x && Pe(x, y, a), B && P.enter(S), D && ot(a, null, y, "mounted");
          }, v);
    },
    Ee = (a, d, g, y, v) => {
      if ((g && w(a, g), y)) for (let b = 0; b < y.length; b++) w(a, y[b]);
      if (v) {
        let b = v.subTree;
        if (
          d === b ||
          (Yi(b.type) && (b.ssContent === d || b.ssFallback === d))
        ) {
          const E = v.vnode;
          Ee(a, E, E.scopeId, E.slotScopeIds, v.parent);
        }
      }
    },
    Qe = (a, d, g, y, v, b, E, C, S = 0) => {
      for (let x = S; x < a.length; x++) {
        const M = (a[x] = C ? We(a[x]) : Oe(a[x]));
        A(null, M, d, g, y, v, b, E, C);
      }
    },
    zt = (a, d, g, y, v, b, E) => {
      const C = (d.el = a.el);
      let { patchFlag: S, dynamicChildren: x, dirs: M } = d;
      S |= a.patchFlag & 16;
      const T = a.props || Z,
        P = d.props || Z;
      let D;
      if (
        (g && lt(g, !1),
        (D = P.onVnodeBeforeUpdate) && Pe(D, g, d, a),
        M && ot(d, a, g, "beforeUpdate"),
        g && lt(g, !0),
        ((T.innerHTML && P.innerHTML == null) ||
          (T.textContent && P.textContent == null)) &&
          u(C, ""),
        x
          ? st(a.dynamicChildren, x, C, g, y, Pn(d, v), b)
          : E || Q(a, d, C, null, g, y, Pn(d, v), b, !1),
        S > 0)
      ) {
        if (S & 16) St(C, T, P, g, v);
        else if (
          (S & 2 && T.class !== P.class && r(C, "class", null, P.class, v),
          S & 4 && r(C, "style", T.style, P.style, v),
          S & 8)
        ) {
          const B = d.dynamicProps;
          for (let K = 0; K < B.length; K++) {
            const z = B[K],
              me = T[z],
              ve = P[z];
            (ve !== me || z === "value") && r(C, z, me, ve, v, g);
          }
        }
        S & 1 && a.children !== d.children && u(C, d.children);
      } else !E && x == null && St(C, T, P, g, v);
      ((D = P.onVnodeUpdated) || M) &&
        ye(() => {
          D && Pe(D, g, d, a), M && ot(d, a, g, "updated");
        }, y);
    },
    st = (a, d, g, y, v, b, E) => {
      for (let C = 0; C < d.length; C++) {
        const S = a[C],
          x = d[C],
          M =
            S.el && (S.type === $ || !Tt(S, x) || S.shapeFlag & 198)
              ? h(S.el)
              : g;
        A(S, x, M, null, y, v, b, E, !0);
      }
    },
    St = (a, d, g, y, v) => {
      if (d !== g) {
        if (d !== Z)
          for (const b in d) !Mt(b) && !(b in g) && r(a, b, d[b], null, v, y);
        for (const b in g) {
          if (Mt(b)) continue;
          const E = g[b],
            C = d[b];
          E !== C && b !== "value" && r(a, b, C, E, v, y);
        }
        "value" in g && r(a, "value", d.value, g.value, v);
      }
    },
    Xt = (a, d, g, y, v, b, E, C, S) => {
      const x = (d.el = a ? a.el : l("")),
        M = (d.anchor = a ? a.anchor : l(""));
      let { patchFlag: T, dynamicChildren: P, slotScopeIds: D } = d;
      D && (C = C ? C.concat(D) : D),
        a == null
          ? (s(x, g, y), s(M, g, y), Qe(d.children || [], g, M, v, b, E, C, S))
          : T > 0 && T & 64 && P && a.dynamicChildren
          ? (st(a.dynamicChildren, P, g, v, b, E, C),
            (d.key != null || (v && d === v.subTree)) && Xi(a, d, !0))
          : Q(a, d, g, M, v, b, E, C, S);
    },
    Qt = (a, d, g, y, v, b, E, C, S) => {
      (d.slotScopeIds = C),
        a == null
          ? d.shapeFlag & 512
            ? v.ctx.activate(d, g, y, E, S)
            : xn(d, g, y, v, b, E, S)
          : gs(a, d, S);
    },
    xn = (a, d, g, y, v, b, E) => {
      const C = (a.component = tl(a, y, v));
      if ((Mi(a) && (C.ctx.renderer = Et), nl(C, !1, E), C.asyncDep)) {
        if ((v && v.registerDep(C, ae, E), !a.el)) {
          const S = (C.subTree = N(Ne));
          R(null, S, d, g), (a.placeholder = S.el);
        }
      } else ae(C, a, d, g, v, b, E);
    },
    gs = (a, d, g) => {
      const y = (d.component = a.component);
      if (Vo(a, d, g))
        if (y.asyncDep && !y.asyncResolved) {
          G(y, d, g);
          return;
        } else (y.next = d), y.update();
      else (d.el = a.el), (y.vnode = d);
    },
    ae = (a, d, g, y, v, b, E) => {
      const C = () => {
        if (a.isMounted) {
          let { next: T, bu: P, u: D, parent: B, vnode: K } = a;
          {
            const Te = Qi(a);
            if (Te) {
              T && ((T.el = K.el), G(a, T, E)),
                Te.asyncDep.then(() => {
                  a.isUnmounted || C();
                });
              return;
            }
          }
          let z = T,
            me;
          lt(a, !1),
            T ? ((T.el = K.el), G(a, T, E)) : (T = K),
            P && Cn(P),
            (me = T.props && T.props.onVnodeBeforeUpdate) && Pe(me, B, T, K),
            lt(a, !0);
          const ve = Ms(a),
            ke = a.subTree;
          (a.subTree = ve),
            A(ke, ve, h(ke.el), Wt(ke), a, v, b),
            (T.el = ve.el),
            z === null && zo(a, ve.el),
            D && ye(D, v),
            (me = T.props && T.props.onVnodeUpdated) &&
              ye(() => Pe(me, B, T, K), v);
        } else {
          let T;
          const { el: P, props: D } = d,
            { bm: B, m: K, parent: z, root: me, type: ve } = a,
            ke = _t(d);
          lt(a, !1),
            B && Cn(B),
            !ke && (T = D && D.onVnodeBeforeMount) && Pe(T, z, d),
            lt(a, !0);
          {
            me.ce &&
              me.ce._def.shadowRoot !== !1 &&
              me.ce._injectChildStyle(ve);
            const Te = (a.subTree = Ms(a));
            A(null, Te, g, y, a, v, b), (d.el = Te.el);
          }
          if ((K && ye(K, v), !ke && (T = D && D.onVnodeMounted))) {
            const Te = d;
            ye(() => Pe(T, z, Te), v);
          }
          (d.shapeFlag & 256 ||
            (z && _t(z.vnode) && z.vnode.shapeFlag & 256)) &&
            a.a &&
            ye(a.a, v),
            (a.isMounted = !0),
            (d = g = y = null);
        }
      };
      a.scope.on();
      const S = (a.effect = new ui(C));
      a.scope.off();
      const x = (a.update = S.run.bind(S)),
        M = (a.job = S.runIfDirty.bind(S));
      (M.i = a), (M.id = a.uid), (S.scheduler = () => os(M)), lt(a, !0), x();
    },
    G = (a, d, g) => {
      d.component = a;
      const y = a.vnode.props;
      (a.vnode = d),
        (a.next = null),
        ko(a, d.props, y, g),
        Mo(a, d.children, g),
        $e(),
        Ss(a),
        qe();
    },
    Q = (a, d, g, y, v, b, E, C, S = !1) => {
      const x = a && a.children,
        M = a ? a.shapeFlag : 0,
        T = d.children,
        { patchFlag: P, shapeFlag: D } = d;
      if (P > 0) {
        if (P & 128) {
          Kt(x, T, g, y, v, b, E, C, S);
          return;
        } else if (P & 256) {
          it(x, T, g, y, v, b, E, C, S);
          return;
        }
      }
      D & 8
        ? (M & 16 && Ct(x, v, b), T !== x && u(g, T))
        : M & 16
        ? D & 16
          ? Kt(x, T, g, y, v, b, E, C, S)
          : Ct(x, v, b, !0)
        : (M & 8 && u(g, ""), D & 16 && Qe(T, g, y, v, b, E, C, S));
    },
    it = (a, d, g, y, v, b, E, C, S) => {
      (a = a || mt), (d = d || mt);
      const x = a.length,
        M = d.length,
        T = Math.min(x, M);
      let P;
      for (P = 0; P < T; P++) {
        const D = (d[P] = S ? We(d[P]) : Oe(d[P]));
        A(a[P], D, g, null, v, b, E, C, S);
      }
      x > M ? Ct(a, v, b, !0, !1, T) : Qe(d, g, y, v, b, E, C, S, T);
    },
    Kt = (a, d, g, y, v, b, E, C, S) => {
      let x = 0;
      const M = d.length;
      let T = a.length - 1,
        P = M - 1;
      for (; x <= T && x <= P; ) {
        const D = a[x],
          B = (d[x] = S ? We(d[x]) : Oe(d[x]));
        if (Tt(D, B)) A(D, B, g, null, v, b, E, C, S);
        else break;
        x++;
      }
      for (; x <= T && x <= P; ) {
        const D = a[T],
          B = (d[P] = S ? We(d[P]) : Oe(d[P]));
        if (Tt(D, B)) A(D, B, g, null, v, b, E, C, S);
        else break;
        T--, P--;
      }
      if (x > T) {
        if (x <= P) {
          const D = P + 1,
            B = D < M ? d[D].el : y;
          for (; x <= P; )
            A(null, (d[x] = S ? We(d[x]) : Oe(d[x])), g, B, v, b, E, C, S), x++;
        }
      } else if (x > P) for (; x <= T; ) Ie(a[x], v, b, !0), x++;
      else {
        const D = x,
          B = x,
          K = new Map();
        for (x = B; x <= P; x++) {
          const _e = (d[x] = S ? We(d[x]) : Oe(d[x]));
          _e.key != null && K.set(_e.key, x);
        }
        let z,
          me = 0;
        const ve = P - B + 1;
        let ke = !1,
          Te = 0;
        const It = new Array(ve);
        for (x = 0; x < ve; x++) It[x] = 0;
        for (x = D; x <= T; x++) {
          const _e = a[x];
          if (me >= ve) {
            Ie(_e, v, b, !0);
            continue;
          }
          let Re;
          if (_e.key != null) Re = K.get(_e.key);
          else
            for (z = B; z <= P; z++)
              if (It[z - B] === 0 && Tt(_e, d[z])) {
                Re = z;
                break;
              }
          Re === void 0
            ? Ie(_e, v, b, !0)
            : ((It[Re - B] = x + 1),
              Re >= Te ? (Te = Re) : (ke = !0),
              A(_e, d[Re], g, null, v, b, E, C, S),
              me++);
        }
        const bs = ke ? Do(It) : mt;
        for (z = bs.length - 1, x = ve - 1; x >= 0; x--) {
          const _e = B + x,
            Re = d[_e],
            ws = d[_e + 1],
            _s = _e + 1 < M ? ws.el || ws.placeholder : y;
          It[x] === 0
            ? A(null, Re, g, _s, v, b, E, C, S)
            : ke && (z < 0 || x !== bs[z] ? rt(Re, g, _s, 2) : z--);
        }
      }
    },
    rt = (a, d, g, y, v = null) => {
      const { el: b, type: E, transition: C, children: S, shapeFlag: x } = a;
      if (x & 6) {
        rt(a.component.subTree, d, g, y);
        return;
      }
      if (x & 128) {
        a.suspense.move(d, g, y);
        return;
      }
      if (x & 64) {
        E.move(a, d, g, Et);
        return;
      }
      if (E === $) {
        s(b, d, g);
        for (let T = 0; T < S.length; T++) rt(S[T], d, g, y);
        s(a.anchor, d, g);
        return;
      }
      if (E === On) {
        X(a, d, g);
        return;
      }
      if (y !== 2 && x & 1 && C)
        if (y === 0) C.beforeEnter(b), s(b, d, g), ye(() => C.enter(b), v);
        else {
          const { leave: T, delayLeave: P, afterLeave: D } = C,
            B = () => {
              a.ctx.isUnmounted ? i(b) : s(b, d, g);
            },
            K = () => {
              b._isLeaving && b[ro](!0),
                T(b, () => {
                  B(), D && D();
                });
            };
          P ? P(b, B, K) : K();
        }
      else s(b, d, g);
    },
    Ie = (a, d, g, y = !1, v = !1) => {
      const {
        type: b,
        props: E,
        ref: C,
        children: S,
        dynamicChildren: x,
        shapeFlag: M,
        patchFlag: T,
        dirs: P,
        cacheIndex: D,
      } = a;
      if (
        (T === -2 && (v = !1),
        C != null && ($e(), Lt(C, null, g, a, !0), qe()),
        D != null && (d.renderCache[D] = void 0),
        M & 256)
      ) {
        d.ctx.deactivate(a);
        return;
      }
      const B = M & 1 && P,
        K = !_t(a);
      let z;
      if ((K && (z = E && E.onVnodeBeforeUnmount) && Pe(z, d, a), M & 6))
        hr(a.component, g, y);
      else {
        if (M & 128) {
          a.suspense.unmount(g, y);
          return;
        }
        B && ot(a, null, d, "beforeUnmount"),
          M & 64
            ? a.type.remove(a, d, g, Et, y)
            : x && !x.hasOnce && (b !== $ || (T > 0 && T & 64))
            ? Ct(x, d, g, !1, !0)
            : ((b === $ && T & 384) || (!v && M & 16)) && Ct(S, d, g),
          y && ms(a);
      }
      ((K && (z = E && E.onVnodeUnmounted)) || B) &&
        ye(() => {
          z && Pe(z, d, a), B && ot(a, null, d, "unmounted");
        }, g);
    },
    ms = (a) => {
      const { type: d, el: g, anchor: y, transition: v } = a;
      if (d === $) {
        dr(g, y);
        return;
      }
      if (d === On) {
        L(a);
        return;
      }
      const b = () => {
        i(g), v && !v.persisted && v.afterLeave && v.afterLeave();
      };
      if (a.shapeFlag & 1 && v && !v.persisted) {
        const { leave: E, delayLeave: C } = v,
          S = () => E(g, b);
        C ? C(a.el, b, S) : S();
      } else b();
    },
    dr = (a, d) => {
      let g;
      for (; a !== d; ) (g = p(a)), i(a), (a = g);
      i(d);
    },
    hr = (a, d, g) => {
      const { bum: y, scope: v, job: b, subTree: E, um: C, m: S, a: x } = a;
      Ps(S),
        Ps(x),
        y && Cn(y),
        v.stop(),
        b && ((b.flags |= 8), Ie(E, a, d, g)),
        C && ye(C, d),
        ye(() => {
          a.isUnmounted = !0;
        }, d);
    },
    Ct = (a, d, g, y = !1, v = !1, b = 0) => {
      for (let E = b; E < a.length; E++) Ie(a[E], d, g, y, v);
    },
    Wt = (a) => {
      if (a.shapeFlag & 6) return Wt(a.component.subTree);
      if (a.shapeFlag & 128) return a.suspense.next();
      const d = p(a.anchor || a.el),
        g = d && d[so];
      return g ? p(g) : d;
    };
  let An = !1;
  const vs = (a, d, g) => {
      a == null
        ? d._vnode && Ie(d._vnode, null, null, !0)
        : A(d._vnode || null, a, d, null, null, null, g),
        (d._vnode = a),
        An || ((An = !0), Ss(), ki(), (An = !1));
    },
    Et = {
      p: A,
      um: Ie,
      m: rt,
      r: ms,
      mt: xn,
      mc: Qe,
      pc: Q,
      pbc: st,
      n: Wt,
      o: e,
    };
  return { render: vs, hydrate: void 0, createApp: Eo(vs) };
}
function Pn({ type: e, props: t }, n) {
  return (n === "svg" && e === "foreignObject") ||
    (n === "mathml" &&
      e === "annotation-xml" &&
      t &&
      t.encoding &&
      t.encoding.includes("html"))
    ? void 0
    : n;
}
function lt({ effect: e, job: t }, n) {
  n ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
}
function Lo(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function Xi(e, t, n = !1) {
  const s = e.children,
    i = t.children;
  if (F(s) && F(i))
    for (let r = 0; r < s.length; r++) {
      const o = s[r];
      let l = i[r];
      l.shapeFlag & 1 &&
        !l.dynamicChildren &&
        ((l.patchFlag <= 0 || l.patchFlag === 32) &&
          ((l = i[r] = We(i[r])), (l.el = o.el)),
        !n && l.patchFlag !== -2 && Xi(o, l)),
        l.type === wn && l.patchFlag !== -1 && (l.el = o.el),
        l.type === Ne && !l.el && (l.el = o.el);
    }
}
function Do(e) {
  const t = e.slice(),
    n = [0];
  let s, i, r, o, l;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const f = e[s];
    if (f !== 0) {
      if (((i = n[n.length - 1]), e[i] < f)) {
        (t[s] = i), n.push(s);
        continue;
      }
      for (r = 0, o = n.length - 1; r < o; )
        (l = (r + o) >> 1), e[n[l]] < f ? (r = l + 1) : (o = l);
      f < e[n[r]] && (r > 0 && (t[s] = n[r - 1]), (n[r] = s));
    }
  }
  for (r = n.length, o = n[r - 1]; r-- > 0; ) (n[r] = o), (o = t[o]);
  return n;
}
function Qi(e) {
  const t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : Qi(t);
}
function Ps(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
const Fo = Symbol.for("v-scx"),
  Ho = () => Ft(Fo);
function Mn(e, t, n) {
  return Ki(e, t, n);
}
function Ki(e, t, n = Z) {
  const { immediate: s, deep: i, flush: r, once: o } = n,
    l = pe({}, n),
    c = (t && s) || (!t && r !== "post");
  let f;
  if (Nt) {
    if (r === "sync") {
      const w = Ho();
      f = w.__watcherHandles || (w.__watcherHandles = []);
    } else if (!c) {
      const w = () => {};
      return (w.stop = je), (w.resume = je), (w.pause = je), w;
    }
  }
  const u = de;
  l.call = (w, _, A) => De(w, u, _, A);
  let h = !1;
  r === "post"
    ? (l.scheduler = (w) => {
        ye(w, u && u.suspense);
      })
    : r !== "sync" &&
      ((h = !0),
      (l.scheduler = (w, _) => {
        _ ? w() : os(w);
      })),
    (l.augmentJob = (w) => {
      t && (w.flags |= 4),
        h && ((w.flags |= 2), u && ((w.id = u.uid), (w.i = u)));
    });
  const p = Gr(e, t, l);
  return Nt && (f ? f.push(p) : c && p()), p;
}
function Uo(e, t, n) {
  const s = this.proxy,
    i = ne(e) ? (e.includes(".") ? Wi(s, e) : () => s[e]) : e.bind(s, s);
  let r;
  U(t) ? (r = t) : ((r = t.handler), (n = t));
  const o = Vt(this),
    l = Ki(i, r.bind(s), n);
  return o(), l;
}
function Wi(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let i = 0; i < n.length && s; i++) s = s[n[i]];
    return s;
  };
}
const Bo = (e, t) =>
  t === "modelValue" || t === "model-value"
    ? e.modelModifiers
    : e[`${t}Modifiers`] || e[`${Ge(t)}Modifiers`] || e[`${ht(t)}Modifiers`];
function $o(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Z;
  let i = n;
  const r = t.startsWith("update:"),
    o = r && Bo(s, t.slice(7));
  o &&
    (o.trim && (i = n.map((u) => (ne(u) ? u.trim() : u))),
    o.number && (i = n.map(br)));
  let l,
    c = s[(l = Sn(t))] || s[(l = Sn(Ge(t)))];
  !c && r && (c = s[(l = Sn(ht(t)))]), c && De(c, e, 6, i);
  const f = s[l + "Once"];
  if (f) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[l]) return;
    (e.emitted[l] = !0), De(f, e, 6, i);
  }
}
const qo = new WeakMap();
function Zi(e, t, n = !1) {
  const s = n ? qo : t.emitsCache,
    i = s.get(e);
  if (i !== void 0) return i;
  const r = e.emits;
  let o = {},
    l = !1;
  if (!U(e)) {
    const c = (f) => {
      const u = Zi(f, t, !0);
      u && ((l = !0), pe(o, u));
    };
    !n && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c);
  }
  return !r && !l
    ? (Y(e) && s.set(e, null), null)
    : (F(r) ? r.forEach((c) => (o[c] = null)) : pe(o, r),
      Y(e) && s.set(e, o),
      o);
}
function bn(e, t) {
  return !e || !fn(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, "")),
      V(e, t[0].toLowerCase() + t.slice(1)) || V(e, ht(t)) || V(e, t));
}
function Ms(e) {
  const {
      type: t,
      vnode: n,
      proxy: s,
      withProxy: i,
      propsOptions: [r],
      slots: o,
      attrs: l,
      emit: c,
      render: f,
      renderCache: u,
      props: h,
      data: p,
      setupState: w,
      ctx: _,
      inheritAttrs: A,
    } = e,
    j = ln(e);
  let R, H;
  try {
    if (n.shapeFlag & 4) {
      const L = i || s,
        se = L;
      (R = Oe(f.call(se, L, u, h, w, p, _))), (H = l);
    } else {
      const L = t;
      (R = Oe(
        L.length > 1 ? L(h, { attrs: l, slots: o, emit: c }) : L(h, null)
      )),
        (H = t.props ? l : No(l));
    }
  } catch (L) {
    (Ht.length = 0), mn(L, e, 1), (R = N(Ne));
  }
  let X = R;
  if (H && A !== !1) {
    const L = Object.keys(H),
      { shapeFlag: se } = X;
    L.length &&
      se & 7 &&
      (r && L.some(Kn) && (H = Jo(H, r)), (X = xt(X, H, !1, !0)));
  }
  return (
    n.dirs &&
      ((X = xt(X, null, !1, !0)),
      (X.dirs = X.dirs ? X.dirs.concat(n.dirs) : n.dirs)),
    n.transition && ls(X, n.transition),
    (R = X),
    ln(j),
    R
  );
}
const No = (e) => {
    let t;
    for (const n in e)
      (n === "class" || n === "style" || fn(n)) && ((t || (t = {}))[n] = e[n]);
    return t;
  },
  Jo = (e, t) => {
    const n = {};
    for (const s in e) (!Kn(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
    return n;
  };
function Vo(e, t, n) {
  const { props: s, children: i, component: r } = e,
    { props: o, children: l, patchFlag: c } = t,
    f = r.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (n && c >= 0) {
    if (c & 1024) return !0;
    if (c & 16) return s ? Os(s, o, f) : !!o;
    if (c & 8) {
      const u = t.dynamicProps;
      for (let h = 0; h < u.length; h++) {
        const p = u[h];
        if (o[p] !== s[p] && !bn(f, p)) return !0;
      }
    }
  } else
    return (i || l) && (!l || !l.$stable)
      ? !0
      : s === o
      ? !1
      : s
      ? o
        ? Os(s, o, f)
        : !0
      : !!o;
  return !1;
}
function Os(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !0;
  for (let i = 0; i < s.length; i++) {
    const r = s[i];
    if (t[r] !== e[r] && !bn(n, r)) return !0;
  }
  return !1;
}
function zo({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if ((s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e))
      ((e = t.vnode).el = n), (t = t.parent);
    else break;
  }
}
const Yi = (e) => e.__isSuspense;
function Xo(e, t) {
  t && t.pendingBranch
    ? F(e)
      ? t.effects.push(...e)
      : t.effects.push(e)
    : no(e);
}
const $ = Symbol.for("v-fgt"),
  wn = Symbol.for("v-txt"),
  Ne = Symbol.for("v-cmt"),
  On = Symbol.for("v-stc"),
  Ht = [];
let xe = null;
function k(e = !1) {
  Ht.push((xe = e ? null : []));
}
function Qo() {
  Ht.pop(), (xe = Ht[Ht.length - 1] || null);
}
let qt = 1;
function js(e, t = !1) {
  (qt += e), e < 0 && xe && t && (xe.hasOnce = !0);
}
function Gi(e) {
  return (
    (e.dynamicChildren = qt > 0 ? xe || mt : null),
    Qo(),
    qt > 0 && xe && xe.push(e),
    e
  );
}
function O(e, t, n, s, i, r) {
  return Gi(m(e, t, n, s, i, r, !0));
}
function te(e, t, n, s, i) {
  return Gi(N(e, t, n, s, i, !0));
}
function fs(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Tt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const er = ({ key: e }) => e ?? null,
  tn = ({ ref: e, ref_key: t, ref_for: n }) => (
    typeof e == "number" && (e = "" + e),
    e != null
      ? ne(e) || le(e) || U(e)
        ? { i: we, r: e, k: t, f: !!n }
        : e
      : null
  );
function m(
  e,
  t = null,
  n = null,
  s = 0,
  i = null,
  r = e === $ ? 0 : 1,
  o = !1,
  l = !1
) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && er(t),
    ref: t && tn(t),
    scopeId: Ri,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: s,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: we,
  };
  return (
    l
      ? (ds(c, n), r & 128 && e.normalize(c))
      : n && (c.shapeFlag |= ne(n) ? 8 : 16),
    qt > 0 &&
      !o &&
      xe &&
      (c.patchFlag > 0 || r & 6) &&
      c.patchFlag !== 32 &&
      xe.push(c),
    c
  );
}
const N = Ko;
function Ko(e, t = null, n = null, s = 0, i = null, r = !1) {
  if (((!e || e === bo) && (e = Ne), fs(e))) {
    const l = xt(e, t, !0);
    return (
      n && ds(l, n),
      qt > 0 &&
        !r &&
        xe &&
        (l.shapeFlag & 6 ? (xe[xe.indexOf(e)] = l) : xe.push(l)),
      (l.patchFlag = -2),
      l
    );
  }
  if ((ol(e) && (e = e.__vccOpts), t)) {
    t = Wo(t);
    let { class: l, style: c } = t;
    l && !ne(l) && (t.class = he(l)),
      Y(c) && (rs(c) && !F(c) && (c = pe({}, c)), (t.style = Le(c)));
  }
  const o = ne(e) ? 1 : Yi(e) ? 128 : io(e) ? 64 : Y(e) ? 4 : U(e) ? 2 : 0;
  return m(e, t, n, s, i, o, r, !0);
}
function Wo(e) {
  return e ? (rs(e) || $i(e) ? pe({}, e) : e) : null;
}
function xt(e, t, n = !1, s = !1) {
  const { props: i, ref: r, patchFlag: o, children: l, transition: c } = e,
    f = t ? Yo(i || {}, t) : i,
    u = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: f,
      key: f && er(f),
      ref:
        t && t.ref
          ? n && r
            ? F(r)
              ? r.concat(tn(t))
              : [r, tn(t)]
            : tn(t)
          : r,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: l,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== $ ? (o === -1 ? 16 : o | 16) : o,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: c,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && xt(e.ssContent),
      ssFallback: e.ssFallback && xt(e.ssFallback),
      placeholder: e.placeholder,
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce,
    };
  return c && s && ls(u, c.clone(u)), u;
}
function Zo(e = " ", t = 0) {
  return N(wn, null, e, t);
}
function At(e = "", t = !1) {
  return t ? (k(), te(Ne, null, e)) : N(Ne, null, e);
}
function Oe(e) {
  return e == null || typeof e == "boolean"
    ? N(Ne)
    : F(e)
    ? N($, null, e.slice())
    : fs(e)
    ? We(e)
    : N(wn, null, String(e));
}
function We(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : xt(e);
}
function ds(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null) t = null;
  else if (F(t)) n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), ds(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !$i(t)
        ? (t._ctx = we)
        : i === 3 &&
          we &&
          (we.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else
    U(t)
      ? ((t = { default: t, _ctx: we }), (n = 32))
      : ((t = String(t)), s & 64 ? ((n = 16), (t = [Zo(t)])) : (n = 8));
  (e.children = t), (e.shapeFlag |= n);
}
function Yo(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const i in s)
      if (i === "class")
        t.class !== s.class && (t.class = he([t.class, s.class]));
      else if (i === "style") t.style = Le([t.style, s.style]);
      else if (fn(i)) {
        const r = t[i],
          o = s[i];
        o &&
          r !== o &&
          !(F(r) && r.includes(o)) &&
          (t[i] = r ? [].concat(r, o) : o);
      } else i !== "" && (t[i] = s[i]);
  }
  return t;
}
function Pe(e, t, n, s = null) {
  De(e, t, 7, [n, s]);
}
const Go = Fi();
let el = 0;
function tl(e, t, n) {
  const s = e.type,
    i = (t ? t.appContext : e.appContext) || Go,
    r = {
      uid: el++,
      vnode: e,
      type: s,
      parent: t,
      appContext: i,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new Cr(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(i.provides),
      ids: t ? t.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: Ni(s, i),
      emitsOptions: Zi(s, i),
      emit: null,
      emitted: null,
      propsDefaults: Z,
      inheritAttrs: s.inheritAttrs,
      ctx: Z,
      data: Z,
      props: Z,
      attrs: Z,
      slots: Z,
      refs: Z,
      setupState: Z,
      setupContext: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null,
    };
  return (
    (r.ctx = { _: r }),
    (r.root = t ? t.root : r),
    (r.emit = $o.bind(null, r)),
    e.ce && e.ce(r),
    r
  );
}
let de = null;
const tr = () => de || we;
let un, zn;
{
  const e = pn(),
    t = (n, s) => {
      let i;
      return (
        (i = e[n]) || (i = e[n] = []),
        i.push(s),
        (r) => {
          i.length > 1 ? i.forEach((o) => o(r)) : i[0](r);
        }
      );
    };
  (un = t("__VUE_INSTANCE_SETTERS__", (n) => (de = n))),
    (zn = t("__VUE_SSR_SETTERS__", (n) => (Nt = n)));
}
const Vt = (e) => {
    const t = de;
    return (
      un(e),
      e.scope.on(),
      () => {
        e.scope.off(), un(t);
      }
    );
  },
  Ls = () => {
    de && de.scope.off(), un(null);
  };
function nr(e) {
  return e.vnode.shapeFlag & 4;
}
let Nt = !1;
function nl(e, t = !1, n = !1) {
  t && zn(t);
  const { props: s, children: i } = e.vnode,
    r = nr(e);
  Io(e, s, r, t), Po(e, i, n || t);
  const o = r ? sl(e, t) : void 0;
  return t && zn(!1), o;
}
function sl(e, t) {
  const n = e.type;
  (e.accessCache = Object.create(null)), (e.proxy = new Proxy(e.ctx, wo));
  const { setup: s } = n;
  if (s) {
    $e();
    const i = (e.setupContext = s.length > 1 ? rl(e) : null),
      r = Vt(e),
      o = Jt(s, e, 0, [e.props, i]),
      l = ni(o);
    if ((qe(), r(), (l || e.sp) && !_t(e) && Pi(e), l)) {
      if ((o.then(Ls, Ls), t))
        return o
          .then((c) => {
            Ds(e, c);
          })
          .catch((c) => {
            mn(c, e, 0);
          });
      e.asyncDep = o;
    } else Ds(e, o);
  } else sr(e);
}
function Ds(e, t, n) {
  U(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : Y(t) && (e.setupState = Si(t)),
    sr(e);
}
function sr(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || je);
  {
    const i = Vt(e);
    $e();
    try {
      _o(e);
    } finally {
      qe(), i();
    }
  }
}
const il = {
  get(e, t) {
    return oe(e, "get", ""), e[t];
  },
};
function rl(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, il),
    slots: e.slots,
    emit: e.emit,
    expose: t,
  };
}
function hs(e) {
  return e.exposed
    ? e.exposeProxy ||
        (e.exposeProxy = new Proxy(Si(zr(e.exposed)), {
          get(t, n) {
            if (n in t) return t[n];
            if (n in Dt) return Dt[n](e);
          },
          has(t, n) {
            return n in t || n in Dt;
          },
        }))
    : e.proxy;
}
function ol(e) {
  return U(e) && "__vccOpts" in e;
}
const _n = (e, t) => Zr(e, t, Nt),
  ll = "3.5.22";
/**
 * @vue/runtime-dom v3.5.22
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Xn;
const Fs = typeof window < "u" && window.trustedTypes;
if (Fs)
  try {
    Xn = Fs.createPolicy("vue", { createHTML: (e) => e });
  } catch {}
const ir = Xn ? (e) => Xn.createHTML(e) : (e) => e,
  cl = "http://www.w3.org/2000/svg",
  al = "http://www.w3.org/1998/Math/MathML",
  Ue = typeof document < "u" ? document : null,
  Hs = Ue && Ue.createElement("template"),
  ul = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, n, s) => {
      const i =
        t === "svg"
          ? Ue.createElementNS(cl, e)
          : t === "mathml"
          ? Ue.createElementNS(al, e)
          : n
          ? Ue.createElement(e, { is: n })
          : Ue.createElement(e);
      return (
        e === "select" &&
          s &&
          s.multiple != null &&
          i.setAttribute("multiple", s.multiple),
        i
      );
    },
    createText: (e) => Ue.createTextNode(e),
    createComment: (e) => Ue.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: (e) => e.parentNode,
    nextSibling: (e) => e.nextSibling,
    querySelector: (e) => Ue.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "");
    },
    insertStaticContent(e, t, n, s, i, r) {
      const o = n ? n.previousSibling : t.lastChild;
      if (i && (i === r || i.nextSibling))
        for (
          ;
          t.insertBefore(i.cloneNode(!0), n),
            !(i === r || !(i = i.nextSibling));

        );
      else {
        Hs.innerHTML = ir(
          s === "svg"
            ? `<svg>${e}</svg>`
            : s === "mathml"
            ? `<math>${e}</math>`
            : e
        );
        const l = Hs.content;
        if (s === "svg" || s === "mathml") {
          const c = l.firstChild;
          for (; c.firstChild; ) l.appendChild(c.firstChild);
          l.removeChild(c);
        }
        t.insertBefore(l, n);
      }
      return [
        o ? o.nextSibling : t.firstChild,
        n ? n.previousSibling : t.lastChild,
      ];
    },
  },
  fl = Symbol("_vtc");
function dl(e, t, n) {
  const s = e[fl];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")),
    t == null
      ? e.removeAttribute("class")
      : n
      ? e.setAttribute("class", t)
      : (e.className = t);
}
const Us = Symbol("_vod"),
  hl = Symbol("_vsh"),
  pl = Symbol(""),
  gl = /(?:^|;)\s*display\s*:/;
function ml(e, t, n) {
  const s = e.style,
    i = ne(n);
  let r = !1;
  if (n && !i) {
    if (t)
      if (ne(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          n[l] == null && nn(s, l, "");
        }
      else for (const o in t) n[o] == null && nn(s, o, "");
    for (const o in n) o === "display" && (r = !0), nn(s, o, n[o]);
  } else if (i) {
    if (t !== n) {
      const o = s[pl];
      o && (n += ";" + o), (s.cssText = n), (r = gl.test(n));
    }
  } else t && e.removeAttribute("style");
  Us in e && ((e[Us] = r ? s.display : ""), e[hl] && (s.display = "none"));
}
const Bs = /\s*!important$/;
function nn(e, t, n) {
  if (F(n)) n.forEach((s) => nn(e, t, s));
  else if ((n == null && (n = ""), t.startsWith("--"))) e.setProperty(t, n);
  else {
    const s = vl(e, t);
    Bs.test(n)
      ? e.setProperty(ht(s), n.replace(Bs, ""), "important")
      : (e[s] = n);
  }
}
const $s = ["Webkit", "Moz", "ms"],
  jn = {};
function vl(e, t) {
  const n = jn[t];
  if (n) return n;
  let s = Ge(t);
  if (s !== "filter" && s in e) return (jn[t] = s);
  s = ri(s);
  for (let i = 0; i < $s.length; i++) {
    const r = $s[i] + s;
    if (r in e) return (jn[t] = r);
  }
  return t;
}
const qs = "http://www.w3.org/1999/xlink";
function Ns(e, t, n, s, i, r = Sr(t)) {
  s && t.startsWith("xlink:")
    ? n == null
      ? e.removeAttributeNS(qs, t.slice(6, t.length))
      : e.setAttributeNS(qs, t, n)
    : n == null || (r && !li(n))
    ? e.removeAttribute(t)
    : e.setAttribute(t, r ? "" : Je(n) ? String(n) : n);
}
function Js(e, t, n, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? ir(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && !r.includes("-")) {
    const l = r === "OPTION" ? e.getAttribute("value") || "" : e.value,
      c = n == null ? (e.type === "checkbox" ? "on" : "") : String(n);
    (l !== c || !("_value" in e)) && (e.value = c),
      n == null && e.removeAttribute(t),
      (e._value = n);
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean"
      ? (n = li(n))
      : n == null && l === "string"
      ? ((n = ""), (o = !0))
      : l === "number" && ((n = 0), (o = !0));
  }
  try {
    e[t] = n;
  } catch {}
  o && e.removeAttribute(i || t);
}
function bl(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function wl(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Vs = Symbol("_vei");
function _l(e, t, n, s, i = null) {
  const r = e[Vs] || (e[Vs] = {}),
    o = r[t];
  if (s && o) o.value = s;
  else {
    const [l, c] = yl(t);
    if (s) {
      const f = (r[t] = Sl(s, i));
      bl(e, l, f, c);
    } else o && (wl(e, l, o, c), (r[t] = void 0));
  }
}
const zs = /(?:Once|Passive|Capture)$/;
function yl(e) {
  let t;
  if (zs.test(e)) {
    t = {};
    let s;
    for (; (s = e.match(zs)); )
      (e = e.slice(0, e.length - s[0].length)), (t[s[0].toLowerCase()] = !0);
  }
  return [e[2] === ":" ? e.slice(3) : ht(e.slice(2)), t];
}
let Ln = 0;
const xl = Promise.resolve(),
  Al = () => Ln || (xl.then(() => (Ln = 0)), (Ln = Date.now()));
function Sl(e, t) {
  const n = (s) => {
    if (!s._vts) s._vts = Date.now();
    else if (s._vts <= n.attached) return;
    De(Cl(s, n.value), t, 5, [s]);
  };
  return (n.value = e), (n.attached = Al()), n;
}
function Cl(e, t) {
  if (F(t)) {
    const n = e.stopImmediatePropagation;
    return (
      (e.stopImmediatePropagation = () => {
        n.call(e), (e._stopped = !0);
      }),
      t.map((s) => (i) => !i._stopped && s && s(i))
    );
  } else return t;
}
const Xs = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  El = (e, t, n, s, i, r) => {
    const o = i === "svg";
    t === "class"
      ? dl(e, s, o)
      : t === "style"
      ? ml(e, n, s)
      : fn(t)
      ? Kn(t) || _l(e, t, n, s, r)
      : (
          t[0] === "."
            ? ((t = t.slice(1)), !0)
            : t[0] === "^"
            ? ((t = t.slice(1)), !1)
            : Il(e, t, s, o)
        )
      ? (Js(e, t, s),
        !e.tagName.includes("-") &&
          (t === "value" || t === "checked" || t === "selected") &&
          Ns(e, t, s, o, r, t !== "value"))
      : e._isVueCE && (/[A-Z]/.test(t) || !ne(s))
      ? Js(e, Ge(t), s, r, t)
      : (t === "true-value"
          ? (e._trueValue = s)
          : t === "false-value" && (e._falseValue = s),
        Ns(e, t, s, o));
  };
function Il(e, t, n, s) {
  if (s)
    return !!(
      t === "innerHTML" ||
      t === "textContent" ||
      (t in e && Xs(t) && U(n))
    );
  if (
    t === "spellcheck" ||
    t === "draggable" ||
    t === "translate" ||
    t === "autocorrect" ||
    t === "form" ||
    (t === "list" && e.tagName === "INPUT") ||
    (t === "type" && e.tagName === "TEXTAREA")
  )
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return Xs(t) && ne(n) ? !1 : t in e;
}
const kl = pe({ patchProp: El }, ul);
let Qs;
function Tl() {
  return Qs || (Qs = Oo(kl));
}
const Rl = (...e) => {
  const t = Tl().createApp(...e),
    { mount: n } = t;
  return (
    (t.mount = (s) => {
      const i = Ml(s);
      if (!i) return;
      const r = t._component;
      !U(r) && !r.render && !r.template && (r.template = i.innerHTML),
        i.nodeType === 1 && (i.textContent = "");
      const o = n(i, !1, Pl(i));
      return (
        i instanceof Element &&
          (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")),
        o
      );
    }),
    t
  );
};
function Pl(e) {
  if (e instanceof SVGElement) return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Ml(e) {
  return ne(e) ? document.querySelector(e) : e;
}
const rr = Symbol("scrollContext");
function Ol() {
  const e = I(),
    t = I(),
    n = I([]);
  return (
    Hi(rr, {
      containerRef: e,
      contentRef: t,
      sections: n,
      getSections: () => {
        const l = [];
        return (
          n.value.forEach((c) => {
            c.el && l.push(c);
          }),
          l
        );
      },
      scroll: (l) => {
        const c =
          l.getBoundingClientRect().top - t.value.getBoundingClientRect().top;
        e.value.scrollTo({ top: c, behavior: "smooth" });
      },
      registerSection: (l, c) => {
        const f = n.value.find((u) => u.id === l);
        f ? f.el || (f.el = c) : n.value.push({ id: l, el: c });
      },
      unregisterSection: (l) => {
        n.value.find((c) => c.id === l).el = null;
      },
    }),
    { containerRef: e, contentRef: t, sections: n }
  );
}
function tt() {
  return Ft(rr, {
    containerRef: I(null),
    contentRef: I(null),
    sections: I([]),
    getSections: () => {},
    scroll: () => {},
    registerSection: () => {},
    unregisterSection: () => {},
  });
}
const jl = {
    class: "absolute top-0 right-0 w-8 h-full z-30 font-rubik py-[3dvw]",
  },
  Ll = ["data-scroll-thumb-y"],
  Dl = {
    class:
      "text-[12px] text-white rotate-270 text-left leading-none flex items-center justify-center",
  },
  Fl = {
    __name: "Scrollbar",
    setup(e) {
      const t = I(0),
        n = I(!1),
        s = I(0),
        i = I(),
        r = I(),
        o = I(!1),
        l = I(0),
        c = I(0),
        { containerRef: f, contentRef: u } = tt(),
        h = () => {
          if (
            !(!f.value || !u.value) &&
            ((n.value = u.value.clientHeight > f.value.clientHeight),
            !!n.value && !(!r.value || !i.value) && !o.value)
          ) {
            const A = u.value.scrollHeight - f.value.clientHeight,
              j = i.value.clientHeight - r.value.clientHeight;
            A > 0 &&
              ((s.value = f.value.scrollTop / A),
              (t.value = Math.round(j * s.value)));
          }
        },
        p = (A) => {
          n.value &&
            ((o.value = !0),
            (l.value = A.clientY),
            (c.value = t.value),
            document.addEventListener("mousemove", w),
            document.addEventListener("mouseup", _),
            A.preventDefault());
        },
        w = (A) => {
          if (!o.value) return;
          const j = A.clientY - l.value,
            R = i.value.clientHeight - r.value.clientHeight;
          let H = c.value + j;
          (H = Math.max(0, Math.min(H, R))), (t.value = H);
          const X = u.value.scrollHeight - f.value.clientHeight,
            L = H / R;
          f.value && ((f.value.scrollTop = L * X), (s.value = L));
        },
        _ = () => {
          (o.value = !1),
            document.removeEventListener("mousemove", w),
            document.removeEventListener("mouseup", _);
        };
      return (
        ge(() => {
          const A = setInterval(() => {
            f.value &&
              u.value &&
              (h(),
              f.value.addEventListener("scroll", h),
              window.addEventListener("resize", h),
              clearInterval(A));
          }, 100);
        }),
        cs(() => {
          f.value && f.value.removeEventListener("scroll", h),
            window.removeEventListener("resize", h),
            document.removeEventListener("mousemove", w),
            document.removeEventListener("mouseup", _);
        }),
        (A, j) => (
          k(),
          O("div", jl, [
            m(
              "div",
              {
                ref_key: "scrollTrack",
                ref: i,
                class: "w-full h-full relative flex justify-center",
              },
              [
                n.value
                  ? (k(),
                    O(
                      "div",
                      {
                        key: 0,
                        ref_key: "scrollThumb",
                        ref: r,
                        "data-scroll-thumb-y": t.value,
                        onMousedown: p,
                        style: Le(`top: ${t.value}px`),
                        class:
                          "w-5/8 cursor-pointer bg-neutral-300 absolute top-0 h-10 rounded-xs flex items-center justify-center",
                      },
                      [m("span", Dl, ee(Math.round(s.value * 100)), 1)],
                      44,
                      Ll
                    ))
                  : At("", !0),
              ],
              512
            ),
          ])
        )
      );
    },
  },
  Hl = ["href", "target"],
  Ul = { class: "relative overflow-hidden" },
  Bl = { class: "flex" },
  $l = { class: "absolute top-full left-0 flex" },
  yn = {
    __name: "CustomA",
    props: {
      text: { type: String, required: !0 },
      href: { type: String, default: "#" },
      target: { type: String, default: "" },
    },
    setup(e) {
      const t = e,
        n = _n(() => t.text.split("").map((s) => (s === " " ? " " : s)));
      return (s, i) => (
        k(),
        O(
          "a",
          { href: e.href, target: e.target, class: "group flex" },
          [
            m("div", Ul, [
              m("span", Bl, [
                (k(!0),
                O(
                  $,
                  null,
                  ce(
                    n.value,
                    (r, o) => (
                      k(),
                      O(
                        "span",
                        {
                          key: o,
                          class:
                            "block transition-all duration-200 group-hover:-translate-y-[200%]",
                          style: Le({
                            "--i": o,
                            "transition-delay": "calc(var(--i) * 30ms)",
                          }),
                        },
                        ee(r),
                        5
                      )
                    )
                  ),
                  128
                )),
              ]),
              m("span", $l, [
                (k(!0),
                O(
                  $,
                  null,
                  ce(
                    n.value,
                    (r, o) => (
                      k(),
                      O(
                        "span",
                        {
                          key: "bot-" + o,
                          class:
                            "block text-red-custom transition-all duration-200 group-hover:-translate-y-full",
                          style: Le({
                            "--i": o,
                            "transition-delay": "calc(var(--i) * 30ms)",
                          }),
                        },
                        ee(r),
                        5
                      )
                    )
                  ),
                  128
                )),
              ]),
            ]),
          ],
          8,
          Hl
        )
      );
    },
  };
class ql {
  constructor() {
    this.actions = [];
  }
  emit(t) {
    this.actions.forEach((n) => n.callback(t));
  }
  addAction(t, n) {
    this.actions.push({ componentId: t, callback: n });
  }
  removeAction(t) {
    this.actions = this.actions.filter((n) => n.componentId !== t);
  }
}
class Nl {
  constructor(t) {
    (this.listeners = {}), (this.element = t);
  }
  addListener(t, n, s) {
    this.listeners[t] || this.createEventObserver(t),
      this.listeners[t].observer.addAction(n, s);
  }
  removeListenersByComponentId(t) {
    Object.entries(this.listeners).forEach(([n, s]) => {
      s.observer.removeAction(t),
        s.observer.actions.length === 0 && this.removeEventObserver(n);
    });
  }
  createEventObserver(t) {
    const n = new ql(),
      s = (i) => n.emit(i);
    this.element.addEventListener(t, s, { passive: !0 }),
      (this.listeners[t] = { observer: n, boundHandler: s });
  }
  removeEventObserver(t) {
    const { boundHandler: n } = this.listeners[t];
    this.element.removeEventListener(t, n), delete this.listeners[t];
  }
}
class at {
  constructor() {
    this.domElements = [];
  }
  static getInstance() {
    return at.instance || (at.instance = new at()), at.instance;
  }
  addEventListener(t, n, s, i) {
    this.registerDomElement(t),
      this.domElements.find((r) => r.element == t).addListener(n, s, i);
  }
  removeEventListeners(t) {
    this.domElements.forEach((n) => {
      n.removeListenersByComponentId(t);
    });
  }
  registerDomElement(t) {
    this.domElements.some((n) => n.element == t) ||
      this.domElements.push(new Nl(t));
  }
}
class ut {
  constructor() {
    (this.animations = new Map()),
      (this.animate = () => {
        this.animations.forEach((t) => {
          t();
        }),
          requestAnimationFrame(this.animate);
      }),
      requestAnimationFrame(this.animate);
  }
  static getInstance() {
    return ut.instance || (ut.instance = new ut()), ut.instance;
  }
  addAnimation(t, n) {
    this.animations.set(t, n);
  }
  removeAnimation(t) {
    this.animations.delete(t);
  }
}
class Se {
  constructor(t) {
    (this.areAnimationsEnabled = !1),
      (this.enableAnimations = () => {}),
      (this.disableAnimations = () => {}),
      (this.prepareForAnimations = () => {}),
      (this.tick = () => {}),
      (this.id = Symbol()),
      (this.domSection = t ?? null);
  }
  reset() {
    (this.areAnimationsEnabled = !1),
      (this.enableAnimations = () => {}),
      (this.disableAnimations = () => {}),
      (this.prepareForAnimations = () => {}),
      (this.tick = () => {}),
      this.removeAnimationTriggers();
  }
  animate(t) {
    if (!this.isVisibleOnScreen()) {
      this.areAnimationsEnabled && this.toggleAnimationStatus();
      return;
    }
    this.areAnimationsEnabled || this.toggleAnimationStatus(),
      this.prepareForAnimations(),
      requestAnimationFrame(t ? () => this.tick(t) : this.tick);
  }
  autoAnimate() {
    ut.getInstance().addAnimation(this.id, this.animate.bind(this));
  }
  addAnimationTrigger(t, n) {
    at.getInstance().addEventListener(t, n, this.id, this.animate.bind(this));
  }
  removeAnimationTriggers() {
    at.getInstance().removeEventListeners(this.id),
      ut.getInstance().removeAnimation(this.id);
  }
  isVisibleOnScreen() {
    if (!this.domSection) return !0;
    const t = this.domSection.getBoundingClientRect().bottom < 0,
      n = this.domSection.getBoundingClientRect().top - window.innerHeight > 0;
    return !t && !n;
  }
  toggleAnimationStatus() {
    this.areAnimationsEnabled
      ? this.disableAnimations()
      : this.enableAnimations(),
      (this.areAnimationsEnabled = !this.areAnimationsEnabled);
  }
}
const ze = (e, t) => {
    const n = e.__vccOpts || e;
    for (const [s, i] of t) n[s] = i;
    return n;
  },
  Jl = {},
  Vl = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "1.5",
    stroke: "currentColor",
    class: "size-6",
  };
function zl(e, t) {
  return (
    k(),
    O("svg", Vl, [
      ...(t[0] ||
        (t[0] = [
          m(
            "path",
            {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
            },
            null,
            -1
          ),
        ])),
    ])
  );
}
const Xl = ze(Jl, [["render", zl]]),
  Ql = {},
  Kl = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "1.5",
    stroke: "currentColor",
    class: "size-6",
  };
function Wl(e, t) {
  return (
    k(),
    O("svg", Kl, [
      ...(t[0] ||
        (t[0] = [
          m(
            "path",
            {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M6 18 18 6M6 6l12 12",
            },
            null,
            -1
          ),
        ])),
    ])
  );
}
const Zl = ze(Ql, [["render", Wl]]),
  Yl = {
    ref: "nav",
    class:
      "text-white fixed pointer-events-none flex-col top-[4dvw] z-50 rounded-3xl filter before:rounded-3xl backdrop-filter-[url('#liquidFilter')]",
  },
  Gl = {
    class:
      "h-full w-full flex flex-col items-center text-white p-16 font-rubik z-0",
  },
  ec = ["onClick"],
  tc = {
    __name: "LiquidNavbar",
    setup(e) {
      const { containerRef: t, getSections: n, scroll: s } = tt(),
        i = I(),
        r = I(),
        o = I(),
        l = I(!1),
        c = (u, h) => {
          u.preventDefault(), s(h);
        },
        f = () => {
          const u = r.value.children;
          for (let h = 0; h <= u.length - 1; h++) {
            const p = n()[h].el.getBoundingClientRect(),
              w = -1 * Math.round(p.top),
              _ = Math.round(p.height);
            let A = 0;
            w >= 0 && w <= _
              ? ((o.value = n()[h].id),
                (A = (w * 100) / _),
                h == u.length - 1 && (A = 100))
              : w > _ && (A = 100),
              u[h].style.setProperty("--after-width", `${A}%`);
          }
        };
      return (
        ge(async () => {
          (i.value = new Se()),
            (i.value.tick = f),
            i.value.addAnimationTrigger(t.value, "scroll"),
            i.value.addAnimationTrigger(t.value, "wheel"),
            i.value.addAnimationTrigger(t.value, "touchmove"),
            i.value.addAnimationTrigger(window, "resize"),
            await Ei(),
            (o.value = n()[0].id),
            f();
        }),
        Fe(() => {
          i.value.reset();
        }),
        (u, h) => (
          k(),
          O(
            $,
            null,
            [
              m(
                "nav",
                Yl,
                [
                  h[2] ||
                    (h[2] = m(
                      "div",
                      {
                        class:
                          "absolute inset-0 w-full h-full bg-black opacity-25 -z-10 rounded-3xl",
                      },
                      null,
                      -1
                    )),
                  m(
                    "div",
                    {
                      ref_key: "navContainerRef",
                      ref: r,
                      class: "hidden md:flex gap-4 p-4 relative",
                    },
                    [
                      (k(!0),
                      O(
                        $,
                        null,
                        ce(
                          q(n)(),
                          (p, w) => (
                            k(),
                            te(
                              yn,
                              {
                                key: p.id,
                                text: p.id.replace("-", " "),
                                href: "",
                                onClick: (_) => c(_, p.el),
                                class: he([
                                  "navLink pointer-events-auto relative after:content-[''] after:h-[1px] after:left-0 after:bottom-0 after:absolute after:bg-white",
                                  {
                                    "after:transition-all after:duration-300":
                                      w === q(n)().length - 1,
                                  },
                                ]),
                              },
                              null,
                              8,
                              ["text", "onClick", "class"]
                            )
                          )
                        ),
                        128
                      )),
                    ],
                    512
                  ),
                  m(
                    "div",
                    {
                      class:
                        "flex md:hidden relative gap-4 transition-all p-4 cursor-pointer rounded-3xl pointer-events-auto",
                      onClick: h[0] || (h[0] = (p) => (l.value = !0)),
                    },
                    [N(Xl), m("span", null, ee(o.value), 1)]
                  ),
                ],
                512
              ),
              m(
                "section",
                {
                  class: he([
                    { "-translate-x-full": !l.value },
                    "flex md:hidden transition-all fixed inset-0 h-full w-full filter backdrop-filter-[url('#liquidTexturedFilter')] z-50",
                  ]),
                },
                [
                  h[3] ||
                    (h[3] = m(
                      "div",
                      {
                        class:
                          "absolute inset-0 w-full h-full bg-black opacity-75 -z-10",
                      },
                      null,
                      -1
                    )),
                  m("div", Gl, [
                    N(Zl, {
                      class: "absolute top-4 left-4 h-12 w-12 cursor-pointer",
                      onClick: h[1] || (h[1] = (p) => (l.value = !1)),
                    }),
                    (k(!0),
                    O(
                      $,
                      null,
                      ce(
                        q(n)(),
                        (p) => (
                          k(),
                          O(
                            "span",
                            { key: p.id, class: "flex-1 flex items-center" },
                            [
                              m(
                                "a",
                                {
                                  href: "",
                                  onClick: (w) => {
                                    c(w, p.el), (l.value = !1);
                                  },
                                  class: he([
                                    "text-3xl flex items-center justify-center transition-all cursor-pointer pointer-events-auto",
                                    { "text-red-custom": p.id === o.value },
                                  ]),
                                },
                                ee(p.id),
                                11,
                                ec
                              ),
                            ]
                          )
                        )
                      ),
                      128
                    )),
                  ]),
                ],
                2
              ),
            ],
            64
          )
        )
      );
    },
  },
  nc = ze(tc, [["__scopeId", "data-v-85b9ff79"]]),
  sc = {},
  ic = { style: { display: "none" } };
function rc(e, t) {
  return (
    k(),
    O("svg", ic, [
      ...(t[0] ||
        (t[0] = [
          m(
            "filter",
            { id: "liquidFilter" },
            [
              m("feImage", {
                href: "data:image/png;base64,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",
                preserveAspectRatio: "none",
              }),
              m("feDisplacementMap", {
                in: "SourceGraphic",
                scale: "300",
                xChannelSelector: "R",
                yChannelSelector: "G",
              }),
            ],
            -1
          ),
        ])),
    ])
  );
}
const oc = ze(sc, [["render", rc]]),
  lc = {},
  cc = { style: { display: "none" } };
function ac(e, t) {
  return (
    k(),
    O("svg", cc, [
      ...(t[0] ||
        (t[0] = [
          m(
            "filter",
            { id: "liquidTexturedFilter" },
            [
              m("feImage", {
                href: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAMoElEQVRogZ1a3ZqjyI6MkBJc3XOz7/+g+53pMoq9kJQk2K6Zs0yNGzAG/YRCSgn+/r0PYpCD2IEH+SC/yIdZfj6MD9pu3M02cjMb5KC50cycNBoJ0kiCJKn8BEWCACgCAkAAIAhQAGAAIRccNGIDBjCADdilHdilh/QAH9AX+DA+yN1sM9vAYRw2SIKg1dNJkm61Y0YzGkmDGc1A0og8JEGT1Q1gBCkQJEgArENgCi4QFDR1AABIAEEJggAIECRJogBJeblIkLK0AUEOjpQUBMzMyPk/naTRUvTUgTQDjWZESmxgfgJGIA8poE62+HNHvSeJedzngdYgZZaASNepr1HelgQhYthuhjKrpaBmrP+MZuUHt9IqP9mKWnkEZiAxzc8UkgQFkDzFLAeohZJw7qh3InRAIYYUQAhBCOVStauHbaTBQXMaPWV2L4Sb08ytxPUS1wxmaftohIEX0QkT076Fe1UcZExISB3Uhp3Ctw9CSt0i2jMSKCKmP4nBB70AYsbEudtwcx++DR/DbJi7mafh6WVs2sSPQJql+Zmxm9Y/kVPSsw1OlB/K3gIhEwI4ICqDO47QM8Lj2BShCFHMCEnTaPhXYd5TBXN3H2N/7PtjezzG/nDfzDe6kw66+cRQBsQKfaSLK2RXBU6Y84SSFtwrhCOjNcULAaEIHId/f38f37tCoQAEBCBQ0uCXO+E0N7rb5j58e+y/f339/v3462t7bDaGuTMZkwZ6RgBIEvk50d/Si1DGMi8KqHVicc8ZstEIknBAh3Aojjjw/Obzb/v7z/78ez9CVAhKiAHDv8qYLPSPfX/8+vX719f//Nr/2rd9s+FWdOPNWCk9KzpZzM7Cjdr2J0+CnPSji+yEAATAPqeCO0IRccTzie9tH//7/A+ex98hISoeAhr2SCah08wSPV/7778eX3899t/DNrdJnMVXGapW4hbceSLnZP4VP9P20jw76afUUAMqACkkQYPb+OP8j8WXjnhGxHFECBQEcPCr2JFGp49tG4992x/742GeadcIFNXgBE3zQJ1sE99wX0Q/sbXkrsvRCa+ZCxonh/jc9Y3vZ4yDT4UiEJLIkIZ9mYFmNtLGw20bY9vMh/mocAVViM/Yb7uDInlyJRfEL9C/RO881HJGEFtZQJnBLc8LDBwxxrF7wCNiZmmBw3abGcvo5u6bcTg9MzEh4sXkrUMVBLwY/oV83m7pNgEpO1sNZDSUtWAZL6ag3GKjghIVRabDdzeaZx6AmRs35yCsLTq5pUHPhW1O/LwXnauVr1t7RQuvcuYHAKpUSIYgMzkhyiAwQkWjtruDltUlRuZf+qx/WCiZ9cdCO9OQn23fmp940eUrCMwgpgArNVQRiqo5YJBn8UGJQEAsCPnmDnoXOk7H8CQm2Mru09LzD1cs/ajAaXV79cUstZupqoA6CcsIIZyiEIiqMxJCw410ZJ5y0tyJTrbT0h20L9J/9MNVE85/rrFbUs4I4HpeVXJKAVlWIQxrjpJEDPOytlkyvaOL0AUti7icKt00WSR+5SKhi5eVTtdMrdUH0kJveRElL29nJi4P2Kh1SqcqTvzwLmsF9Sn0xwC4UdDbzHaTm7WqqeDOmpuiQCIaRVVr5dIHQHmgFlqmWqmwFll5La/QZ+P61Q/9mUkNpzxX2c8lzZReaJOvsdCHygVAUAYJwUxzDGDQ5wLRDEZ5umHlnKvtL5iZCe6uxksk36XXTb1Xn+R9VKkzuSgoEmZSZOk0LFcyuSYrD3T4LtIvbHMR9L0H3oTvi+3Lf1otnd92NPfCIRc7hGSy6hXUugwYtQyWmVmulgm78D1XWW5S/iD9HezvtlfpZ3CXDmWlJCMjZAELSvAswIeZTfxkAjtDtrI9X2RdDf9WsZv9Lwb+IDcnVXE9vER/rvVy0Vc5wgzu8FMHeHqA5++4yLJq8rMTbpd90vPyqeVQ19/OsiI/xVozDaMbaLLsmWR3oYJmeeQ1Kv9RxJsf5vaD7W/kc95B/XlKn9eQgHJ9PkU3g6E8cIoyeeaKnFWTH3b+q1D5IXJOL6kWxBRg7GZVU03uGLhQp2636SB58+BXV9xUvetzWyq8/Xk7YWny9WaE5anknyyrVgy+M+fbJ93M/Oknr9sPqHvxku7ONCBbUGwdzr+K/PePfCv6W7F+UO9ywZuc9vLzeU35ROgYmDpk1/WN+f/l9paLflCPL6fOMwu6lLUbs4brOABglKXQldl62f7JBv8k+n+98ePRHauq/kXvIxWoFmGmYauerz5J/BoDc9PLlf8k7Rs/XPsU77cmeBGAUYQKQiV9k8+rT3/cbpe9fbxeD/Xm/PvnMoXXSYwUzJr1iTlamYy7pvJ/3N4uFOff/2Ob04OWWK8eaw6d31GmPqTeWv+tl+/08Gnh+7r/zxZqSjmlLLUEcXRqarqYJe3lQe+f8qKgfoyKtzp8MsFlu4ZdO0UkZZgeOlsCuCpx2X138hXZPwfAv0fUTKtYhWq6zPCtb7he11HwD0Lw5cz1UJ8NfH7qZyeUDDUUnAzTa1blWOUknHzmOVJ70eEDRG5i3aDy0fYXTjnFAq5wB9AzsbZtMiY1ijKN6hblyaB97+Ve1XA6EyT4Y0n8ul2Uud58VeyycyV1nRASLBXJYpt2XQW8mutFgs+k9IlVbzv3Gy6EeOqmU/pe8mbdbBhFpPOurGKjdU87lYG7WwNBOX2vFSBnUEwP4IMTrvpXE1TvKPvs5FNIwukUm01zGDBy7Jfd1e43anJv31arC+uwwr+/Onmre5pamw7vdVjgevfJ+txqRVmPPxMvIsAhx5nS1U3hALITebFKD0bvlsbd8BcS+yj9y7darFAgWNfm2U8x5mqrwD7gU/wUUTUwj1sqTqtnHJ9d2G4itL2n7d6IfhX0JLv3V5Zz2HFnVXUmU3bvhINeaqdzJPEQONvgN0yfcXU+pn/auJrS/FjecbJQBcPCp7XPs0gQTTVZN/asUSQGvSdb1TVtrUO3x7bNl4nQyaq44Gr96RrPd1C9wImn9OdTa34LmuiiJ51EQYhb1qHdwIq2ztoau2eAoiau2p3Mpbvpb85YvMSrDpwj5v66gQQ6MECHeQ6ZSMCoga3SQiKfQQAIQmd1NAclyoyIOdW9RsgFJG9TyXLBawDwclkzppj8YzIXh+DZfcjFlw2NnJaVDnFAgELIt0Im68xIPcXFkk3/fQSvoresN33WZk5lAdDB0X+A2cwDe1JP5i/CJECHEksFHS3PzmUGm4h068JqccZE1HL+1SFr3F/VKD8Q5qmAbAcd3UAXwIGHEMzkq5CegqQnFKpUgJo9vFD/VeiLGlex1mi+A+ZF9NlcQOEaBpg4xB3cZCNbo6kDB/bm5chJpwKBI6QIhcmkGvEscvfsKSPijt77diEprqGPnsqAKFqsHEhgzvgsfMi2sE22ywaybCNAw+DeHkvMuALHoe8Dw2k6OqwZC7+tcQzcC5nGUI3dsfiIa52FHmrPYE2TlAsV2bEaI3w8t8cxHoc/wAFI9Gq0D37RauhBShrS0GHHk9/m8OdQ0MFDsE4UBEw43wZIyS4R/NEPtd+/5Aqk2VojDNnmj0GN7bnvf/Zff7avw7fDh5w01GuSg49eKgQA46E4jm//5gb+ifh+ejBkFhXQJhgQoqWZZqu76sEzF826SZp+KKyzxZ3Qz4ZUNacgJ5wYjM31tT9/7X++Ht/b4+kuOskga4w3+EVEY0OKgAmxP78fwvMYTzuCLrhgwXrzol8ctO71sVj4bMovpYYWQBHz336jlN0ezL6aQ8MwKCc2xu56+PPXFvv2HEOVELrhT8PQXgFTr6+IEXHsxHEwQgc8KEABE0aVLTAxXxJL+J3NvJM/EiWFk7N866ivV0t7oIKckEKDGIQzdtcG7B4P0/AYLmOQSPTnRIPkwKOKgswDqnqUETpCQL2JR5ChrFBTn9RWUivASvqauGoU9QtAlRNmbZPrlLJ9v5QLGTEMngHgcmKYzETO+VdOISlhxKNeAGE6PtOWInkpJ+IUQjLNfKekpXRFLbVbh8XOXX0vyOl1d2eMjKosgZofsnYAROtpmFULEcsMGDASQ3t6WpbLmJyCZySklFAIEcpXOxkpgBigGIBJyPqql4d5p+aXtUaizhfCiX7Pes7UaSJIE7C8nFrXdAPU5uyCAIe2IoyADMwJeOK7DV+LnNyvMjtfyy78GM7XPc/grXeje2mFfqdO6CbURRLAquggOeXukJ2pF0V4pwIjpotzdFw4yUIi+iXIwo9KpWg+73FDgUL9YnSTEdfVLuv1MhE2XyrlJCXjgiLU6AXovAsqybPKAlHA/wH75uVy+EFM3wAAAABJRU5ErkJggg==",
                preserveAspectRatio: "none",
              }),
              m("feTurbulence", {
                type: "turbulence",
                baseFrequency: ".05",
                numOctaves: "2",
                result: "turbulence",
              }),
              m("feDisplacementMap", {
                in: "SourceGraphic",
                in2: "turbulence",
                scale: "30",
                xChannelSelector: "R",
                yChannelSelector: "G",
              }),
            ],
            -1
          ),
        ])),
    ])
  );
}
const uc = ze(lc, [["render", ac]]),
  fc = {
    __name: "TextAnim",
    props: {
      texts: { type: Array, required: !0 },
      duration: { type: Number, default: 2 },
      container: { type: Object, default: null },
    },
    setup(e) {
      const t = e,
        n = I(null),
        s = oo(),
        i = I([]),
        r = I([]),
        o = (p) => {
          p && i.value.push(p);
        },
        l = (p) => {
          p && r.value.push(p);
        },
        c = _n(() => [...t.texts, t.texts[0]].map((p) => p.split(""))),
        f = (p, w) => {
          const _ = 50 / p;
          let A = `@keyframes ${w} {
  0% { transform: translateY(0%); }
`;
          for (let j = 0; j <= p - 1; j++) {
            const R = (j + 1) * -100;
            (A += `${_ * j * 2 + _}% { transform: translateY(${R}%); }
`),
              (A += `${(_ * j + _) * 2}% { transform: translateY(${R}%); }
`);
          }
          return A + "}";
        },
        u = () => {
          r.value.forEach((p) => {
            p.classList.remove("pause");
          });
        },
        h = () => {
          r.value.forEach((p) => {
            p.classList.add("pause");
          });
        };
      return (
        ge(() => {
          const p = i.value.length - 1;
          if (p < 1) return;
          const w = `slide-steps-${s}`,
            _ = document.createElement("style");
          (_.textContent = f(p, w)),
            document.head.appendChild(_),
            r.value.forEach((A) => {
              (A.style.animation = `${w} ${
                p * t.duration
              }s cubic-bezier(0.25, 0.1, 0.25, 1.4) infinite`),
                (A.style.animationDelay = "calc(var(--i) * 100ms)");
            }),
            (n.value = new Se(t.container)),
            (n.value.enableAnimations = u),
            (n.value.disableAnimations = h),
            n.value.autoAnimate();
        }),
        Fe(() => {
          n.value.reset();
        }),
        (p, w) => (
          k(),
          O("div", null, [
            (k(!0),
            O(
              $,
              null,
              ce(
                c.value,
                (_, A) => (
                  k(),
                  O("p", { key: A, class: "word flex", ref_for: !0, ref: o }, [
                    (k(!0),
                    O(
                      $,
                      null,
                      ce(
                        _,
                        (j, R) => (
                          k(),
                          O(
                            "span",
                            {
                              key: R,
                              class: "letter",
                              ref_for: !0,
                              ref: l,
                              style: Le({ "--i": R }),
                            },
                            ee(j),
                            5
                          )
                        )
                      ),
                      128
                    )),
                  ])
                )
              ),
              128
            )),
          ])
        )
      );
    },
  },
  dc = ["id"],
  nt = {
    __name: "FramedMainSection",
    props: { id: { type: String, required: !0 } },
    setup(e, { expose: t }) {
      const n = e,
        s = I(null),
        { registerSection: i, unregisterSection: r } = tt();
      return (
        ge(() => i(n.id, s.value)),
        Fe(() => r(n.id)),
        t({ sectionRef: s }),
        (o, l) => (
          k(),
          O(
            "section",
            {
              ref_key: "sectionRef",
              ref: s,
              id: n.id,
              class: "window w-full overflow-hidden p-[3dvw] snap-start",
            },
            [dt(o.$slots, "default")],
            8,
            dc
          )
        )
      );
    },
  },
  hc = {
    class:
      "h-full w-full bg-fit bg-cover bg-position-[center_40%] rounded-4xl bg-[url('/backgrounds/mountains.jpg')] flex flex-col justify-center items-center text-center",
  },
  pc = {
    class:
      "text-[#fff] font-rubik uppercase text-[10dvw] xl:text-[13dvh] leading-none flex flex-col justify-center items-center",
  },
  gc = { class: "flex h-[8.4dvw] xl:h-[11dvh] overflow-hidden" },
  mc = {
    __name: "Home",
    setup(e) {
      const t = I(null),
        n = I(null);
      return (
        ge(() => {
          n.value = t.value.sectionRef;
        }),
        (s, i) => (
          k(),
          te(
            nt,
            { ref_key: "frameRef", ref: t, id: "cyprien", class: "h-dvh" },
            {
              default: re(() => [
                m("div", hc, [
                  m("div", pc, [
                    i[1] ||
                      (i[1] = m(
                        "p",
                        { class: "flex h-[8.4dvw] xl:h-[11dvh]" },
                        "In order",
                        -1
                      )),
                    m("p", gc, [
                      i[0] ||
                        (i[0] = m(
                          "span",
                          { class: "standard-text" },
                          "to ",
                          -1
                        )),
                      n.value
                        ? (k(),
                          te(
                            fc,
                            {
                              key: 0,
                              texts: [
                                "Build",
                                "Develop",
                                "Impact",
                                "Change",
                                "Design",
                              ],
                              container: n.value,
                              duration: 2.5,
                              class: he("text-red-custom"),
                            },
                            null,
                            8,
                            ["container"]
                          ))
                        : At("", !0),
                    ]),
                    i[2] ||
                      (i[2] = m(
                        "p",
                        { class: "flex h-[8.4dvw] xl:h-[11dvh]" },
                        "the future",
                        -1
                      )),
                    i[3] ||
                      (i[3] = m(
                        "p",
                        { class: "flex h-[8.4dvw] xl:h-[11dvh]" },
                        "one drop",
                        -1
                      )),
                    i[4] ||
                      (i[4] = m(
                        "p",
                        { class: "flex h-[8.4dvw] xl:h-[11dvh]" },
                        "at a time.",
                        -1
                      )),
                  ]),
                ]),
              ]),
              _: 1,
            },
            512
          )
        )
      );
    },
  },
  Pt = [
    {
      image: "/about/kid.png",
      when: "The Problem",
      description:
        'Every summer, thousands of villages across drought-prone regions of India face severe water shortages.
The current system is manual, reactive, and inefficient.

Village officials call for help.
District offices receive hundreds of complaints daily.
Tankers are dispatched based on pressure — not real need.

There is no predictive intelligence, no transparent allocation, and no accountability tracking.

JalRakshak was built to change this."',
      from: "2004",
      to: "2019",
    },
    {
      image: "/about/teen.png",
      when: "Reaching my teenage years",
      description:
        "I left my parents' home to live in the mountains and start an apprenticeship in computer science. There, I learned systems, networking, and the basics of software development. After my apprenticeship, I pursued advanced studies in development, mastering key areas of software engineering and team management, and most importantly, I became ready to take on any challenge.",
      from: "2019",
      to: "2025",
    },
    {
      image: "/about/adult.png",
      when: "The Impact",
      description:
        "I'm proud of the journey I've taken so far, but my eyes are still on tomorrow. I keep learning in specific fields to satisfy my curiosity, I continuously improve my home lab, and I often dive into ambitious projects. I'm passionate, and since every project and every great story begins with an idea, feel free to reach out. I'd love to hear from you!",
      from: "2025",
      to: "The Impact",
    },
  ],
  or = {
    __name: "FollowingFrame",
    props: { contentSection: { type: HTMLElement, required: !0 } },
    setup(e) {
      const { containerRef: t } = tt(),
        n = I(null),
        s = I(null),
        i = I(),
        r = I(),
        o = e,
        l = () => {
          if (!n.value) return;
          const f =
              -o.contentSection.getBoundingClientRect().height +
              n.value.offsetHeight,
            u = o.contentSection.getBoundingClientRect().top;
          (i.value = "absolute"),
            (r.value = 0),
            u <= 0 && u >= f ? (i.value = "fixed") : u < f && (r.value = f);
        },
        c = () => {
          (n.value.style.transform = `translateY(${-r.value}px)`),
            (n.value.style.position = i.value);
        };
      return (
        ge(async () => {
          l(),
            c(),
            (s.value = new Se(n.value)),
            s.value.addAnimationTrigger(t.value, "scroll"),
            (s.value.prepareForAnimations = l),
            (s.value.tick = c);
        }),
        Fe(() => {
          s.value.reset();
        }),
        (f, u) => (
          k(),
          O(
            "div",
            {
              ref_key: "frameRef",
              ref: n,
              class:
                "h-dvh w-dvw z-20 absolute top-0 left-0 pointer-events-none",
            },
            [dt(f.$slots, "default")],
            512
          )
        )
      );
    },
  },
  vc = {
    class:
      "h-full w-full relative flex justify-center items-center rounded-4xl overflow-hidden",
  },
  bc = { class: "h-1/2 w-full overflow-hidden px-[3dvw] z-10" },
  wc = { class: "absolute h-6 z-30 flex items-center gap-2 text-white" },
  _c = { class: "w-10" },
  yc = { class: "h-full w-40 flex items-center border-x-2" },
  xc = { class: "w-10" },
  Ac = {
    class: "h-full w-full aspect-square flex items-end justify-end gap-6",
  },
  Sc = { class: "flex gap-2 flex-col" },
  Cc = { class: "font-bold text-xl leading-none font-rubik" },
  Ec = { class: "flex-1 h-fit" },
  Ic = ["src"],
  kc = { class: "h-[60dvh]" },
  Tc = {
    __name: "AboutMe",
    setup(e) {
      const t = I(null),
        n = I(null),
        s = I(),
        i = I(null),
        { containerRef: r } = tt(),
        o = I(null),
        l = I(null),
        c = I([]),
        f = I(0),
        u = I(0),
        h = I(0),
        p = () => {
          let _ = 0;
          c.value.forEach((H) => {
            H.getBoundingClientRect().top <= 0 && _++;
          }),
            (h.value = Math.min(_, c.value.length - 1));
          const A = c.value[h.value],
            j = A.getBoundingClientRect().top,
            R = A.offsetTop;
          if (_ > c.value.length - 1) u.value = 100;
          else if (_ <= c.value.length - 1 && j <= R) {
            const H = _ == 0 ? 0 : c.value[_ - 1].offsetTop,
              X = R - H;
            u.value = Math.min(((X - j) * 100) / X, 100);
          } else _ <= c.value.length - 1 && j > R && (u.value = 0);
          f.value = -100 * h.value;
        },
        w = () => {
          o.value.style.transform = `translateY(${f.value}%)`;
        };
      return (
        ge(async () => {
          (i.value = n.value.sectionRef),
            (c.value = Array.from(l.value.children)),
            (t.value = new Se(n.value.sectionRef)),
            (t.value.prepareForAnimations = p),
            (t.value.tick = w),
            t.value.addAnimationTrigger(r.value, "scroll");
        }),
        Fe(() => {
          t.value.reset();
        }),
        (_, A) => (
          k(),
          te(
            nt,
            {
              ref_key: "frameRef",
              ref: n,
              id: "about-me",
              class: "min-h-[100dvh] flex items-center relative",
            },
            {
              default: re(() => [
                i.value
                  ? (k(),
                    te(
                      or,
                      { key: 0, contentSection: i.value },
                      {
                        default: re(() => [
                          m(
                            "div",
                            {
                              ref_key: "topRef",
                              ref: s,
                              class: "h-full w-full bg-white p-[3dvw]",
                            },
                            [
                              m("div", vc, [
                                A[0] ||
                                  (A[0] = m(
                                    "div",
                                    {
                                      class:
                                        "absolute h-full w-full top-0 left-0 bg-[url('/backgrounds/room.jpg')] bg-cover bg-bottom",
                                    },
                                    null,
                                    -1
                                  )),
                                m("div", bc, [
                                  m("div", wc, [
                                    m("span", _c, ee(q(Pt)[h.value].from), 1),
                                    m("div", yc, [
                                      m(
                                        "div",
                                        {
                                          class: "h-1 bg-white",
                                          style: Le(`width: ${u.value}%`),
                                        },
                                        null,
                                        4
                                      ),
                                    ]),
                                    m("span", xc, ee(q(Pt)[h.value].to), 1),
                                  ]),
                                  m(
                                    "div",
                                    {
                                      ref_key: "contentRef",
                                      ref: o,
                                      class:
                                        "h-full w-full transition-transform duration-400 text-white",
                                    },
                                    [
                                      (k(!0),
                                      O(
                                        $,
                                        null,
                                        ce(
                                          q(Pt),
                                          (j) => (
                                            k(),
                                            O("div", Ac, [
                                              m("div", Sc, [
                                                m("h1", Cc, ee(j.when), 1),
                                                m(
                                                  "p",
                                                  Ec,
                                                  ee(j.description),
                                                  1
                                                ),
                                              ]),
                                              m(
                                                "img",
                                                {
                                                  src: j.image,
                                                  alt: "",
                                                  class:
                                                    "mr-0 md:mr-[6dvw] lg:mr-[12dvw] w-fit aspect-[9/16] max-h-full object-contain object-bottom",
                                                },
                                                null,
                                                8,
                                                Ic
                                              ),
                                            ])
                                          )
                                        ),
                                        256
                                      )),
                                    ],
                                    512
                                  ),
                                ]),
                              ]),
                            ],
                            512
                          ),
                        ]),
                        _: 1,
                      },
                      8,
                      ["contentSection"]
                    ))
                  : At("", !0),
                m(
                  "div",
                  {
                    ref_key: "triggerSectionRef",
                    ref: l,
                    class: "w-full flex flex-col justify-between py-[40dvh]",
                  },
                  [
                    (k(!0),
                    O(
                      $,
                      null,
                      ce([...q(Pt)], (j) => (k(), O("div", kc))),
                      256
                    )),
                  ],
                  512
                ),
              ]),
              _: 1,
            },
            512
          )
        )
      );
    },
  },
  Rc = {
    class:
      "h-full w-full rounded-4xl bg-[url('/backgrounds/room.jpg')] bg-cover bg-right text-white flex justify-center items-end text-center p-4",
  },
  Pc = { class: "grid grid-cols-1 md:grid-cols-3" },
  Mc = {
    class: "rounded-2xl object-contain aspect-video w-full overflow-hidden",
  },
  Oc = ["src"],
  jc = { class: "font-bold text-xl leading-none font-rubik" },
  Lc = { class: "flex-1 h-fit" },
  Dc = {
    __name: "AboutMeMobile",
    setup(e) {
      return (t, n) => (
        k(),
        te(
          nt,
          { id: "about-me", class: "min-h-[100dvh] flex relative" },
          {
            default: re(() => [
              m("div", Rc, [
                m("div", Pc, [
                  (k(!0),
                  O(
                    $,
                    null,
                    ce(
                      q(Pt),
                      (s, i) => (
                        k(),
                        O(
                          "div",
                          {
                            key: i,
                            class:
                              "h-fit flex-1 p-4 flex flex-col items-start cursor-default text-left gap-2",
                          },
                          [
                            m("div", Mc, [
                              m(
                                "img",
                                {
                                  src: s.image,
                                  alt: "",
                                  class: "h-full w-full object-contain",
                                },
                                null,
                                8,
                                Oc
                              ),
                            ]),
                            m("h1", jc, ee(s.when), 1),
                            m("p", Lc, ee(s.description), 1),
                          ]
                        )
                      )
                    ),
                    128
                  )),
                ]),
              ]),
            ]),
            _: 1,
          }
        )
      );
    },
  },
  Fc = {},
  Hc = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    "stroke-width": "1.5",
    stroke: "currentColor",
    class: "w-full h-full",
    preserveAspectRatio: "none",
  };
function Uc(e, t) {
  return (
    k(),
    O("svg", Hc, [
      ...(t[0] ||
        (t[0] = [
          m(
            "path",
            {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3",
            },
            null,
            -1
          ),
        ])),
    ])
  );
}
const Bc = ze(Fc, [["render", Uc]]),
  $c = {
    class: "z-10 w-full h-full flex justify-between items-center text-white",
  },
  qc = {
    class: "lg:w-[2dvw] w-6 aspect-square flex justify-center items-center",
  },
  Nc = {
    __name: "ToggleSection",
    props: { open: { type: Boolean, default: !1 } },
    emits: ["toggle", "hover", "leave"],
    setup(e, { emit: t }) {
      const n = e,
        s = t;
      return (i, r) => (
        k(),
        O(
          "div",
          {
            class: "flex-1 flex flex-col w-full",
            onMouseover: r[1] || (r[1] = (o) => s("hover")),
            onMouseleave: r[2] || (r[2] = (o) => s("leave")),
          },
          [
            m(
              "div",
              {
                class:
                  "flex-1 group relative p-4 w-full items-center font-rubik cursor-pointer text-xl lg:text-[2dvw] overflow-hidden transition-all",
                onClick: r[0] || (r[0] = (o) => s("toggle")),
              },
              [
                m(
                  "div",
                  {
                    class: he([
                      "absolute inset-0 bg-black -z-10 pointer-events-none group-hover:translate-y-0 transition-transform duration-500",
                      n.open ? "translate-y-0" : "translate-y-[98%]",
                    ]),
                  },
                  null,
                  2
                ),
                m("div", $c, [
                  dt(i.$slots, "header"),
                  m("div", qc, [
                    N(
                      Bc,
                      {
                        class: he([
                          "block transition-all",
                          n.open ? "rotate-90" : "rotate-0",
                        ]),
                      },
                      null,
                      8,
                      ["class"]
                    ),
                  ]),
                ]),
              ]
            ),
            m(
              "div",
              {
                class: he([
                  "w-full overflow-hidden bg-black text-white",
                  n.open ? "h-auto" : "h-0",
                ]),
              },
              [dt(i.$slots, "content")],
              2
            ),
          ],
          32
        )
      );
    },
  },
  en = I();
function Jc() {
  return {
    openIndex: en,
    isOpen: (n) => en.value === n,
    toggle: (n) => {
      en.value = en.value === n ? null : n;
    },
  };
}
const Ks = I(),
  Ws = I(!1),
  Zs = I(!1),
  Ys = I(!1);
function lr() {
  return {
    imageUrl: Ks,
    isOpen: Ws,
    isUrl: Zs,
    isSmall: Ys,
    setIsOpen: (i) => {
      Ws.value = i;
    },
    setImage: (i) => {
      Ks.value = i;
    },
    setIsUrl: (i) => {
      Zs.value = i;
    },
    setIsSmall: (i) => {
      Ys.value = i;
    },
  };
}
const Dn = I({ x: 0, y: 0 });
function ps() {
  return {
    getPositions: () => ({ x: Dn.value.x, y: Dn.value.y }),
    setPositions: (n, s) => {
      Dn.value = { x: n, y: s };
    },
  };
}
const Vc = {},
  zc = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "1.5",
    stroke: "currentColor",
    class: "size-6",
  };
function Xc(e, t) {
  return (
    k(),
    O("svg", zc, [
      ...(t[0] ||
        (t[0] = [
          m(
            "path",
            {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",
            },
            null,
            -1
          ),
        ])),
    ])
  );
}
const Qc = ze(Vc, [["render", Xc]]),
  Kc = { class: "relative w-full h-full" },
  Wc = ["src"],
  Zc = {
    __name: "ImageAsCursor",
    props: { contentSection: { type: HTMLElement, required: !0 } },
    setup(e) {
      const t = e,
        { containerRef: n } = tt(),
        { getPositions: s } = ps(),
        { imageUrl: i, isOpen: r, isUrl: o, isSmall: l } = lr(),
        c = I(),
        f = I(),
        u = I(window.innerWidth / 2),
        h = I(window.innerHeight / 2),
        p = I({ x: u.value, y: h.value }),
        w = () => {
          const R = s();
          (p.value.x = R.x), (p.value.y = R.y);
        },
        _ = (R, H) => Math.round(R.value * 100) / 100 != H,
        A = (R, H) => {
          _(R.value, H) && (R.value += (H - R.value) * 0.08);
        },
        j = () => {
          A(u, p.value.x), A(h, p.value.y);
        };
      return (
        ge(() => {
          (c.value = new Se(t.contentSection)),
            (c.value.tick = w),
            c.value.addAnimationTrigger(window, "mousemove"),
            c.value.addAnimationTrigger(n.value, "scroll"),
            (f.value = new Se(t.contentSection)),
            (f.value.tick = j),
            f.value.autoAnimate();
        }),
        Fe(() => {
          c.value.reset(), f.value.reset();
        }),
        (R, H) => (
          k(),
          O(
            "div",
            {
              class: he([
                "aspect-video absolute hidden md:flex shadow-[#0003] shadow-lg z-40 -translate-1/2 pointer-events-none rounded-[4dvw] overflow-hidden ease-linear transition-all duration-75",
                q(r) ? (q(l) ? "w-[20dvh]" : "w-[30dvh]") : "w-0",
              ]),
              style: Le(`left: ${u.value}px; top: ${h.value}px`),
            },
            [
              m("div", Kc, [
                m(
                  "div",
                  {
                    class: he([
                      `${q(o) ? "opacity-60" : "opacity-0"}`,
                      "absolute h-full w-full transition-all inset-0 bg-black flex justify-center items-center",
                    ]),
                  },
                  [N(Qc, { class: "h-1/2 w-1/2 text-white" })],
                  2
                ),
                m(
                  "img",
                  { src: q(i), alt: "", class: "w-full h-full object-cover" },
                  null,
                  8,
                  Wc
                ),
              ]),
            ],
            6
          )
        )
      );
    },
  },
  Yc = [
    {
      title: "Game Engine",
      description:
        "Sprunk-engine is an open-source web game engine (available on npm) that I developed with some friends. We wanted a challenging, architecture-focused project, so we built a game engine with almost no external libraries. It lets developers create 2D browser games, and we made two demo games available on the official website. I worked on our custom math library, the 2D physics engine, and I’m now developing a new 3D physics engine. This project helped me deepen my understanding of algorithms, optimization, mathematics, and open-source collaboration.",
      link: "https://sprunk-engine.com/",
      background: "/projects/sprunk/background.jpg",
      mobile_pic: "/projects/sprunk/web.png",
      desktop_pic: "/projects/sprunk/template.jpg",
    },
    {
      title: "Find your tribe",
      description:
        "Find your tribe is a small project inspired by a music festival I attended abroad with friends. With over 60,000 people per day, it was nearly impossible to find each other once the group split up due to the crowd, noise, and lack of landmarks. The app solves this by letting users create groups to chat, see each other’s live locations, set and share map landmarks, and use 3D arrows powered by the phone’s gyroscope to point directly to their friends in real time. The 3D arrow feature is built using my modular “game engine” project.",
      link: "https://github.com/orgs/retrouve-ta-tribu/repositories",
      background: "/projects/find-your-tribe/background.jpg",
      mobile_pic: "/projects/find-your-tribe/map.png",
      desktop_pic: "/projects/find-your-tribe/irl.jpg",
    },
    {
      title: "Portfolio",
      description:
        "The portfolio project is the website you’re on right now. While many of my projects focus on architecture, algorithms, and data science, I’ve always had a strong passion for frontend development. I’ve long dreamed of becoming a “Creative Developer,” and I regularly explore awwwards.com for inspiration and to study the techniques behind advanced visual effects. This portfolio is both a way to present my work and a way to stay true to that ambition. If you have any suggestions or feedback, feel free to reach out!",
      link: "https://github.com/Cyprien-png/portfolio",
      background: "/backgrounds/mountains.jpg",
      mobile_pic: "/projects/portfolio/contact.png",
      desktop_pic: "/projects/portfolio/home.jpg",
    },
    {
      title: "SeaCracker",
      description:
        "SeaCracker is another open-source project I built with the same team as the game engine, a few months earlier. We wanted to explore design patterns and web app architecture, so we created a Kahoot-like platform where users can build quizzes and play them in live sessions. The host presents each question, while players join with their phones and submit answers like a remote control. A leaderboard is shown between questions to keep things engaging. This project introduced me to state machines, event-driven architecture, and gave me my first real experience with WebSockets.",
      link: "https://github.com/orgs/SeaCrackers/repositories",
      background: "/projects/sea-cracker/background.jpg",
      mobile_pic: "/projects/sea-cracker/answer.png",
      desktop_pic: "/projects/sea-cracker/question.jpg",
    },
  ],
  Gc = { class: "flex-1 w-full bg-fit flex flex-col text-center pt-20" },
  ea = { class: "w-full h-full flex flex-col" },
  ta = ["src"],
  na = { class: "tracking-[-0.3dvw] hidden md:flex" },
  sa = { class: "px-6 pb-6" },
  ia = {
    class:
      "relative w-full text-black overflow-hidden flex flex-col items-start gap-6 h-fit",
  },
  ra = { class: "gap-4 flex items-center flex-col lg:flex-row" },
  oa = ["src"],
  la = { class: "z-20 min-h-full w-full text-white p-4 text-left" },
  ca = ["src"],
  aa = ["href"],
  ua = {
    __name: "Projects",
    setup(e) {
      const { setImage: t, setIsUrl: n, setIsOpen: s, setIsSmall: i } = lr(),
        { isOpen: r, toggle: o, openIndex: l } = Jc(),
        c = I(),
        f = I();
      return (
        ge(() => {
          f.value = c.value.sectionRef;
        }),
        (u, h) => (
          k(),
          O(
            $,
            null,
            [
              f.value
                ? (k(),
                  te(Zc, { key: 0, contentSection: f.value }, null, 8, [
                    "contentSection",
                  ]))
                : At("", !0),
              N(
                nt,
                {
                  ref_key: "frameRef",
                  ref: c,
                  id: "projects",
                  class: he("min-h-[100dvh] flex h-auto"),
                },
                {
                  default: re(() => [
                    m("div", Gc, [
                      m("div", ea, [
                        (k(!0),
                        O(
                          $,
                          null,
                          ce(
                            q(Yc),
                            (p, w) => (
                              k(),
                              te(
                                Nc,
                                {
                                  key: w,
                                  open: q(r)(w),
                                  onToggle: (_) => q(o)(w),
                                  onHover: (_) => (
                                    q(t)(p.background),
                                    q(s)(!0),
                                    q(l) == w ? q(i)(!0) : q(i)(!1)
                                  ),
                                  onLeave:
                                    h[2] ||
                                    (h[2] = (_) => (q(s)(!1), q(i)(!1))),
                                },
                                {
                                  header: re(() => [
                                    m(
                                      "img",
                                      {
                                        src: p.background,
                                        alt: "",
                                        class:
                                          "absolute h-full w-full top-0 left-0 -z-20 brightness-50 object-cover",
                                      },
                                      null,
                                      8,
                                      ta
                                    ),
                                    m(
                                      "h1",
                                      na,
                                      " 00-" +
                                        ee(
                                          (w + 1).toLocaleString("en-US", {
                                            minimumIntegerDigits: 2,
                                          })
                                        ),
                                      1
                                    ),
                                    m("h1", null, ee(p.title), 1),
                                  ]),
                                  content: re(() => [
                                    m("div", sa, [
                                      m("div", ia, [
                                        m("div", ra, [
                                          m(
                                            "img",
                                            {
                                              src: p.desktop_pic,
                                              alt: "",
                                              class:
                                                "w-full lg:w-auto lg:h-52 object-contain",
                                            },
                                            null,
                                            8,
                                            oa
                                          ),
                                          m("p", la, ee(p.description), 1),
                                          m(
                                            "img",
                                            {
                                              src: p.mobile_pic,
                                              alt: "",
                                              class:
                                                "h-52 aspect-[9/16] hidden lg:block",
                                            },
                                            null,
                                            8,
                                            ca
                                          ),
                                        ]),
                                        m(
                                          "a",
                                          {
                                            onMouseenter:
                                              h[0] || (h[0] = (_) => q(n)(!0)),
                                            onMouseleave:
                                              h[1] || (h[1] = (_) => q(n)(!1)),
                                            href: p.link,
                                            class:
                                              "relative w-full flex bg-center bg-cover bg-white",
                                            target: "_blank",
                                          },
                                          [
                                            N(
                                              yn,
                                              {
                                                text: "View more",
                                                href: p.link,
                                                target: "_blank",
                                                class: "z-10 h-full w-full p-4",
                                              },
                                              null,
                                              8,
                                              ["href"]
                                            ),
                                          ],
                                          40,
                                          aa
                                        ),
                                      ]),
                                    ]),
                                  ]),
                                  _: 2,
                                },
                                1032,
                                ["open", "onToggle", "onHover"]
                              )
                            )
                          ),
                          128
                        )),
                      ]),
                    ]),
                  ]),
                  _: 1,
                },
                512
              ),
            ],
            64
          )
        )
      );
    },
  },
  fa = "/awards/trophy.png",
  da = [
    {
      title: "Best diploma project",
      description:
        "At the end of my higher education in application development, I received the cantonal award for the best final project. This project, combining development and cybersecurity, involved securing confidential data within a production software.",
      date: "2025",
    },
    {
      title: "Solidarity and comradeship",
      description:
        "The year I completed my compulsory schooling, my teachers and the school administration agreed to create a special award for me, recognizing my social skills and my commitment to supporting classmates through academic difficulties.",
      date: "2019",
    },
  ],
  Gs = I(window.innerWidth);
function cr() {
  const e = () => {
      Gs.value = window.innerWidth;
    },
    t = _n(() => Gs.value >= 768);
  return { resetWidth: e, md: t };
}
const ar = {
    __name: "Parallax",
    setup(e) {
      const { getPositions: t } = ps(),
        { md: n } = cr(),
        s = I(),
        i = I(),
        r = I([]),
        o = I(0),
        l = () => {
          const c = s.value.getBoundingClientRect();
          let f = t(),
            u = c.width / 2 + c.left,
            h = c.height / 2 + c.top;
          if (!n.value) {
            o.value = (o.value + 0.005) % 360;
            const p = 300;
            (f.x = p * Math.cos(o.value * 1.5)),
              (f.y = p * Math.sin(o.value)),
              (u = 0),
              (h = 0);
          }
          r.value.forEach((p) => {
            const w = p.dataset.parallaxValue;
            let _, A;
            if (!n.value) (_ = (f.x - u) * -w), (A = (f.y - h) * -w);
            else {
              const j = f.x - u,
                R = f.y - h;
              (_ = -(j * w * 2) / Math.log(Math.abs(j) + 2)),
                (A = -(R * w * 2) / Math.log(Math.abs(R) + 2));
            }
            p.style.transform = `translateX(${_}px) translateY(${A}px)`;
          });
        };
      return (
        ge(() => {
          (r.value = Array.from(s.value.getElementsByClassName("parallax"))),
            (i.value = new Se(s.value)),
            (i.value.tick = l),
            i.value.autoAnimate();
        }),
        Fe(() => {
          i.value.reset();
        }),
        (c, f) => (
          k(),
          O(
            "div",
            {
              ref_key: "rootRef",
              ref: s,
              class: "parallax-wrapper h-full w-full",
            },
            [dt(c.$slots, "default")],
            512
          )
        )
      );
    },
  },
  ha = {
    class:
      "h-full w-full relative overflow-hidden rounded-4xl text-white flex justify-center items-start md:items-end text-center p-4",
  },
  pa = { class: "flex flex-col md:flex-row" },
  ga = {
    class:
      "h-fit flex-1 p-4 flex flex-col items-start cursor-default text-left",
  },
  ma = { class: "font-rubik" },
  va = { class: "font-rubik text-xl italic" },
  ba = {
    __name: "Awards",
    setup(e) {
      return (t, n) => (
        k(),
        te(
          nt,
          { id: "awards", class: "h-dvh" },
          {
            default: re(() => [
              N(ar, null, {
                default: re(() => [
                  m("div", ha, [
                    n[0] ||
                      (n[0] = m(
                        "div",
                        {
                          class:
                            "absolute h-full w-full bg-[url('/awards/sky.jpg')] bg-cover top-0 left-0 -z-10 overflow-visible",
                        },
                        [
                          m("div", {
                            "data-parallax-value": ".02",
                            class:
                              "parallax absolute top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-video w-[130dvw] bg-center bg-cover bg-[url('/awards/clouds.png')]",
                          }),
                          m("img", {
                            src: fa,
                            alt: "",
                            "data-parallax-value": ".15",
                            class:
                              "parallax w-full absolute scale-200 -bottom-1/12 sm:scale-125 md:scale-150 lg:scale-125 lg:-bottom-1/3",
                          }),
                        ],
                        -1
                      )),
                    m("div", pa, [
                      (k(!0),
                      O(
                        $,
                        null,
                        ce(
                          q(da),
                          (s) => (
                            k(),
                            O("div", ga, [
                              m("span", ma, ee(s.date), 1),
                              m("h1", va, ee(s.title), 1),
                              m("p", null, ee(s.description), 1),
                            ])
                          )
                        ),
                        256
                      )),
                    ]),
                  ]),
                ]),
                _: 1,
              }),
            ]),
            _: 1,
          }
        )
      );
    },
  },
  wa = "/backgrounds/sky.jpg",
  ur = [
    {
      writer_image: "/testimonials/man-1.jpg",
      writer_position: "CEO of an E-Learning solutions company",
      stars: 5,
      description:
        "Cyprien stood out for his professionalism, analytical mindset, and impressive learning agility. He consistently demonstrated autonomy, curiosity, and precision in his work. His reliability, enthusiasm, and drive for excellence make him a true asset in any collaboration. I can confidently recommend him to anyone seeking a skilled, motivated, and forward-thinking professional.",
    },
    {
      writer_image: "/testimonials/man-2.jpg",
      writer_position: "CEO of a healthcare software company",
      stars: 5,
      description:
        "Working with Cyprien was an excellent experience. He quickly understood our goals, aligned perfectly with the team, and brought valuable technical insight and structure to our workflow. His proactive mindset, clarity in communication, and ability to turn ideas into tangible results made a lasting impact. Cyprien is someone you can trust to deliver, both technically and creatively.",
    },
    {
      writer_image: "/testimonials/man-3.jpg",
      writer_position: "CTO at a Medical Group",
      stars: 5,
      description:
        "Cyprien approached every collaboration with professionalism, motivation, and genuine team spirit. His adaptability and reliability made him a pleasure to work with, and his commitment to quality was evident in everything he delivered. Highly dedicated and always eager to contribute, he consistently exceeded expectations and brought a positive energy to every project.",
    },
  ],
  _a = { class: "relative h-dvh w-full top-0 left-0 pointer-events-none" },
  ya = { class: "h-full w-full overflow-hidden z-20 p-[3dvw]" },
  xa = {
    class:
      "h-full w-full flex flex-row justify-center items-center rounded-4xl outline-[6dvw] outline-white",
  },
  Aa = {
    __name: "RotateOnScroll",
    props: { contentSection: { type: HTMLElement, required: !0 } },
    setup(e) {
      const t = e,
        { containerRef: n } = tt(),
        s = I(),
        i = I(),
        r = I(),
        o = I(),
        l = I(),
        c = I(0),
        f = I(),
        u = (_) => {
          i.value = _;
        },
        h = () => {
          const _ = i.value.children,
            A = Array.from(_);
          A.map((R) => (R.style.height = "")),
            (l.value.style.height = ""),
            (r.value.style.height = ""),
            (c.value = A.reduce(
              (R, H) => Math.max(R, H.offsetHeight),
              _[0].offsetHeight
            )),
            A.map((R) => (R.style.height = `${c.value}px`)),
            (l.value.style.height = `${c.value}px`);
          const j =
            window.innerHeight -
            (_[0].offsetHeight + _[_.length - 1].offsetHeight) / 2;
          (o.value = parseFloat(
            getComputedStyle(l.value.parentElement.parentElement).padding
          )),
            (r.value.style.height = `${
              i.value.offsetHeight + j - 2 * o.value
            }px`),
            p(0, !0);
        },
        p = (_, A = !1) => {
          Array.from(i.value.children).forEach((j) => {
            if (
              A ||
              (j.getBoundingClientRect().top <
                l.value.getBoundingClientRect().bottom &&
                j.getBoundingClientRect().bottom >
                  l.value.getBoundingClientRect().top)
            ) {
              const R = Math.min(Math.max(-(_ + j.offsetTop), -200), 200);
              j.style.transform = `translateZ(${-Math.abs(R)}px) rotateX(${
                R / 3
              }deg)`;
            }
          });
        },
        w = () => {
          let _ = r.value.getBoundingClientRect().top - o.value;
          const A =
            r.value.getBoundingClientRect().bottom -
            window.innerHeight +
            o.value;
          _ >= 0 ? (_ = 0) : A < 0 && (_ = c.value - i.value.offsetHeight),
            p(_),
            (i.value.style.transform = `translateY(${_}px)`);
        };
      return (
        ge(async () => {
          document.fonts && (await document.fonts.ready),
            h(),
            (s.value = new Se(t.contentSection)),
            (s.value.tick = w),
            s.value.addAnimationTrigger(n.value, "scroll"),
            (f.value = new Se()),
            (f.value.tick = h),
            f.value.addAnimationTrigger(window, "resize");
        }),
        Fe(() => {
          s.value.reset(), f.value.reset();
        }),
        (_, A) => (
          k(),
          O(
            $,
            null,
            [
              N(
                or,
                { contentSection: e.contentSection },
                {
                  default: re(() => [
                    m("div", _a, [
                      m("div", ya, [
                        m("div", xa, [
                          m(
                            "div",
                            {
                              ref_key: "highlightEl",
                              ref: l,
                              class:
                                "rounded-full bg-white w-3/4 lg:w-2/3 px-4 pb-2 z-20 relative overflow-hidden",
                            },
                            [
                              dt(_.$slots, "content", { registerContainer: u }),
                              A[0] ||
                                (A[0] = m(
                                  "div",
                                  {
                                    class:
                                      "absolute h-full w-full top-0 left-0 z-30 bg-linear-[white_0%,transparent_15%,transparent_85%,white_100%]",
                                  },
                                  null,
                                  -1
                                )),
                            ],
                            512
                          ),
                        ]),
                      ]),
                    ]),
                  ]),
                  _: 3,
                },
                8,
                ["contentSection"]
              ),
              m(
                "div",
                {
                  ref_key: "scrollableSectionRef",
                  ref: r,
                  class: "w-full bg-linear-to-b from-violet-500 to-yellow-500",
                },
                [dt(_.$slots, "background")],
                512
              ),
            ],
            64
          )
        )
      );
    },
  },
  Sa = {},
  Ca = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    viewBox: "0 0 24 24",
    "stroke-width": "1.5",
    stroke: "transparent",
    class: "size-6",
  };
function Ea(e, t) {
  return (
    k(),
    O("svg", Ca, [
      ...(t[0] ||
        (t[0] = [
          m(
            "path",
            {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
            },
            null,
            -1
          ),
        ])),
    ])
  );
}
const Ia = ze(Sa, [["render", Ea]]),
  ka = { class: "flex" },
  Ta = ["src"],
  Ra = { class: "pl-2" },
  Pa = { class: "flex" },
  fr = {
    __name: "TestimonialWriterCard",
    props: {
      writerImage: { type: String, required: !0 },
      writerPosition: { type: String, required: !0 },
      starsCount: { type: Number, required: !0 },
      isDarkMode: { type: Boolean, default: !1 },
    },
    setup(e) {
      return (t, n) => (
        k(),
        O("header", ka, [
          m(
            "img",
            { src: e.writerImage, alt: "", class: "h-12 w-12 rounded-full" },
            null,
            8,
            Ta
          ),
          m("div", Ra, [
            m("div", Pa, [
              (k(),
              O(
                $,
                null,
                ce(5, (s) =>
                  N(
                    Ia,
                    {
                      class: he(
                        s <= e.starsCount
                          ? "text-yellow-500"
                          : e.isDarkMode
                          ? "text-transparent"
                          : "text-white"
                      ),
                    },
                    null,
                    8,
                    ["class"]
                  )
                ),
                64
              )),
            ]),
            m(
              "span",
              {
                class: he([
                  "italic text-sm",
                  e.isDarkMode ? "text-neutral-100" : "text-neutral-600",
                ]),
              },
              ee(e.writerPosition),
              3
            ),
          ]),
        ])
      );
    },
  },
  Ma = {
    class:
      "h-full w-full bg-cover rounded-4xl text-center flex items-start relative",
  },
  Oa = {
    __name: "Testimonials",
    setup(e) {
      const t = I(null),
        n = I(null);
      return (
        ge(async () => {
          n.value = t.value.sectionRef;
        }),
        (s, i) => (
          k(),
          te(
            nt,
            {
              ref_key: "frameRef",
              ref: t,
              id: "testimonials",
              class: "min-h-[100dvh] flex relative",
            },
            {
              default: re(() => [
                n.value
                  ? (k(),
                    te(
                      Aa,
                      { key: 0, contentSection: n.value },
                      {
                        content: re(({ registerContainer: r }) => [
                          m("div", Ma, [
                            m(
                              "div",
                              {
                                ref: r,
                                class:
                                  "flex flex-col relative items-center w-fit z-30 perspective-distant text-black",
                                style: { height: "auto" },
                              },
                              [
                                (k(!0),
                                O(
                                  $,
                                  null,
                                  ce(
                                    q(ur),
                                    (o, l) => (
                                      k(),
                                      O(
                                        "div",
                                        {
                                          key: l,
                                          class:
                                            "testimonial-item w-full text-left flex flex-col gap-2 py-8 px-20",
                                        },
                                        [
                                          N(
                                            fr,
                                            {
                                              writerImage: o.writer_image,
                                              writerPosition: o.writer_position,
                                              starsCount: o.stars,
                                            },
                                            null,
                                            8,
                                            [
                                              "writerImage",
                                              "writerPosition",
                                              "starsCount",
                                            ]
                                          ),
                                          m("p", null, ee(o.description), 1),
                                        ]
                                      )
                                    )
                                  ),
                                  128
                                )),
                              ],
                              512
                            ),
                          ]),
                        ]),
                        background: re(() => [
                          ...(i[0] ||
                            (i[0] = [
                              m(
                                "img",
                                { src: wa, alt: "", class: "h-full w-full" },
                                null,
                                -1
                              ),
                            ])),
                        ]),
                        _: 1,
                      },
                      8,
                      ["contentSection"]
                    ))
                  : At("", !0),
              ]),
              _: 1,
            },
            512
          )
        )
      );
    },
  },
  ja = {
    class:
      "h-full w-full relative rounded-4xl text-white flex justify-center items-end text-center px-4 overflow-hidden",
  },
  La = { class: "flex h-full flex-col pt-[6dvw] md:flex-row" },
  Da = { class: "pt-2 text-justify" },
  Fa = {
    __name: "TestimonialsMobile",
    setup(e) {
      return (t, n) => (
        k(),
        te(
          nt,
          { id: "testimonials", class: "min-h-[100dvh] flex relative" },
          {
            default: re(() => [
              m("div", ja, [
                n[0] ||
                  (n[0] = m(
                    "div",
                    {
                      class:
                        "absolute h-full w-full top-0 left-0 bg-[url('/backgrounds/sky.jpg')] bg-cover brightness-[.6] -z-10",
                    },
                    null,
                    -1
                  )),
                m("div", La, [
                  (k(!0),
                  O(
                    $,
                    null,
                    ce(
                      q(ur),
                      (s, i) => (
                        k(),
                        O(
                          "div",
                          {
                            key: i,
                            class:
                              "h-fit flex-1 p-4 flex flex-col items-start cursor-default text-left",
                          },
                          [
                            N(
                              fr,
                              {
                                writerImage: s.writer_image,
                                writerPosition: s.writer_position,
                                starsCount: s.stars,
                                isDarkMode: !0,
                              },
                              null,
                              8,
                              ["writerImage", "writerPosition", "starsCount"]
                            ),
                            m("p", Da, ee(s.description), 1),
                          ]
                        )
                      )
                    ),
                    128
                  )),
                ]),
              ]),
            ]),
            _: 1,
          }
        )
      );
    },
  },
  Ha = "/contact/mountains.png",
  Ua = "/contact/path.png",
  Ba = "/contact/body.png",
  $a = "/contact/arm.png",
  qa = [
    {
      text: "LinkedIn",
      href: "https://www.linkedin.com/in/cyprien-jaquier",
      target: "_blank",
    },
    {
      text: "You seem curious hahaha, you can also add me on Discord ;)",
      href: "r0kkxryuk",
      hidden: !0,
    },
  ],
  Na = {
    "Hire me": [
      { text: "cyprien@jaquier.dev", href: "mailto:cyprien@jaquier.dev" },
    ],
    Social: qa,
    "Open source": [
      {
        text: "GitHub",
        href: "https://github.com/Cyprien-png",
        target: "_blank",
      },
      {
        text: "CodePen",
        href: "https://codepen.io/R0kkxRyuk",
        target: "_blank",
      },
    ],
  },
  Ja = {
    class:
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-8 px-8 text-white",
  },
  Va = {
    class: "font-rubik border-b-2 border-dashed border-neutral-400 text-xl",
  },
  za = { class: "pt-4 text-2xl flex flex-col gap-2" },
  Xa = {
    __name: "Contact",
    setup(e) {
      const t = I(null),
        n = I(null),
        { containerRef: s } = tt(),
        i = I(null),
        r = I(0),
        o = I(0),
        l = () => {
          const c = n.value.sectionRef.getBoundingClientRect().top;
          r.value = Math.round(c + o.value * 1.5);
        };
      return (
        ge(() => {
          (o.value = parseFloat(getComputedStyle(i.value).paddingTop)),
            (t.value = new Se(n.value.sectionRef)),
            (t.value.tick = l),
            t.value.addAnimationTrigger(s.value, "scroll");
        }),
        Fe(() => {
          t.value.reset();
        }),
        (c, f) => (
          k(),
          te(
            nt,
            { ref_key: "frameRef", ref: n, id: "contact", class: "h-dvh" },
            {
              default: re(() => [
                N(ar, null, {
                  default: re(() => [
                    m(
                      "div",
                      {
                        ref_key: "contactSectionRef",
                        ref: i,
                        class:
                          "h-full w-full relative rounded-4xl flex flex-col pt-24",
                      },
                      [
                        f[1] ||
                          (f[1] = m(
                            "div",
                            {
                              class:
                                "absolute h-full w-full top-0 left-0 rounded-4xl brightness-[.85] bg-[url('/contact/sky.jpeg')] bg-cover -z-10 overflow-hidden",
                            },
                            [
                              m(
                                "div",
                                {
                                  class:
                                    "h-full w-full flex justify-center items-end relative",
                                },
                                [
                                  m("img", {
                                    src: Ha,
                                    alt: "",
                                    "data-parallax-value": ".005",
                                    class:
                                      "absolute h-auto w-full scale-110 object-cover parallax",
                                  }),
                                  m("img", {
                                    src: Ua,
                                    alt: "",
                                    "data-parallax-value": ".025",
                                    class:
                                      "absolute h-auto w-full translate-y-1/3 scale-110 object-cover parallax",
                                  }),
                                ]
                              ),
                            ],
                            -1
                          )),
                        m("div", Ja, [
                          (k(!0),
                          O(
                            $,
                            null,
                            ce(
                              q(Na),
                              (u, h) => (
                                k(),
                                O("div", { key: h, class: "h-full w-full" }, [
                                  m("h2", Va, ee(h), 1),
                                  m("ul", za, [
                                    (k(!0),
                                    O(
                                      $,
                                      null,
                                      ce(
                                        u,
                                        (p, w) => (
                                          k(),
                                          O("li", { key: w, class: "w-fit" }, [
                                            p.hidden
                                              ? At("", !0)
                                              : (k(),
                                                te(
                                                  yn,
                                                  {
                                                    key: 0,
                                                    text: p.text,
                                                    href: p.href,
                                                    target: p.target,
                                                  },
                                                  null,
                                                  8,
                                                  ["text", "href", "target"]
                                                )),
                                          ])
                                        )
                                      ),
                                      128
                                    )),
                                  ]),
                                ])
                              )
                            ),
                            128
                          )),
                        ]),
                        f[2] ||
                          (f[2] = m(
                            "div",
                            {
                              class:
                                "flex flex-col justify-center items-center text-[10dvw] leading-none w-full h-full font-rubik",
                            },
                            [
                              m("h1", { class: "text-white" }, "Let's work"),
                              m(
                                "h1",
                                { class: "text-red-custom z-10" },
                                "together"
                              ),
                            ],
                            -1
                          )),
                        m(
                          "div",
                          {
                            class:
                              "h-full w-full flex justify-center items-end absolute pointer-events-none bg-red-400a",
                            style: Le(`transform: translateY(${r.value}px)`),
                          },
                          [
                            ...(f[0] ||
                              (f[0] = [
                                m(
                                  "div",
                                  {
                                    class:
                                      "max-h-full relative w-2/3 md:w-full aspect-[9/16]",
                                  },
                                  [
                                    m("img", {
                                      src: Ba,
                                      alt: "",
                                      "data-parallax-value": ".15",
                                      class:
                                        "absolute h-full w-full top-0 left-0 object-contain parallax",
                                    }),
                                    m("img", {
                                      src: $a,
                                      alt: "",
                                      "data-parallax-value": ".17",
                                      class:
                                        "absolute h-full w-full top-0 left-0 object-contain parallax",
                                    }),
                                  ],
                                  -1
                                ),
                              ])),
                          ],
                          4
                        ),
                      ],
                      512
                    ),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
            512
          )
        )
      );
    },
  },
  Qa = { class: "relative" },
  Ka = { class: "absolute bottom-0 text-sm p-[4dvw] opacity-60 text-white" },
  Wa = {
    __name: "App",
    setup(e) {
      const { containerRef: t, contentRef: n } = Ol(),
        { setPositions: s } = ps(),
        { resetWidth: i, md: r } = cr(),
        o = I(),
        l = I(),
        c = (f) => {
          f instanceof MouseEvent && s(f.clientX, f.clientY);
        };
      return (
        ge(async () => {
          await fetch("https://ws.jaquier.dev/load?app=portfolio_v1"),
            (o.value = new Se()),
            (o.value.tick = c),
            o.value.addAnimationTrigger(window, "mousemove"),
            (l.value = new Se()),
            (l.value.tick = i),
            l.value.addAnimationTrigger(window, "resize");
        }),
        (f, u) => (
          k(),
          O(
            $,
            null,
            [
              u[0] ||
                (u[0] = m(
                  "section",
                  {
                    id: "loading",
                    class:
                      "outline-[100dvw] outline-white rounded-[999px] bg-transparent h-0 w-0 fixed top-1/2 left-1/2 z-[100] -translate-1/2 flex items-center justify-center",
                  },
                  [
                    m(
                      "span",
                      {
                        class:
                          "absolute font-ledger h-40 w-96 flex justify-center items-center",
                      },
                      "The paint is drying..."
                    ),
                  ],
                  -1
                )),
              N(Fl),
              N(oc),
              N(uc),
              m(
                "div",
                {
                  ref_key: "containerRef",
                  ref: t,
                  id: "container",
                  class:
                    "overflow-auto h-dvh flex flex-col items-center font-ledger",
                  style: { "scrollbar-width": "none" },
                },
                [
                  N(nc),
                  m(
                    "div",
                    {
                      ref_key: "contentRef",
                      ref: n,
                      id: "content",
                      class: "w-full flex flex-col",
                    },
                    [
                      N(mc),
                      q(r)
                        ? (k(), te(Tc, { key: 0 }))
                        : (k(), te(Dc, { key: 1 })),
                      N(ua),
                      N(ba),
                      q(r)
                        ? (k(), te(Oa, { key: 2 }))
                        : (k(), te(Fa, { key: 3 })),
                      N(Xa),
                      m("footer", Qa, [
                        m("span", Ka, [
                          N(yn, {
                            text: "Read the code here",
                            href: "https://github.com/Cyprien-png/portfolio",
                            target: "_blank",
                          }),
                        ]),
                      ]),
                    ],
                    512
                  ),
                ],
                512
              ),
            ],
            64
          )
        )
      );
    },
  },
  Za = ze(Wa, [["__scopeId", "data-v-42dcbf7f"]]);
Rl(Za).mount("#app");
