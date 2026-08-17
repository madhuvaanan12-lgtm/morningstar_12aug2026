var e = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), (e = null)), t.exports);
!(function () {
  let e = document.createElement("link").relList;
  if (!(e && e.supports && e.supports("modulepreload"))) {
    for (let e of document.querySelectorAll('link[rel="modulepreload"]')) t(e);
    new MutationObserver((e) => {
      for (let n of e)
        if ("childList" === n.type)
          for (let e of n.addedNodes) "LINK" === e.tagName && "modulepreload" === e.rel && t(e);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function t(e) {
    if (e.ep) return;
    e.ep = !0;
    let t = (function (e) {
      let t = {};
      return (
        e.integrity && (t.integrity = e.integrity),
        e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
        "use-credentials" === e.crossOrigin
          ? (t.credentials = "include")
          : "anonymous" === e.crossOrigin
            ? (t.credentials = "omit")
            : (t.credentials = "same-origin"),
        t
      );
    })(e);
    fetch(e.href, t);
  }
})();
var t = e((e) => {
    var t = Symbol.for("react.transitional.element"),
      n = Symbol.for("react.portal"),
      r = Symbol.for("react.fragment"),
      l = Symbol.for("react.strict_mode"),
      a = Symbol.for("react.profiler"),
      i = Symbol.for("react.consumer"),
      o = Symbol.for("react.context"),
      s = Symbol.for("react.forward_ref"),
      u = Symbol.for("react.suspense"),
      c = Symbol.for("react.memo"),
      d = Symbol.for("react.lazy"),
      f = Symbol.for("react.activity"),
      p = Symbol.iterator;
    var h = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      m = Object.assign,
      g = {};
    function y(e, t, n) {
      ((this.props = e), (this.context = t), (this.refs = g), (this.updater = n || h));
    }
    function v() {}
    function b(e, t, n) {
      ((this.props = e), (this.context = t), (this.refs = g), (this.updater = n || h));
    }
    ((y.prototype.isReactComponent = {}),
      (y.prototype.setState = function (e, t) {
        if ("object" != typeof e && "function" != typeof e && null != e)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables.",
          );
        this.updater.enqueueSetState(this, e, t, "setState");
      }),
      (y.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
      }),
      (v.prototype = y.prototype));
    var k = (b.prototype = new v());
    ((k.constructor = b), m(k, y.prototype), (k.isPureReactComponent = !0));
    var w = Array.isArray;
    function x() {}
    var S = { H: null, A: null, T: null, S: null },
      j = Object.prototype.hasOwnProperty;
    function C(e, n, r) {
      var l = r.ref;
      return { $$typeof: t, type: e, key: n, ref: void 0 === l ? null : l, props: r };
    }
    function E(e) {
      return "object" == typeof e && !!e && e.$$typeof === t;
    }
    var N = /\/+/g;
    function T(e, t) {
      return "object" == typeof e && e && null != e.key
        ? (function (e) {
            var t = { "=": "=0", ":": "=2" };
            return (
              "$" +
              e.replace(/[=:]/g, function (e) {
                return t[e];
              })
            );
          })("" + e.key)
        : t.toString(36);
    }
    function _(e, r, l, a, i) {
      var o = typeof e;
      ("undefined" === o || "boolean" === o) && (e = null);
      var s = !1;
      if (null === e) s = !0;
      else
        switch (o) {
          case "bigint":
          case "string":
          case "number":
            s = !0;
            break;
          case "object":
            switch (e.$$typeof) {
              case t:
              case n:
                s = !0;
                break;
              case d:
                return _((s = e._init)(e._payload), r, l, a, i);
            }
        }
      if (s)
        return (
          (i = i(e)),
          (s = "" === a ? "." + T(e, 0) : a),
          w(i)
            ? ((l = ""),
              null != s && (l = s.replace(N, "$&/") + "/"),
              _(i, r, l, "", function (e) {
                return e;
              }))
            : null != i &&
              (E(i) &&
                (i = (function (e, t) {
                  return C(e.type, t, e.props);
                })(
                  i,
                  l +
                    (null == i.key || (e && e.key === i.key)
                      ? ""
                      : ("" + i.key).replace(N, "$&/") + "/") +
                    s,
                )),
              r.push(i)),
          1
        );
      s = 0;
      var u = "" === a ? "." : a + ":";
      if (w(e)) for (var c = 0; c < e.length; c++) s += _((a = e[c]), r, l, (o = u + T(a, c)), i);
      else if (
        ((c = (function (e) {
          return "object" == typeof e &&
            e &&
            "function" == typeof (e = (p && e[p]) || e["@@iterator"])
            ? e
            : null;
        })(e)),
        "function" == typeof c)
      )
        for (e = c.call(e), c = 0; !(a = e.next()).done;)
          s += _((a = a.value), r, l, (o = u + T(a, c++)), i);
      else if ("object" === o) {
        if ("function" == typeof e.then)
          return _(
            (function (e) {
              switch (e.status) {
                case "fulfilled":
                  return e.value;
                case "rejected":
                  throw e.reason;
                default:
                  switch (
                    ("string" == typeof e.status
                      ? e.then(x, x)
                      : ((e.status = "pending"),
                        e.then(
                          function (t) {
                            "pending" === e.status && ((e.status = "fulfilled"), (e.value = t));
                          },
                          function (t) {
                            "pending" === e.status && ((e.status = "rejected"), (e.reason = t));
                          },
                        )),
                    e.status)
                  ) {
                    case "fulfilled":
                      return e.value;
                    case "rejected":
                      throw e.reason;
                  }
              }
              throw e;
            })(e),
            r,
            l,
            a,
            i,
          );
        throw (
          (r = String(e)),
          Error(
            "Objects are not valid as a React child (found: " +
              ("[object Object]" === r
                ? "object with keys {" + Object.keys(e).join(", ") + "}"
                : r) +
              "). If you meant to render a collection of children, use an array instead.",
          )
        );
      }
      return s;
    }
    function z(e, t, n) {
      if (null == e) return e;
      var r = [],
        l = 0;
      return (
        _(e, r, "", "", function (e) {
          return t.call(n, e, l++);
        }),
        r
      );
    }
    function L(e) {
      if (-1 === e._status) {
        var t = e._result;
        ((t = t()).then(
          function (t) {
            (0 === e._status || -1 === e._status) && ((e._status = 1), (e._result = t));
          },
          function (t) {
            (0 === e._status || -1 === e._status) && ((e._status = 2), (e._result = t));
          },
        ),
          -1 === e._status && ((e._status = 0), (e._result = t)));
      }
      if (1 === e._status) return e._result.default;
      throw e._result;
    }
    var P =
        "function" == typeof reportError
          ? reportError
          : function (e) {
              if ("object" == typeof window && "function" == typeof window.ErrorEvent) {
                var t = new window.ErrorEvent("error", {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    "object" == typeof e && e && "string" == typeof e.message
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if ("object" == typeof process && "function" == typeof process.emit)
                return void process.emit("uncaughtException", e);
              console.error(e);
            },
      A = {
        map: z,
        forEach: function (e, t, n) {
          z(
            e,
            function () {
              t.apply(this, arguments);
            },
            n,
          );
        },
        count: function (e) {
          var t = 0;
          return (
            z(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            z(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!E(e))
            throw Error("React.Children.only expected to receive a single React element child.");
          return e;
        },
      };
    ((e.Activity = f),
      (e.Children = A),
      (e.Component = y),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = b),
      (e.StrictMode = l),
      (e.Suspense = u),
      (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = S),
      (e.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (e) {
          return S.H.useMemoCache(e);
        },
      }),
      (e.cache = function (e) {
        return function () {
          return e.apply(null, arguments);
        };
      }),
      (e.cacheSignal = function () {
        return null;
      }),
      (e.cloneElement = function (e, t, n) {
        if (null == e)
          throw Error("The argument must be a React element, but you passed " + e + ".");
        var r = m({}, e.props),
          l = e.key;
        if (null != t)
          for (a in (void 0 !== t.key && (l = "" + t.key), t))
            !j.call(t, a) ||
              "key" === a ||
              "__self" === a ||
              "__source" === a ||
              ("ref" === a && void 0 === t.ref) ||
              (r[a] = t[a]);
        var a = arguments.length - 2;
        if (1 === a) r.children = n;
        else if (1 < a) {
          for (var i = Array(a), o = 0; o < a; o++) i[o] = arguments[o + 2];
          r.children = i;
        }
        return C(e.type, l, r);
      }),
      (e.createContext = function (e) {
        return (
          ((e = {
            $$typeof: o,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }).Provider = e),
          (e.Consumer = { $$typeof: i, _context: e }),
          e
        );
      }),
      (e.createElement = function (e, t, n) {
        var r,
          l = {},
          a = null;
        if (null != t)
          for (r in (void 0 !== t.key && (a = "" + t.key), t))
            j.call(t, r) && "key" !== r && "__self" !== r && "__source" !== r && (l[r] = t[r]);
        var i = arguments.length - 2;
        if (1 === i) l.children = n;
        else if (1 < i) {
          for (var o = Array(i), s = 0; s < i; s++) o[s] = arguments[s + 2];
          l.children = o;
        }
        if (e && e.defaultProps) for (r in (i = e.defaultProps)) void 0 === l[r] && (l[r] = i[r]);
        return C(e, a, l);
      }),
      (e.createRef = function () {
        return { current: null };
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: s, render: e };
      }),
      (e.isValidElement = E),
      (e.lazy = function (e) {
        return { $$typeof: d, _payload: { _status: -1, _result: e }, _init: L };
      }),
      (e.memo = function (e, t) {
        return { $$typeof: c, type: e, compare: void 0 === t ? null : t };
      }),
      (e.startTransition = function (e) {
        var t = S.T,
          n = {};
        S.T = n;
        try {
          var r = e(),
            l = S.S;
          (null !== l && l(n, r),
            "object" == typeof r && r && "function" == typeof r.then && r.then(x, P));
        } catch (e) {
          P(e);
        } finally {
          (null !== t && null !== n.types && (t.types = n.types), (S.T = t));
        }
      }),
      (e.unstable_useCacheRefresh = function () {
        return S.H.useCacheRefresh();
      }),
      (e.use = function (e) {
        return S.H.use(e);
      }),
      (e.useActionState = function (e, t, n) {
        return S.H.useActionState(e, t, n);
      }),
      (e.useCallback = function (e, t) {
        return S.H.useCallback(e, t);
      }),
      (e.useContext = function (e) {
        return S.H.useContext(e);
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e, t) {
        return S.H.useDeferredValue(e, t);
      }),
      (e.useEffect = function (e, t) {
        return S.H.useEffect(e, t);
      }),
      (e.useEffectEvent = function (e) {
        return S.H.useEffectEvent(e);
      }),
      (e.useId = function () {
        return S.H.useId();
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return S.H.useImperativeHandle(e, t, n);
      }),
      (e.useInsertionEffect = function (e, t) {
        return S.H.useInsertionEffect(e, t);
      }),
      (e.useLayoutEffect = function (e, t) {
        return S.H.useLayoutEffect(e, t);
      }),
      (e.useMemo = function (e, t) {
        return S.H.useMemo(e, t);
      }),
      (e.useOptimistic = function (e, t) {
        return S.H.useOptimistic(e, t);
      }),
      (e.useReducer = function (e, t, n) {
        return S.H.useReducer(e, t, n);
      }),
      (e.useRef = function (e) {
        return S.H.useRef(e);
      }),
      (e.useState = function (e) {
        return S.H.useState(e);
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return S.H.useSyncExternalStore(e, t, n);
      }),
      (e.useTransition = function () {
        return S.H.useTransition();
      }),
      (e.version = "19.2.6"));
  }),
  n = e((e, n) => {
    n.exports = t();
  }),
  r = e((e) => {
    function t(e, t) {
      var n = e.length;
      e.push(t);
      e: for (; 0 < n;) {
        var r = (n - 1) >>> 1,
          a = e[r];
        if (!(0 < l(a, t))) break e;
        ((e[r] = t), (e[n] = a), (n = r));
      }
    }
    function n(e) {
      return 0 === e.length ? null : e[0];
    }
    function r(e) {
      if (0 === e.length) return null;
      var t = e[0],
        n = e.pop();
      if (n !== t) {
        e[0] = n;
        e: for (var r = 0, a = e.length, i = a >>> 1; r < i;) {
          var o = 2 * (r + 1) - 1,
            s = e[o],
            u = o + 1,
            c = e[u];
          if (0 > l(s, n))
            u < a && 0 > l(c, s)
              ? ((e[r] = c), (e[u] = n), (r = u))
              : ((e[r] = s), (e[o] = n), (r = o));
          else {
            if (!(u < a && 0 > l(c, n))) break e;
            ((e[r] = c), (e[u] = n), (r = u));
          }
        }
      }
      return t;
    }
    function l(e, t) {
      var n = e.sortIndex - t.sortIndex;
      return 0 === n ? e.id - t.id : n;
    }
    if (
      ((e.unstable_now = void 0),
      "object" == typeof performance && "function" == typeof performance.now)
    ) {
      var a = performance;
      e.unstable_now = function () {
        return a.now();
      };
    } else {
      var i = Date,
        o = i.now();
      e.unstable_now = function () {
        return i.now() - o;
      };
    }
    var s = [],
      u = [],
      c = 1,
      d = null,
      f = 3,
      p = !1,
      h = !1,
      m = !1,
      g = !1,
      y = "function" == typeof setTimeout ? setTimeout : null,
      v = "function" == typeof clearTimeout ? clearTimeout : null,
      b = typeof setImmediate < "u" ? setImmediate : null;
    function k(e) {
      for (var l = n(u); null !== l;) {
        if (null === l.callback) r(u);
        else {
          if (!(l.startTime <= e)) break;
          (r(u), (l.sortIndex = l.expirationTime), t(s, l));
        }
        l = n(u);
      }
    }
    function w(e) {
      if (((m = !1), k(e), !h))
        if (null !== n(s)) ((h = !0), S || ((S = !0), x()));
        else {
          var t = n(u);
          null !== t && L(w, t.startTime - e);
        }
    }
    var x,
      S = !1,
      j = -1,
      C = 5,
      E = -1;
    function N() {
      return !!g || !(e.unstable_now() - E < C);
    }
    function T() {
      if (((g = !1), S)) {
        var t = e.unstable_now();
        E = t;
        var l = !0;
        try {
          e: {
            ((h = !1), m && ((m = !1), v(j), (j = -1)), (p = !0));
            var a = f;
            try {
              t: {
                for (k(t), d = n(s); null !== d && !(d.expirationTime > t && N());) {
                  var i = d.callback;
                  if ("function" == typeof i) {
                    ((d.callback = null), (f = d.priorityLevel));
                    var o = i(d.expirationTime <= t);
                    if (((t = e.unstable_now()), "function" == typeof o)) {
                      ((d.callback = o), k(t), (l = !0));
                      break t;
                    }
                    (d === n(s) && r(s), k(t));
                  } else r(s);
                  d = n(s);
                }
                if (null !== d) l = !0;
                else {
                  var c = n(u);
                  (null !== c && L(w, c.startTime - t), (l = !1));
                }
              }
              break e;
            } finally {
              ((d = null), (f = a), (p = !1));
            }
            l = void 0;
          }
        } finally {
          l ? x() : (S = !1);
        }
      }
    }
    if ("function" == typeof b)
      x = function () {
        b(T);
      };
    else if (typeof MessageChannel < "u") {
      var _ = new MessageChannel(),
        z = _.port2;
      ((_.port1.onmessage = T),
        (x = function () {
          z.postMessage(null);
        }));
    } else
      x = function () {
        y(T, 0);
      };
    function L(t, n) {
      j = y(function () {
        t(e.unstable_now());
      }, n);
    }
    ((e.unstable_IdlePriority = 5),
      (e.unstable_ImmediatePriority = 1),
      (e.unstable_LowPriority = 4),
      (e.unstable_NormalPriority = 3),
      (e.unstable_Profiling = null),
      (e.unstable_UserBlockingPriority = 2),
      (e.unstable_cancelCallback = function (e) {
        e.callback = null;
      }),
      (e.unstable_forceFrameRate = function (e) {
        0 > e || 125 < e
          ? console.error(
              "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
            )
          : (C = 0 < e ? Math.floor(1e3 / e) : 5);
      }),
      (e.unstable_getCurrentPriorityLevel = function () {
        return f;
      }),
      (e.unstable_next = function (e) {
        switch (f) {
          case 1:
          case 2:
          case 3:
            var t = 3;
            break;
          default:
            t = f;
        }
        var n = f;
        f = t;
        try {
          return e();
        } finally {
          f = n;
        }
      }),
      (e.unstable_requestPaint = function () {
        g = !0;
      }),
      (e.unstable_runWithPriority = function (e, t) {
        switch (e) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            e = 3;
        }
        var n = f;
        f = e;
        try {
          return t();
        } finally {
          f = n;
        }
      }),
      (e.unstable_scheduleCallback = function (r, l, a) {
        var i = e.unstable_now();
        switch (
          ("object" == typeof a && a
            ? (a = "number" == typeof (a = a.delay) && 0 < a ? i + a : i)
            : (a = i),
          r)
        ) {
          case 1:
            var o = -1;
            break;
          case 2:
            o = 250;
            break;
          case 5:
            o = 1073741823;
            break;
          case 4:
            o = 1e4;
            break;
          default:
            o = 5e3;
        }
        return (
          (r = {
            id: c++,
            callback: l,
            priorityLevel: r,
            startTime: a,
            expirationTime: (o = a + o),
            sortIndex: -1,
          }),
          a > i
            ? ((r.sortIndex = a),
              t(u, r),
              null === n(s) && r === n(u) && (m ? (v(j), (j = -1)) : (m = !0), L(w, a - i)))
            : ((r.sortIndex = o), t(s, r), h || p || ((h = !0), S || ((S = !0), x()))),
          r
        );
      }),
      (e.unstable_shouldYield = N),
      (e.unstable_wrapCallback = function (e) {
        var t = f;
        return function () {
          var n = f;
          f = t;
          try {
            return e.apply(this, arguments);
          } finally {
            f = n;
          }
        };
      }));
  }),
  i = e((e, t) => {
    t.exports = r();
  }),
  a = e((e) => {
    var t = n();
    function r(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += "&args[]=" + encodeURIComponent(arguments[n]);
      }
      return (
        "Minified React error #" +
        e +
        "; visit " +
        t +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    function l() {}
    var a = {
        d: {
          f: l,
          r: function () {
            throw Error(r(522));
          },
          D: l,
          C: l,
          L: l,
          m: l,
          X: l,
          S: l,
          M: l,
        },
        p: 0,
        findDOMNode: null,
      },
      i = Symbol.for("react.portal");
    var o = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function s(e, t) {
      return "font" === e ? "" : "string" == typeof t ? ("use-credentials" === t ? t : "") : void 0;
    }
    ((e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = a),
      (e.createPortal = function (e, t) {
        var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!t || (1 !== t.nodeType && 9 !== t.nodeType && 11 !== t.nodeType)) throw Error(r(299));
        return (function (e, t, n) {
          var r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
          return {
            $$typeof: i,
            key: null == r ? null : "" + r,
            children: e,
            containerInfo: t,
            implementation: n,
          };
        })(e, t, null, n);
      }),
      (e.flushSync = function (e) {
        var t = o.T,
          n = a.p;
        try {
          if (((o.T = null), (a.p = 2), e)) return e();
        } finally {
          ((o.T = t), (a.p = n), a.d.f());
        }
      }),
      (e.preconnect = function (e, t) {
        "string" == typeof e &&
          (t
            ? (t =
                "string" == typeof (t = t.crossOrigin)
                  ? "use-credentials" === t
                    ? t
                    : ""
                  : void 0)
            : (t = null),
          a.d.C(e, t));
      }),
      (e.prefetchDNS = function (e) {
        "string" == typeof e && a.d.D(e);
      }),
      (e.preinit = function (e, t) {
        if ("string" == typeof e && t && "string" == typeof t.as) {
          var n = t.as,
            r = s(n, t.crossOrigin),
            l = "string" == typeof t.integrity ? t.integrity : void 0,
            i = "string" == typeof t.fetchPriority ? t.fetchPriority : void 0;
          "style" === n
            ? a.d.S(e, "string" == typeof t.precedence ? t.precedence : void 0, {
                crossOrigin: r,
                integrity: l,
                fetchPriority: i,
              })
            : "script" === n &&
              a.d.X(e, {
                crossOrigin: r,
                integrity: l,
                fetchPriority: i,
                nonce: "string" == typeof t.nonce ? t.nonce : void 0,
              });
        }
      }),
      (e.preinitModule = function (e, t) {
        if ("string" == typeof e)
          if ("object" == typeof t && t) {
            if (null == t.as || "script" === t.as) {
              var n = s(t.as, t.crossOrigin);
              a.d.M(e, {
                crossOrigin: n,
                integrity: "string" == typeof t.integrity ? t.integrity : void 0,
                nonce: "string" == typeof t.nonce ? t.nonce : void 0,
              });
            }
          } else t ?? a.d.M(e);
      }),
      (e.preload = function (e, t) {
        if ("string" == typeof e && "object" == typeof t && t && "string" == typeof t.as) {
          var n = t.as,
            r = s(n, t.crossOrigin);
          a.d.L(e, n, {
            crossOrigin: r,
            integrity: "string" == typeof t.integrity ? t.integrity : void 0,
            nonce: "string" == typeof t.nonce ? t.nonce : void 0,
            type: "string" == typeof t.type ? t.type : void 0,
            fetchPriority: "string" == typeof t.fetchPriority ? t.fetchPriority : void 0,
            referrerPolicy: "string" == typeof t.referrerPolicy ? t.referrerPolicy : void 0,
            imageSrcSet: "string" == typeof t.imageSrcSet ? t.imageSrcSet : void 0,
            imageSizes: "string" == typeof t.imageSizes ? t.imageSizes : void 0,
            media: "string" == typeof t.media ? t.media : void 0,
          });
        }
      }),
      (e.preloadModule = function (e, t) {
        if ("string" == typeof e)
          if (t) {
            var n = s(t.as, t.crossOrigin);
            a.d.m(e, {
              as: "string" == typeof t.as && "script" !== t.as ? t.as : void 0,
              crossOrigin: n,
              integrity: "string" == typeof t.integrity ? t.integrity : void 0,
            });
          } else a.d.m(e);
      }),
      (e.requestFormReset = function (e) {
        a.d.r(e);
      }),
      (e.unstable_batchedUpdates = function (e, t) {
        return e(t);
      }),
      (e.useFormState = function (e, t, n) {
        return o.H.useFormState(e, t, n);
      }),
      (e.useFormStatus = function () {
        return o.H.useHostTransitionStatus();
      }),
      (e.version = "19.2.6"));
  }),
  o = e((e, t) => {
    ((function e() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        "function" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
        } catch (e) {
          console.error(e);
        }
    })(),
      (t.exports = a()));
  }),
  s = e((e) => {
    var t = i(),
      r = n(),
      l = o();
    function a(e) {
      var t = "https://react.dev/errors/" + e;
      if (1 < arguments.length) {
        t += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += "&args[]=" + encodeURIComponent(arguments[n]);
      }
      return (
        "Minified React error #" +
        e +
        "; visit " +
        t +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    function s(e) {
      var t = e,
        n = e;
      if (e.alternate) for (; t.return;) t = t.return;
      else {
        e = t;
        do {
          (4098 & (t = e).flags && (n = t.return), (e = t.return));
        } while (e);
      }
      return 3 === t.tag ? n : null;
    }
    function u(e) {
      if (13 === e.tag) {
        var t = e.memoizedState;
        if ((null === t && null !== (e = e.alternate) && (t = e.memoizedState), null !== t))
          return t.dehydrated;
      }
      return null;
    }
    function c(e) {
      if (31 === e.tag) {
        var t = e.memoizedState;
        if ((null === t && null !== (e = e.alternate) && (t = e.memoizedState), null !== t))
          return t.dehydrated;
      }
      return null;
    }
    function d(e) {
      if (s(e) !== e) throw Error(a(188));
    }
    function f(e) {
      var t = e.tag;
      if (5 === t || 26 === t || 27 === t || 6 === t) return e;
      for (e = e.child; null !== e;) {
        if (null !== (t = f(e))) return t;
        e = e.sibling;
      }
      return null;
    }
    var p = Object.assign,
      h = Symbol.for("react.element"),
      m = Symbol.for("react.transitional.element"),
      g = Symbol.for("react.portal"),
      y = Symbol.for("react.fragment"),
      v = Symbol.for("react.strict_mode"),
      b = Symbol.for("react.profiler"),
      k = Symbol.for("react.consumer"),
      w = Symbol.for("react.context"),
      x = Symbol.for("react.forward_ref"),
      S = Symbol.for("react.suspense"),
      j = Symbol.for("react.suspense_list"),
      C = Symbol.for("react.memo"),
      E = Symbol.for("react.lazy"),
      N = Symbol.for("react.activity"),
      T = Symbol.for("react.memo_cache_sentinel"),
      _ = Symbol.iterator;
    function z(e) {
      return "object" == typeof e && e
        ? "function" == typeof (e = (_ && e[_]) || e["@@iterator"])
          ? e
          : null
        : null;
    }
    var L = Symbol.for("react.client.reference");
    function P(e) {
      if (null == e) return null;
      if ("function" == typeof e) return e.$$typeof === L ? null : e.displayName || e.name || null;
      if ("string" == typeof e) return e;
      switch (e) {
        case y:
          return "Fragment";
        case b:
          return "Profiler";
        case v:
          return "StrictMode";
        case S:
          return "Suspense";
        case j:
          return "SuspenseList";
        case N:
          return "Activity";
      }
      if ("object" == typeof e)
        switch (e.$$typeof) {
          case g:
            return "Portal";
          case w:
            return e.displayName || "Context";
          case k:
            return (e._context.displayName || "Context") + ".Consumer";
          case x:
            var t = e.render;
            return (
              (e = e.displayName) ||
                (e =
                  "" === (e = t.displayName || t.name || "")
                    ? "ForwardRef"
                    : "ForwardRef(" + e + ")"),
              e
            );
          case C:
            return null === (t = e.displayName || null) ? P(e.type) || "Memo" : t;
          case E:
            ((t = e._payload), (e = e._init));
            try {
              return P(e(t));
            } catch {}
        }
      return null;
    }
    var A = Array.isArray,
      M = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      O = l.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      R = { pending: !1, data: null, method: null, action: null },
      D = [],
      I = -1;
    function F(e) {
      return { current: e };
    }
    function $(e) {
      0 > I || ((e.current = D[I]), (D[I] = null), I--);
    }
    function U(e, t) {
      (I++, (D[I] = e.current), (e.current = t));
    }
    var H,
      V,
      W = F(null),
      B = F(null),
      q = F(null),
      Q = F(null);
    function G(e, t) {
      switch ((U(q, t), U(B, e), U(W, null), t.nodeType)) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? yd(e) : 0;
          break;
        default:
          if (((e = t.tagName), (t = t.namespaceURI))) e = vd((t = yd(t)), e);
          else
            switch (e) {
              case "svg":
                e = 1;
                break;
              case "math":
                e = 2;
                break;
              default:
                e = 0;
            }
      }
      ($(W), U(W, e));
    }
    function K() {
      ($(W), $(B), $(q));
    }
    function Y(e) {
      null !== e.memoizedState && U(Q, e);
      var t = W.current,
        n = vd(t, e.type);
      t !== n && (U(B, e), U(W, n));
    }
    function X(e) {
      (B.current === e && ($(W), $(B)), Q.current === e && ($(Q), (df._currentValue = R)));
    }
    function J(e) {
      if (void 0 === H)
        try {
          throw Error();
        } catch (e) {
          var t = e.stack.trim().match(/\n( *(at )?)/);
          ((H = (t && t[1]) || ""),
            (V =
              -1 < e.stack.indexOf("\n    at")
                ? " (<anonymous>)"
                : -1 < e.stack.indexOf("@")
                  ? "@unknown:0:0"
                  : ""));
        }
      return "\n" + H + e + V;
    }
    var Z = !1;
    function ee(e, t) {
      if (!e || Z) return "";
      Z = !0;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var r = {
          DetermineComponentFrameRoot: function () {
            try {
              if (t) {
                var n = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(n.prototype, "props", {
                    set: function () {
                      throw Error();
                    },
                  }),
                  "object" == typeof Reflect && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(n, []);
                  } catch (e) {
                    var r = e;
                  }
                  Reflect.construct(e, [], n);
                } else {
                  try {
                    n.call();
                  } catch (e) {
                    r = e;
                  }
                  e.call(n.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (e) {
                  r = e;
                }
                (n = e()) && "function" == typeof n.catch && n.catch(function () {});
              }
            } catch (e) {
              if (e && r && "string" == typeof e.stack) return [e.stack, r.stack];
            }
            return [null, null];
          },
        };
        r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var l = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
        l &&
          l.configurable &&
          Object.defineProperty(r.DetermineComponentFrameRoot, "name", {
            value: "DetermineComponentFrameRoot",
          });
        var a = r.DetermineComponentFrameRoot(),
          i = a[0],
          o = a[1];
        if (i && o) {
          var s = i.split("\n"),
            u = o.split("\n");
          for (l = r = 0; r < s.length && !s[r].includes("DetermineComponentFrameRoot");) r++;
          for (; l < u.length && !u[l].includes("DetermineComponentFrameRoot");) l++;
          if (r === s.length || l === u.length)
            for (r = s.length - 1, l = u.length - 1; 1 <= r && 0 <= l && s[r] !== u[l];) l--;
          for (; 1 <= r && 0 <= l; r--, l--)
            if (s[r] !== u[l]) {
              if (1 !== r || 1 !== l)
                do {
                  if ((r--, 0 > --l || s[r] !== u[l])) {
                    var c = "\n" + s[r].replace(" at new ", " at ");
                    return (
                      e.displayName &&
                        c.includes("<anonymous>") &&
                        (c = c.replace("<anonymous>", e.displayName)),
                      c
                    );
                  }
                } while (1 <= r && 0 <= l);
              break;
            }
        }
      } finally {
        ((Z = !1), (Error.prepareStackTrace = n));
      }
      return (n = e ? e.displayName || e.name : "") ? J(n) : "";
    }
    function te(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return J(e.type);
        case 16:
          return J("Lazy");
        case 13:
          return e.child !== t && null !== t ? J("Suspense Fallback") : J("Suspense");
        case 19:
          return J("SuspenseList");
        case 0:
        case 15:
          return ee(e.type, !1);
        case 11:
          return ee(e.type.render, !1);
        case 1:
          return ee(e.type, !0);
        case 31:
          return J("Activity");
        default:
          return "";
      }
    }
    function ne(e) {
      try {
        var t = "",
          n = null;
        do {
          ((t += te(e, n)), (n = e), (e = e.return));
        } while (e);
        return t;
      } catch (e) {
        return "\nError generating stack: " + e.message + "\n" + e.stack;
      }
    }
    var re = Object.prototype.hasOwnProperty,
      le = t.unstable_scheduleCallback,
      ae = t.unstable_cancelCallback,
      ie = t.unstable_shouldYield,
      oe = t.unstable_requestPaint,
      se = t.unstable_now,
      ue = t.unstable_getCurrentPriorityLevel,
      ce = t.unstable_ImmediatePriority,
      de = t.unstable_UserBlockingPriority,
      fe = t.unstable_NormalPriority,
      pe = t.unstable_LowPriority,
      he = t.unstable_IdlePriority,
      me = t.log,
      ge = t.unstable_setDisableYieldValue,
      ye = null,
      ve = null;
    function be(e) {
      if (("function" == typeof me && ge(e), ve && "function" == typeof ve.setStrictMode))
        try {
          ve.setStrictMode(ye, e);
        } catch {}
    }
    var ke = Math.clz32
        ? Math.clz32
        : function (e) {
            return ((e >>>= 0), 0 === e ? 32 : (31 - ((we(e) / xe) | 0)) | 0);
          },
      we = Math.log,
      xe = Math.LN2;
    var Se = 256,
      je = 262144,
      Ce = 4194304;
    function Ee(e) {
      var t = 42 & e;
      if (0 !== t) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return 261888 & e;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return 3932160 & e;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return 62914560 & e;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function Ne(e, t, n) {
      var r = e.pendingLanes;
      if (0 === r) return 0;
      var l = 0,
        a = e.suspendedLanes,
        i = e.pingedLanes;
      e = e.warmLanes;
      var o = 134217727 & r;
      return (
        0 === o
          ? 0 === (o = r & ~a)
            ? 0 === i
              ? n || (0 !== (n = r & ~e) && (l = Ee(n)))
              : (l = Ee(i))
            : (l = Ee(o))
          : 0 === (r = o & ~a)
            ? 0 === (i &= o)
              ? n || (0 !== (n = o & ~e) && (l = Ee(n)))
              : (l = Ee(i))
            : (l = Ee(r)),
        0 === l
          ? 0
          : 0 !== t &&
              t !== l &&
              0 === (t & a) &&
              ((a = l & -l) >= (n = t & -t) || (32 === a && 4194048 & n))
            ? t
            : l
      );
    }
    function Te(e, t) {
      return 0 === (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t);
    }
    function _e(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        default:
          return -1;
      }
    }
    function ze() {
      var e = Ce;
      return (!(62914560 & (Ce <<= 1)) && (Ce = 4194304), e);
    }
    function Le(e) {
      for (var t = [], n = 0; 31 > n; n++) t.push(e);
      return t;
    }
    function Pe(e, t) {
      ((e.pendingLanes |= t),
        268435456 !== t && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
    }
    function Ae(e, t, n) {
      ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
      var r = 31 - ke(t);
      ((e.entangledLanes |= t),
        (e.entanglements[r] = 1073741824 | e.entanglements[r] | (261930 & n)));
    }
    function Me(e, t) {
      var n = (e.entangledLanes |= t);
      for (e = e.entanglements; n;) {
        var r = 31 - ke(n),
          l = 1 << r;
        ((l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l));
      }
    }
    function Oe(e, t) {
      var n = t & -t;
      return 0 === ((n = 42 & n ? 1 : Re(n)) & (e.suspendedLanes | t)) ? n : 0;
    }
    function Re(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function De(e) {
      return 2 < (e &= -e) ? (8 < e ? (134217727 & e ? 32 : 268435456) : 8) : 2;
    }
    function Ie() {
      var e = O.p;
      return 0 === e ? (void 0 === (e = window.event) ? 32 : Cf(e.type)) : e;
    }
    function Fe(e, t) {
      var n = O.p;
      try {
        return ((O.p = e), t());
      } finally {
        O.p = n;
      }
    }
    var $e = Math.random().toString(36).slice(2),
      Ue = "__reactFiber$" + $e,
      He = "__reactProps$" + $e,
      Ve = "__reactContainer$" + $e,
      We = "__reactEvents$" + $e,
      Be = "__reactListeners$" + $e,
      qe = "__reactHandles$" + $e,
      Qe = "__reactResources$" + $e,
      Ge = "__reactMarker$" + $e;
    function Ke(e) {
      (delete e[Ue], delete e[He], delete e[We], delete e[Be], delete e[qe]);
    }
    function Ye(e) {
      var t = e[Ue];
      if (t) return t;
      for (var n = e.parentNode; n;) {
        if ((t = n[Ve] || n[Ue])) {
          if (((n = t.alternate), null !== t.child || (null !== n && null !== n.child)))
            for (e = Rd(e); null !== e;) {
              if ((n = e[Ue])) return n;
              e = Rd(e);
            }
          return t;
        }
        n = (e = n).parentNode;
      }
      return null;
    }
    function Xe(e) {
      if ((e = e[Ue] || e[Ve])) {
        var t = e.tag;
        if (5 === t || 6 === t || 13 === t || 31 === t || 26 === t || 27 === t || 3 === t) return e;
      }
      return null;
    }
    function Je(e) {
      var t = e.tag;
      if (5 === t || 26 === t || 27 === t || 6 === t) return e.stateNode;
      throw Error(a(33));
    }
    function Ze(e) {
      var t = e[Qe];
      return (t || (t = e[Qe] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
    }
    function et(e) {
      e[Ge] = !0;
    }
    var tt = new Set(),
      nt = {};
    function rt(e, t) {
      (lt(e, t), lt(e + "Capture", t));
    }
    function lt(e, t) {
      for (nt[e] = t, e = 0; e < t.length; e++) tt.add(t[e]);
    }
    var at = RegExp(
        "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
      ),
      it = {},
      ot = {};
    function st(e, t, n) {
      if (
        (function (e) {
          return (
            !!re.call(ot, e) ||
            (!re.call(it, e) && (at.test(e) ? (ot[e] = !0) : ((it[e] = !0), !1)))
          );
        })(t)
      )
        if (null === n) e.removeAttribute(t);
        else {
          switch (typeof n) {
            case "undefined":
            case "function":
            case "symbol":
              return void e.removeAttribute(t);
            case "boolean":
              var r = t.toLowerCase().slice(0, 5);
              if ("data-" !== r && "aria-" !== r) return void e.removeAttribute(t);
          }
          e.setAttribute(t, "" + n);
        }
    }
    function ut(e, t, n) {
      if (null === n) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            return void e.removeAttribute(t);
        }
        e.setAttribute(t, "" + n);
      }
    }
    function ct(e, t, n, r) {
      if (null === r) e.removeAttribute(n);
      else {
        switch (typeof r) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            return void e.removeAttribute(n);
        }
        e.setAttributeNS(t, n, "" + r);
      }
    }
    function dt(e) {
      switch (typeof e) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
        case "object":
          return e;
        default:
          return "";
      }
    }
    function ft(e) {
      var t = e.type;
      return (e = e.nodeName) && "input" === e.toLowerCase() && ("checkbox" === t || "radio" === t);
    }
    function pt(e) {
      if (!e._valueTracker) {
        var t = ft(e) ? "checked" : "value";
        e._valueTracker = (function (e, t, n) {
          var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
          if (
            !e.hasOwnProperty(t) &&
            void 0 !== r &&
            "function" == typeof r.get &&
            "function" == typeof r.set
          ) {
            var l = r.get,
              a = r.set;
            return (
              Object.defineProperty(e, t, {
                configurable: !0,
                get: function () {
                  return l.call(this);
                },
                set: function (e) {
                  ((n = "" + e), a.call(this, e));
                },
              }),
              Object.defineProperty(e, t, { enumerable: r.enumerable }),
              {
                getValue: function () {
                  return n;
                },
                setValue: function (e) {
                  n = "" + e;
                },
                stopTracking: function () {
                  ((e._valueTracker = null), delete e[t]);
                },
              }
            );
          }
        })(e, t, "" + e[t]);
      }
    }
    function ht(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var n = t.getValue(),
        r = "";
      return (
        e && (r = ft(e) ? (e.checked ? "true" : "false") : e.value),
        (e = r) !== n && (t.setValue(e), !0)
      );
    }
    function mt(e) {
      if (void 0 === (e = e || (typeof document < "u" ? document : void 0))) return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var gt = /[\n"\\]/g;
    function yt(e) {
      return e.replace(gt, function (e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      });
    }
    function vt(e, t, n, r, l, a, i, o) {
      ((e.name = ""),
        null != i && "function" != typeof i && "symbol" != typeof i && "boolean" != typeof i
          ? (e.type = i)
          : e.removeAttribute("type"),
        null == t
          ? ("submit" !== i && "reset" !== i) || e.removeAttribute("value")
          : "number" === i
            ? ((0 === t && "" === e.value) || e.value != t) && (e.value = "" + dt(t))
            : e.value !== "" + dt(t) && (e.value = "" + dt(t)),
        null == t
          ? null == n
            ? null != r && e.removeAttribute("value")
            : kt(e, i, dt(n))
          : kt(e, i, dt(t)),
        null == l && null != a && (e.defaultChecked = !!a),
        null != l && (e.checked = l && "function" != typeof l && "symbol" != typeof l),
        null != o && "function" != typeof o && "symbol" != typeof o && "boolean" != typeof o
          ? (e.name = "" + dt(o))
          : e.removeAttribute("name"));
    }
    function bt(e, t, n, r, l, a, i, o) {
      if (
        (null != a &&
          "function" != typeof a &&
          "symbol" != typeof a &&
          "boolean" != typeof a &&
          (e.type = a),
        null != t || null != n)
      ) {
        if (("submit" === a || "reset" === a) && null == t) return void pt(e);
        ((n = null == n ? "" : "" + dt(n)),
          (t = null == t ? n : "" + dt(t)),
          o || t === e.value || (e.value = t),
          (e.defaultValue = t));
      }
      ((r = "function" != typeof (r = r ?? l) && "symbol" != typeof r && !!r),
        (e.checked = o ? e.checked : !!r),
        (e.defaultChecked = !!r),
        null != i &&
          "function" != typeof i &&
          "symbol" != typeof i &&
          "boolean" != typeof i &&
          (e.name = i),
        pt(e));
    }
    function kt(e, t, n) {
      ("number" === t && mt(e.ownerDocument) === e) ||
        e.defaultValue === "" + n ||
        (e.defaultValue = "" + n);
    }
    function wt(e, t, n, r) {
      if (((e = e.options), t)) {
        t = {};
        for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
        for (n = 0; n < e.length; n++)
          ((l = t.hasOwnProperty("$" + e[n].value)),
            e[n].selected !== l && (e[n].selected = l),
            l && r && (e[n].defaultSelected = !0));
      } else {
        for (n = "" + dt(n), t = null, l = 0; l < e.length; l++) {
          if (e[l].value === n)
            return ((e[l].selected = !0), void (r && (e[l].defaultSelected = !0)));
          null !== t || e[l].disabled || (t = e[l]);
        }
        null !== t && (t.selected = !0);
      }
    }
    function xt(e, t, n) {
      null == t || ((t = "" + dt(t)) !== e.value && (e.value = t), null != n)
        ? (e.defaultValue = null == n ? "" : "" + dt(n))
        : e.defaultValue !== t && (e.defaultValue = t);
    }
    function St(e, t, n, r) {
      if (null == t) {
        if (null != r) {
          if (null != n) throw Error(a(92));
          if (A(r)) {
            if (1 < r.length) throw Error(a(93));
            r = r[0];
          }
          n = r;
        }
        (n ?? (n = ""), (t = n));
      }
      ((n = dt(t)),
        (e.defaultValue = n),
        (r = e.textContent) === n && "" !== r && null !== r && (e.value = r),
        pt(e));
    }
    function jt(e, t) {
      if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && 3 === n.nodeType) return void (n.nodeValue = t);
      }
      e.textContent = t;
    }
    var Ct = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " ",
      ),
    );
    function Et(e, t, n) {
      var r = 0 === t.indexOf("--");
      null == n || "boolean" == typeof n || "" === n
        ? r
          ? e.setProperty(t, "")
          : "float" === t
            ? (e.cssFloat = "")
            : (e[t] = "")
        : r
          ? e.setProperty(t, n)
          : "number" != typeof n || 0 === n || Ct.has(t)
            ? "float" === t
              ? (e.cssFloat = n)
              : (e[t] = ("" + n).trim())
            : (e[t] = n + "px");
    }
    function Nt(e, t, n) {
      if (null != t && "object" != typeof t) throw Error(a(62));
      if (((e = e.style), null != n)) {
        for (var r in n)
          !n.hasOwnProperty(r) ||
            (null != t && t.hasOwnProperty(r)) ||
            (0 === r.indexOf("--")
              ? e.setProperty(r, "")
              : "float" === r
                ? (e.cssFloat = "")
                : (e[r] = ""));
        for (var l in t) ((r = t[l]), t.hasOwnProperty(l) && n[l] !== r && Et(e, l, r));
      } else for (var i in t) t.hasOwnProperty(i) && Et(e, i, t[i]);
    }
    function Tt(e) {
      if (-1 === e.indexOf("-")) return !1;
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var _t = new Map([
        ["acceptCharset", "accept-charset"],
        ["htmlFor", "for"],
        ["httpEquiv", "http-equiv"],
        ["crossOrigin", "crossorigin"],
        ["accentHeight", "accent-height"],
        ["alignmentBaseline", "alignment-baseline"],
        ["arabicForm", "arabic-form"],
        ["baselineShift", "baseline-shift"],
        ["capHeight", "cap-height"],
        ["clipPath", "clip-path"],
        ["clipRule", "clip-rule"],
        ["colorInterpolation", "color-interpolation"],
        ["colorInterpolationFilters", "color-interpolation-filters"],
        ["colorProfile", "color-profile"],
        ["colorRendering", "color-rendering"],
        ["dominantBaseline", "dominant-baseline"],
        ["enableBackground", "enable-background"],
        ["fillOpacity", "fill-opacity"],
        ["fillRule", "fill-rule"],
        ["floodColor", "flood-color"],
        ["floodOpacity", "flood-opacity"],
        ["fontFamily", "font-family"],
        ["fontSize", "font-size"],
        ["fontSizeAdjust", "font-size-adjust"],
        ["fontStretch", "font-stretch"],
        ["fontStyle", "font-style"],
        ["fontVariant", "font-variant"],
        ["fontWeight", "font-weight"],
        ["glyphName", "glyph-name"],
        ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
        ["glyphOrientationVertical", "glyph-orientation-vertical"],
        ["horizAdvX", "horiz-adv-x"],
        ["horizOriginX", "horiz-origin-x"],
        ["imageRendering", "image-rendering"],
        ["letterSpacing", "letter-spacing"],
        ["lightingColor", "lighting-color"],
        ["markerEnd", "marker-end"],
        ["markerMid", "marker-mid"],
        ["markerStart", "marker-start"],
        ["overlinePosition", "overline-position"],
        ["overlineThickness", "overline-thickness"],
        ["paintOrder", "paint-order"],
        ["panose-1", "panose-1"],
        ["pointerEvents", "pointer-events"],
        ["renderingIntent", "rendering-intent"],
        ["shapeRendering", "shape-rendering"],
        ["stopColor", "stop-color"],
        ["stopOpacity", "stop-opacity"],
        ["strikethroughPosition", "strikethrough-position"],
        ["strikethroughThickness", "strikethrough-thickness"],
        ["strokeDasharray", "stroke-dasharray"],
        ["strokeDashoffset", "stroke-dashoffset"],
        ["strokeLinecap", "stroke-linecap"],
        ["strokeLinejoin", "stroke-linejoin"],
        ["strokeMiterlimit", "stroke-miterlimit"],
        ["strokeOpacity", "stroke-opacity"],
        ["strokeWidth", "stroke-width"],
        ["textAnchor", "text-anchor"],
        ["textDecoration", "text-decoration"],
        ["textRendering", "text-rendering"],
        ["transformOrigin", "transform-origin"],
        ["underlinePosition", "underline-position"],
        ["underlineThickness", "underline-thickness"],
        ["unicodeBidi", "unicode-bidi"],
        ["unicodeRange", "unicode-range"],
        ["unitsPerEm", "units-per-em"],
        ["vAlphabetic", "v-alphabetic"],
        ["vHanging", "v-hanging"],
        ["vIdeographic", "v-ideographic"],
        ["vMathematical", "v-mathematical"],
        ["vectorEffect", "vector-effect"],
        ["vertAdvY", "vert-adv-y"],
        ["vertOriginX", "vert-origin-x"],
        ["vertOriginY", "vert-origin-y"],
        ["wordSpacing", "word-spacing"],
        ["writingMode", "writing-mode"],
        ["xmlnsXlink", "xmlns:xlink"],
        ["xHeight", "x-height"],
      ]),
      zt =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Lt(e) {
      return zt.test("" + e)
        ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
        : e;
    }
    function Pt() {}
    var At = null;
    function Mt(e) {
      return (
        (e = e.target || e.srcElement || window).correspondingUseElement &&
          (e = e.correspondingUseElement),
        3 === e.nodeType ? e.parentNode : e
      );
    }
    var Ot = null,
      Rt = null;
    function Dt(e) {
      var t = Xe(e);
      if (t && (e = t.stateNode)) {
        var n = e[He] || null;
        e: switch (((e = t.stateNode), t.type)) {
          case "input":
            if (
              (vt(
                e,
                n.value,
                n.defaultValue,
                n.defaultValue,
                n.checked,
                n.defaultChecked,
                n.type,
                n.name,
              ),
              (t = n.name),
              "radio" === n.type && null != t)
            ) {
              for (n = e; n.parentNode;) n = n.parentNode;
              for (
                n = n.querySelectorAll('input[name="' + yt("" + t) + '"][type="radio"]'), t = 0;
                t < n.length;
                t++
              ) {
                var r = n[t];
                if (r !== e && r.form === e.form) {
                  var l = r[He] || null;
                  if (!l) throw Error(a(90));
                  vt(
                    r,
                    l.value,
                    l.defaultValue,
                    l.defaultValue,
                    l.checked,
                    l.defaultChecked,
                    l.type,
                    l.name,
                  );
                }
              }
              for (t = 0; t < n.length; t++) (r = n[t]).form === e.form && ht(r);
            }
            break e;
          case "textarea":
            xt(e, n.value, n.defaultValue);
            break e;
          case "select":
            null != (t = n.value) && wt(e, !!n.multiple, t, !1);
        }
      }
    }
    var It = !1;
    function Ft(e, t, n) {
      if (It) return e(t, n);
      It = !0;
      try {
        return e(t);
      } finally {
        if (
          ((It = !1),
          (null !== Ot || null !== Rt) &&
            (Zu(), Ot && ((t = Ot), (e = Rt), (Rt = Ot = null), Dt(t), e)))
        )
          for (t = 0; t < e.length; t++) Dt(e[t]);
      }
    }
    function $t(e, t) {
      var n = e.stateNode;
      if (null === n) return null;
      var r = n[He] || null;
      if (null === r) return null;
      n = r[t];
      e: switch (t) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          ((r = !r.disabled) ||
            (r = !(
              "button" === (e = e.type) ||
              "input" === e ||
              "select" === e ||
              "textarea" === e
            )),
            (e = !r));
          break e;
        default:
          e = !1;
      }
      if (e) return null;
      if (n && "function" != typeof n) throw Error(a(231, t, typeof n));
      return n;
    }
    var Ut = !(
        typeof window > "u" ||
        void 0 === window.document ||
        void 0 === window.document.createElement
      ),
      Ht = !1;
    if (Ut)
      try {
        var Vt = {};
        (Object.defineProperty(Vt, "passive", {
          get: function () {
            Ht = !0;
          },
        }),
          window.addEventListener("test", Vt, Vt),
          window.removeEventListener("test", Vt, Vt));
      } catch {
        Ht = !1;
      }
    var Wt = null,
      Bt = null,
      qt = null;
    function Qt() {
      if (qt) return qt;
      var e,
        t,
        n = Bt,
        r = n.length,
        l = "value" in Wt ? Wt.value : Wt.textContent,
        a = l.length;
      for (e = 0; e < r && n[e] === l[e]; e++);
      var i = r - e;
      for (t = 1; t <= i && n[r - t] === l[a - t]; t++);
      return (qt = l.slice(e, 1 < t ? 1 - t : void 0));
    }
    function Gt(e) {
      var t = e.keyCode;
      return (
        "charCode" in e ? 0 === (e = e.charCode) && 13 === t && (e = 13) : (e = t),
        10 === e && (e = 13),
        32 <= e || 13 === e ? e : 0
      );
    }
    function Kt() {
      return !0;
    }
    function Yt() {
      return !1;
    }
    function Xt(e) {
      function t(t, n, r, l, a) {
        for (var i in ((this._reactName = t),
        (this._targetInst = r),
        (this.type = n),
        (this.nativeEvent = l),
        (this.target = a),
        (this.currentTarget = null),
        e))
          e.hasOwnProperty(i) && ((t = e[i]), (this[i] = t ? t(l) : l[i]));
        return (
          (this.isDefaultPrevented = (
            null == l.defaultPrevented ? !1 === l.returnValue : l.defaultPrevented
          )
            ? Kt
            : Yt),
          (this.isPropagationStopped = Yt),
          this
        );
      }
      return (
        p(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var e = this.nativeEvent;
            e &&
              (e.preventDefault
                ? e.preventDefault()
                : "unknown" != typeof e.returnValue && (e.returnValue = !1),
              (this.isDefaultPrevented = Kt));
          },
          stopPropagation: function () {
            var e = this.nativeEvent;
            e &&
              (e.stopPropagation
                ? e.stopPropagation()
                : "unknown" != typeof e.cancelBubble && (e.cancelBubble = !0),
              (this.isPropagationStopped = Kt));
          },
          persist: function () {},
          isPersistent: Kt,
        }),
        t
      );
    }
    var Jt,
      Zt,
      en,
      tn = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      nn = Xt(tn),
      rn = p({}, tn, { view: 0, detail: 0 }),
      ln = Xt(rn),
      an = p({}, rn, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: yn,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
          return void 0 === e.relatedTarget
            ? e.fromElement === e.srcElement
              ? e.toElement
              : e.fromElement
            : e.relatedTarget;
        },
        movementX: function (e) {
          return "movementX" in e
            ? e.movementX
            : (e !== en &&
                (en && "mousemove" === e.type
                  ? ((Jt = e.screenX - en.screenX), (Zt = e.screenY - en.screenY))
                  : (Zt = Jt = 0),
                (en = e)),
              Jt);
        },
        movementY: function (e) {
          return "movementY" in e ? e.movementY : Zt;
        },
      }),
      on = Xt(an),
      sn = Xt(p({}, an, { dataTransfer: 0 })),
      un = Xt(p({}, rn, { relatedTarget: 0 })),
      cn = Xt(p({}, tn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 })),
      dn = Xt(
        p({}, tn, {
          clipboardData: function (e) {
            return "clipboardData" in e ? e.clipboardData : window.clipboardData;
          },
        }),
      ),
      fn = Xt(p({}, tn, { data: 0 })),
      pn = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified",
      },
      hn = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta",
      },
      mn = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function gn(e) {
      var t = this.nativeEvent;
      return t.getModifierState ? t.getModifierState(e) : !!(e = mn[e]) && !!t[e];
    }
    function yn() {
      return gn;
    }
    var vn = Xt(
        p({}, rn, {
          key: function (e) {
            if (e.key) {
              var t = pn[e.key] || e.key;
              if ("Unidentified" !== t) return t;
            }
            return "keypress" === e.type
              ? 13 === (e = Gt(e))
                ? "Enter"
                : String.fromCharCode(e)
              : "keydown" === e.type || "keyup" === e.type
                ? hn[e.keyCode] || "Unidentified"
                : "";
          },
          code: 0,
          location: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          repeat: 0,
          locale: 0,
          getModifierState: yn,
          charCode: function (e) {
            return "keypress" === e.type ? Gt(e) : 0;
          },
          keyCode: function (e) {
            return "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0;
          },
          which: function (e) {
            return "keypress" === e.type
              ? Gt(e)
              : "keydown" === e.type || "keyup" === e.type
                ? e.keyCode
                : 0;
          },
        }),
      ),
      bn = Xt(
        p({}, an, {
          pointerId: 0,
          width: 0,
          height: 0,
          pressure: 0,
          tangentialPressure: 0,
          tiltX: 0,
          tiltY: 0,
          twist: 0,
          pointerType: 0,
          isPrimary: 0,
        }),
      ),
      kn = Xt(
        p({}, rn, {
          touches: 0,
          targetTouches: 0,
          changedTouches: 0,
          altKey: 0,
          metaKey: 0,
          ctrlKey: 0,
          shiftKey: 0,
          getModifierState: yn,
        }),
      ),
      wn = Xt(p({}, tn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
      xn = Xt(
        p({}, an, {
          deltaX: function (e) {
            return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
          },
          deltaY: function (e) {
            return "deltaY" in e
              ? e.deltaY
              : "wheelDeltaY" in e
                ? -e.wheelDeltaY
                : "wheelDelta" in e
                  ? -e.wheelDelta
                  : 0;
          },
          deltaZ: 0,
          deltaMode: 0,
        }),
      ),
      Sn = Xt(p({}, tn, { newState: 0, oldState: 0 })),
      jn = [9, 13, 27, 32],
      Cn = Ut && "CompositionEvent" in window,
      En = null;
    Ut && "documentMode" in document && (En = document.documentMode);
    var Nn = Ut && "TextEvent" in window && !En,
      Tn = Ut && (!Cn || (En && 8 < En && 11 >= En)),
      _n = " ",
      zn = !1;
    function Ln(e, t) {
      switch (e) {
        case "keyup":
          return -1 !== jn.indexOf(t.keyCode);
        case "keydown":
          return 229 !== t.keyCode;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function Pn(e) {
      return "object" == typeof (e = e.detail) && "data" in e ? e.data : null;
    }
    var An = !1;
    var Mn = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function On(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return "input" === t ? !!Mn[e.type] : "textarea" === t;
    }
    function Rn(e, t, n, r) {
      (Ot ? (Rt ? Rt.push(r) : (Rt = [r])) : (Ot = r),
        0 < (t = rd(t, "onChange")).length &&
          ((n = new nn("onChange", "change", null, n, r)), e.push({ event: n, listeners: t })));
    }
    var Dn = null,
      In = null;
    function Fn(e) {
      Kc(e, 0);
    }
    function $n(e) {
      if (ht(Je(e))) return e;
    }
    function Un(e, t) {
      if ("change" === e) return t;
    }
    var Hn = !1;
    if (Ut) {
      var Vn;
      if (Ut) {
        var Wn = "oninput" in document;
        if (!Wn) {
          var Bn = document.createElement("div");
          (Bn.setAttribute("oninput", "return;"), (Wn = "function" == typeof Bn.oninput));
        }
        Vn = Wn;
      } else Vn = !1;
      Hn = Vn && (!document.documentMode || 9 < document.documentMode);
    }
    function qn() {
      Dn && (Dn.detachEvent("onpropertychange", Qn), (In = Dn = null));
    }
    function Qn(e) {
      if ("value" === e.propertyName && $n(In)) {
        var t = [];
        (Rn(t, In, e, Mt(e)), Ft(Fn, t));
      }
    }
    function Gn(e, t, n) {
      "focusin" === e
        ? (qn(), (In = n), (Dn = t).attachEvent("onpropertychange", Qn))
        : "focusout" === e && qn();
    }
    function Kn(e) {
      if ("selectionchange" === e || "keyup" === e || "keydown" === e) return $n(In);
    }
    function Yn(e, t) {
      if ("click" === e) return $n(t);
    }
    function Xn(e, t) {
      if ("input" === e || "change" === e) return $n(t);
    }
    var Jn =
      "function" == typeof Object.is
        ? Object.is
        : function (e, t) {
            return (e === t && (0 !== e || 1 / e == 1 / t)) || (e != e && t != t);
          };
    function Zn(e, t) {
      if (Jn(e, t)) return !0;
      if ("object" != typeof e || !e || "object" != typeof t || !t) return !1;
      var n = Object.keys(e),
        r = Object.keys(t);
      if (n.length !== r.length) return !1;
      for (r = 0; r < n.length; r++) {
        var l = n[r];
        if (!re.call(t, l) || !Jn(e[l], t[l])) return !1;
      }
      return !0;
    }
    function er(e) {
      for (; e && e.firstChild;) e = e.firstChild;
      return e;
    }
    function tr(e, t) {
      var n,
        r = er(e);
      for (e = 0; r;) {
        if (3 === r.nodeType) {
          if (((n = e + r.textContent.length), e <= t && n >= t)) return { node: r, offset: t - e };
          e = n;
        }
        e: {
          for (; r;) {
            if (r.nextSibling) {
              r = r.nextSibling;
              break e;
            }
            r = r.parentNode;
          }
          r = void 0;
        }
        r = er(r);
      }
    }
    function nr(e, t) {
      return (
        !(!e || !t) &&
        (e === t ||
          ((!e || 3 !== e.nodeType) &&
            (t && 3 === t.nodeType
              ? nr(e, t.parentNode)
              : "contains" in e
                ? e.contains(t)
                : !!e.compareDocumentPosition && !!(16 & e.compareDocumentPosition(t)))))
      );
    }
    function rr(e) {
      for (
        var t = mt(
          (e =
            null != e && null != e.ownerDocument && null != e.ownerDocument.defaultView
              ? e.ownerDocument.defaultView
              : window).document,
        );
        t instanceof e.HTMLIFrameElement;
      ) {
        try {
          var n = "string" == typeof t.contentWindow.location.href;
        } catch {
          n = !1;
        }
        if (!n) break;
        t = mt((e = t.contentWindow).document);
      }
      return t;
    }
    function lr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return (
        t &&
        (("input" === t &&
          ("text" === e.type ||
            "search" === e.type ||
            "tel" === e.type ||
            "url" === e.type ||
            "password" === e.type)) ||
          "textarea" === t ||
          "true" === e.contentEditable)
      );
    }
    var ar = Ut && "documentMode" in document && 11 >= document.documentMode,
      ir = null,
      or = null,
      sr = null,
      ur = !1;
    function cr(e, t, n) {
      var r = n.window === n ? n.document : 9 === n.nodeType ? n : n.ownerDocument;
      ur ||
        null == ir ||
        ir !== mt(r) ||
        ("selectionStart" in (r = ir) && lr(r)
          ? (r = { start: r.selectionStart, end: r.selectionEnd })
          : (r = {
              anchorNode: (r = (
                (r.ownerDocument && r.ownerDocument.defaultView) ||
                window
              ).getSelection()).anchorNode,
              anchorOffset: r.anchorOffset,
              focusNode: r.focusNode,
              focusOffset: r.focusOffset,
            }),
        (sr && Zn(sr, r)) ||
          ((sr = r),
          0 < (r = rd(or, "onSelect")).length &&
            ((t = new nn("onSelect", "select", null, t, n)),
            e.push({ event: t, listeners: r }),
            (t.target = ir))));
    }
    function dr(e, t) {
      var n = {};
      return (
        (n[e.toLowerCase()] = t.toLowerCase()),
        (n["Webkit" + e] = "webkit" + t),
        (n["Moz" + e] = "moz" + t),
        n
      );
    }
    var fr = {
        animationend: dr("Animation", "AnimationEnd"),
        animationiteration: dr("Animation", "AnimationIteration"),
        animationstart: dr("Animation", "AnimationStart"),
        transitionrun: dr("Transition", "TransitionRun"),
        transitionstart: dr("Transition", "TransitionStart"),
        transitioncancel: dr("Transition", "TransitionCancel"),
        transitionend: dr("Transition", "TransitionEnd"),
      },
      pr = {},
      hr = {};
    function mr(e) {
      if (pr[e]) return pr[e];
      if (!fr[e]) return e;
      var t,
        n = fr[e];
      for (t in n) if (n.hasOwnProperty(t) && t in hr) return (pr[e] = n[t]);
      return e;
    }
    Ut &&
      ((hr = document.createElement("div").style),
      "AnimationEvent" in window ||
        (delete fr.animationend.animation,
        delete fr.animationiteration.animation,
        delete fr.animationstart.animation),
      "TransitionEvent" in window || delete fr.transitionend.transition);
    var gr = mr("animationend"),
      yr = mr("animationiteration"),
      vr = mr("animationstart"),
      br = mr("transitionrun"),
      kr = mr("transitionstart"),
      wr = mr("transitioncancel"),
      xr = mr("transitionend"),
      Sr = new Map(),
      jr =
        "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
          " ",
        );
    function Cr(e, t) {
      (Sr.set(e, t), rt(t, [e]));
    }
    jr.push("scrollEnd");
    var Er =
        "function" == typeof reportError
          ? reportError
          : function (e) {
              if ("object" == typeof window && "function" == typeof window.ErrorEvent) {
                var t = new window.ErrorEvent("error", {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    "object" == typeof e && e && "string" == typeof e.message
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if ("object" == typeof process && "function" == typeof process.emit)
                return void process.emit("uncaughtException", e);
              console.error(e);
            },
      Nr = [],
      Tr = 0,
      _r = 0;
    function zr() {
      for (var e = Tr, t = (_r = Tr = 0); t < e;) {
        var n = Nr[t];
        Nr[t++] = null;
        var r = Nr[t];
        Nr[t++] = null;
        var l = Nr[t];
        Nr[t++] = null;
        var a = Nr[t];
        if (((Nr[t++] = null), null !== r && null !== l)) {
          var i = r.pending;
          (null === i ? (l.next = l) : ((l.next = i.next), (i.next = l)), (r.pending = l));
        }
        0 !== a && Mr(n, l, a);
      }
    }
    function Lr(e, t, n, r) {
      ((Nr[Tr++] = e),
        (Nr[Tr++] = t),
        (Nr[Tr++] = n),
        (Nr[Tr++] = r),
        (_r |= r),
        (e.lanes |= r),
        null !== (e = e.alternate) && (e.lanes |= r));
    }
    function Pr(e, t, n, r) {
      return (Lr(e, t, n, r), Or(e));
    }
    function Ar(e, t) {
      return (Lr(e, null, null, t), Or(e));
    }
    function Mr(e, t, n) {
      e.lanes |= n;
      var r = e.alternate;
      null !== r && (r.lanes |= n);
      for (var l = !1, a = e.return; null !== a;)
        ((a.childLanes |= n),
          null !== (r = a.alternate) && (r.childLanes |= n),
          22 === a.tag && (null === (e = a.stateNode) || 1 & e._visibility || (l = !0)),
          (e = a),
          (a = a.return));
      return 3 === e.tag
        ? ((a = e.stateNode),
          l &&
            null !== t &&
            ((l = 31 - ke(n)),
            null === (r = (e = a.hiddenUpdates)[l]) ? (e[l] = [t]) : r.push(t),
            (t.lane = 536870912 | n)),
          a)
        : null;
    }
    function Or(e) {
      if (50 < Wu) throw ((Wu = 0), (Bu = null), Error(a(185)));
      for (var t = e.return; null !== t;) t = (e = t).return;
      return 3 === e.tag ? e.stateNode : null;
    }
    var Rr = {};
    function Dr(e, t, n, r) {
      ((this.tag = e),
        (this.key = n),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = t),
        (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
        (this.mode = r),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function Ir(e, t, n, r) {
      return new Dr(e, t, n, r);
    }
    function Fr(e) {
      return !(!(e = e.prototype) || !e.isReactComponent);
    }
    function $r(e, t) {
      var n = e.alternate;
      return (
        null === n
          ? (((n = Ir(e.tag, t, e.key, e.mode)).elementType = e.elementType),
            (n.type = e.type),
            (n.stateNode = e.stateNode),
            (n.alternate = e),
            (e.alternate = n))
          : ((n.pendingProps = t),
            (n.type = e.type),
            (n.flags = 0),
            (n.subtreeFlags = 0),
            (n.deletions = null)),
        (n.flags = 65011712 & e.flags),
        (n.childLanes = e.childLanes),
        (n.lanes = e.lanes),
        (n.child = e.child),
        (n.memoizedProps = e.memoizedProps),
        (n.memoizedState = e.memoizedState),
        (n.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (n.dependencies = null === t ? null : { lanes: t.lanes, firstContext: t.firstContext }),
        (n.sibling = e.sibling),
        (n.index = e.index),
        (n.ref = e.ref),
        (n.refCleanup = e.refCleanup),
        n
      );
    }
    function Ur(e, t) {
      e.flags &= 65011714;
      var n = e.alternate;
      return (
        null === n
          ? ((e.childLanes = 0),
            (e.lanes = t),
            (e.child = null),
            (e.subtreeFlags = 0),
            (e.memoizedProps = null),
            (e.memoizedState = null),
            (e.updateQueue = null),
            (e.dependencies = null),
            (e.stateNode = null))
          : ((e.childLanes = n.childLanes),
            (e.lanes = n.lanes),
            (e.child = n.child),
            (e.subtreeFlags = 0),
            (e.deletions = null),
            (e.memoizedProps = n.memoizedProps),
            (e.memoizedState = n.memoizedState),
            (e.updateQueue = n.updateQueue),
            (e.type = n.type),
            (t = n.dependencies),
            (e.dependencies =
              null === t ? null : { lanes: t.lanes, firstContext: t.firstContext })),
        e
      );
    }
    function Hr(e, t, n, r, l, i) {
      var o = 0;
      if (((r = e), "function" == typeof e)) Fr(e) && (o = 1);
      else if ("string" == typeof e)
        o = (function (e, t, n) {
          if (1 === n || null != t.itemProp) return !1;
          switch (e) {
            case "meta":
            case "title":
              return !0;
            case "style":
              if ("string" != typeof t.precedence || "string" != typeof t.href || "" === t.href)
                break;
              return !0;
            case "link":
              if (
                "string" != typeof t.rel ||
                "string" != typeof t.href ||
                "" === t.href ||
                t.onLoad ||
                t.onError
              )
                break;
              return (
                "stylesheet" !== t.rel ||
                ((e = t.disabled), "string" == typeof t.precedence && null == e)
              );
            case "script":
              if (
                t.async &&
                "function" != typeof t.async &&
                "symbol" != typeof t.async &&
                !t.onLoad &&
                !t.onError &&
                t.src &&
                "string" == typeof t.src
              )
                return !0;
          }
          return !1;
        })(e, n, W.current)
          ? 26
          : "html" === e || "head" === e || "body" === e
            ? 27
            : 5;
      else
        e: switch (e) {
          case N:
            return (((e = Ir(31, n, t, l)).elementType = N), (e.lanes = i), e);
          case y:
            return Vr(n.children, l, i, t);
          case v:
            ((o = 8), (l |= 24));
            break;
          case b:
            return (((e = Ir(12, n, t, 2 | l)).elementType = b), (e.lanes = i), e);
          case S:
            return (((e = Ir(13, n, t, l)).elementType = S), (e.lanes = i), e);
          case j:
            return (((e = Ir(19, n, t, l)).elementType = j), (e.lanes = i), e);
          default:
            if ("object" == typeof e && e)
              switch (e.$$typeof) {
                case w:
                  o = 10;
                  break e;
                case k:
                  o = 9;
                  break e;
                case x:
                  o = 11;
                  break e;
                case C:
                  o = 14;
                  break e;
                case E:
                  ((o = 16), (r = null));
                  break e;
              }
            ((o = 29), (n = Error(a(130, null === e ? "null" : typeof e, ""))), (r = null));
        }
      return (((t = Ir(o, n, t, l)).elementType = e), (t.type = r), (t.lanes = i), t);
    }
    function Vr(e, t, n, r) {
      return (((e = Ir(7, e, r, t)).lanes = n), e);
    }
    function Wr(e, t, n) {
      return (((e = Ir(6, e, null, t)).lanes = n), e);
    }
    function Br(e) {
      var t = Ir(18, null, null, 0);
      return ((t.stateNode = e), t);
    }
    function qr(e, t, n) {
      return (
        ((t = Ir(4, null === e.children ? [] : e.children, e.key, t)).lanes = n),
        (t.stateNode = {
          containerInfo: e.containerInfo,
          pendingChildren: null,
          implementation: e.implementation,
        }),
        t
      );
    }
    var Qr = new WeakMap();
    function Gr(e, t) {
      if ("object" == typeof e && e) {
        var n = Qr.get(e);
        return void 0 === n ? ((t = { value: e, source: t, stack: ne(t) }), Qr.set(e, t), t) : n;
      }
      return { value: e, source: t, stack: ne(t) };
    }
    var Kr = [],
      Yr = 0,
      Xr = null,
      Jr = 0,
      Zr = [],
      el = 0,
      tl = null,
      nl = 1,
      rl = "";
    function ll(e, t) {
      ((Kr[Yr++] = Jr), (Kr[Yr++] = Xr), (Xr = e), (Jr = t));
    }
    function al(e, t, n) {
      ((Zr[el++] = nl), (Zr[el++] = rl), (Zr[el++] = tl), (tl = e));
      var r = nl;
      e = rl;
      var l = 32 - ke(r) - 1;
      ((r &= ~(1 << l)), (n += 1));
      var a = 32 - ke(t) + l;
      if (30 < a) {
        var i = l - (l % 5);
        ((a = (r & ((1 << i) - 1)).toString(32)),
          (r >>= i),
          (l -= i),
          (nl = (1 << (32 - ke(t) + l)) | (n << l) | r),
          (rl = a + e));
      } else ((nl = (1 << a) | (n << l) | r), (rl = e));
    }
    function il(e) {
      null !== e.return && (ll(e, 1), al(e, 1, 0));
    }
    function ol(e) {
      for (; e === Xr;) ((Xr = Kr[--Yr]), (Kr[Yr] = null), (Jr = Kr[--Yr]), (Kr[Yr] = null));
      for (; e === tl;)
        ((tl = Zr[--el]),
          (Zr[el] = null),
          (rl = Zr[--el]),
          (Zr[el] = null),
          (nl = Zr[--el]),
          (Zr[el] = null));
    }
    function sl(e, t) {
      ((Zr[el++] = nl), (Zr[el++] = rl), (Zr[el++] = tl), (nl = t.id), (rl = t.overflow), (tl = e));
    }
    var ul = null,
      cl = null,
      dl = !1,
      fl = null,
      pl = !1,
      hl = Error(a(519));
    function ml(e) {
      throw (
        wl(
          Gr(
            Error(
              a(
                418,
                1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML",
                "",
              ),
            ),
            e,
          ),
        ),
        hl
      );
    }
    function gl(e) {
      var t = e.stateNode,
        n = e.type,
        r = e.memoizedProps;
      switch (((t[Ue] = e), (t[He] = r), n)) {
        case "dialog":
          (Yc("cancel", t), Yc("close", t));
          break;
        case "iframe":
        case "object":
        case "embed":
          Yc("load", t);
          break;
        case "video":
        case "audio":
          for (n = 0; n < Qc.length; n++) Yc(Qc[n], t);
          break;
        case "source":
          Yc("error", t);
          break;
        case "img":
        case "image":
        case "link":
          (Yc("error", t), Yc("load", t));
          break;
        case "details":
          Yc("toggle", t);
          break;
        case "input":
          (Yc("invalid", t),
            bt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0));
          break;
        case "select":
          Yc("invalid", t);
          break;
        case "textarea":
          (Yc("invalid", t), St(t, r.value, r.defaultValue, r.children));
      }
      (("string" != typeof (n = r.children) && "number" != typeof n && "bigint" != typeof n) ||
      t.textContent === "" + n ||
      !0 === r.suppressHydrationWarning ||
      ud(t.textContent, n)
        ? (null != r.popover && (Yc("beforetoggle", t), Yc("toggle", t)),
          null != r.onScroll && Yc("scroll", t),
          null != r.onScrollEnd && Yc("scrollend", t),
          null != r.onClick && (t.onclick = Pt),
          (t = !0))
        : (t = !1),
        t || ml(e, !0));
    }
    function yl(e) {
      for (ul = e.return; ul;)
        switch (ul.tag) {
          case 5:
          case 31:
          case 13:
            return void (pl = !1);
          case 27:
          case 3:
            return void (pl = !0);
          default:
            ul = ul.return;
        }
    }
    function vl(e) {
      if (e !== ul) return !1;
      if (!dl) return (yl(e), (dl = !0), !1);
      var t,
        n = e.tag;
      if (
        ((t = 3 !== n && 27 !== n) &&
          ((t = 5 === n) &&
            (t = !("form" !== (t = e.type) && "button" !== t) || bd(e.type, e.memoizedProps)),
          (t = !t)),
        t && cl && ml(e),
        yl(e),
        13 === n)
      ) {
        if (!(e = null === (e = e.memoizedState) ? null : e.dehydrated)) throw Error(a(317));
        cl = Od(e);
      } else if (31 === n) {
        if (!(e = null === (e = e.memoizedState) ? null : e.dehydrated)) throw Error(a(317));
        cl = Od(e);
      } else
        27 === n
          ? ((n = cl), Ed(e.type) ? ((e = Md), (Md = null), (cl = e)) : (cl = n))
          : (cl = ul ? Ad(e.stateNode.nextSibling) : null);
      return !0;
    }
    function bl() {
      ((cl = ul = null), (dl = !1));
    }
    function kl() {
      var e = fl;
      return (null !== e && (null === zu ? (zu = e) : zu.push.apply(zu, e), (fl = null)), e);
    }
    function wl(e) {
      null === fl ? (fl = [e]) : fl.push(e);
    }
    var xl = F(null),
      Sl = null,
      jl = null;
    function Cl(e, t, n) {
      (U(xl, t._currentValue), (t._currentValue = n));
    }
    function El(e) {
      ((e._currentValue = xl.current), $(xl));
    }
    function Nl(e, t, n) {
      for (; null !== e;) {
        var r = e.alternate;
        if (
          ((e.childLanes & t) === t
            ? null !== r && (r.childLanes & t) !== t && (r.childLanes |= t)
            : ((e.childLanes |= t), null !== r && (r.childLanes |= t)),
          e === n)
        )
          break;
        e = e.return;
      }
    }
    function Tl(e, t, n, r) {
      var l = e.child;
      for (null !== l && (l.return = e); null !== l;) {
        var i = l.dependencies;
        if (null !== i) {
          var o = l.child;
          i = i.firstContext;
          e: for (; null !== i;) {
            var s = i;
            i = l;
            for (var u = 0; u < t.length; u++)
              if (s.context === t[u]) {
                ((i.lanes |= n),
                  null !== (s = i.alternate) && (s.lanes |= n),
                  Nl(i.return, n, e),
                  r || (o = null));
                break e;
              }
            i = s.next;
          }
        } else if (18 === l.tag) {
          if (null === (o = l.return)) throw Error(a(341));
          ((o.lanes |= n), null !== (i = o.alternate) && (i.lanes |= n), Nl(o, n, e), (o = null));
        } else o = l.child;
        if (null !== o) o.return = l;
        else
          for (o = l; null !== o;) {
            if (o === e) {
              o = null;
              break;
            }
            if (null !== (l = o.sibling)) {
              ((l.return = o.return), (o = l));
              break;
            }
            o = o.return;
          }
        l = o;
      }
    }
    function _l(e, t, n, r) {
      e = null;
      for (var l = t, i = !1; null !== l;) {
        if (!i)
          if (524288 & l.flags) i = !0;
          else if (262144 & l.flags) break;
        if (10 === l.tag) {
          var o = l.alternate;
          if (null === o) throw Error(a(387));
          if (null !== (o = o.memoizedProps)) {
            var s = l.type;
            Jn(l.pendingProps.value, o.value) || (null === e ? (e = [s]) : e.push(s));
          }
        } else if (l === Q.current) {
          if (null === (o = l.alternate)) throw Error(a(387));
          o.memoizedState.memoizedState !== l.memoizedState.memoizedState &&
            (null === e ? (e = [df]) : e.push(df));
        }
        l = l.return;
      }
      (null !== e && Tl(t, e, n, r), (t.flags |= 262144));
    }
    function zl(e) {
      for (e = e.firstContext; null !== e;) {
        if (!Jn(e.context._currentValue, e.memoizedValue)) return !0;
        e = e.next;
      }
      return !1;
    }
    function Ll(e) {
      ((Sl = e), (jl = null), null !== (e = e.dependencies) && (e.firstContext = null));
    }
    function Pl(e) {
      return Ml(Sl, e);
    }
    function Al(e, t) {
      return (null === Sl && Ll(e), Ml(e, t));
    }
    function Ml(e, t) {
      var n = t._currentValue;
      if (((t = { context: t, memoizedValue: n, next: null }), null === jl)) {
        if (null === e) throw Error(a(308));
        ((jl = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
      } else jl = jl.next = t;
      return n;
    }
    var Ol =
        typeof AbortController < "u"
          ? AbortController
          : function () {
              var e = [],
                t = (this.signal = {
                  aborted: !1,
                  addEventListener: function (t, n) {
                    e.push(n);
                  },
                });
              this.abort = function () {
                ((t.aborted = !0),
                  e.forEach(function (e) {
                    return e();
                  }));
              };
            },
      Rl = t.unstable_scheduleCallback,
      Dl = t.unstable_NormalPriority,
      Il = {
        $$typeof: w,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function Fl() {
      return { controller: new Ol(), data: new Map(), refCount: 0 };
    }
    function $l(e) {
      (e.refCount--,
        0 === e.refCount &&
          Rl(Dl, function () {
            e.controller.abort();
          }));
    }
    var Ul = null,
      Hl = 0,
      Vl = 0,
      Wl = null;
    function Bl() {
      if (0 === --Hl && null !== Ul) {
        null !== Wl && (Wl.status = "fulfilled");
        var e = Ul;
        ((Ul = null), (Vl = 0), (Wl = null));
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    var ql = M.S;
    M.S = function (e, t) {
      ((Au = se()),
        "object" == typeof t &&
          t &&
          "function" == typeof t.then &&
          (function (e, t) {
            if (null === Ul) {
              var n = (Ul = []);
              ((Hl = 0),
                (Vl = Hc()),
                (Wl = {
                  status: "pending",
                  value: void 0,
                  then: function (e) {
                    n.push(e);
                  },
                }));
            }
            (Hl++, t.then(Bl, Bl));
          })(0, t),
        null !== ql && ql(e, t));
    };
    var Ql = F(null);
    function Gl() {
      var e = Ql.current;
      return null === e ? hu.pooledCache : e;
    }
    function Kl(e, t) {
      U(Ql, null === t ? Ql.current : t.pool);
    }
    function Yl() {
      var e = Gl();
      return null === e ? null : { parent: Il._currentValue, pool: e };
    }
    var Xl = Error(a(460)),
      Jl = Error(a(474)),
      Zl = Error(a(542)),
      ea = { then: function () {} };
    function ta(e) {
      return "fulfilled" === (e = e.status) || "rejected" === e;
    }
    function na(e, t, n) {
      switch (
        (void 0 === (n = e[n]) ? e.push(t) : n !== t && (t.then(Pt, Pt), (t = n)), t.status)
      ) {
        case "fulfilled":
          return t.value;
        case "rejected":
          throw (ia((e = t.reason)), e);
        default:
          if ("string" == typeof t.status) t.then(Pt, Pt);
          else {
            if (null !== (e = hu) && 100 < e.shellSuspendCounter) throw Error(a(482));
            (((e = t).status = "pending"),
              e.then(
                function (e) {
                  if ("pending" === t.status) {
                    var n = t;
                    ((n.status = "fulfilled"), (n.value = e));
                  }
                },
                function (e) {
                  if ("pending" === t.status) {
                    var n = t;
                    ((n.status = "rejected"), (n.reason = e));
                  }
                },
              ));
          }
          switch (t.status) {
            case "fulfilled":
              return t.value;
            case "rejected":
              throw (ia((e = t.reason)), e);
          }
          throw ((la = t), Xl);
      }
    }
    function ra(e) {
      try {
        return (0, e._init)(e._payload);
      } catch (e) {
        throw "object" == typeof e && e && "function" == typeof e.then ? ((la = e), Xl) : e;
      }
    }
    var la = null;
    function aa() {
      if (null === la) throw Error(a(459));
      var e = la;
      return ((la = null), e);
    }
    function ia(e) {
      if (e === Xl || e === Zl) throw Error(a(483));
    }
    var oa = null,
      sa = 0;
    function ua(e) {
      var t = sa;
      return ((sa += 1), null === oa && (oa = []), na(oa, e, t));
    }
    function ca(e, t) {
      ((t = t.props.ref), (e.ref = void 0 === t ? null : t));
    }
    function da(e, t) {
      throw t.$$typeof === h
        ? Error(a(525))
        : ((e = Object.prototype.toString.call(t)),
          Error(
            a(
              31,
              "[object Object]" === e ? "object with keys {" + Object.keys(t).join(", ") + "}" : e,
            ),
          ));
    }
    function fa(e) {
      function t(t, n) {
        if (e) {
          var r = t.deletions;
          null === r ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
        }
      }
      function n(n, r) {
        if (!e) return null;
        for (; null !== r;) (t(n, r), (r = r.sibling));
        return null;
      }
      function r(e) {
        for (var t = new Map(); null !== e;)
          (null === e.key ? t.set(e.index, e) : t.set(e.key, e), (e = e.sibling));
        return t;
      }
      function l(e, t) {
        return (((e = $r(e, t)).index = 0), (e.sibling = null), e);
      }
      function i(t, n, r) {
        return (
          (t.index = r),
          e
            ? null === (r = t.alternate)
              ? ((t.flags |= 67108866), n)
              : (r = r.index) < n
                ? ((t.flags |= 67108866), n)
                : r
            : ((t.flags |= 1048576), n)
        );
      }
      function o(t) {
        return (e && null === t.alternate && (t.flags |= 67108866), t);
      }
      function s(e, t, n, r) {
        return null === t || 6 !== t.tag
          ? (((t = Wr(n, e.mode, r)).return = e), t)
          : (((t = l(t, n)).return = e), t);
      }
      function u(e, t, n, r) {
        var a = n.type;
        return a === y
          ? d(e, t, n.props.children, r, n.key)
          : null !== t &&
              (t.elementType === a ||
                ("object" == typeof a && a && a.$$typeof === E && ra(a) === t.type))
            ? (ca((t = l(t, n.props)), n), (t.return = e), t)
            : (ca((t = Hr(n.type, n.key, n.props, null, e.mode, r)), n), (t.return = e), t);
      }
      function c(e, t, n, r) {
        return null === t ||
          4 !== t.tag ||
          t.stateNode.containerInfo !== n.containerInfo ||
          t.stateNode.implementation !== n.implementation
          ? (((t = qr(n, e.mode, r)).return = e), t)
          : (((t = l(t, n.children || [])).return = e), t);
      }
      function d(e, t, n, r, a) {
        return null === t || 7 !== t.tag
          ? (((t = Vr(n, e.mode, r, a)).return = e), t)
          : (((t = l(t, n)).return = e), t);
      }
      function f(e, t, n) {
        if (("string" == typeof t && "" !== t) || "number" == typeof t || "bigint" == typeof t)
          return (((t = Wr("" + t, e.mode, n)).return = e), t);
        if ("object" == typeof t && t) {
          switch (t.$$typeof) {
            case m:
              return (ca((n = Hr(t.type, t.key, t.props, null, e.mode, n)), t), (n.return = e), n);
            case g:
              return (((t = qr(t, e.mode, n)).return = e), t);
            case E:
              return f(e, (t = ra(t)), n);
          }
          if (A(t) || z(t)) return (((t = Vr(t, e.mode, n, null)).return = e), t);
          if ("function" == typeof t.then) return f(e, ua(t), n);
          if (t.$$typeof === w) return f(e, Al(e, t), n);
          da(e, t);
        }
        return null;
      }
      function p(e, t, n, r) {
        var l = null === t ? null : t.key;
        if (("string" == typeof n && "" !== n) || "number" == typeof n || "bigint" == typeof n)
          return null === l ? s(e, t, "" + n, r) : null;
        if ("object" == typeof n && n) {
          switch (n.$$typeof) {
            case m:
              return n.key === l ? u(e, t, n, r) : null;
            case g:
              return n.key === l ? c(e, t, n, r) : null;
            case E:
              return p(e, t, (n = ra(n)), r);
          }
          if (A(n) || z(n)) return null === l ? d(e, t, n, r, null) : null;
          if ("function" == typeof n.then) return p(e, t, ua(n), r);
          if (n.$$typeof === w) return p(e, t, Al(e, n), r);
          da(e, n);
        }
        return null;
      }
      function h(e, t, n, r, l) {
        if (("string" == typeof r && "" !== r) || "number" == typeof r || "bigint" == typeof r)
          return s(t, (e = e.get(n) || null), "" + r, l);
        if ("object" == typeof r && r) {
          switch (r.$$typeof) {
            case m:
              return u(t, (e = e.get(null === r.key ? n : r.key) || null), r, l);
            case g:
              return c(t, (e = e.get(null === r.key ? n : r.key) || null), r, l);
            case E:
              return h(e, t, n, (r = ra(r)), l);
          }
          if (A(r) || z(r)) return d(t, (e = e.get(n) || null), r, l, null);
          if ("function" == typeof r.then) return h(e, t, n, ua(r), l);
          if (r.$$typeof === w) return h(e, t, n, Al(t, r), l);
          da(t, r);
        }
        return null;
      }
      function v(l, a, o, s) {
        for (
          var u = null, c = null, d = a, m = (a = 0), g = null;
          null !== d && m < o.length;
          m++
        ) {
          d.index > m ? ((g = d), (d = null)) : (g = d.sibling);
          var y = p(l, d, o[m], s);
          if (null === y) {
            null === d && (d = g);
            break;
          }
          (e && d && null === y.alternate && t(l, d),
            (a = i(y, a, m)),
            null === c ? (u = y) : (c.sibling = y),
            (c = y),
            (d = g));
        }
        if (m === o.length) return (n(l, d), dl && ll(l, m), u);
        if (null === d) {
          for (; m < o.length; m++)
            null !== (d = f(l, o[m], s)) &&
              ((a = i(d, a, m)), null === c ? (u = d) : (c.sibling = d), (c = d));
          return (dl && ll(l, m), u);
        }
        for (d = r(d); m < o.length; m++)
          null !== (g = h(d, l, m, o[m], s)) &&
            (e && null !== g.alternate && d.delete(null === g.key ? m : g.key),
            (a = i(g, a, m)),
            null === c ? (u = g) : (c.sibling = g),
            (c = g));
        return (
          e &&
            d.forEach(function (e) {
              return t(l, e);
            }),
          dl && ll(l, m),
          u
        );
      }
      function b(l, o, s, u) {
        if (null == s) throw Error(a(151));
        for (
          var c = null, d = null, m = o, g = (o = 0), y = null, v = s.next();
          null !== m && !v.done;
          g++, v = s.next()
        ) {
          m.index > g ? ((y = m), (m = null)) : (y = m.sibling);
          var b = p(l, m, v.value, u);
          if (null === b) {
            null === m && (m = y);
            break;
          }
          (e && m && null === b.alternate && t(l, m),
            (o = i(b, o, g)),
            null === d ? (c = b) : (d.sibling = b),
            (d = b),
            (m = y));
        }
        if (v.done) return (n(l, m), dl && ll(l, g), c);
        if (null === m) {
          for (; !v.done; g++, v = s.next())
            null !== (v = f(l, v.value, u)) &&
              ((o = i(v, o, g)), null === d ? (c = v) : (d.sibling = v), (d = v));
          return (dl && ll(l, g), c);
        }
        for (m = r(m); !v.done; g++, v = s.next())
          null !== (v = h(m, l, g, v.value, u)) &&
            (e && null !== v.alternate && m.delete(null === v.key ? g : v.key),
            (o = i(v, o, g)),
            null === d ? (c = v) : (d.sibling = v),
            (d = v));
        return (
          e &&
            m.forEach(function (e) {
              return t(l, e);
            }),
          dl && ll(l, g),
          c
        );
      }
      function k(e, r, i, s) {
        if (
          ("object" == typeof i && i && i.type === y && null === i.key && (i = i.props.children),
          "object" == typeof i && i)
        ) {
          switch (i.$$typeof) {
            case m:
              e: {
                for (var u = i.key; null !== r;) {
                  if (r.key === u) {
                    if ((u = i.type) === y) {
                      if (7 === r.tag) {
                        (n(e, r.sibling), ((s = l(r, i.props.children)).return = e), (e = s));
                        break e;
                      }
                    } else if (
                      r.elementType === u ||
                      ("object" == typeof u && u && u.$$typeof === E && ra(u) === r.type)
                    ) {
                      (n(e, r.sibling), ca((s = l(r, i.props)), i), (s.return = e), (e = s));
                      break e;
                    }
                    n(e, r);
                    break;
                  }
                  (t(e, r), (r = r.sibling));
                }
                i.type === y
                  ? (((s = Vr(i.props.children, e.mode, s, i.key)).return = e), (e = s))
                  : (ca((s = Hr(i.type, i.key, i.props, null, e.mode, s)), i),
                    (s.return = e),
                    (e = s));
              }
              return o(e);
            case g:
              e: {
                for (u = i.key; null !== r;) {
                  if (r.key === u) {
                    if (
                      4 === r.tag &&
                      r.stateNode.containerInfo === i.containerInfo &&
                      r.stateNode.implementation === i.implementation
                    ) {
                      (n(e, r.sibling), ((s = l(r, i.children || [])).return = e), (e = s));
                      break e;
                    }
                    n(e, r);
                    break;
                  }
                  (t(e, r), (r = r.sibling));
                }
                (((s = qr(i, e.mode, s)).return = e), (e = s));
              }
              return o(e);
            case E:
              return k(e, r, (i = ra(i)), s);
          }
          if (A(i)) return v(e, r, i, s);
          if (z(i)) {
            if ("function" != typeof (u = z(i))) throw Error(a(150));
            return b(e, r, (i = u.call(i)), s);
          }
          if ("function" == typeof i.then) return k(e, r, ua(i), s);
          if (i.$$typeof === w) return k(e, r, Al(e, i), s);
          da(e, i);
        }
        return ("string" == typeof i && "" !== i) || "number" == typeof i || "bigint" == typeof i
          ? ((i = "" + i),
            null !== r && 6 === r.tag
              ? (n(e, r.sibling), ((s = l(r, i)).return = e), (e = s))
              : (n(e, r), ((s = Wr(i, e.mode, s)).return = e), (e = s)),
            o(e))
          : n(e, r);
      }
      return function (e, t, n, r) {
        try {
          sa = 0;
          var l = k(e, t, n, r);
          return ((oa = null), l);
        } catch (t) {
          if (t === Xl || t === Zl) throw t;
          var a = Ir(29, t, null, e.mode);
          return ((a.lanes = r), (a.return = e), a);
        }
      };
    }
    var pa = fa(!0),
      ha = fa(!1),
      ma = !1;
    function ga(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function ya(e, t) {
      ((e = e.updateQueue),
        t.updateQueue === e &&
          (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            callbacks: null,
          }));
    }
    function va(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function ba(e, t, n) {
      var r = e.updateQueue;
      if (null === r) return null;
      if (((r = r.shared), 2 & pu)) {
        var l = r.pending;
        return (
          null === l ? (t.next = t) : ((t.next = l.next), (l.next = t)),
          (r.pending = t),
          (t = Or(e)),
          Mr(e, null, n),
          t
        );
      }
      return (Lr(e, r, t, n), Or(e));
    }
    function ka(e, t, n) {
      if (null !== (t = t.updateQueue) && ((t = t.shared), 4194048 & n)) {
        var r = t.lanes;
        ((n |= r &= e.pendingLanes), (t.lanes = n), Me(e, n));
      }
    }
    function wa(e, t) {
      var n = e.updateQueue,
        r = e.alternate;
      if (null !== r && n === (r = r.updateQueue)) {
        var l = null,
          a = null;
        if (null !== (n = n.firstBaseUpdate)) {
          do {
            var i = { lane: n.lane, tag: n.tag, payload: n.payload, callback: null, next: null };
            (null === a ? (l = a = i) : (a = a.next = i), (n = n.next));
          } while (null !== n);
          null === a ? (l = a = t) : (a = a.next = t);
        } else l = a = t;
        return (
          (n = {
            baseState: r.baseState,
            firstBaseUpdate: l,
            lastBaseUpdate: a,
            shared: r.shared,
            callbacks: r.callbacks,
          }),
          void (e.updateQueue = n)
        );
      }
      (null === (e = n.lastBaseUpdate) ? (n.firstBaseUpdate = t) : (e.next = t),
        (n.lastBaseUpdate = t));
    }
    var xa = !1;
    function Sa() {
      if (xa) {
        if (null !== Wl) throw Wl;
      }
    }
    function ja(e, t, n, r) {
      xa = !1;
      var l = e.updateQueue;
      ma = !1;
      var a = l.firstBaseUpdate,
        i = l.lastBaseUpdate,
        o = l.shared.pending;
      if (null !== o) {
        l.shared.pending = null;
        var s = o,
          u = s.next;
        ((s.next = null), null === i ? (a = u) : (i.next = u), (i = s));
        var c = e.alternate;
        null !== c &&
          (o = (c = c.updateQueue).lastBaseUpdate) !== i &&
          (null === o ? (c.firstBaseUpdate = u) : (o.next = u), (c.lastBaseUpdate = s));
      }
      if (null !== a) {
        var d = l.baseState;
        for (i = 0, c = u = s = null, o = a; ;) {
          var f = -536870913 & o.lane,
            h = f !== o.lane;
          if (h ? (gu & f) === f : (r & f) === f) {
            (0 !== f && f === Vl && (xa = !0),
              null !== c &&
                (c = c.next =
                  { lane: 0, tag: o.tag, payload: o.payload, callback: null, next: null }));
            e: {
              var m = e,
                g = o;
              f = t;
              var y = n;
              switch (g.tag) {
                case 1:
                  if ("function" == typeof (m = g.payload)) {
                    d = m.call(y, d, f);
                    break e;
                  }
                  d = m;
                  break e;
                case 3:
                  m.flags = (-65537 & m.flags) | 128;
                case 0:
                  if (null == (f = "function" == typeof (m = g.payload) ? m.call(y, d, f) : m))
                    break e;
                  d = p({}, d, f);
                  break e;
                case 2:
                  ma = !0;
              }
            }
            null !== (f = o.callback) &&
              ((e.flags |= 64),
              h && (e.flags |= 8192),
              null === (h = l.callbacks) ? (l.callbacks = [f]) : h.push(f));
          } else
            ((h = { lane: f, tag: o.tag, payload: o.payload, callback: o.callback, next: null }),
              null === c ? ((u = c = h), (s = d)) : (c = c.next = h),
              (i |= f));
          if (null === (o = o.next)) {
            if (null === (o = l.shared.pending)) break;
            ((o = (h = o).next),
              (h.next = null),
              (l.lastBaseUpdate = h),
              (l.shared.pending = null));
          }
        }
        (null === c && (s = d),
          (l.baseState = s),
          (l.firstBaseUpdate = u),
          (l.lastBaseUpdate = c),
          null === a && (l.shared.lanes = 0),
          (ju |= i),
          (e.lanes = i),
          (e.memoizedState = d));
      }
    }
    function Ca(e, t) {
      if ("function" != typeof e) throw Error(a(191, e));
      e.call(t);
    }
    function Ea(e, t) {
      var n = e.callbacks;
      if (null !== n) for (e.callbacks = null, e = 0; e < n.length; e++) Ca(n[e], t);
    }
    var Na = F(null),
      Ta = F(0);
    function _a(e, t) {
      (U(Ta, (e = xu)), U(Na, t), (xu = e | t.baseLanes));
    }
    function za() {
      (U(Ta, xu), U(Na, Na.current));
    }
    function La() {
      ((xu = Ta.current), $(Na), $(Ta));
    }
    var Pa = F(null),
      Aa = null;
    function Ma(e) {
      var t = e.alternate;
      (U(Fa, 1 & Fa.current),
        U(Pa, e),
        null === Aa && (null === t || null !== Na.current || null !== t.memoizedState) && (Aa = e));
    }
    function Oa(e) {
      (U(Fa, Fa.current), U(Pa, e), null === Aa && (Aa = e));
    }
    function Ra(e) {
      22 === e.tag ? (U(Fa, Fa.current), U(Pa, e), null === Aa && (Aa = e)) : Da();
    }
    function Da() {
      (U(Fa, Fa.current), U(Pa, Pa.current));
    }
    function Ia(e) {
      ($(Pa), Aa === e && (Aa = null), $(Fa));
    }
    var Fa = F(0);
    function $a(e) {
      for (var t = e; null !== t;) {
        if (13 === t.tag) {
          var n = t.memoizedState;
          if (null !== n && (null === (n = n.dehydrated) || Ld(n) || Pd(n))) return t;
        } else if (
          19 !== t.tag ||
          ("forwards" !== t.memoizedProps.revealOrder &&
            "backwards" !== t.memoizedProps.revealOrder &&
            "unstable_legacy-backwards" !== t.memoizedProps.revealOrder &&
            "together" !== t.memoizedProps.revealOrder)
        ) {
          if (null !== t.child) {
            ((t.child.return = t), (t = t.child));
            continue;
          }
        } else if (128 & t.flags) return t;
        if (t === e) break;
        for (; null === t.sibling;) {
          if (null === t.return || t.return === e) return null;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
      return null;
    }
    var Ua = 0,
      Ha = null,
      Va = null,
      Wa = null,
      Ba = !1,
      qa = !1,
      Qa = !1,
      Ga = 0,
      Ka = 0,
      Ya = null,
      Xa = 0;
    function Ja() {
      throw Error(a(321));
    }
    function Za(e, t) {
      if (null === t) return !1;
      for (var n = 0; n < t.length && n < e.length; n++) if (!Jn(e[n], t[n])) return !1;
      return !0;
    }
    function ei(e, t, n, r, l, a) {
      return (
        (Ua = a),
        (Ha = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (M.H = null === e || null === e.memoizedState ? go : yo),
        (Qa = !1),
        (a = n(r, l)),
        (Qa = !1),
        qa && (a = ni(t, n, r, l)),
        ti(e),
        a
      );
    }
    function ti(e) {
      M.H = mo;
      var t = null !== Va && null !== Va.next;
      if (((Ua = 0), (Wa = Va = Ha = null), (Ba = !1), (Ka = 0), (Ya = null), t))
        throw Error(a(300));
      null === e || Ao || (null !== (e = e.dependencies) && zl(e) && (Ao = !0));
    }
    function ni(e, t, n, r) {
      Ha = e;
      var l = 0;
      do {
        if ((qa && (Ya = null), (Ka = 0), (qa = !1), 25 <= l)) throw Error(a(301));
        if (((l += 1), (Wa = Va = null), null != e.updateQueue)) {
          var i = e.updateQueue;
          ((i.lastEffect = null),
            (i.events = null),
            (i.stores = null),
            null != i.memoCache && (i.memoCache.index = 0));
        }
        ((M.H = vo), (i = t(n, r)));
      } while (qa);
      return i;
    }
    function ri() {
      var e = M.H,
        t = e.useState()[0];
      return (
        (t = "function" == typeof t.then ? ui(t) : t),
        (e = e.useState()[0]),
        (null === Va ? null : Va.memoizedState) !== e && (Ha.flags |= 1024),
        t
      );
    }
    function li() {
      var e = 0 !== Ga;
      return ((Ga = 0), e);
    }
    function ai(e, t, n) {
      ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
    }
    function ii(e) {
      if (Ba) {
        for (e = e.memoizedState; null !== e;) {
          var t = e.queue;
          (null !== t && (t.pending = null), (e = e.next));
        }
        Ba = !1;
      }
      ((Ua = 0), (Wa = Va = Ha = null), (qa = !1), (Ka = Ga = 0), (Ya = null));
    }
    function oi() {
      var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return (null === Wa ? (Ha.memoizedState = Wa = e) : (Wa = Wa.next = e), Wa);
    }
    function si() {
      if (null === Va) {
        var e = Ha.alternate;
        e = null === e ? null : e.memoizedState;
      } else e = Va.next;
      var t = null === Wa ? Ha.memoizedState : Wa.next;
      if (null !== t) ((Wa = t), (Va = e));
      else {
        if (null === e) throw null === Ha.alternate ? Error(a(467)) : Error(a(310));
        ((e = {
          memoizedState: (Va = e).memoizedState,
          baseState: Va.baseState,
          baseQueue: Va.baseQueue,
          queue: Va.queue,
          next: null,
        }),
          null === Wa ? (Ha.memoizedState = Wa = e) : (Wa = Wa.next = e));
      }
      return Wa;
    }
    function ui(e) {
      var t = Ka;
      return (
        (Ka += 1),
        null === Ya && (Ya = []),
        (e = na(Ya, e, t)),
        (t = Ha),
        null === (null === Wa ? t.memoizedState : Wa.next) &&
          ((t = t.alternate), (M.H = null === t || null === t.memoizedState ? go : yo)),
        e
      );
    }
    function ci(e) {
      if ("object" == typeof e && e) {
        if ("function" == typeof e.then) return ui(e);
        if (e.$$typeof === w) return Pl(e);
      }
      throw Error(a(438, String(e)));
    }
    function di(e) {
      var t = null,
        n = Ha.updateQueue;
      if ((null !== n && (t = n.memoCache), null == t)) {
        var r = Ha.alternate;
        null !== r &&
          null !== (r = r.updateQueue) &&
          null != (r = r.memoCache) &&
          (t = {
            data: r.data.map(function (e) {
              return e.slice();
            }),
            index: 0,
          });
      }
      if (
        (t ?? (t = { data: [], index: 0 }),
        null === n &&
          ((n = { lastEffect: null, events: null, stores: null, memoCache: null }),
          (Ha.updateQueue = n)),
        (n.memoCache = t),
        void 0 === (n = t.data[t.index]))
      )
        for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = T;
      return (t.index++, n);
    }
    function fi(e, t) {
      return "function" == typeof t ? t(e) : t;
    }
    function pi(e) {
      return hi(si(), Va, e);
    }
    function hi(e, t, n) {
      var r = e.queue;
      if (null === r) throw Error(a(311));
      r.lastRenderedReducer = n;
      var l = e.baseQueue,
        i = r.pending;
      if (null !== i) {
        if (null !== l) {
          var o = l.next;
          ((l.next = i.next), (i.next = o));
        }
        ((t.baseQueue = l = i), (r.pending = null));
      }
      if (((i = e.baseState), null === l)) e.memoizedState = i;
      else {
        var s = (o = null),
          u = null,
          c = (t = l.next),
          d = !1;
        do {
          var f = -536870913 & c.lane;
          if (f === c.lane ? (Ua & f) === f : (gu & f) === f) {
            var p = c.revertLane;
            if (0 === p)
              (null !== u &&
                (u = u.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: c.action,
                    hasEagerState: c.hasEagerState,
                    eagerState: c.eagerState,
                    next: null,
                  }),
                f === Vl && (d = !0));
            else {
              if ((Ua & p) === p) {
                ((c = c.next), p === Vl && (d = !0));
                continue;
              }
              ((f = {
                lane: 0,
                revertLane: c.revertLane,
                gesture: null,
                action: c.action,
                hasEagerState: c.hasEagerState,
                eagerState: c.eagerState,
                next: null,
              }),
                null === u ? ((s = u = f), (o = i)) : (u = u.next = f),
                (Ha.lanes |= p),
                (ju |= p));
            }
            ((f = c.action), Qa && n(i, f), (i = c.hasEagerState ? c.eagerState : n(i, f)));
          } else
            ((p = {
              lane: f,
              revertLane: c.revertLane,
              gesture: c.gesture,
              action: c.action,
              hasEagerState: c.hasEagerState,
              eagerState: c.eagerState,
              next: null,
            }),
              null === u ? ((s = u = p), (o = i)) : (u = u.next = p),
              (Ha.lanes |= f),
              (ju |= f));
          c = c.next;
        } while (null !== c && c !== t);
        if (
          (null === u ? (o = i) : (u.next = s),
          !Jn(i, e.memoizedState) && ((Ao = !0), d && null !== (n = Wl)))
        )
          throw n;
        ((e.memoizedState = i), (e.baseState = o), (e.baseQueue = u), (r.lastRenderedState = i));
      }
      return (null === l && (r.lanes = 0), [e.memoizedState, r.dispatch]);
    }
    function mi(e) {
      var t = si(),
        n = t.queue;
      if (null === n) throw Error(a(311));
      n.lastRenderedReducer = e;
      var r = n.dispatch,
        l = n.pending,
        i = t.memoizedState;
      if (null !== l) {
        n.pending = null;
        var o = (l = l.next);
        do {
          ((i = e(i, o.action)), (o = o.next));
        } while (o !== l);
        (Jn(i, t.memoizedState) || (Ao = !0),
          (t.memoizedState = i),
          null === t.baseQueue && (t.baseState = i),
          (n.lastRenderedState = i));
      }
      return [i, r];
    }
    function gi(e, t, n) {
      var r = Ha,
        l = si(),
        i = dl;
      if (i) {
        if (void 0 === n) throw Error(a(407));
        n = n();
      } else n = t();
      var o = !Jn((Va || l).memoizedState, n);
      if (
        (o && ((l.memoizedState = n), (Ao = !0)),
        (l = l.queue),
        Ui(bi.bind(null, r, l, e), [e]),
        l.getSnapshot !== t || o || (null !== Wa && 1 & Wa.memoizedState.tag))
      ) {
        if (
          ((r.flags |= 2048),
          Ri(9, { destroy: void 0 }, vi.bind(null, r, l, n, t), null),
          null === hu)
        )
          throw Error(a(349));
        i || 127 & Ua || yi(r, t, n);
      }
      return n;
    }
    function yi(e, t, n) {
      ((e.flags |= 16384),
        (e = { getSnapshot: t, value: n }),
        null === (t = Ha.updateQueue)
          ? ((t = { lastEffect: null, events: null, stores: null, memoCache: null }),
            (Ha.updateQueue = t),
            (t.stores = [e]))
          : null === (n = t.stores)
            ? (t.stores = [e])
            : n.push(e));
    }
    function vi(e, t, n, r) {
      ((t.value = n), (t.getSnapshot = r), ki(t) && wi(e));
    }
    function bi(e, t, n) {
      return n(function () {
        ki(t) && wi(e);
      });
    }
    function ki(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !Jn(e, n);
      } catch {
        return !0;
      }
    }
    function wi(e) {
      var t = Ar(e, 2);
      null !== t && Gu(t, e, 2);
    }
    function xi(e) {
      var t = oi();
      if ("function" == typeof e) {
        var n = e;
        if (((e = n()), Qa)) {
          be(!0);
          try {
            n();
          } finally {
            be(!1);
          }
        }
      }
      return (
        (t.memoizedState = t.baseState = e),
        (t.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: fi,
          lastRenderedState: e,
        }),
        t
      );
    }
    function Si(e, t, n, r) {
      return ((e.baseState = n), hi(e, Va, "function" == typeof r ? r : fi));
    }
    function ji(e, t, n, r, l) {
      if (fo(e)) throw Error(a(485));
      if (null !== (e = t.action)) {
        var i = {
          payload: l,
          action: e,
          next: null,
          isTransition: !0,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function (e) {
            i.listeners.push(e);
          },
        };
        (null === M.T ? (i.isTransition = !1) : n(!0),
          r(i),
          null === (n = t.pending)
            ? ((i.next = t.pending = i), Ci(t, i))
            : ((i.next = n.next), (t.pending = n.next = i)));
      }
    }
    function Ci(e, t) {
      var n = t.action,
        r = t.payload,
        l = e.state;
      if (t.isTransition) {
        var a = M.T,
          i = {};
        M.T = i;
        try {
          var o = n(l, r),
            s = M.S;
          (null !== s && s(i, o), Ei(e, t, o));
        } catch (n) {
          Ti(e, t, n);
        } finally {
          (null !== a && null !== i.types && (a.types = i.types), (M.T = a));
        }
      } else
        try {
          Ei(e, t, (a = n(l, r)));
        } catch (n) {
          Ti(e, t, n);
        }
    }
    function Ei(e, t, n) {
      "object" == typeof n && n && "function" == typeof n.then
        ? n.then(
            function (n) {
              Ni(e, t, n);
            },
            function (n) {
              return Ti(e, t, n);
            },
          )
        : Ni(e, t, n);
    }
    function Ni(e, t, n) {
      ((t.status = "fulfilled"),
        (t.value = n),
        _i(t),
        (e.state = n),
        null !== (t = e.pending) &&
          ((n = t.next) === t ? (e.pending = null) : ((n = n.next), (t.next = n), Ci(e, n))));
    }
    function Ti(e, t, n) {
      var r = e.pending;
      if (((e.pending = null), null !== r)) {
        r = r.next;
        do {
          ((t.status = "rejected"), (t.reason = n), _i(t), (t = t.next));
        } while (t !== r);
      }
      e.action = null;
    }
    function _i(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function zi(e, t) {
      return t;
    }
    function Li(e, t) {
      if (dl) {
        var n = hu.formState;
        if (null !== n) {
          e: {
            var r = Ha;
            if (dl) {
              if (cl) {
                t: {
                  for (var l = cl, a = pl; 8 !== l.nodeType;) {
                    if (!a) {
                      l = null;
                      break t;
                    }
                    if (null === (l = Ad(l.nextSibling))) {
                      l = null;
                      break t;
                    }
                  }
                  l = "F!" === (a = l.data) || "F" === a ? l : null;
                }
                if (l) {
                  ((cl = Ad(l.nextSibling)), (r = "F!" === l.data));
                  break e;
                }
              }
              ml(r);
            }
            r = !1;
          }
          r && (t = n[0]);
        }
      }
      return (
        ((n = oi()).memoizedState = n.baseState = t),
        (r = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: zi,
          lastRenderedState: t,
        }),
        (n.queue = r),
        (n = so.bind(null, Ha, r)),
        (r.dispatch = n),
        (r = xi(!1)),
        (a = co.bind(null, Ha, !1, r.queue)),
        (l = { state: t, dispatch: null, action: e, pending: null }),
        ((r = oi()).queue = l),
        (n = ji.bind(null, Ha, l, a, n)),
        (l.dispatch = n),
        (r.memoizedState = e),
        [t, n, !1]
      );
    }
    function Pi(e) {
      return Ai(si(), Va, e);
    }
    function Ai(e, t, n) {
      if (
        ((t = hi(e, t, zi)[0]),
        (e = pi(fi)[0]),
        "object" == typeof t && t && "function" == typeof t.then)
      )
        try {
          var r = ui(t);
        } catch (e) {
          throw e === Xl ? Zl : e;
        }
      else r = t;
      var l = (t = si()).queue,
        a = l.dispatch;
      return (
        n !== t.memoizedState &&
          ((Ha.flags |= 2048), Ri(9, { destroy: void 0 }, Mi.bind(null, l, n), null)),
        [r, a, e]
      );
    }
    function Mi(e, t) {
      e.action = t;
    }
    function Oi(e) {
      var t = si(),
        n = Va;
      if (null !== n) return Ai(t, n, e);
      (si(), (t = t.memoizedState));
      var r = (n = si()).queue.dispatch;
      return ((n.memoizedState = e), [t, r, !1]);
    }
    function Ri(e, t, n, r) {
      return (
        (e = { tag: e, create: n, deps: r, inst: t, next: null }),
        null === (t = Ha.updateQueue) &&
          ((t = { lastEffect: null, events: null, stores: null, memoCache: null }),
          (Ha.updateQueue = t)),
        null === (n = t.lastEffect)
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
        e
      );
    }
    function Di() {
      return si().memoizedState;
    }
    function Ii(e, t, n, r) {
      var l = oi();
      ((Ha.flags |= e),
        (l.memoizedState = Ri(1 | t, { destroy: void 0 }, n, void 0 === r ? null : r)));
    }
    function Fi(e, t, n, r) {
      var l = si();
      r = void 0 === r ? null : r;
      var a = l.memoizedState.inst;
      null !== Va && null !== r && Za(r, Va.memoizedState.deps)
        ? (l.memoizedState = Ri(t, a, n, r))
        : ((Ha.flags |= e), (l.memoizedState = Ri(1 | t, a, n, r)));
    }
    function $i(e, t) {
      Ii(8390656, 8, e, t);
    }
    function Ui(e, t) {
      Fi(2048, 8, e, t);
    }
    function Hi(e) {
      var t = si().memoizedState;
      return (
        (function (e) {
          Ha.flags |= 4;
          var t = Ha.updateQueue;
          if (null === t)
            ((t = { lastEffect: null, events: null, stores: null, memoCache: null }),
              (Ha.updateQueue = t),
              (t.events = [e]));
          else {
            var n = t.events;
            null === n ? (t.events = [e]) : n.push(e);
          }
        })({ ref: t, nextImpl: e }),
        function () {
          if (2 & pu) throw Error(a(440));
          return t.impl.apply(void 0, arguments);
        }
      );
    }
    function Vi(e, t) {
      return Fi(4, 2, e, t);
    }
    function Wi(e, t) {
      return Fi(4, 4, e, t);
    }
    function Bi(e, t) {
      if ("function" == typeof t) {
        e = e();
        var n = t(e);
        return function () {
          "function" == typeof n ? n() : t(null);
        };
      }
      if (null != t)
        return (
          (e = e()),
          (t.current = e),
          function () {
            t.current = null;
          }
        );
    }
    function qi(e, t, n) {
      ((n = null == n ? null : n.concat([e])), Fi(4, 4, Bi.bind(null, t, e), n));
    }
    function Qi() {}
    function Gi(e, t) {
      var n = si();
      t = void 0 === t ? null : t;
      var r = n.memoizedState;
      return null !== t && Za(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
    }
    function Ki(e, t) {
      var n = si();
      t = void 0 === t ? null : t;
      var r = n.memoizedState;
      if (null !== t && Za(t, r[1])) return r[0];
      if (((r = e()), Qa)) {
        be(!0);
        try {
          e();
        } finally {
          be(!1);
        }
      }
      return ((n.memoizedState = [r, t]), r);
    }
    function Yi(e, t, n) {
      return void 0 === n || (1073741824 & Ua && !(261930 & gu))
        ? (e.memoizedState = t)
        : ((e.memoizedState = n), (e = Qu()), (Ha.lanes |= e), (ju |= e), n);
    }
    function Xi(e, t, n, r) {
      return Jn(n, t)
        ? n
        : null === Na.current
          ? 42 & Ua && (!(1073741824 & Ua) || 261930 & gu)
            ? ((e = Qu()), (Ha.lanes |= e), (ju |= e), t)
            : ((Ao = !0), (e.memoizedState = n))
          : ((e = Yi(e, n, r)), Jn(e, t) || (Ao = !0), e);
    }
    function Ji(e, t, n, r, l) {
      var a = O.p;
      O.p = 0 !== a && 8 > a ? a : 8;
      var i = M.T,
        o = {};
      ((M.T = o), co(e, !1, t, n));
      try {
        var s = l(),
          u = M.S;
        (null !== u && u(o, s),
          "object" == typeof s && s && "function" == typeof s.then
            ? uo(
                e,
                t,
                (function (e, t) {
                  var n = [],
                    r = {
                      status: "pending",
                      value: null,
                      reason: null,
                      then: function (e) {
                        n.push(e);
                      },
                    };
                  return (
                    e.then(
                      function () {
                        ((r.status = "fulfilled"), (r.value = t));
                        for (var e = 0; e < n.length; e++) (0, n[e])(t);
                      },
                      function (e) {
                        for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++)
                          (0, n[e])(void 0);
                      },
                    ),
                    r
                  );
                })(s, r),
                qu(),
              )
            : uo(e, t, r, qu()));
      } catch (n) {
        uo(e, t, { then: function () {}, status: "rejected", reason: n }, qu());
      } finally {
        ((O.p = a), null !== i && null !== o.types && (i.types = o.types), (M.T = i));
      }
    }
    function Zi() {}
    function eo(e, t, n, r) {
      if (5 !== e.tag) throw Error(a(476));
      var l = to(e).queue;
      Ji(
        e,
        l,
        t,
        R,
        null === n
          ? Zi
          : function () {
              return (no(e), n(r));
            },
      );
    }
    function to(e) {
      var t = e.memoizedState;
      if (null !== t) return t;
      var n = {};
      return (
        ((t = {
          memoizedState: R,
          baseState: R,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: fi,
            lastRenderedState: R,
          },
          next: null,
        }).next = {
          memoizedState: n,
          baseState: n,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: fi,
            lastRenderedState: n,
          },
          next: null,
        }),
        (e.memoizedState = t),
        null !== (e = e.alternate) && (e.memoizedState = t),
        t
      );
    }
    function no(e) {
      var t = to(e);
      (null === t.next && (t = e.alternate.memoizedState), uo(e, t.next.queue, {}, qu()));
    }
    function ro() {
      return Pl(df);
    }
    function lo() {
      return si().memoizedState;
    }
    function ao() {
      return si().memoizedState;
    }
    function io(e) {
      for (var t = e.return; null !== t;) {
        switch (t.tag) {
          case 24:
          case 3:
            var n = qu(),
              r = ba(t, (e = va(n)), n);
            return (
              null !== r && (Gu(r, t, n), ka(r, t, n)),
              (t = { cache: Fl() }),
              void (e.payload = t)
            );
        }
        t = t.return;
      }
    }
    function oo(e, t, n) {
      var r = qu();
      ((n = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        fo(e) ? po(t, n) : null !== (n = Pr(e, t, n, r)) && (Gu(n, e, r), ho(n, t, r)));
    }
    function so(e, t, n) {
      uo(e, t, n, qu());
    }
    function uo(e, t, n, r) {
      var l = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (fo(e)) po(t, l);
      else {
        var a = e.alternate;
        if (0 === e.lanes && (null === a || 0 === a.lanes) && null !== (a = t.lastRenderedReducer))
          try {
            var i = t.lastRenderedState,
              o = a(i, n);
            if (((l.hasEagerState = !0), (l.eagerState = o), Jn(o, i)))
              return (Lr(e, t, l, 0), null === hu && zr(), !1);
          } catch {}
        if (null !== (n = Pr(e, t, l, r))) return (Gu(n, e, r), ho(n, t, r), !0);
      }
      return !1;
    }
    function co(e, t, n, r) {
      if (
        ((r = {
          lane: 2,
          revertLane: Hc(),
          gesture: null,
          action: r,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        fo(e))
      ) {
        if (t) throw Error(a(479));
      } else null !== (t = Pr(e, n, r, 2)) && Gu(t, e, 2);
    }
    function fo(e) {
      var t = e.alternate;
      return e === Ha || (null !== t && t === Ha);
    }
    function po(e, t) {
      qa = Ba = !0;
      var n = e.pending;
      (null === n ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t));
    }
    function ho(e, t, n) {
      if (4194048 & n) {
        var r = t.lanes;
        ((n |= r &= e.pendingLanes), (t.lanes = n), Me(e, n));
      }
    }
    var mo = {
      readContext: Pl,
      use: ci,
      useCallback: Ja,
      useContext: Ja,
      useEffect: Ja,
      useImperativeHandle: Ja,
      useLayoutEffect: Ja,
      useInsertionEffect: Ja,
      useMemo: Ja,
      useReducer: Ja,
      useRef: Ja,
      useState: Ja,
      useDebugValue: Ja,
      useDeferredValue: Ja,
      useTransition: Ja,
      useSyncExternalStore: Ja,
      useId: Ja,
      useHostTransitionStatus: Ja,
      useFormState: Ja,
      useActionState: Ja,
      useOptimistic: Ja,
      useMemoCache: Ja,
      useCacheRefresh: Ja,
    };
    mo.useEffectEvent = Ja;
    var go = {
        readContext: Pl,
        use: ci,
        useCallback: function (e, t) {
          return ((oi().memoizedState = [e, void 0 === t ? null : t]), e);
        },
        useContext: Pl,
        useEffect: $i,
        useImperativeHandle: function (e, t, n) {
          ((n = null == n ? null : n.concat([e])), Ii(4194308, 4, Bi.bind(null, t, e), n));
        },
        useLayoutEffect: function (e, t) {
          return Ii(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          Ii(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var n = oi();
          t = void 0 === t ? null : t;
          var r = e();
          if (Qa) {
            be(!0);
            try {
              e();
            } finally {
              be(!1);
            }
          }
          return ((n.memoizedState = [r, t]), r);
        },
        useReducer: function (e, t, n) {
          var r = oi();
          if (void 0 !== n) {
            var l = n(t);
            if (Qa) {
              be(!0);
              try {
                n(t);
              } finally {
                be(!1);
              }
            }
          } else l = t;
          return (
            (r.memoizedState = r.baseState = l),
            (e = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: e,
              lastRenderedState: l,
            }),
            (r.queue = e),
            (e = e.dispatch = oo.bind(null, Ha, e)),
            [r.memoizedState, e]
          );
        },
        useRef: function (e) {
          return ((e = { current: e }), (oi().memoizedState = e));
        },
        useState: function (e) {
          var t = (e = xi(e)).queue,
            n = so.bind(null, Ha, t);
          return ((t.dispatch = n), [e.memoizedState, n]);
        },
        useDebugValue: Qi,
        useDeferredValue: function (e, t) {
          return Yi(oi(), e, t);
        },
        useTransition: function () {
          var e = xi(!1);
          return ((e = Ji.bind(null, Ha, e.queue, !0, !1)), (oi().memoizedState = e), [!1, e]);
        },
        useSyncExternalStore: function (e, t, n) {
          var r = Ha,
            l = oi();
          if (dl) {
            if (void 0 === n) throw Error(a(407));
            n = n();
          } else {
            if (((n = t()), null === hu)) throw Error(a(349));
            127 & gu || yi(r, t, n);
          }
          l.memoizedState = n;
          var i = { value: n, getSnapshot: t };
          return (
            (l.queue = i),
            $i(bi.bind(null, r, i, e), [e]),
            (r.flags |= 2048),
            Ri(9, { destroy: void 0 }, vi.bind(null, r, i, n, t), null),
            n
          );
        },
        useId: function () {
          var e = oi(),
            t = hu.identifierPrefix;
          if (dl) {
            var n = rl;
            ((t = "_" + t + "R_" + (n = (nl & ~(1 << (32 - ke(nl) - 1))).toString(32) + n)),
              0 < (n = Ga++) && (t += "H" + n.toString(32)),
              (t += "_"));
          } else t = "_" + t + "r_" + (n = Xa++).toString(32) + "_";
          return (e.memoizedState = t);
        },
        useHostTransitionStatus: ro,
        useFormState: Li,
        useActionState: Li,
        useOptimistic: function (e) {
          var t = oi();
          t.memoizedState = t.baseState = e;
          var n = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return ((t.queue = n), (t = co.bind(null, Ha, !0, n)), (n.dispatch = t), [e, t]);
        },
        useMemoCache: di,
        useCacheRefresh: function () {
          return (oi().memoizedState = io.bind(null, Ha));
        },
        useEffectEvent: function (e) {
          var t = oi(),
            n = { impl: e };
          return (
            (t.memoizedState = n),
            function () {
              if (2 & pu) throw Error(a(440));
              return n.impl.apply(void 0, arguments);
            }
          );
        },
      },
      yo = {
        readContext: Pl,
        use: ci,
        useCallback: Gi,
        useContext: Pl,
        useEffect: Ui,
        useImperativeHandle: qi,
        useInsertionEffect: Vi,
        useLayoutEffect: Wi,
        useMemo: Ki,
        useReducer: pi,
        useRef: Di,
        useState: function () {
          return pi(fi);
        },
        useDebugValue: Qi,
        useDeferredValue: function (e, t) {
          return Xi(si(), Va.memoizedState, e, t);
        },
        useTransition: function () {
          var e = pi(fi)[0],
            t = si().memoizedState;
          return ["boolean" == typeof e ? e : ui(e), t];
        },
        useSyncExternalStore: gi,
        useId: lo,
        useHostTransitionStatus: ro,
        useFormState: Pi,
        useActionState: Pi,
        useOptimistic: function (e, t) {
          return Si(si(), 0, e, t);
        },
        useMemoCache: di,
        useCacheRefresh: ao,
      };
    yo.useEffectEvent = Hi;
    var vo = {
      readContext: Pl,
      use: ci,
      useCallback: Gi,
      useContext: Pl,
      useEffect: Ui,
      useImperativeHandle: qi,
      useInsertionEffect: Vi,
      useLayoutEffect: Wi,
      useMemo: Ki,
      useReducer: mi,
      useRef: Di,
      useState: function () {
        return mi(fi);
      },
      useDebugValue: Qi,
      useDeferredValue: function (e, t) {
        var n = si();
        return null === Va ? Yi(n, e, t) : Xi(n, Va.memoizedState, e, t);
      },
      useTransition: function () {
        var e = mi(fi)[0],
          t = si().memoizedState;
        return ["boolean" == typeof e ? e : ui(e), t];
      },
      useSyncExternalStore: gi,
      useId: lo,
      useHostTransitionStatus: ro,
      useFormState: Oi,
      useActionState: Oi,
      useOptimistic: function (e, t) {
        var n = si();
        return null === Va ? ((n.baseState = e), [e, n.queue.dispatch]) : Si(n, 0, e, t);
      },
      useMemoCache: di,
      useCacheRefresh: ao,
    };
    function bo(e, t, n, r) {
      ((n = null == (n = n(r, (t = e.memoizedState))) ? t : p({}, t, n)),
        (e.memoizedState = n),
        0 === e.lanes && (e.updateQueue.baseState = n));
    }
    vo.useEffectEvent = Hi;
    var ko = {
      enqueueSetState: function (e, t, n) {
        e = e._reactInternals;
        var r = qu(),
          l = va(r);
        ((l.payload = t),
          null != n && (l.callback = n),
          null !== (t = ba(e, l, r)) && (Gu(t, e, r), ka(t, e, r)));
      },
      enqueueReplaceState: function (e, t, n) {
        e = e._reactInternals;
        var r = qu(),
          l = va(r);
        ((l.tag = 1),
          (l.payload = t),
          null != n && (l.callback = n),
          null !== (t = ba(e, l, r)) && (Gu(t, e, r), ka(t, e, r)));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var n = qu(),
          r = va(n);
        ((r.tag = 2),
          null != t && (r.callback = t),
          null !== (t = ba(e, r, n)) && (Gu(t, e, n), ka(t, e, n)));
      },
    };
    function wo(e, t, n, r, l, a, i) {
      return "function" == typeof (e = e.stateNode).shouldComponentUpdate
        ? e.shouldComponentUpdate(r, a, i)
        : !t.prototype || !t.prototype.isPureReactComponent || !Zn(n, r) || !Zn(l, a);
    }
    function xo(e, t, n, r) {
      ((e = t.state),
        "function" == typeof t.componentWillReceiveProps && t.componentWillReceiveProps(n, r),
        "function" == typeof t.UNSAFE_componentWillReceiveProps &&
          t.UNSAFE_componentWillReceiveProps(n, r),
        t.state !== e && ko.enqueueReplaceState(t, t.state, null));
    }
    function So(e, t) {
      var n = t;
      if ("ref" in t) for (var r in ((n = {}), t)) "ref" !== r && (n[r] = t[r]);
      if ((e = e.defaultProps))
        for (var l in (n === t && (n = p({}, n)), e)) void 0 === n[l] && (n[l] = e[l]);
      return n;
    }
    function jo(e) {
      Er(e);
    }
    function Co(e) {
      console.error(e);
    }
    function Eo(e) {
      Er(e);
    }
    function No(e, t) {
      try {
        (0, e.onUncaughtError)(t.value, { componentStack: t.stack });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function To(e, t, n) {
      try {
        (0, e.onCaughtError)(n.value, {
          componentStack: n.stack,
          errorBoundary: 1 === t.tag ? t.stateNode : null,
        });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function _o(e, t, n) {
      return (
        ((n = va(n)).tag = 3),
        (n.payload = { element: null }),
        (n.callback = function () {
          No(e, t);
        }),
        n
      );
    }
    function zo(e) {
      return (((e = va(e)).tag = 3), e);
    }
    function Lo(e, t, n, r) {
      var l = n.type.getDerivedStateFromError;
      if ("function" == typeof l) {
        var a = r.value;
        ((e.payload = function () {
          return l(a);
        }),
          (e.callback = function () {
            To(t, n, r);
          }));
      }
      var i = n.stateNode;
      null !== i &&
        "function" == typeof i.componentDidCatch &&
        (e.callback = function () {
          (To(t, n, r),
            "function" != typeof l && (null === Ru ? (Ru = new Set([this])) : Ru.add(this)));
          var e = r.stack;
          this.componentDidCatch(r.value, { componentStack: null === e ? "" : e });
        });
    }
    var Po = Error(a(461)),
      Ao = !1;
    function Mo(e, t, n, r) {
      t.child = null === e ? ha(t, null, n, r) : pa(t, e.child, n, r);
    }
    function Oo(e, t, n, r, l) {
      n = n.render;
      var a = t.ref;
      if ("ref" in r) {
        var i = {};
        for (var o in r) "ref" !== o && (i[o] = r[o]);
      } else i = r;
      return (
        Ll(t),
        (r = ei(e, t, n, i, a, l)),
        (o = li()),
        null === e || Ao
          ? (dl && o && il(t), (t.flags |= 1), Mo(e, t, r, l), t.child)
          : (ai(e, t, l), ls(e, t, l))
      );
    }
    function Ro(e, t, n, r, l) {
      if (null === e) {
        var a = n.type;
        return "function" != typeof a || Fr(a) || void 0 !== a.defaultProps || null !== n.compare
          ? (((e = Hr(n.type, null, r, t, t.mode, l)).ref = t.ref), (e.return = t), (t.child = e))
          : ((t.tag = 15), (t.type = a), Do(e, t, a, r, l));
      }
      if (((a = e.child), !as(e, l))) {
        var i = a.memoizedProps;
        if ((n = null === (n = n.compare) ? Zn : n)(i, r) && e.ref === t.ref) return ls(e, t, l);
      }
      return ((t.flags |= 1), ((e = $r(a, r)).ref = t.ref), (e.return = t), (t.child = e));
    }
    function Do(e, t, n, r, l) {
      if (null !== e) {
        var a = e.memoizedProps;
        if (Zn(a, r) && e.ref === t.ref) {
          if (((Ao = !1), (t.pendingProps = r = a), !as(e, l)))
            return ((t.lanes = e.lanes), ls(e, t, l));
          131072 & e.flags && (Ao = !0);
        }
      }
      return Wo(e, t, n, r, l);
    }
    function Io(e, t, n, r) {
      var l = r.children,
        a = null === e ? null : e.memoizedState;
      if (
        (null === e &&
          null === t.stateNode &&
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        "hidden" === r.mode)
      ) {
        if (128 & t.flags) {
          if (((a = null === a ? n : a.baseLanes | n), null !== e)) {
            for (r = t.child = e.child, l = 0; null !== r;)
              ((l = l | r.lanes | r.childLanes), (r = r.sibling));
            r = l & ~a;
          } else ((r = 0), (t.child = null));
          return $o(e, t, a, n, r);
        }
        if (!(536870912 & n))
          return ((r = t.lanes = 536870912), $o(e, t, null === a ? n : a.baseLanes | n, n, r));
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          null !== e && Kl(0, null === a ? null : a.cachePool),
          null === a ? za() : _a(t, a),
          Ra(t));
      } else
        null === a
          ? (null !== e && Kl(0, null), za(), Da())
          : (Kl(0, a.cachePool), _a(t, a), Da(), (t.memoizedState = null));
      return (Mo(e, t, l, n), t.child);
    }
    function Fo(e, t) {
      return (
        (null !== e && 22 === e.tag) ||
          null !== t.stateNode ||
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        t.sibling
      );
    }
    function $o(e, t, n, r, l) {
      var a = Gl();
      return (
        (a = null === a ? null : { parent: Il._currentValue, pool: a }),
        (t.memoizedState = { baseLanes: n, cachePool: a }),
        null !== e && Kl(0, null),
        za(),
        Ra(t),
        null !== e && _l(e, t, r, !0),
        (t.childLanes = l),
        null
      );
    }
    function Uo(e, t) {
      return (
        ((t = Zo({ mode: t.mode, children: t.children }, e.mode)).ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function Ho(e, t, n) {
      return (
        pa(t, e.child, null, n),
        ((e = Uo(t, t.pendingProps)).flags |= 2),
        Ia(t),
        (t.memoizedState = null),
        e
      );
    }
    function Vo(e, t) {
      var n = t.ref;
      if (null === n) null !== e && null !== e.ref && (t.flags |= 4194816);
      else {
        if ("function" != typeof n && "object" != typeof n) throw Error(a(284));
        (null === e || e.ref !== n) && (t.flags |= 4194816);
      }
    }
    function Wo(e, t, n, r, l) {
      return (
        Ll(t),
        (n = ei(e, t, n, r, void 0, l)),
        (r = li()),
        null === e || Ao
          ? (dl && r && il(t), (t.flags |= 1), Mo(e, t, n, l), t.child)
          : (ai(e, t, l), ls(e, t, l))
      );
    }
    function Bo(e, t, n, r, l, a) {
      return (
        Ll(t),
        (t.updateQueue = null),
        (n = ni(t, r, n, l)),
        ti(e),
        (r = li()),
        null === e || Ao
          ? (dl && r && il(t), (t.flags |= 1), Mo(e, t, n, a), t.child)
          : (ai(e, t, a), ls(e, t, a))
      );
    }
    function qo(e, t, n, r, l) {
      if ((Ll(t), null === t.stateNode)) {
        var a = Rr,
          i = n.contextType;
        ("object" == typeof i && i && (a = Pl(i)),
          (a = new n(r, a)),
          (t.memoizedState = null !== a.state && void 0 !== a.state ? a.state : null),
          (a.updater = ko),
          (t.stateNode = a),
          (a._reactInternals = t),
          ((a = t.stateNode).props = r),
          (a.state = t.memoizedState),
          (a.refs = {}),
          ga(t),
          (i = n.contextType),
          (a.context = "object" == typeof i && i ? Pl(i) : Rr),
          (a.state = t.memoizedState),
          "function" == typeof (i = n.getDerivedStateFromProps) &&
            (bo(t, n, i, r), (a.state = t.memoizedState)),
          "function" == typeof n.getDerivedStateFromProps ||
            "function" == typeof a.getSnapshotBeforeUpdate ||
            ("function" != typeof a.UNSAFE_componentWillMount &&
              "function" != typeof a.componentWillMount) ||
            ((i = a.state),
            "function" == typeof a.componentWillMount && a.componentWillMount(),
            "function" == typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(),
            i !== a.state && ko.enqueueReplaceState(a, a.state, null),
            ja(t, r, a, l),
            Sa(),
            (a.state = t.memoizedState)),
          "function" == typeof a.componentDidMount && (t.flags |= 4194308),
          (r = !0));
      } else if (null === e) {
        a = t.stateNode;
        var o = t.memoizedProps,
          s = So(n, o);
        a.props = s;
        var u = a.context,
          c = n.contextType;
        ((i = Rr), "object" == typeof c && c && (i = Pl(c)));
        var d = n.getDerivedStateFromProps;
        ((c = "function" == typeof d || "function" == typeof a.getSnapshotBeforeUpdate),
          (o = t.pendingProps !== o),
          c ||
            ("function" != typeof a.UNSAFE_componentWillReceiveProps &&
              "function" != typeof a.componentWillReceiveProps) ||
            ((o || u !== i) && xo(t, a, r, i)),
          (ma = !1));
        var f = t.memoizedState;
        ((a.state = f),
          ja(t, r, a, l),
          Sa(),
          (u = t.memoizedState),
          o || f !== u || ma
            ? ("function" == typeof d && (bo(t, n, d, r), (u = t.memoizedState)),
              (s = ma || wo(t, n, s, r, f, u, i))
                ? (c ||
                    ("function" != typeof a.UNSAFE_componentWillMount &&
                      "function" != typeof a.componentWillMount) ||
                    ("function" == typeof a.componentWillMount && a.componentWillMount(),
                    "function" == typeof a.UNSAFE_componentWillMount &&
                      a.UNSAFE_componentWillMount()),
                  "function" == typeof a.componentDidMount && (t.flags |= 4194308))
                : ("function" == typeof a.componentDidMount && (t.flags |= 4194308),
                  (t.memoizedProps = r),
                  (t.memoizedState = u)),
              (a.props = r),
              (a.state = u),
              (a.context = i),
              (r = s))
            : ("function" == typeof a.componentDidMount && (t.flags |= 4194308), (r = !1)));
      } else {
        ((a = t.stateNode),
          ya(e, t),
          (c = So(n, (i = t.memoizedProps))),
          (a.props = c),
          (d = t.pendingProps),
          (f = a.context),
          (u = n.contextType),
          (s = Rr),
          "object" == typeof u && u && (s = Pl(u)),
          (u =
            "function" == typeof (o = n.getDerivedStateFromProps) ||
            "function" == typeof a.getSnapshotBeforeUpdate) ||
            ("function" != typeof a.UNSAFE_componentWillReceiveProps &&
              "function" != typeof a.componentWillReceiveProps) ||
            ((i !== d || f !== s) && xo(t, a, r, s)),
          (ma = !1),
          (f = t.memoizedState),
          (a.state = f),
          ja(t, r, a, l),
          Sa());
        var p = t.memoizedState;
        i !== d || f !== p || ma || (null !== e && null !== e.dependencies && zl(e.dependencies))
          ? ("function" == typeof o && (bo(t, n, o, r), (p = t.memoizedState)),
            (c =
              ma ||
              wo(t, n, c, r, f, p, s) ||
              (null !== e && null !== e.dependencies && zl(e.dependencies)))
              ? (u ||
                  ("function" != typeof a.UNSAFE_componentWillUpdate &&
                    "function" != typeof a.componentWillUpdate) ||
                  ("function" == typeof a.componentWillUpdate && a.componentWillUpdate(r, p, s),
                  "function" == typeof a.UNSAFE_componentWillUpdate &&
                    a.UNSAFE_componentWillUpdate(r, p, s)),
                "function" == typeof a.componentDidUpdate && (t.flags |= 4),
                "function" == typeof a.getSnapshotBeforeUpdate && (t.flags |= 1024))
              : ("function" != typeof a.componentDidUpdate ||
                  (i === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                "function" != typeof a.getSnapshotBeforeUpdate ||
                  (i === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = r),
                (t.memoizedState = p)),
            (a.props = r),
            (a.state = p),
            (a.context = s),
            (r = c))
          : ("function" != typeof a.componentDidUpdate ||
              (i === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            "function" != typeof a.getSnapshotBeforeUpdate ||
              (i === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (r = !1));
      }
      return (
        (a = r),
        Vo(e, t),
        (r = !!(128 & t.flags)),
        a || r
          ? ((a = t.stateNode),
            (n = r && "function" != typeof n.getDerivedStateFromError ? null : a.render()),
            (t.flags |= 1),
            null !== e && r
              ? ((t.child = pa(t, e.child, null, l)), (t.child = pa(t, null, n, l)))
              : Mo(e, t, n, l),
            (t.memoizedState = a.state),
            (e = t.child))
          : (e = ls(e, t, l)),
        e
      );
    }
    function Qo(e, t, n, r) {
      return (bl(), (t.flags |= 256), Mo(e, t, n, r), t.child);
    }
    var Go = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
    function Ko(e) {
      return { baseLanes: e, cachePool: Yl() };
    }
    function Yo(e, t, n) {
      return ((e = null === e ? 0 : e.childLanes & ~n), t && (e |= Nu), e);
    }
    function Xo(e, t, n) {
      var r,
        l = t.pendingProps,
        i = !1,
        o = !!(128 & t.flags);
      if (
        ((r = o) || (r = (null === e || null !== e.memoizedState) && !!(2 & Fa.current)),
        r && ((i = !0), (t.flags &= -129)),
        (r = !!(32 & t.flags)),
        (t.flags &= -33),
        null === e)
      ) {
        if (dl) {
          if (
            (i ? Ma(t) : Da(),
            (e = cl)
              ? null !== (e = null !== (e = zd(e, pl)) && "&" !== e.data ? e : null) &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: null === tl ? null : { id: nl, overflow: rl },
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                ((n = Br(e)).return = t),
                (t.child = n),
                (ul = t),
                (cl = null))
              : (e = null),
            null === e)
          )
            throw ml(t);
          return (Pd(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
        }
        var s = l.children;
        return (
          (l = l.fallback),
          i
            ? (Da(),
              (s = Zo({ mode: "hidden", children: s }, (i = t.mode))),
              (l = Vr(l, i, n, null)),
              (s.return = t),
              (l.return = t),
              (s.sibling = l),
              (t.child = s),
              ((l = t.child).memoizedState = Ko(n)),
              (l.childLanes = Yo(e, r, n)),
              (t.memoizedState = Go),
              Fo(null, l))
            : (Ma(t), Jo(t, s))
        );
      }
      var u = e.memoizedState;
      if (null !== u && null !== (s = u.dehydrated)) {
        if (o)
          256 & t.flags
            ? (Ma(t), (t.flags &= -257), (t = es(e, t, n)))
            : null === t.memoizedState
              ? (Da(),
                (s = l.fallback),
                (i = t.mode),
                (l = Zo({ mode: "visible", children: l.children }, i)),
                ((s = Vr(s, i, n, null)).flags |= 2),
                (l.return = t),
                (s.return = t),
                (l.sibling = s),
                (t.child = l),
                pa(t, e.child, null, n),
                ((l = t.child).memoizedState = Ko(n)),
                (l.childLanes = Yo(e, r, n)),
                (t.memoizedState = Go),
                (t = Fo(null, l)))
              : (Da(), (t.child = e.child), (t.flags |= 128), (t = null));
        else if ((Ma(t), Pd(s))) {
          if ((r = s.nextSibling && s.nextSibling.dataset)) var c = r.dgst;
          ((r = c),
            ((l = Error(a(419))).stack = ""),
            (l.digest = r),
            wl({ value: l, source: null, stack: null }),
            (t = es(e, t, n)));
        } else if ((Ao || _l(e, t, n, !1), (r = 0 !== (n & e.childLanes)), Ao || r)) {
          if (null !== (r = hu) && 0 !== (l = Oe(r, n)) && l !== u.retryLane)
            throw ((u.retryLane = l), Ar(e, l), Gu(r, e, l), Po);
          (Ld(s) || ic(), (t = es(e, t, n)));
        } else
          Ld(s)
            ? ((t.flags |= 192), (t.child = e.child), (t = null))
            : ((e = u.treeContext),
              (cl = Ad(s.nextSibling)),
              (ul = t),
              (dl = !0),
              (fl = null),
              (pl = !1),
              null !== e && sl(t, e),
              ((t = Jo(t, l.children)).flags |= 4096));
        return t;
      }
      return i
        ? (Da(),
          (s = l.fallback),
          (i = t.mode),
          (c = (u = e.child).sibling),
          ((l = $r(u, { mode: "hidden", children: l.children })).subtreeFlags =
            65011712 & u.subtreeFlags),
          null === c ? ((s = Vr(s, i, n, null)).flags |= 2) : (s = $r(c, s)),
          (s.return = t),
          (l.return = t),
          (l.sibling = s),
          (t.child = l),
          Fo(null, l),
          (l = t.child),
          null === (s = e.child.memoizedState)
            ? (s = Ko(n))
            : (null === (i = s.cachePool)
                ? (i = Yl())
                : ((u = Il._currentValue), (i = i.parent === u ? i : { parent: u, pool: u })),
              (s = { baseLanes: s.baseLanes | n, cachePool: i })),
          (l.memoizedState = s),
          (l.childLanes = Yo(e, r, n)),
          (t.memoizedState = Go),
          Fo(e.child, l))
        : (Ma(t),
          (e = (n = e.child).sibling),
          ((n = $r(n, { mode: "visible", children: l.children })).return = t),
          (n.sibling = null),
          null !== e &&
            (null === (r = t.deletions) ? ((t.deletions = [e]), (t.flags |= 16)) : r.push(e)),
          (t.child = n),
          (t.memoizedState = null),
          n);
    }
    function Jo(e, t) {
      return (((t = Zo({ mode: "visible", children: t }, e.mode)).return = e), (e.child = t));
    }
    function Zo(e, t) {
      return (((e = Ir(22, e, null, t)).lanes = 0), e);
    }
    function es(e, t, n) {
      return (
        pa(t, e.child, null, n),
        ((e = Jo(t, t.pendingProps.children)).flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function ts(e, t, n) {
      e.lanes |= t;
      var r = e.alternate;
      (null !== r && (r.lanes |= t), Nl(e.return, t, n));
    }
    function ns(e, t, n, r, l, a) {
      var i = e.memoizedState;
      null === i
        ? (e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: n,
            tailMode: l,
            treeForkCount: a,
          })
        : ((i.isBackwards = t),
          (i.rendering = null),
          (i.renderingStartTime = 0),
          (i.last = r),
          (i.tail = n),
          (i.tailMode = l),
          (i.treeForkCount = a));
    }
    function rs(e, t, n) {
      var r = t.pendingProps,
        l = r.revealOrder,
        a = r.tail;
      r = r.children;
      var i = Fa.current,
        o = !!(2 & i);
      if (
        (o ? ((i = (1 & i) | 2), (t.flags |= 128)) : (i &= 1),
        U(Fa, i),
        Mo(e, t, r, n),
        (r = dl ? Jr : 0),
        !o && null !== e && 128 & e.flags)
      )
        e: for (e = t.child; null !== e;) {
          if (13 === e.tag) null !== e.memoizedState && ts(e, n, t);
          else if (19 === e.tag) ts(e, n, t);
          else if (null !== e.child) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break e;
          for (; null === e.sibling;) {
            if (null === e.return || e.return === t) break e;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      switch (l) {
        case "forwards":
          for (n = t.child, l = null; null !== n;)
            (null !== (e = n.alternate) && null === $a(e) && (l = n), (n = n.sibling));
          (null === (n = l)
            ? ((l = t.child), (t.child = null))
            : ((l = n.sibling), (n.sibling = null)),
            ns(t, !1, l, n, a, r));
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (n = null, l = t.child, t.child = null; null !== l;) {
            if (null !== (e = l.alternate) && null === $a(e)) {
              t.child = l;
              break;
            }
            ((e = l.sibling), (l.sibling = n), (n = l), (l = e));
          }
          ns(t, !0, n, null, a, r);
          break;
        case "together":
          ns(t, !1, null, null, void 0, r);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function ls(e, t, n) {
      if (
        (null !== e && (t.dependencies = e.dependencies), (ju |= t.lanes), 0 === (n & t.childLanes))
      ) {
        if (null === e) return null;
        if ((_l(e, t, n, !1), 0 === (n & t.childLanes))) return null;
      }
      if (null !== e && t.child !== e.child) throw Error(a(153));
      if (null !== t.child) {
        for (n = $r((e = t.child), e.pendingProps), t.child = n, n.return = t; null !== e.sibling;)
          ((e = e.sibling), ((n = n.sibling = $r(e, e.pendingProps)).return = t));
        n.sibling = null;
      }
      return t.child;
    }
    function as(e, t) {
      return 0 !== (e.lanes & t) || !(null === (e = e.dependencies) || !zl(e));
    }
    function is(e, t, n) {
      if (null !== e)
        if (e.memoizedProps !== t.pendingProps) Ao = !0;
        else {
          if (!(as(e, n) || 128 & t.flags))
            return (
              (Ao = !1),
              (function (e, t, n) {
                switch (t.tag) {
                  case 3:
                    (G(t, t.stateNode.containerInfo), Cl(0, Il, e.memoizedState.cache), bl());
                    break;
                  case 27:
                  case 5:
                    Y(t);
                    break;
                  case 4:
                    G(t, t.stateNode.containerInfo);
                    break;
                  case 10:
                    Cl(0, t.type, t.memoizedProps.value);
                    break;
                  case 31:
                    if (null !== t.memoizedState) return ((t.flags |= 128), Oa(t), null);
                    break;
                  case 13:
                    var r = t.memoizedState;
                    if (null !== r)
                      return null === r.dehydrated
                        ? 0 === (n & t.child.childLanes)
                          ? (Ma(t), null === (e = ls(e, t, n)) ? null : e.sibling)
                          : Xo(e, t, n)
                        : (Ma(t), (t.flags |= 128), null);
                    Ma(t);
                    break;
                  case 19:
                    var l = !!(128 & e.flags);
                    if (
                      ((r = 0 !== (n & t.childLanes)) ||
                        (_l(e, t, n, !1), (r = 0 !== (n & t.childLanes))),
                      l)
                    ) {
                      if (r) return rs(e, t, n);
                      t.flags |= 128;
                    }
                    if (
                      (null !== (l = t.memoizedState) &&
                        ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
                      U(Fa, Fa.current),
                      r)
                    )
                      break;
                    return null;
                  case 22:
                    return ((t.lanes = 0), Io(e, t, n, t.pendingProps));
                  case 24:
                    Cl(0, Il, e.memoizedState.cache);
                }
                return ls(e, t, n);
              })(e, t, n)
            );
          Ao = !!(131072 & e.flags);
        }
      else ((Ao = !1), dl && 1048576 & t.flags && al(t, Jr, t.index));
      switch (((t.lanes = 0), t.tag)) {
        case 16:
          e: {
            var r = t.pendingProps;
            if (((e = ra(t.elementType)), (t.type = e), "function" != typeof e)) {
              if (null != e) {
                var l = e.$$typeof;
                if (l === x) {
                  ((t.tag = 11), (t = Oo(null, t, e, r, n)));
                  break e;
                }
                if (l === C) {
                  ((t.tag = 14), (t = Ro(null, t, e, r, n)));
                  break e;
                }
              }
              throw ((t = P(e) || e), Error(a(306, t, "")));
            }
            Fr(e)
              ? ((r = So(e, r)), (t.tag = 1), (t = qo(null, t, e, r, n)))
              : ((t.tag = 0), (t = Wo(null, t, e, r, n)));
          }
          return t;
        case 0:
          return Wo(e, t, t.type, t.pendingProps, n);
        case 1:
          return qo(e, t, (r = t.type), (l = So(r, t.pendingProps)), n);
        case 3:
          e: {
            if ((G(t, t.stateNode.containerInfo), null === e)) throw Error(a(387));
            r = t.pendingProps;
            var i = t.memoizedState;
            ((l = i.element), ya(e, t), ja(t, r, null, n));
            var o = t.memoizedState;
            if (
              ((r = o.cache),
              Cl(0, Il, r),
              r !== i.cache && Tl(t, [Il], n, !0),
              Sa(),
              (r = o.element),
              i.isDehydrated)
            ) {
              if (
                ((i = { element: r, isDehydrated: !1, cache: o.cache }),
                (t.updateQueue.baseState = i),
                (t.memoizedState = i),
                256 & t.flags)
              ) {
                t = Qo(e, t, r, n);
                break e;
              }
              if (r !== l) {
                (wl((l = Gr(Error(a(424)), t))), (t = Qo(e, t, r, n)));
                break e;
              }
              if (9 === (e = t.stateNode.containerInfo).nodeType) e = e.body;
              else e = "HTML" === e.nodeName ? e.ownerDocument.body : e;
              for (
                cl = Ad(e.firstChild),
                  ul = t,
                  dl = !0,
                  fl = null,
                  pl = !0,
                  n = ha(t, null, r, n),
                  t.child = n;
                n;
              )
                ((n.flags = (-3 & n.flags) | 4096), (n = n.sibling));
            } else {
              if ((bl(), r === l)) {
                t = ls(e, t, n);
                break e;
              }
              Mo(e, t, r, n);
            }
            t = t.child;
          }
          return t;
        case 26:
          return (
            Vo(e, t),
            null === e
              ? (n = Bd(t.type, null, t.pendingProps, null))
                ? (t.memoizedState = n)
                : dl ||
                  ((n = t.type),
                  (e = t.pendingProps),
                  ((r = gd(q.current).createElement(n))[Ue] = t),
                  (r[He] = e),
                  fd(r, n, e),
                  et(r),
                  (t.stateNode = r))
              : (t.memoizedState = Bd(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
            null
          );
        case 27:
          return (
            Y(t),
            null === e &&
              dl &&
              ((r = t.stateNode = Dd(t.type, t.pendingProps, q.current)),
              (ul = t),
              (pl = !0),
              (l = cl),
              Ed(t.type) ? ((Md = l), (cl = Ad(r.firstChild))) : (cl = l)),
            Mo(e, t, t.pendingProps.children, n),
            Vo(e, t),
            null === e && (t.flags |= 4194304),
            t.child
          );
        case 5:
          return (
            null === e &&
              dl &&
              ((l = r = cl) &&
                ((r = (function (e, t, n, r) {
                  for (; 1 === e.nodeType;) {
                    var l = n;
                    if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
                      if (!r && ("INPUT" !== e.nodeName || "hidden" !== e.type)) break;
                    } else if (r) {
                      if (!e[Ge])
                        switch (t) {
                          case "meta":
                            if (!e.hasAttribute("itemprop")) break;
                            return e;
                          case "link":
                            if (
                              ("stylesheet" === (a = e.getAttribute("rel")) &&
                                e.hasAttribute("data-precedence")) ||
                              a !== l.rel ||
                              e.getAttribute("href") !==
                                (null == l.href || "" === l.href ? null : l.href) ||
                              e.getAttribute("crossorigin") !==
                                (null == l.crossOrigin ? null : l.crossOrigin) ||
                              e.getAttribute("title") !== (null == l.title ? null : l.title)
                            )
                              break;
                            return e;
                          case "style":
                            if (e.hasAttribute("data-precedence")) break;
                            return e;
                          case "script":
                            if (
                              ((a = e.getAttribute("src")) !== (null == l.src ? null : l.src) ||
                                e.getAttribute("type") !== (null == l.type ? null : l.type) ||
                                e.getAttribute("crossorigin") !==
                                  (null == l.crossOrigin ? null : l.crossOrigin)) &&
                              a &&
                              e.hasAttribute("async") &&
                              !e.hasAttribute("itemprop")
                            )
                              break;
                            return e;
                          default:
                            return e;
                        }
                    } else {
                      if ("input" !== t || "hidden" !== e.type) return e;
                      var a = null == l.name ? null : "" + l.name;
                      if ("hidden" === l.type && e.getAttribute("name") === a) return e;
                    }
                    if (null === (e = Ad(e.nextSibling))) break;
                  }
                  return null;
                })(r, t.type, t.pendingProps, pl)),
                null === r
                  ? (l = !1)
                  : ((t.stateNode = r), (ul = t), (cl = Ad(r.firstChild)), (pl = !1), (l = !0))),
              l || ml(t)),
            Y(t),
            (l = t.type),
            (i = t.pendingProps),
            (o = null === e ? null : e.memoizedProps),
            (r = i.children),
            bd(l, i) ? (r = null) : null !== o && bd(l, o) && (t.flags |= 32),
            null !== t.memoizedState && ((l = ei(e, t, ri, null, null, n)), (df._currentValue = l)),
            Vo(e, t),
            Mo(e, t, r, n),
            t.child
          );
        case 6:
          return (
            null === e &&
              dl &&
              ((e = n = cl) &&
                ((n = (function (e, t, n) {
                  if ("" === t) return null;
                  for (; 3 !== e.nodeType;)
                    if (
                      ((1 !== e.nodeType || "INPUT" !== e.nodeName || "hidden" !== e.type) && !n) ||
                      null === (e = Ad(e.nextSibling))
                    )
                      return null;
                  return e;
                })(n, t.pendingProps, pl)),
                null === n ? (e = !1) : ((t.stateNode = n), (ul = t), (cl = null), (e = !0))),
              e || ml(t)),
            null
          );
        case 13:
          return Xo(e, t, n);
        case 4:
          return (
            G(t, t.stateNode.containerInfo),
            (r = t.pendingProps),
            null === e ? (t.child = pa(t, null, r, n)) : Mo(e, t, r, n),
            t.child
          );
        case 11:
          return Oo(e, t, t.type, t.pendingProps, n);
        case 7:
          return (Mo(e, t, t.pendingProps, n), t.child);
        case 8:
        case 12:
          return (Mo(e, t, t.pendingProps.children, n), t.child);
        case 10:
          return ((r = t.pendingProps), Cl(0, t.type, r.value), Mo(e, t, r.children, n), t.child);
        case 9:
          return (
            (l = t.type._context),
            (r = t.pendingProps.children),
            Ll(t),
            (r = r((l = Pl(l)))),
            (t.flags |= 1),
            Mo(e, t, r, n),
            t.child
          );
        case 14:
          return Ro(e, t, t.type, t.pendingProps, n);
        case 15:
          return Do(e, t, t.type, t.pendingProps, n);
        case 19:
          return rs(e, t, n);
        case 31:
          return (function (e, t, n) {
            var r = t.pendingProps,
              l = !!(128 & t.flags);
            if (((t.flags &= -129), null === e)) {
              if (dl) {
                if ("hidden" === r.mode)
                  return ((e = Uo(t, r)), (t.lanes = 536870912), Fo(null, e));
                if (
                  (Oa(t),
                  (e = cl)
                    ? null !== (e = null !== (e = zd(e, pl)) && "&" === e.data ? e : null) &&
                      ((t.memoizedState = {
                        dehydrated: e,
                        treeContext: null === tl ? null : { id: nl, overflow: rl },
                        retryLane: 536870912,
                        hydrationErrors: null,
                      }),
                      ((n = Br(e)).return = t),
                      (t.child = n),
                      (ul = t),
                      (cl = null))
                    : (e = null),
                  null === e)
                )
                  throw ml(t);
                return ((t.lanes = 536870912), null);
              }
              return Uo(t, r);
            }
            var i = e.memoizedState;
            if (null !== i) {
              var o = i.dehydrated;
              if ((Oa(t), l))
                if (256 & t.flags) ((t.flags &= -257), (t = Ho(e, t, n)));
                else {
                  if (null === t.memoizedState) throw Error(a(558));
                  ((t.child = e.child), (t.flags |= 128), (t = null));
                }
              else if ((Ao || _l(e, t, n, !1), (l = 0 !== (n & e.childLanes)), Ao || l)) {
                if (null !== (r = hu) && 0 !== (o = Oe(r, n)) && o !== i.retryLane)
                  throw ((i.retryLane = o), Ar(e, o), Gu(r, e, o), Po);
                (ic(), (t = Ho(e, t, n)));
              } else
                ((e = i.treeContext),
                  (cl = Ad(o.nextSibling)),
                  (ul = t),
                  (dl = !0),
                  (fl = null),
                  (pl = !1),
                  null !== e && sl(t, e),
                  ((t = Uo(t, r)).flags |= 4096));
              return t;
            }
            return (
              ((e = $r(e.child, { mode: r.mode, children: r.children })).ref = t.ref),
              (t.child = e),
              (e.return = t),
              e
            );
          })(e, t, n);
        case 22:
          return Io(e, t, n, t.pendingProps);
        case 24:
          return (
            Ll(t),
            (r = Pl(Il)),
            null === e
              ? (null === (l = Gl()) &&
                  ((l = hu),
                  (i = Fl()),
                  (l.pooledCache = i),
                  i.refCount++,
                  null !== i && (l.pooledCacheLanes |= n),
                  (l = i)),
                (t.memoizedState = { parent: r, cache: l }),
                ga(t),
                Cl(0, Il, l))
              : (0 !== (e.lanes & n) && (ya(e, t), ja(t, null, null, n), Sa()),
                (l = e.memoizedState),
                (i = t.memoizedState),
                l.parent === r
                  ? ((r = i.cache), Cl(0, Il, r), r !== l.cache && Tl(t, [Il], n, !0))
                  : ((l = { parent: r, cache: r }),
                    (t.memoizedState = l),
                    0 === t.lanes && (t.memoizedState = t.updateQueue.baseState = l),
                    Cl(0, Il, r))),
            Mo(e, t, t.pendingProps.children, n),
            t.child
          );
        case 29:
          throw t.pendingProps;
      }
      throw Error(a(156, t.tag));
    }
    function os(e) {
      e.flags |= 4;
    }
    function ss(e, t, n, r, l) {
      if (((t = !!(32 & e.mode)) && (t = !1), t)) {
        if (((e.flags |= 16777216), (335544128 & l) === l))
          if (e.stateNode.complete) e.flags |= 8192;
          else {
            if (!rc()) throw ((la = ea), Jl);
            e.flags |= 8192;
          }
      } else e.flags &= -16777217;
    }
    function us(e, t) {
      if ("stylesheet" !== t.type || 4 & t.state.loading) e.flags &= -16777217;
      else if (((e.flags |= 16777216), !lf(t))) {
        if (!rc()) throw ((la = ea), Jl);
        e.flags |= 8192;
      }
    }
    function cs(e, t) {
      (null !== t && (e.flags |= 4),
        16384 & e.flags && ((t = 22 === e.tag ? 536870912 : ze()), (e.lanes |= t), (Tu |= t)));
    }
    function ds(e, t) {
      if (!dl)
        switch (e.tailMode) {
          case "hidden":
            t = e.tail;
            for (var n = null; null !== t;) (null !== t.alternate && (n = t), (t = t.sibling));
            null === n ? (e.tail = null) : (n.sibling = null);
            break;
          case "collapsed":
            n = e.tail;
            for (var r = null; null !== n;) (null !== n.alternate && (r = n), (n = n.sibling));
            null === r
              ? t || null === e.tail
                ? (e.tail = null)
                : (e.tail.sibling = null)
              : (r.sibling = null);
        }
    }
    function fs(e) {
      var t = null !== e.alternate && e.alternate.child === e.child,
        n = 0,
        r = 0;
      if (t)
        for (var l = e.child; null !== l;)
          ((n |= l.lanes | l.childLanes),
            (r |= 65011712 & l.subtreeFlags),
            (r |= 65011712 & l.flags),
            (l.return = e),
            (l = l.sibling));
      else
        for (l = e.child; null !== l;)
          ((n |= l.lanes | l.childLanes),
            (r |= l.subtreeFlags),
            (r |= l.flags),
            (l.return = e),
            (l = l.sibling));
      return ((e.subtreeFlags |= r), (e.childLanes = n), t);
    }
    function ps(e, t, n) {
      var r = t.pendingProps;
      switch ((ol(t), t.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
        case 1:
          return (fs(t), null);
        case 3:
          return (
            (n = t.stateNode),
            (r = null),
            null !== e && (r = e.memoizedState.cache),
            t.memoizedState.cache !== r && (t.flags |= 2048),
            El(Il),
            K(),
            n.pendingContext && ((n.context = n.pendingContext), (n.pendingContext = null)),
            (null === e || null === e.child) &&
              (vl(t)
                ? os(t)
                : null === e ||
                  (e.memoizedState.isDehydrated && !(256 & t.flags)) ||
                  ((t.flags |= 1024), kl())),
            fs(t),
            null
          );
        case 26:
          var l = t.type,
            i = t.memoizedState;
          return (
            null === e
              ? (os(t), null === i ? (fs(t), ss(t, l, 0, 0, n)) : (fs(t), us(t, i)))
              : i
                ? i === e.memoizedState
                  ? (fs(t), (t.flags &= -16777217))
                  : (os(t), fs(t), us(t, i))
                : ((e = e.memoizedProps) !== r && os(t), fs(t), ss(t, l, 0, 0, n)),
            null
          );
        case 27:
          if ((X(t), (n = q.current), (l = t.type), null !== e && null != t.stateNode))
            e.memoizedProps !== r && os(t);
          else {
            if (!r) {
              if (null === t.stateNode) throw Error(a(166));
              return (fs(t), null);
            }
            ((e = W.current), vl(t) ? gl(t) : ((e = Dd(l, r, n)), (t.stateNode = e), os(t)));
          }
          return (fs(t), null);
        case 5:
          if ((X(t), (l = t.type), null !== e && null != t.stateNode))
            e.memoizedProps !== r && os(t);
          else {
            if (!r) {
              if (null === t.stateNode) throw Error(a(166));
              return (fs(t), null);
            }
            if (((i = W.current), vl(t))) gl(t);
            else {
              var o = gd(q.current);
              switch (i) {
                case 1:
                  i = o.createElementNS("http://www.w3.org/2000/svg", l);
                  break;
                case 2:
                  i = o.createElementNS("http://www.w3.org/1998/Math/MathML", l);
                  break;
                default:
                  switch (l) {
                    case "svg":
                      i = o.createElementNS("http://www.w3.org/2000/svg", l);
                      break;
                    case "math":
                      i = o.createElementNS("http://www.w3.org/1998/Math/MathML", l);
                      break;
                    case "script":
                      (((i = o.createElement("div")).innerHTML = "<script><\/script>"),
                        (i = i.removeChild(i.firstChild)));
                      break;
                    case "select":
                      ((i =
                        "string" == typeof r.is
                          ? o.createElement("select", { is: r.is })
                          : o.createElement("select")),
                        r.multiple ? (i.multiple = !0) : r.size && (i.size = r.size));
                      break;
                    default:
                      i =
                        "string" == typeof r.is
                          ? o.createElement(l, { is: r.is })
                          : o.createElement(l);
                  }
              }
              ((i[Ue] = t), (i[He] = r));
              e: for (o = t.child; null !== o;) {
                if (5 === o.tag || 6 === o.tag) i.appendChild(o.stateNode);
                else if (4 !== o.tag && 27 !== o.tag && null !== o.child) {
                  ((o.child.return = o), (o = o.child));
                  continue;
                }
                if (o === t) break e;
                for (; null === o.sibling;) {
                  if (null === o.return || o.return === t) break e;
                  o = o.return;
                }
                ((o.sibling.return = o.return), (o = o.sibling));
              }
              t.stateNode = i;
              e: switch ((fd(i, l, r), l)) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
              r && os(t);
            }
          }
          return (fs(t), ss(t, t.type, null === e || e.memoizedProps, t.pendingProps, n), null);
        case 6:
          if (e && null != t.stateNode) e.memoizedProps !== r && os(t);
          else {
            if ("string" != typeof r && null === t.stateNode) throw Error(a(166));
            if (((e = q.current), vl(t))) {
              if (((e = t.stateNode), (n = t.memoizedProps), (r = null), null !== (l = ul)))
                switch (l.tag) {
                  case 27:
                  case 5:
                    r = l.memoizedProps;
                }
              ((e[Ue] = t),
                (e = !!(
                  e.nodeValue === n ||
                  (null !== r && !0 === r.suppressHydrationWarning) ||
                  ud(e.nodeValue, n)
                )) || ml(t, !0));
            } else (((e = gd(e).createTextNode(r))[Ue] = t), (t.stateNode = e));
          }
          return (fs(t), null);
        case 31:
          if (((n = t.memoizedState), null === e || null !== e.memoizedState)) {
            if (((r = vl(t)), null !== n)) {
              if (null === e) {
                if (!r) throw Error(a(318));
                if (!(e = null === (e = t.memoizedState) ? null : e.dehydrated))
                  throw Error(a(557));
                e[Ue] = t;
              } else (bl(), !(128 & t.flags) && (t.memoizedState = null), (t.flags |= 4));
              (fs(t), (e = !1));
            } else
              ((n = kl()),
                null !== e && null !== e.memoizedState && (e.memoizedState.hydrationErrors = n),
                (e = !0));
            if (!e) return 256 & t.flags ? (Ia(t), t) : (Ia(t), null);
            if (128 & t.flags) throw Error(a(558));
          }
          return (fs(t), null);
        case 13:
          if (
            ((r = t.memoizedState),
            null === e || (null !== e.memoizedState && null !== e.memoizedState.dehydrated))
          ) {
            if (((l = vl(t)), null !== r && null !== r.dehydrated)) {
              if (null === e) {
                if (!l) throw Error(a(318));
                if (!(l = null === (l = t.memoizedState) ? null : l.dehydrated))
                  throw Error(a(317));
                l[Ue] = t;
              } else (bl(), !(128 & t.flags) && (t.memoizedState = null), (t.flags |= 4));
              (fs(t), (l = !1));
            } else
              ((l = kl()),
                null !== e && null !== e.memoizedState && (e.memoizedState.hydrationErrors = l),
                (l = !0));
            if (!l) return 256 & t.flags ? (Ia(t), t) : (Ia(t), null);
          }
          return (
            Ia(t),
            128 & t.flags
              ? ((t.lanes = n), t)
              : ((n = null !== r),
                (e = null !== e && null !== e.memoizedState),
                n &&
                  ((l = null),
                  null !== (r = t.child).alternate &&
                    null !== r.alternate.memoizedState &&
                    null !== r.alternate.memoizedState.cachePool &&
                    (l = r.alternate.memoizedState.cachePool.pool),
                  (i = null),
                  null !== r.memoizedState &&
                    null !== r.memoizedState.cachePool &&
                    (i = r.memoizedState.cachePool.pool),
                  i !== l && (r.flags |= 2048)),
                n !== e && n && (t.child.flags |= 8192),
                cs(t, t.updateQueue),
                fs(t),
                null)
          );
        case 4:
          return (K(), null === e && Zc(t.stateNode.containerInfo), fs(t), null);
        case 10:
          return (El(t.type), fs(t), null);
        case 19:
          if (($(Fa), null === (r = t.memoizedState))) return (fs(t), null);
          if (((l = !!(128 & t.flags)), null === (i = r.rendering)))
            if (l) ds(r, !1);
            else {
              if (0 !== Su || (null !== e && 128 & e.flags))
                for (e = t.child; null !== e;) {
                  if (null !== (i = $a(e))) {
                    for (
                      t.flags |= 128,
                        ds(r, !1),
                        e = i.updateQueue,
                        t.updateQueue = e,
                        cs(t, e),
                        t.subtreeFlags = 0,
                        e = n,
                        n = t.child;
                      null !== n;
                    )
                      (Ur(n, e), (n = n.sibling));
                    return (U(Fa, (1 & Fa.current) | 2), dl && ll(t, r.treeForkCount), t.child);
                  }
                  e = e.sibling;
                }
              null !== r.tail &&
                se() > Mu &&
                ((t.flags |= 128), (l = !0), ds(r, !1), (t.lanes = 4194304));
            }
          else {
            if (!l)
              if (null !== (e = $a(i))) {
                if (
                  ((t.flags |= 128),
                  (l = !0),
                  (e = e.updateQueue),
                  (t.updateQueue = e),
                  cs(t, e),
                  ds(r, !0),
                  null === r.tail && "hidden" === r.tailMode && !i.alternate && !dl)
                )
                  return (fs(t), null);
              } else
                2 * se() - r.renderingStartTime > Mu &&
                  536870912 !== n &&
                  ((t.flags |= 128), (l = !0), ds(r, !1), (t.lanes = 4194304));
            r.isBackwards
              ? ((i.sibling = t.child), (t.child = i))
              : (null === (e = r.last) ? (t.child = i) : (e.sibling = i), (r.last = i));
          }
          return null === r.tail
            ? (fs(t), null)
            : ((e = r.tail),
              (r.rendering = e),
              (r.tail = e.sibling),
              (r.renderingStartTime = se()),
              (e.sibling = null),
              (n = Fa.current),
              U(Fa, l ? (1 & n) | 2 : 1 & n),
              dl && ll(t, r.treeForkCount),
              e);
        case 22:
        case 23:
          return (
            Ia(t),
            La(),
            (r = null !== t.memoizedState),
            null === e
              ? r && (t.flags |= 8192)
              : (null !== e.memoizedState) !== r && (t.flags |= 8192),
            r
              ? 536870912 & n &&
                !(128 & t.flags) &&
                (fs(t), 6 & t.subtreeFlags && (t.flags |= 8192))
              : fs(t),
            null !== (n = t.updateQueue) && cs(t, n.retryQueue),
            (n = null),
            null !== e &&
              null !== e.memoizedState &&
              null !== e.memoizedState.cachePool &&
              (n = e.memoizedState.cachePool.pool),
            (r = null),
            null !== t.memoizedState &&
              null !== t.memoizedState.cachePool &&
              (r = t.memoizedState.cachePool.pool),
            r !== n && (t.flags |= 2048),
            null !== e && $(Ql),
            null
          );
        case 24:
          return (
            (n = null),
            null !== e && (n = e.memoizedState.cache),
            t.memoizedState.cache !== n && (t.flags |= 2048),
            El(Il),
            fs(t),
            null
          );
        case 25:
        case 30:
          return null;
      }
      throw Error(a(156, t.tag));
    }
    function hs(e, t) {
      switch ((ol(t), t.tag)) {
        case 1:
          return 65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null;
        case 3:
          return (
            El(Il),
            K(),
            65536 & (e = t.flags) && !(128 & e) ? ((t.flags = (-65537 & e) | 128), t) : null
          );
        case 26:
        case 27:
        case 5:
          return (X(t), null);
        case 31:
          if (null !== t.memoizedState) {
            if ((Ia(t), null === t.alternate)) throw Error(a(340));
            bl();
          }
          return 65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null;
        case 13:
          if ((Ia(t), null !== (e = t.memoizedState) && null !== e.dehydrated)) {
            if (null === t.alternate) throw Error(a(340));
            bl();
          }
          return 65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null;
        case 19:
          return ($(Fa), null);
        case 4:
          return (K(), null);
        case 10:
          return (El(t.type), null);
        case 22:
        case 23:
          return (
            Ia(t),
            La(),
            null !== e && $(Ql),
            65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null
          );
        case 24:
          return (El(Il), null);
        default:
          return null;
      }
    }
    function ms(e, t) {
      switch ((ol(t), t.tag)) {
        case 3:
          (El(Il), K());
          break;
        case 26:
        case 27:
        case 5:
          X(t);
          break;
        case 4:
          K();
          break;
        case 31:
          null !== t.memoizedState && Ia(t);
          break;
        case 13:
          Ia(t);
          break;
        case 19:
          $(Fa);
          break;
        case 10:
          El(t.type);
          break;
        case 22:
        case 23:
          (Ia(t), La(), null !== e && $(Ql));
          break;
        case 24:
          El(Il);
      }
    }
    function gs(e, t) {
      try {
        var n = t.updateQueue,
          r = null === n ? null : n.lastEffect;
        if (null !== r) {
          var l = r.next;
          n = l;
          do {
            if ((n.tag & e) === e) {
              r = void 0;
              var a = n.create,
                i = n.inst;
              ((r = a()), (i.destroy = r));
            }
            n = n.next;
          } while (n !== l);
        }
      } catch (e) {
        Sc(t, t.return, e);
      }
    }
    function ys(e, t, n) {
      try {
        var r = t.updateQueue,
          l = null === r ? null : r.lastEffect;
        if (null !== l) {
          var a = l.next;
          r = a;
          do {
            if ((r.tag & e) === e) {
              var i = r.inst,
                o = i.destroy;
              if (void 0 !== o) {
                ((i.destroy = void 0), (l = t));
                var s = n,
                  u = o;
                try {
                  u();
                } catch (e) {
                  Sc(l, s, e);
                }
              }
            }
            r = r.next;
          } while (r !== a);
        }
      } catch (e) {
        Sc(t, t.return, e);
      }
    }
    function vs(e) {
      var t = e.updateQueue;
      if (null !== t) {
        var n = e.stateNode;
        try {
          Ea(t, n);
        } catch (t) {
          Sc(e, e.return, t);
        }
      }
    }
    function bs(e, t, n) {
      ((n.props = So(e.type, e.memoizedProps)), (n.state = e.memoizedState));
      try {
        n.componentWillUnmount();
      } catch (n) {
        Sc(e, t, n);
      }
    }
    function ks(e, t) {
      try {
        var n = e.ref;
        if (null !== n) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var r = e.stateNode;
              break;
            default:
              r = e.stateNode;
          }
          "function" == typeof n ? (e.refCleanup = n(r)) : (n.current = r);
        }
      } catch (n) {
        Sc(e, t, n);
      }
    }
    function ws(e, t) {
      var n = e.ref,
        r = e.refCleanup;
      if (null !== n)
        if ("function" == typeof r)
          try {
            r();
          } catch (n) {
            Sc(e, t, n);
          } finally {
            ((e.refCleanup = null), null != (e = e.alternate) && (e.refCleanup = null));
          }
        else if ("function" == typeof n)
          try {
            n(null);
          } catch (n) {
            Sc(e, t, n);
          }
        else n.current = null;
    }
    function xs(e) {
      var t = e.type,
        n = e.memoizedProps,
        r = e.stateNode;
      try {
        e: switch (t) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            n.autoFocus && r.focus();
            break e;
          case "img":
            n.src ? (r.src = n.src) : n.srcSet && (r.srcset = n.srcSet);
        }
      } catch (t) {
        Sc(e, e.return, t);
      }
    }
    function Ss(e, t, n) {
      try {
        var r = e.stateNode;
        ((function (e, t, n, r) {
          switch (t) {
            case "div":
            case "span":
            case "svg":
            case "path":
            case "a":
            case "g":
            case "p":
            case "li":
              break;
            case "input":
              var l = null,
                i = null,
                o = null,
                s = null,
                u = null,
                c = null,
                d = null;
              for (h in n) {
                var f = n[h];
                if (n.hasOwnProperty(h) && null != f)
                  switch (h) {
                    case "checked":
                    case "value":
                      break;
                    case "defaultValue":
                      u = f;
                    default:
                      r.hasOwnProperty(h) || cd(e, t, h, null, r, f);
                  }
              }
              for (var p in r) {
                var h = r[p];
                if (((f = n[p]), r.hasOwnProperty(p) && (null != h || null != f)))
                  switch (p) {
                    case "type":
                      i = h;
                      break;
                    case "name":
                      l = h;
                      break;
                    case "checked":
                      c = h;
                      break;
                    case "defaultChecked":
                      d = h;
                      break;
                    case "value":
                      o = h;
                      break;
                    case "defaultValue":
                      s = h;
                      break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                      if (null != h) throw Error(a(137, t));
                      break;
                    default:
                      h !== f && cd(e, t, p, h, r, f);
                  }
              }
              return void vt(e, o, s, u, c, d, i, l);
            case "select":
              for (i in ((h = o = s = p = null), n))
                if (((u = n[i]), n.hasOwnProperty(i) && null != u))
                  switch (i) {
                    case "value":
                      break;
                    case "multiple":
                      h = u;
                    default:
                      r.hasOwnProperty(i) || cd(e, t, i, null, r, u);
                  }
              for (l in r)
                if (((i = r[l]), (u = n[l]), r.hasOwnProperty(l) && (null != i || null != u)))
                  switch (l) {
                    case "value":
                      p = i;
                      break;
                    case "defaultValue":
                      s = i;
                      break;
                    case "multiple":
                      o = i;
                    default:
                      i !== u && cd(e, t, l, i, r, u);
                  }
              return (
                (t = s),
                (n = o),
                (r = h),
                void (null == p
                  ? !!r != !!n && (null == t ? wt(e, !!n, n ? [] : "", !1) : wt(e, !!n, t, !0))
                  : wt(e, !!n, p, !1))
              );
            case "textarea":
              for (s in ((h = p = null), n))
                if (((l = n[s]), n.hasOwnProperty(s) && null != l && !r.hasOwnProperty(s)))
                  switch (s) {
                    case "value":
                    case "children":
                      break;
                    default:
                      cd(e, t, s, null, r, l);
                  }
              for (o in r)
                if (((l = r[o]), (i = n[o]), r.hasOwnProperty(o) && (null != l || null != i)))
                  switch (o) {
                    case "value":
                      p = l;
                      break;
                    case "defaultValue":
                      h = l;
                      break;
                    case "children":
                      break;
                    case "dangerouslySetInnerHTML":
                      if (null != l) throw Error(a(91));
                      break;
                    default:
                      l !== i && cd(e, t, o, l, r, i);
                  }
              return void xt(e, p, h);
            case "option":
              for (var m in n)
                if (((p = n[m]), n.hasOwnProperty(m) && null != p && !r.hasOwnProperty(m)))
                  if ("selected" === m) e.selected = !1;
                  else cd(e, t, m, null, r, p);
              for (u in r)
                if (
                  ((p = r[u]),
                  (h = n[u]),
                  r.hasOwnProperty(u) && p !== h && (null != p || null != h))
                )
                  if ("selected" === u)
                    e.selected = p && "function" != typeof p && "symbol" != typeof p;
                  else cd(e, t, u, p, r, h);
              return;
            case "img":
            case "link":
            case "area":
            case "base":
            case "br":
            case "col":
            case "embed":
            case "hr":
            case "keygen":
            case "meta":
            case "param":
            case "source":
            case "track":
            case "wbr":
            case "menuitem":
              for (var g in n)
                ((p = n[g]),
                  n.hasOwnProperty(g) &&
                    null != p &&
                    !r.hasOwnProperty(g) &&
                    cd(e, t, g, null, r, p));
              for (c in r)
                if (
                  ((p = r[c]),
                  (h = n[c]),
                  r.hasOwnProperty(c) && p !== h && (null != p || null != h))
                )
                  switch (c) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                      if (null != p) throw Error(a(137, t));
                      break;
                    default:
                      cd(e, t, c, p, r, h);
                  }
              return;
            default:
              if (Tt(t)) {
                for (var y in n)
                  ((p = n[y]),
                    n.hasOwnProperty(y) &&
                      void 0 !== p &&
                      !r.hasOwnProperty(y) &&
                      dd(e, t, y, void 0, r, p));
                for (d in r)
                  ((p = r[d]),
                    (h = n[d]),
                    !r.hasOwnProperty(d) ||
                      p === h ||
                      (void 0 === p && void 0 === h) ||
                      dd(e, t, d, p, r, h));
                return;
              }
          }
          for (var v in n)
            ((p = n[v]),
              n.hasOwnProperty(v) && null != p && !r.hasOwnProperty(v) && cd(e, t, v, null, r, p));
          for (f in r)
            ((p = r[f]),
              (h = n[f]),
              !r.hasOwnProperty(f) || p === h || (null == p && null == h) || cd(e, t, f, p, r, h));
        })(r, e.type, n, t),
          (r[He] = t));
      } catch (t) {
        Sc(e, e.return, t);
      }
    }
    function js(e) {
      return (
        5 === e.tag || 3 === e.tag || 26 === e.tag || (27 === e.tag && Ed(e.type)) || 4 === e.tag
      );
    }
    function Cs(e) {
      e: for (;;) {
        for (; null === e.sibling;) {
          if (null === e.return || js(e.return)) return null;
          e = e.return;
        }
        for (
          e.sibling.return = e.return, e = e.sibling;
          5 !== e.tag && 6 !== e.tag && 18 !== e.tag;
        ) {
          if ((27 === e.tag && Ed(e.type)) || 2 & e.flags || null === e.child || 4 === e.tag)
            continue e;
          ((e.child.return = e), (e = e.child));
        }
        if (!(2 & e.flags)) return e.stateNode;
      }
    }
    function Es(e, t, n) {
      var r = e.tag;
      if (5 === r || 6 === r)
        ((e = e.stateNode),
          t
            ? (9 === n.nodeType
                ? n.body
                : "HTML" === n.nodeName
                  ? n.ownerDocument.body
                  : n
              ).insertBefore(e, t)
            : ((t =
                9 === n.nodeType
                  ? n.body
                  : "HTML" === n.nodeName
                    ? n.ownerDocument.body
                    : n).appendChild(e),
              null != (n = n._reactRootContainer) || null !== t.onclick || (t.onclick = Pt)));
      else if (
        4 !== r &&
        (27 === r && Ed(e.type) && ((n = e.stateNode), (t = null)), null !== (e = e.child))
      )
        for (Es(e, t, n), e = e.sibling; null !== e;) (Es(e, t, n), (e = e.sibling));
    }
    function Ns(e, t, n) {
      var r = e.tag;
      if (5 === r || 6 === r) ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
      else if (4 !== r && (27 === r && Ed(e.type) && (n = e.stateNode), null !== (e = e.child)))
        for (Ns(e, t, n), e = e.sibling; null !== e;) (Ns(e, t, n), (e = e.sibling));
    }
    function Ts(e) {
      var t = e.stateNode,
        n = e.memoizedProps;
      try {
        for (var r = e.type, l = t.attributes; l.length;) t.removeAttributeNode(l[0]);
        (fd(t, r, n), (t[Ue] = e), (t[He] = n));
      } catch (t) {
        Sc(e, e.return, t);
      }
    }
    var _s = !1,
      zs = !1,
      Ls = !1,
      Ps = "function" == typeof WeakSet ? WeakSet : Set,
      As = null;
    function Ms(e, t, n) {
      var r = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (Gs(e, n), 4 & r && gs(5, n));
          break;
        case 1:
          if ((Gs(e, n), 4 & r))
            if (((e = n.stateNode), null === t))
              try {
                e.componentDidMount();
              } catch (e) {
                Sc(n, n.return, e);
              }
            else {
              var l = So(n.type, t.memoizedProps);
              t = t.memoizedState;
              try {
                e.componentDidUpdate(l, t, e.__reactInternalSnapshotBeforeUpdate);
              } catch (e) {
                Sc(n, n.return, e);
              }
            }
          (64 & r && vs(n), 512 & r && ks(n, n.return));
          break;
        case 3:
          if ((Gs(e, n), 64 & r && null !== (e = n.updateQueue))) {
            if (((t = null), null !== n.child))
              switch (n.child.tag) {
                case 27:
                case 5:
                case 1:
                  t = n.child.stateNode;
              }
            try {
              Ea(e, t);
            } catch (e) {
              Sc(n, n.return, e);
            }
          }
          break;
        case 27:
          null === t && 4 & r && Ts(n);
        case 26:
        case 5:
          (Gs(e, n), null === t && 4 & r && xs(n), 512 & r && ks(n, n.return));
          break;
        case 12:
          Gs(e, n);
          break;
        case 31:
          (Gs(e, n), 4 & r && $s(e, n));
          break;
        case 13:
          (Gs(e, n),
            4 & r && Us(e, n),
            64 & r &&
              null !== (e = n.memoizedState) &&
              null !== (e = e.dehydrated) &&
              (function (e, t) {
                var n = e.ownerDocument;
                if ("$~" === e.data) e._reactRetry = t;
                else if ("$?" !== e.data || "loading" !== n.readyState) t();
                else {
                  var r = function () {
                    (t(), n.removeEventListener("DOMContentLoaded", r));
                  };
                  (n.addEventListener("DOMContentLoaded", r), (e._reactRetry = r));
                }
              })(e, (n = Nc.bind(null, n))));
          break;
        case 22:
          if (!(r = null !== n.memoizedState || _s)) {
            ((t = (null !== t && null !== t.memoizedState) || zs), (l = _s));
            var a = zs;
            ((_s = r),
              (zs = t) && !a ? Ys(e, n, !!(8772 & n.subtreeFlags)) : Gs(e, n),
              (_s = l),
              (zs = a));
          }
          break;
        case 30:
          break;
        default:
          Gs(e, n);
      }
    }
    function Os(e) {
      var t = e.alternate;
      (null !== t && ((e.alternate = null), Os(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        5 === e.tag && null !== (t = e.stateNode) && Ke(t),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null));
    }
    var Rs = null,
      Ds = !1;
    function Is(e, t, n) {
      for (n = n.child; null !== n;) (Fs(e, t, n), (n = n.sibling));
    }
    function Fs(e, t, n) {
      if (ve && "function" == typeof ve.onCommitFiberUnmount)
        try {
          ve.onCommitFiberUnmount(ye, n);
        } catch {}
      switch (n.tag) {
        case 26:
          (zs || ws(n, t),
            Is(e, t, n),
            n.memoizedState
              ? n.memoizedState.count--
              : n.stateNode && (n = n.stateNode).parentNode.removeChild(n));
          break;
        case 27:
          zs || ws(n, t);
          var r = Rs,
            l = Ds;
          (Ed(n.type) && ((Rs = n.stateNode), (Ds = !1)),
            Is(e, t, n),
            Id(n.stateNode),
            (Rs = r),
            (Ds = l));
          break;
        case 5:
          zs || ws(n, t);
        case 6:
          if (((r = Rs), (l = Ds), (Rs = null), Is(e, t, n), (Ds = l), null !== (Rs = r)))
            if (Ds)
              try {
                (9 === Rs.nodeType
                  ? Rs.body
                  : "HTML" === Rs.nodeName
                    ? Rs.ownerDocument.body
                    : Rs
                ).removeChild(n.stateNode);
              } catch (e) {
                Sc(n, t, e);
              }
            else
              try {
                Rs.removeChild(n.stateNode);
              } catch (e) {
                Sc(n, t, e);
              }
          break;
        case 18:
          null !== Rs &&
            (Ds
              ? (Nd(
                  9 === (e = Rs).nodeType
                    ? e.body
                    : "HTML" === e.nodeName
                      ? e.ownerDocument.body
                      : e,
                  n.stateNode,
                ),
                Vf(e))
              : Nd(Rs, n.stateNode));
          break;
        case 4:
          ((r = Rs),
            (l = Ds),
            (Rs = n.stateNode.containerInfo),
            (Ds = !0),
            Is(e, t, n),
            (Rs = r),
            (Ds = l));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (ys(2, n, t), zs || ys(4, n, t), Is(e, t, n));
          break;
        case 1:
          (zs ||
            (ws(n, t), "function" == typeof (r = n.stateNode).componentWillUnmount && bs(n, t, r)),
            Is(e, t, n));
          break;
        case 21:
          Is(e, t, n);
          break;
        case 22:
          ((zs = (r = zs) || null !== n.memoizedState), Is(e, t, n), (zs = r));
          break;
        default:
          Is(e, t, n);
      }
    }
    function $s(e, t) {
      if (
        null === t.memoizedState &&
        null !== (e = t.alternate) &&
        null !== (e = e.memoizedState)
      ) {
        e = e.dehydrated;
        try {
          Vf(e);
        } catch (e) {
          Sc(t, t.return, e);
        }
      }
    }
    function Us(e, t) {
      if (
        null === t.memoizedState &&
        null !== (e = t.alternate) &&
        null !== (e = e.memoizedState) &&
        null !== (e = e.dehydrated)
      )
        try {
          Vf(e);
        } catch (e) {
          Sc(t, t.return, e);
        }
    }
    function Hs(e, t) {
      var n = (function (e) {
        switch (e.tag) {
          case 31:
          case 13:
          case 19:
            var t = e.stateNode;
            return (null === t && (t = e.stateNode = new Ps()), t);
          case 22:
            return (
              null === (t = (e = e.stateNode)._retryCache) && (t = e._retryCache = new Ps()),
              t
            );
          default:
            throw Error(a(435, e.tag));
        }
      })(e);
      t.forEach(function (t) {
        if (!n.has(t)) {
          n.add(t);
          var r = Tc.bind(null, e, t);
          t.then(r, r);
        }
      });
    }
    function Vs(e, t) {
      var n = t.deletions;
      if (null !== n)
        for (var r = 0; r < n.length; r++) {
          var l = n[r],
            i = e,
            o = t,
            s = o;
          e: for (; null !== s;) {
            switch (s.tag) {
              case 27:
                if (Ed(s.type)) {
                  ((Rs = s.stateNode), (Ds = !1));
                  break e;
                }
                break;
              case 5:
                ((Rs = s.stateNode), (Ds = !1));
                break e;
              case 3:
              case 4:
                ((Rs = s.stateNode.containerInfo), (Ds = !0));
                break e;
            }
            s = s.return;
          }
          if (null === Rs) throw Error(a(160));
          (Fs(i, o, l),
            (Rs = null),
            (Ds = !1),
            null !== (i = l.alternate) && (i.return = null),
            (l.return = null));
        }
      if (13886 & t.subtreeFlags) for (t = t.child; null !== t;) (Bs(t, e), (t = t.sibling));
    }
    var Ws = null;
    function Bs(e, t) {
      var n = e.alternate,
        r = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (Vs(t, e), qs(e), 4 & r && (ys(3, e, e.return), gs(3, e), ys(5, e, e.return)));
          break;
        case 1:
          (Vs(t, e),
            qs(e),
            512 & r && (zs || null === n || ws(n, n.return)),
            64 & r &&
              _s &&
              null !== (e = e.updateQueue) &&
              null !== (r = e.callbacks) &&
              ((n = e.shared.hiddenCallbacks),
              (e.shared.hiddenCallbacks = null === n ? r : n.concat(r))));
          break;
        case 26:
          var l = Ws;
          if ((Vs(t, e), qs(e), 512 & r && (zs || null === n || ws(n, n.return)), 4 & r)) {
            var i = null === n ? null : n.memoizedState;
            if (((r = e.memoizedState), null === n))
              if (null === r)
                if (null === e.stateNode) {
                  e: {
                    ((r = e.type), (n = e.memoizedProps), (l = l.ownerDocument || l));
                    t: switch (r) {
                      case "title":
                        ((!(i = l.getElementsByTagName("title")[0]) ||
                          i[Ge] ||
                          i[Ue] ||
                          "http://www.w3.org/2000/svg" === i.namespaceURI ||
                          i.hasAttribute("itemprop")) &&
                          ((i = l.createElement(r)),
                          l.head.insertBefore(i, l.querySelector("head > title"))),
                          fd(i, r, n),
                          (i[Ue] = e),
                          et(i),
                          (r = i));
                        break e;
                      case "link":
                        var o = nf("link", "href", l).get(r + (n.href || ""));
                        if (o)
                          for (var s = 0; s < o.length; s++)
                            if (
                              (i = o[s]).getAttribute("href") ===
                                (null == n.href || "" === n.href ? null : n.href) &&
                              i.getAttribute("rel") === (null == n.rel ? null : n.rel) &&
                              i.getAttribute("title") === (null == n.title ? null : n.title) &&
                              i.getAttribute("crossorigin") ===
                                (null == n.crossOrigin ? null : n.crossOrigin)
                            ) {
                              o.splice(s, 1);
                              break t;
                            }
                        (fd((i = l.createElement(r)), r, n), l.head.appendChild(i));
                        break;
                      case "meta":
                        if ((o = nf("meta", "content", l).get(r + (n.content || ""))))
                          for (s = 0; s < o.length; s++)
                            if (
                              (i = o[s]).getAttribute("content") ===
                                (null == n.content ? null : "" + n.content) &&
                              i.getAttribute("name") === (null == n.name ? null : n.name) &&
                              i.getAttribute("property") ===
                                (null == n.property ? null : n.property) &&
                              i.getAttribute("http-equiv") ===
                                (null == n.httpEquiv ? null : n.httpEquiv) &&
                              i.getAttribute("charset") === (null == n.charSet ? null : n.charSet)
                            ) {
                              o.splice(s, 1);
                              break t;
                            }
                        (fd((i = l.createElement(r)), r, n), l.head.appendChild(i));
                        break;
                      default:
                        throw Error(a(468, r));
                    }
                    ((i[Ue] = e), et(i), (r = i));
                  }
                  e.stateNode = r;
                } else rf(l, e.type, e.stateNode);
              else e.stateNode = Xd(l, r, e.memoizedProps);
            else
              i === r
                ? null === r && null !== e.stateNode && Ss(e, e.memoizedProps, n.memoizedProps)
                : (null === i
                    ? null !== n.stateNode && (n = n.stateNode).parentNode.removeChild(n)
                    : i.count--,
                  null === r ? rf(l, e.type, e.stateNode) : Xd(l, r, e.memoizedProps));
          }
          break;
        case 27:
          (Vs(t, e),
            qs(e),
            512 & r && (zs || null === n || ws(n, n.return)),
            null !== n && 4 & r && Ss(e, e.memoizedProps, n.memoizedProps));
          break;
        case 5:
          if ((Vs(t, e), qs(e), 512 & r && (zs || null === n || ws(n, n.return)), 32 & e.flags)) {
            l = e.stateNode;
            try {
              jt(l, "");
            } catch (t) {
              Sc(e, e.return, t);
            }
          }
          (4 & r &&
            null != e.stateNode &&
            Ss(e, (l = e.memoizedProps), null === n ? l : n.memoizedProps),
            1024 & r && (Ls = !0));
          break;
        case 6:
          if ((Vs(t, e), qs(e), 4 & r)) {
            if (null === e.stateNode) throw Error(a(162));
            ((r = e.memoizedProps), (n = e.stateNode));
            try {
              n.nodeValue = r;
            } catch (t) {
              Sc(e, e.return, t);
            }
          }
          break;
        case 3:
          if (
            ((tf = null),
            (l = Ws),
            (Ws = Ud(t.containerInfo)),
            Vs(t, e),
            (Ws = l),
            qs(e),
            4 & r && null !== n && n.memoizedState.isDehydrated)
          )
            try {
              Vf(t.containerInfo);
            } catch (t) {
              Sc(e, e.return, t);
            }
          Ls && ((Ls = !1), Qs(e));
          break;
        case 4:
          ((r = Ws), (Ws = Ud(e.stateNode.containerInfo)), Vs(t, e), qs(e), (Ws = r));
          break;
        case 12:
        default:
          (Vs(t, e), qs(e));
          break;
        case 31:
        case 19:
          (Vs(t, e),
            qs(e),
            4 & r && null !== (r = e.updateQueue) && ((e.updateQueue = null), Hs(e, r)));
          break;
        case 13:
          (Vs(t, e),
            qs(e),
            8192 & e.child.flags &&
              (null !== e.memoizedState) != (null !== n && null !== n.memoizedState) &&
              (Pu = se()),
            4 & r && null !== (r = e.updateQueue) && ((e.updateQueue = null), Hs(e, r)));
          break;
        case 22:
          l = null !== e.memoizedState;
          var u = null !== n && null !== n.memoizedState,
            c = _s,
            d = zs;
          if (((_s = c || l), (zs = d || u), Vs(t, e), (zs = d), (_s = c), qs(e), 8192 & r))
            e: for (
              t = e.stateNode,
                t._visibility = l ? -2 & t._visibility : 1 | t._visibility,
                l && (null === n || u || _s || zs || Ks(e)),
                n = null,
                t = e;
              ;
            ) {
              if (5 === t.tag || 26 === t.tag) {
                if (null === n) {
                  u = n = t;
                  try {
                    if (((i = u.stateNode), l))
                      "function" == typeof (o = i.style).setProperty
                        ? o.setProperty("display", "none", "important")
                        : (o.display = "none");
                    else {
                      s = u.stateNode;
                      var f = u.memoizedProps.style,
                        p = null != f && f.hasOwnProperty("display") ? f.display : null;
                      s.style.display = null == p || "boolean" == typeof p ? "" : ("" + p).trim();
                    }
                  } catch (e) {
                    Sc(u, u.return, e);
                  }
                }
              } else if (6 === t.tag) {
                if (null === n) {
                  u = t;
                  try {
                    u.stateNode.nodeValue = l ? "" : u.memoizedProps;
                  } catch (e) {
                    Sc(u, u.return, e);
                  }
                }
              } else if (18 === t.tag) {
                if (null === n) {
                  u = t;
                  try {
                    var h = u.stateNode;
                    l ? Td(h, !0) : Td(u.stateNode, !1);
                  } catch (e) {
                    Sc(u, u.return, e);
                  }
                }
              } else if (
                ((22 !== t.tag && 23 !== t.tag) || null === t.memoizedState || t === e) &&
                null !== t.child
              ) {
                ((t.child.return = t), (t = t.child));
                continue;
              }
              if (t === e) break e;
              for (; null === t.sibling;) {
                if (null === t.return || t.return === e) break e;
                (n === t && (n = null), (t = t.return));
              }
              (n === t && (n = null), (t.sibling.return = t.return), (t = t.sibling));
            }
          4 & r &&
            null !== (r = e.updateQueue) &&
            null !== (n = r.retryQueue) &&
            ((r.retryQueue = null), Hs(e, n));
        case 30:
        case 21:
      }
    }
    function qs(e) {
      var t = e.flags;
      if (2 & t) {
        try {
          for (var n, r = e.return; null !== r;) {
            if (js(r)) {
              n = r;
              break;
            }
            r = r.return;
          }
          if (null == n) throw Error(a(160));
          switch (n.tag) {
            case 27:
              var l = n.stateNode;
              Ns(e, Cs(e), l);
              break;
            case 5:
              var i = n.stateNode;
              (32 & n.flags && (jt(i, ""), (n.flags &= -33)), Ns(e, Cs(e), i));
              break;
            case 3:
            case 4:
              var o = n.stateNode.containerInfo;
              Es(e, Cs(e), o);
              break;
            default:
              throw Error(a(161));
          }
        } catch (t) {
          Sc(e, e.return, t);
        }
        e.flags &= -3;
      }
      4096 & t && (e.flags &= -4097);
    }
    function Qs(e) {
      if (1024 & e.subtreeFlags)
        for (e = e.child; null !== e;) {
          var t = e;
          (Qs(t), 5 === t.tag && 1024 & t.flags && t.stateNode.reset(), (e = e.sibling));
        }
    }
    function Gs(e, t) {
      if (8772 & t.subtreeFlags)
        for (t = t.child; null !== t;) (Ms(e, t.alternate, t), (t = t.sibling));
    }
    function Ks(e) {
      for (e = e.child; null !== e;) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (ys(4, t, t.return), Ks(t));
            break;
          case 1:
            ws(t, t.return);
            var n = t.stateNode;
            ("function" == typeof n.componentWillUnmount && bs(t, t.return, n), Ks(t));
            break;
          case 27:
            Id(t.stateNode);
          case 26:
          case 5:
            (ws(t, t.return), Ks(t));
            break;
          case 22:
            null === t.memoizedState && Ks(t);
            break;
          default:
            Ks(t);
        }
        e = e.sibling;
      }
    }
    function Ys(e, t, n) {
      for (n = n && !!(8772 & t.subtreeFlags), t = t.child; null !== t;) {
        var r = t.alternate,
          l = e,
          a = t,
          i = a.flags;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            (Ys(l, a, n), gs(4, a));
            break;
          case 1:
            if ((Ys(l, a, n), "function" == typeof (l = (r = a).stateNode).componentDidMount))
              try {
                l.componentDidMount();
              } catch (e) {
                Sc(r, r.return, e);
              }
            if (null !== (l = (r = a).updateQueue)) {
              var o = r.stateNode;
              try {
                var s = l.shared.hiddenCallbacks;
                if (null !== s)
                  for (l.shared.hiddenCallbacks = null, l = 0; l < s.length; l++) Ca(s[l], o);
              } catch (e) {
                Sc(r, r.return, e);
              }
            }
            (n && 64 & i && vs(a), ks(a, a.return));
            break;
          case 27:
            Ts(a);
          case 26:
          case 5:
            (Ys(l, a, n), n && null === r && 4 & i && xs(a), ks(a, a.return));
            break;
          case 12:
            Ys(l, a, n);
            break;
          case 31:
            (Ys(l, a, n), n && 4 & i && $s(l, a));
            break;
          case 13:
            (Ys(l, a, n), n && 4 & i && Us(l, a));
            break;
          case 22:
            (null === a.memoizedState && Ys(l, a, n), ks(a, a.return));
            break;
          case 30:
            break;
          default:
            Ys(l, a, n);
        }
        t = t.sibling;
      }
    }
    function Xs(e, t) {
      var n = null;
      (null !== e &&
        null !== e.memoizedState &&
        null !== e.memoizedState.cachePool &&
        (n = e.memoizedState.cachePool.pool),
        (e = null),
        null !== t.memoizedState &&
          null !== t.memoizedState.cachePool &&
          (e = t.memoizedState.cachePool.pool),
        e !== n && (null != e && e.refCount++, null != n && $l(n)));
    }
    function Js(e, t) {
      ((e = null),
        null !== t.alternate && (e = t.alternate.memoizedState.cache),
        (t = t.memoizedState.cache) !== e && (t.refCount++, null != e && $l(e)));
    }
    function Zs(e, t, n, r) {
      if (10256 & t.subtreeFlags) for (t = t.child; null !== t;) (eu(e, t, n, r), (t = t.sibling));
    }
    function eu(e, t, n, r) {
      var l = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (Zs(e, t, n, r), 2048 & l && gs(9, t));
          break;
        case 1:
        case 31:
        case 13:
        default:
          Zs(e, t, n, r);
          break;
        case 3:
          (Zs(e, t, n, r),
            2048 & l &&
              ((e = null),
              null !== t.alternate && (e = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache) !== e && (t.refCount++, null != e && $l(e))));
          break;
        case 12:
          if (2048 & l) {
            (Zs(e, t, n, r), (e = t.stateNode));
            try {
              var a = t.memoizedProps,
                i = a.id,
                o = a.onPostCommit;
              "function" == typeof o &&
                o(i, null === t.alternate ? "mount" : "update", e.passiveEffectDuration, -0);
            } catch (e) {
              Sc(t, t.return, e);
            }
          } else Zs(e, t, n, r);
          break;
        case 23:
          break;
        case 22:
          ((a = t.stateNode),
            (i = t.alternate),
            null === t.memoizedState
              ? 2 & a._visibility
                ? Zs(e, t, n, r)
                : ((a._visibility |= 2), tu(e, t, n, r, !!(10256 & t.subtreeFlags) || !1))
              : 2 & a._visibility
                ? Zs(e, t, n, r)
                : nu(e, t),
            2048 & l && Xs(i, t));
          break;
        case 24:
          (Zs(e, t, n, r), 2048 & l && Js(t.alternate, t));
      }
    }
    function tu(e, t, n, r, l) {
      for (l = l && (!!(10256 & t.subtreeFlags) || !1), t = t.child; null !== t;) {
        var a = e,
          i = t,
          o = n,
          s = r,
          u = i.flags;
        switch (i.tag) {
          case 0:
          case 11:
          case 15:
            (tu(a, i, o, s, l), gs(8, i));
            break;
          case 23:
            break;
          case 22:
            var c = i.stateNode;
            (null === i.memoizedState
              ? ((c._visibility |= 2), tu(a, i, o, s, l))
              : 2 & c._visibility
                ? tu(a, i, o, s, l)
                : nu(a, i),
              l && 2048 & u && Xs(i.alternate, i));
            break;
          case 24:
            (tu(a, i, o, s, l), l && 2048 & u && Js(i.alternate, i));
            break;
          default:
            tu(a, i, o, s, l);
        }
        t = t.sibling;
      }
    }
    function nu(e, t) {
      if (10256 & t.subtreeFlags)
        for (t = t.child; null !== t;) {
          var n = e,
            r = t,
            l = r.flags;
          switch (r.tag) {
            case 22:
              (nu(n, r), 2048 & l && Xs(r.alternate, r));
              break;
            case 24:
              (nu(n, r), 2048 & l && Js(r.alternate, r));
              break;
            default:
              nu(n, r);
          }
          t = t.sibling;
        }
    }
    var ru = 8192;
    function lu(e, t, n) {
      if (e.subtreeFlags & ru) for (e = e.child; null !== e;) (au(e, t, n), (e = e.sibling));
    }
    function au(e, t, n) {
      switch (e.tag) {
        case 26:
          (lu(e, t, n),
            e.flags & ru &&
              null !== e.memoizedState &&
              (function (e, t, n, r) {
                if (!(
                  "stylesheet" !== n.type ||
                  ("string" == typeof r.media && !1 === matchMedia(r.media).matches) ||
                  4 & n.state.loading
                )) {
                  if (null === n.instance) {
                    var l = qd(r.href),
                      a = t.querySelector(Qd(l));
                    if (a)
                      return (
                        "object" == typeof (t = a._p) &&
                          t &&
                          "function" == typeof t.then &&
                          (e.count++, (e = of.bind(e)), t.then(e, e)),
                        (n.state.loading |= 4),
                        (n.instance = a),
                        void et(a)
                      );
                    ((a = t.ownerDocument || t),
                      (r = Gd(r)),
                      (l = Fd.get(l)) && Zd(r, l),
                      et((a = a.createElement("link"))));
                    var i = a;
                    ((i._p = new Promise(function (e, t) {
                      ((i.onload = e), (i.onerror = t));
                    })),
                      fd(a, "link", r),
                      (n.instance = a));
                  }
                  (null === e.stylesheets && (e.stylesheets = new Map()),
                    e.stylesheets.set(n, t),
                    (t = n.state.preload) &&
                      !(3 & n.state.loading) &&
                      (e.count++,
                      (n = of.bind(e)),
                      t.addEventListener("load", n),
                      t.addEventListener("error", n)));
                }
              })(n, Ws, e.memoizedState, e.memoizedProps));
          break;
        case 5:
        default:
          lu(e, t, n);
          break;
        case 3:
        case 4:
          var r = Ws;
          ((Ws = Ud(e.stateNode.containerInfo)), lu(e, t, n), (Ws = r));
          break;
        case 22:
          null === e.memoizedState &&
            (null !== (r = e.alternate) && null !== r.memoizedState
              ? ((r = ru), (ru = 16777216), lu(e, t, n), (ru = r))
              : lu(e, t, n));
      }
    }
    function iu(e) {
      var t = e.alternate;
      if (null !== t && null !== (e = t.child)) {
        t.child = null;
        do {
          ((t = e.sibling), (e.sibling = null), (e = t));
        } while (null !== e);
      }
    }
    function ou(e) {
      var t = e.deletions;
      if (16 & e.flags) {
        if (null !== t)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((As = r), cu(r, e));
          }
        iu(e);
      }
      if (10256 & e.subtreeFlags) for (e = e.child; null !== e;) (su(e), (e = e.sibling));
    }
    function su(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (ou(e), 2048 & e.flags && ys(9, e, e.return));
          break;
        case 3:
        case 12:
        default:
          ou(e);
          break;
        case 22:
          var t = e.stateNode;
          null !== e.memoizedState &&
          2 & t._visibility &&
          (null === e.return || 13 !== e.return.tag)
            ? ((t._visibility &= -3), uu(e))
            : ou(e);
      }
    }
    function uu(e) {
      var t = e.deletions;
      if (16 & e.flags) {
        if (null !== t)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((As = r), cu(r, e));
          }
        iu(e);
      }
      for (e = e.child; null !== e;) {
        switch ((t = e).tag) {
          case 0:
          case 11:
          case 15:
            (ys(8, t, t.return), uu(t));
            break;
          case 22:
            2 & (n = t.stateNode)._visibility && ((n._visibility &= -3), uu(t));
            break;
          default:
            uu(t);
        }
        e = e.sibling;
      }
    }
    function cu(e, t) {
      for (; null !== As;) {
        var n = As;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            ys(8, n, t);
            break;
          case 23:
          case 22:
            if (null !== n.memoizedState && null !== n.memoizedState.cachePool) {
              var r = n.memoizedState.cachePool.pool;
              null != r && r.refCount++;
            }
            break;
          case 24:
            $l(n.memoizedState.cache);
        }
        if (null !== (r = n.child)) ((r.return = n), (As = r));
        else
          e: for (n = e; null !== As;) {
            var l = (r = As).sibling,
              a = r.return;
            if ((Os(r), r === n)) {
              As = null;
              break e;
            }
            if (null !== l) {
              ((l.return = a), (As = l));
              break e;
            }
            As = a;
          }
      }
    }
    var du = {
        getCacheForType: function (e) {
          var t = Pl(Il),
            n = t.data.get(e);
          return (void 0 === n && ((n = e()), t.data.set(e, n)), n);
        },
        cacheSignal: function () {
          return Pl(Il).controller.signal;
        },
      },
      fu = "function" == typeof WeakMap ? WeakMap : Map,
      pu = 0,
      hu = null,
      mu = null,
      gu = 0,
      yu = 0,
      vu = null,
      bu = !1,
      ku = !1,
      wu = !1,
      xu = 0,
      Su = 0,
      ju = 0,
      Cu = 0,
      Eu = 0,
      Nu = 0,
      Tu = 0,
      _u = null,
      zu = null,
      Lu = !1,
      Pu = 0,
      Au = 0,
      Mu = 1 / 0,
      Ou = null,
      Ru = null,
      Du = 0,
      Iu = null,
      Fu = null,
      $u = 0,
      Uu = 0,
      Hu = null,
      Vu = null,
      Wu = 0,
      Bu = null;
    function qu() {
      return 2 & pu && 0 !== gu ? gu & -gu : null === M.T ? Ie() : Hc();
    }
    function Qu() {
      if (0 === Nu)
        if (536870912 & gu && !dl) Nu = 536870912;
        else {
          var e = je;
          (!(3932160 & (je <<= 1)) && (je = 262144), (Nu = e));
        }
      return (null !== (e = Pa.current) && (e.flags |= 32), Nu);
    }
    function Gu(e, t, n) {
      (((e === hu && (2 === yu || 9 === yu)) || null !== e.cancelPendingCommit) &&
        (tc(e, 0), Ju(e, gu, Nu, !1)),
        Pe(e, n),
        (!(2 & pu) || e !== hu) &&
          (e === hu && (!(2 & pu) && (Cu |= n), 4 === Su && Ju(e, gu, Nu, !1)), Oc(e)));
    }
    function Ku(e, t, n) {
      if (6 & pu) throw Error(a(327));
      for (
        var r = (!n && !(127 & t) && 0 === (t & e.expiredLanes)) || Te(e, t),
          l = r
            ? (function (e, t) {
                var n = pu;
                pu |= 2;
                var r = lc(),
                  l = ac();
                hu !== e || gu !== t ? ((Ou = null), (Mu = se() + 500), tc(e, t)) : (ku = Te(e, t));
                e: for (;;)
                  try {
                    if (0 !== yu && null !== mu) {
                      t = mu;
                      var i = vu;
                      t: switch (yu) {
                        case 1:
                          ((yu = 0), (vu = null), fc(e, t, i, 1));
                          break;
                        case 2:
                        case 9:
                          if (ta(i)) {
                            ((yu = 0), (vu = null), dc(t));
                            break;
                          }
                          ((t = function () {
                            ((2 !== yu && 9 !== yu) || hu !== e || (yu = 7), Oc(e));
                          }),
                            i.then(t, t));
                          break e;
                        case 3:
                          yu = 7;
                          break e;
                        case 4:
                          yu = 5;
                          break e;
                        case 7:
                          ta(i)
                            ? ((yu = 0), (vu = null), dc(t))
                            : ((yu = 0), (vu = null), fc(e, t, i, 7));
                          break;
                        case 5:
                          var o = null;
                          switch (mu.tag) {
                            case 26:
                              o = mu.memoizedState;
                            case 5:
                            case 27:
                              var s = mu;
                              if (o ? lf(o) : s.stateNode.complete) {
                                ((yu = 0), (vu = null));
                                var u = s.sibling;
                                if (null !== u) mu = u;
                                else {
                                  var c = s.return;
                                  null === c ? (mu = null) : ((mu = c), pc(c));
                                }
                                break t;
                              }
                          }
                          ((yu = 0), (vu = null), fc(e, t, i, 5));
                          break;
                        case 6:
                          ((yu = 0), (vu = null), fc(e, t, i, 6));
                          break;
                        case 8:
                          (ec(), (Su = 6));
                          break e;
                        default:
                          throw Error(a(462));
                      }
                    }
                    uc();
                    break;
                  } catch (t) {
                    nc(e, t);
                  }
                return (
                  (jl = Sl = null),
                  (M.H = r),
                  (M.A = l),
                  (pu = n),
                  null === mu ? ((hu = null), (gu = 0), zr(), Su) : 0
                );
              })(e, t)
            : oc(e, t, !0),
          i = r;
        ;
      ) {
        if (0 === l) {
          ku && !r && Ju(e, t, 0, !1);
          break;
        }
        if (((n = e.current.alternate), !i || Xu(n))) {
          if (2 === l) {
            if (((i = t), e.errorRecoveryDisabledLanes & i)) var o = 0;
            else o = 0 === (o = -536870913 & e.pendingLanes) ? (536870912 & o ? 536870912 : 0) : o;
            if (0 !== o) {
              t = o;
              e: {
                var s = e;
                l = _u;
                var u = s.current.memoizedState.isDehydrated;
                if ((u && (tc(s, o).flags |= 256), 2 !== (o = oc(s, o, !1)))) {
                  if (wu && !u) {
                    ((s.errorRecoveryDisabledLanes |= i), (Cu |= i), (l = 4));
                    break e;
                  }
                  ((i = zu),
                    (zu = l),
                    null !== i && (null === zu ? (zu = i) : zu.push.apply(zu, i)));
                }
                l = o;
              }
              if (((i = !1), 2 !== l)) continue;
            }
          }
          if (1 === l) {
            (tc(e, 0), Ju(e, t, 0, !0));
            break;
          }
          e: {
            switch (((r = e), (i = l))) {
              case 0:
              case 1:
                throw Error(a(345));
              case 4:
                if ((4194048 & t) !== t) break;
              case 6:
                Ju(r, t, Nu, !bu);
                break e;
              case 2:
                zu = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(a(329));
            }
            if ((62914560 & t) === t && 10 < (l = Pu + 300 - se())) {
              if ((Ju(r, t, Nu, !bu), 0 !== Ne(r, 0, !0))) break e;
              (($u = t),
                (r.timeoutHandle = wd(
                  Yu.bind(null, r, n, zu, Ou, Lu, t, Nu, Cu, Tu, bu, i, "Throttled", -0, 0),
                  l,
                )));
            } else Yu(r, n, zu, Ou, Lu, t, Nu, Cu, Tu, bu, i, null, -0, 0);
          }
          break;
        }
        ((l = oc(e, t, !1)), (i = !1));
      }
      Oc(e);
    }
    function Yu(e, t, n, r, l, a, i, o, s, u, c, d, f, p) {
      if (((e.timeoutHandle = -1), 8192 & (d = t.subtreeFlags) || !(16785408 & ~d))) {
        au(
          t,
          a,
          (d = {
            stylesheets: null,
            count: 0,
            imgCount: 0,
            imgBytes: 0,
            suspenseyImages: [],
            waitingForImages: !0,
            waitingForViewTransition: !1,
            unsuspend: Pt,
          }),
        );
        var h = (62914560 & a) === a ? Pu - se() : (4194048 & a) === a ? Au - se() : 0;
        if (
          ((h = (function (e, t) {
            return (
              e.stylesheets && 0 === e.count && uf(e, e.stylesheets),
              0 < e.count || 0 < e.imgCount
                ? function (n) {
                    var r = setTimeout(function () {
                      if ((e.stylesheets && uf(e, e.stylesheets), e.unsuspend)) {
                        var t = e.unsuspend;
                        ((e.unsuspend = null), t());
                      }
                    }, 6e4 + t);
                    0 < e.imgBytes &&
                      0 === af &&
                      (af =
                        62500 *
                        (function () {
                          if ("function" == typeof performance.getEntriesByType) {
                            for (
                              var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0;
                              r < n.length;
                              r++
                            ) {
                              var l = n[r],
                                a = l.transferSize,
                                i = l.initiatorType,
                                o = l.duration;
                              if (a && o && pd(i)) {
                                for (i = 0, o = l.responseEnd, r += 1; r < n.length; r++) {
                                  var s = n[r],
                                    u = s.startTime;
                                  if (u > o) break;
                                  var c = s.transferSize,
                                    d = s.initiatorType;
                                  c &&
                                    pd(d) &&
                                    (i += c * ((s = s.responseEnd) < o ? 1 : (o - u) / (s - u)));
                                }
                                if ((--r, (t += (8 * (a + i)) / (l.duration / 1e3)), 10 < ++e))
                                  break;
                              }
                            }
                            if (0 < e) return t / e / 1e6;
                          }
                          return navigator.connection &&
                            ((e = navigator.connection.downlink), "number" == typeof e)
                            ? e
                            : 5;
                        })());
                    var l = setTimeout(
                      function () {
                        if (
                          ((e.waitingForImages = !1),
                          0 === e.count && (e.stylesheets && uf(e, e.stylesheets), e.unsuspend))
                        ) {
                          var t = e.unsuspend;
                          ((e.unsuspend = null), t());
                        }
                      },
                      (e.imgBytes > af ? 50 : 800) + t,
                    );
                    return (
                      (e.unsuspend = n),
                      function () {
                        ((e.unsuspend = null), clearTimeout(r), clearTimeout(l));
                      }
                    );
                  }
                : null
            );
          })(d, h)),
          null !== h)
        )
          return (
            ($u = a),
            (e.cancelPendingCommit = h(mc.bind(null, e, t, a, n, r, l, i, o, s, c, d, null, f, p))),
            void Ju(e, a, i, !u)
          );
      }
      mc(e, t, a, n, r, l, i, o, s);
    }
    function Xu(e) {
      for (var t = e; ;) {
        var n = t.tag;
        if (
          (0 === n || 11 === n || 15 === n) &&
          16384 & t.flags &&
          null !== (n = t.updateQueue) &&
          null !== (n = n.stores)
        )
          for (var r = 0; r < n.length; r++) {
            var l = n[r],
              a = l.getSnapshot;
            l = l.value;
            try {
              if (!Jn(a(), l)) return !1;
            } catch {
              return !1;
            }
          }
        if (((n = t.child), 16384 & t.subtreeFlags && null !== n)) ((n.return = t), (t = n));
        else {
          if (t === e) break;
          for (; null === t.sibling;) {
            if (null === t.return || t.return === e) return !0;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      }
      return !0;
    }
    function Ju(e, t, n, r) {
      ((t &= ~Eu),
        (t &= ~Cu),
        (e.suspendedLanes |= t),
        (e.pingedLanes &= ~t),
        r && (e.warmLanes |= t),
        (r = e.expirationTimes));
      for (var l = t; 0 < l;) {
        var a = 31 - ke(l),
          i = 1 << a;
        ((r[a] = -1), (l &= ~i));
      }
      0 !== n && Ae(e, n, t);
    }
    function Zu() {
      return !!(6 & pu) || (Rc(0, !1), !1);
    }
    function ec() {
      if (null !== mu) {
        if (0 === yu) var e = mu.return;
        else ((jl = Sl = null), ii((e = mu)), (oa = null), (sa = 0), (e = mu));
        for (; null !== e;) (ms(e.alternate, e), (e = e.return));
        mu = null;
      }
    }
    function tc(e, t) {
      var n = e.timeoutHandle;
      (-1 !== n && ((e.timeoutHandle = -1), xd(n)),
        null !== (n = e.cancelPendingCommit) && ((e.cancelPendingCommit = null), n()),
        ($u = 0),
        ec(),
        (hu = e),
        (mu = n = $r(e.current, null)),
        (gu = t),
        (yu = 0),
        (vu = null),
        (bu = !1),
        (ku = Te(e, t)),
        (wu = !1),
        (Tu = Nu = Eu = Cu = ju = Su = 0),
        (zu = _u = null),
        (Lu = !1),
        8 & t && (t |= 32 & t));
      var r = e.entangledLanes;
      if (0 !== r)
        for (e = e.entanglements, r &= t; 0 < r;) {
          var l = 31 - ke(r),
            a = 1 << l;
          ((t |= e[l]), (r &= ~a));
        }
      return ((xu = t), zr(), n);
    }
    function nc(e, t) {
      ((Ha = null),
        (M.H = mo),
        t === Xl || t === Zl
          ? ((t = aa()), (yu = 3))
          : t === Jl
            ? ((t = aa()), (yu = 4))
            : (yu =
                t === Po ? 8 : "object" == typeof t && t && "function" == typeof t.then ? 6 : 1),
        (vu = t),
        null === mu && ((Su = 1), No(e, Gr(t, e.current))));
    }
    function rc() {
      var e = Pa.current;
      return (
        null === e ||
        ((4194048 & gu) === gu
          ? null === Aa
          : !!((62914560 & gu) === gu || 536870912 & gu) && e === Aa)
      );
    }
    function lc() {
      var e = M.H;
      return ((M.H = mo), null === e ? mo : e);
    }
    function ac() {
      var e = M.A;
      return ((M.A = du), e);
    }
    function ic() {
      ((Su = 4),
        bu || ((4194048 & gu) !== gu && null !== Pa.current) || (ku = !0),
        (!(134217727 & ju) && !(134217727 & Cu)) || null === hu || Ju(hu, gu, Nu, !1));
    }
    function oc(e, t, n) {
      var r = pu;
      pu |= 2;
      var l = lc(),
        a = ac();
      ((hu !== e || gu !== t) && ((Ou = null), tc(e, t)), (t = !1));
      var i = Su;
      e: for (;;)
        try {
          if (0 !== yu && null !== mu) {
            var o = mu,
              s = vu;
            switch (yu) {
              case 8:
                (ec(), (i = 6));
                break e;
              case 3:
              case 2:
              case 9:
              case 6:
                null === Pa.current && (t = !0);
                var u = yu;
                if (((yu = 0), (vu = null), fc(e, o, s, u), n && ku)) {
                  i = 0;
                  break e;
                }
                break;
              default:
                ((u = yu), (yu = 0), (vu = null), fc(e, o, s, u));
            }
          }
          (sc(), (i = Su));
          break;
        } catch (t) {
          nc(e, t);
        }
      return (
        t && e.shellSuspendCounter++,
        (jl = Sl = null),
        (pu = r),
        (M.H = l),
        (M.A = a),
        null === mu && ((hu = null), (gu = 0), zr()),
        i
      );
    }
    function sc() {
      for (; null !== mu;) cc(mu);
    }
    function uc() {
      for (; null !== mu && !ie();) cc(mu);
    }
    function cc(e) {
      var t = is(e.alternate, e, xu);
      ((e.memoizedProps = e.pendingProps), null === t ? pc(e) : (mu = t));
    }
    function dc(e) {
      var t = e,
        n = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = Bo(n, t, t.pendingProps, t.type, void 0, gu);
          break;
        case 11:
          t = Bo(n, t, t.pendingProps, t.type.render, t.ref, gu);
          break;
        case 5:
          ii(t);
        default:
          (ms(n, t), (t = is(n, (t = mu = Ur(t, xu)), xu)));
      }
      ((e.memoizedProps = e.pendingProps), null === t ? pc(e) : (mu = t));
    }
    function fc(e, t, n, r) {
      ((jl = Sl = null), ii(t), (oa = null), (sa = 0));
      var l = t.return;
      try {
        if (
          (function (e, t, n, r, l) {
            if (((n.flags |= 32768), "object" == typeof r && r && "function" == typeof r.then)) {
              if ((null !== (t = n.alternate) && _l(t, n, l, !0), null !== (n = Pa.current))) {
                switch (n.tag) {
                  case 31:
                  case 13:
                    return (
                      null === Aa ? ic() : null === n.alternate && 0 === Su && (Su = 3),
                      (n.flags &= -257),
                      (n.flags |= 65536),
                      (n.lanes = l),
                      r === ea
                        ? (n.flags |= 16384)
                        : (null === (t = n.updateQueue) ? (n.updateQueue = new Set([r])) : t.add(r),
                          jc(e, r, l)),
                      !1
                    );
                  case 22:
                    return (
                      (n.flags |= 65536),
                      r === ea
                        ? (n.flags |= 16384)
                        : (null === (t = n.updateQueue)
                            ? ((t = {
                                transitions: null,
                                markerInstances: null,
                                retryQueue: new Set([r]),
                              }),
                              (n.updateQueue = t))
                            : null === (n = t.retryQueue)
                              ? (t.retryQueue = new Set([r]))
                              : n.add(r),
                          jc(e, r, l)),
                      !1
                    );
                }
                throw Error(a(435, n.tag));
              }
              return (jc(e, r, l), ic(), !1);
            }
            if (dl)
              return (
                null === (t = Pa.current)
                  ? (r !== hl && wl(Gr((t = Error(a(423), { cause: r })), n)),
                    ((e = e.current.alternate).flags |= 65536),
                    (l &= -l),
                    (e.lanes |= l),
                    (r = Gr(r, n)),
                    wa(e, (l = _o(e.stateNode, r, l))),
                    4 !== Su && (Su = 2))
                  : (!(65536 & t.flags) && (t.flags |= 256),
                    (t.flags |= 65536),
                    (t.lanes = l),
                    r !== hl && wl(Gr((e = Error(a(422), { cause: r })), n))),
                !1
              );
            var i = Error(a(520), { cause: r });
            if (
              ((i = Gr(i, n)),
              null === _u ? (_u = [i]) : _u.push(i),
              4 !== Su && (Su = 2),
              null === t)
            )
              return !0;
            ((r = Gr(r, n)), (n = t));
            do {
              switch (n.tag) {
                case 3:
                  return (
                    (n.flags |= 65536),
                    (e = l & -l),
                    (n.lanes |= e),
                    wa(n, (e = _o(n.stateNode, r, e))),
                    !1
                  );
                case 1:
                  if (
                    ((t = n.type),
                    (i = n.stateNode),
                    !(
                      128 & n.flags ||
                      ("function" != typeof t.getDerivedStateFromError &&
                        (null === i ||
                          "function" != typeof i.componentDidCatch ||
                          (null !== Ru && Ru.has(i))))
                    ))
                  )
                    return (
                      (n.flags |= 65536),
                      (l &= -l),
                      (n.lanes |= l),
                      Lo((l = zo(l)), e, n, r),
                      wa(n, l),
                      !1
                    );
              }
              n = n.return;
            } while (null !== n);
            return !1;
          })(e, l, t, n, gu)
        )
          return ((Su = 1), No(e, Gr(n, e.current)), void (mu = null));
      } catch (t) {
        if (null !== l) throw ((mu = l), t);
        return ((Su = 1), No(e, Gr(n, e.current)), void (mu = null));
      }
      32768 & t.flags
        ? (dl || 1 === r
            ? (e = !0)
            : ku || 536870912 & gu
              ? (e = !1)
              : ((bu = e = !0),
                (2 === r || 9 === r || 3 === r || 6 === r) &&
                  null !== (r = Pa.current) &&
                  13 === r.tag &&
                  (r.flags |= 16384)),
          hc(t, e))
        : pc(t);
    }
    function pc(e) {
      var t = e;
      do {
        if (32768 & t.flags) return void hc(t, bu);
        e = t.return;
        var n = ps(t.alternate, t, xu);
        if (null !== n) return void (mu = n);
        if (null !== (t = t.sibling)) return void (mu = t);
        mu = t = e;
      } while (null !== t);
      0 === Su && (Su = 5);
    }
    function hc(e, t) {
      do {
        var n = hs(e.alternate, e);
        if (null !== n) return ((n.flags &= 32767), void (mu = n));
        if (
          (null !== (n = e.return) &&
            ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
          !t && null !== (e = e.sibling))
        )
          return void (mu = e);
        mu = e = n;
      } while (null !== e);
      ((Su = 6), (mu = null));
    }
    function mc(e, t, n, r, l, i, o, s, u) {
      e.cancelPendingCommit = null;
      do {
        kc();
      } while (0 !== Du);
      if (6 & pu) throw Error(a(327));
      if (null !== t) {
        if (t === e.current) throw Error(a(177));
        if (
          ((i = t.lanes | t.childLanes),
          (function (e, t, n, r, l, a) {
            var i = e.pendingLanes;
            ((e.pendingLanes = n),
              (e.suspendedLanes = 0),
              (e.pingedLanes = 0),
              (e.warmLanes = 0),
              (e.expiredLanes &= n),
              (e.entangledLanes &= n),
              (e.errorRecoveryDisabledLanes &= n),
              (e.shellSuspendCounter = 0));
            var o = e.entanglements,
              s = e.expirationTimes,
              u = e.hiddenUpdates;
            for (n = i & ~n; 0 < n;) {
              var c = 31 - ke(n),
                d = 1 << c;
              ((o[c] = 0), (s[c] = -1));
              var f = u[c];
              if (null !== f)
                for (u[c] = null, c = 0; c < f.length; c++) {
                  var p = f[c];
                  null !== p && (p.lane &= -536870913);
                }
              n &= ~d;
            }
            (0 !== r && Ae(e, r, 0),
              0 !== a && 0 === l && 0 !== e.tag && (e.suspendedLanes |= a & ~(i & ~t)));
          })(e, n, (i |= _r), o, s, u),
          e === hu && ((mu = hu = null), (gu = 0)),
          (Fu = t),
          (Iu = e),
          ($u = n),
          (Uu = i),
          (Hu = l),
          (Vu = r),
          10256 & t.subtreeFlags || 10256 & t.flags
            ? ((e.callbackNode = null),
              (e.callbackPriority = 0),
              (function (e, t) {
                le(e, t);
              })(fe, function () {
                return (wc(), null);
              }))
            : ((e.callbackNode = null), (e.callbackPriority = 0)),
          (r = !!(13878 & t.flags)),
          13878 & t.subtreeFlags || r)
        ) {
          ((r = M.T), (M.T = null), (l = O.p), (O.p = 2), (o = pu), (pu |= 4));
          try {
            !(function (e, t) {
              if (((e = e.containerInfo), (hd = vf), lr((e = rr(e))))) {
                if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
                else
                  e: {
                    var r =
                      (n = ((n = e.ownerDocument) && n.defaultView) || window).getSelection &&
                      n.getSelection();
                    if (r && 0 !== r.rangeCount) {
                      n = r.anchorNode;
                      var l = r.anchorOffset,
                        i = r.focusNode;
                      r = r.focusOffset;
                      try {
                        (n.nodeType, i.nodeType);
                      } catch {
                        n = null;
                        break e;
                      }
                      var o = 0,
                        s = -1,
                        u = -1,
                        c = 0,
                        d = 0,
                        f = e,
                        p = null;
                      t: for (;;) {
                        for (
                          var h;
                          f !== n || (0 !== l && 3 !== f.nodeType) || (s = o + l),
                            f !== i || (0 !== r && 3 !== f.nodeType) || (u = o + r),
                            3 === f.nodeType && (o += f.nodeValue.length),
                            null !== (h = f.firstChild);
                        )
                          ((p = f), (f = h));
                        for (;;) {
                          if (f === e) break t;
                          if (
                            (p === n && ++c === l && (s = o),
                            p === i && ++d === r && (u = o),
                            null !== (h = f.nextSibling))
                          )
                            break;
                          p = (f = p).parentNode;
                        }
                        f = h;
                      }
                      n = -1 === s || -1 === u ? null : { start: s, end: u };
                    } else n = null;
                  }
                n = n || { start: 0, end: 0 };
              } else n = null;
              for (md = { focusedElem: e, selectionRange: n }, vf = !1, As = t; null !== As;)
                if (((e = (t = As).child), 1028 & t.subtreeFlags && null !== e))
                  ((e.return = t), (As = e));
                else
                  for (; null !== As;) {
                    switch (((i = (t = As).alternate), (e = t.flags), t.tag)) {
                      case 0:
                        if (4 & e && null !== (e = null === (e = t.updateQueue) ? null : e.events))
                          for (n = 0; n < e.length; n++) (l = e[n]).ref.impl = l.nextImpl;
                        break;
                      case 11:
                      case 15:
                      case 5:
                      case 26:
                      case 27:
                      case 6:
                      case 4:
                      case 17:
                        break;
                      case 1:
                        if (1024 & e && null !== i) {
                          ((e = void 0),
                            (n = t),
                            (l = i.memoizedProps),
                            (i = i.memoizedState),
                            (r = n.stateNode));
                          try {
                            var m = So(n.type, l);
                            ((e = r.getSnapshotBeforeUpdate(m, i)),
                              (r.__reactInternalSnapshotBeforeUpdate = e));
                          } catch (e) {
                            Sc(n, n.return, e);
                          }
                        }
                        break;
                      case 3:
                        if (1024 & e)
                          if (9 === (n = (e = t.stateNode.containerInfo).nodeType)) _d(e);
                          else if (1 === n)
                            switch (e.nodeName) {
                              case "HEAD":
                              case "HTML":
                              case "BODY":
                                _d(e);
                                break;
                              default:
                                e.textContent = "";
                            }
                        break;
                      default:
                        if (1024 & e) throw Error(a(163));
                    }
                    if (null !== (e = t.sibling)) {
                      ((e.return = t.return), (As = e));
                      break;
                    }
                    As = t.return;
                  }
            })(e, t);
          } finally {
            ((pu = o), (O.p = l), (M.T = r));
          }
        }
        ((Du = 1), gc(), yc(), vc());
      }
    }
    function gc() {
      if (1 === Du) {
        Du = 0;
        var e = Iu,
          t = Fu,
          n = !!(13878 & t.flags);
        if (13878 & t.subtreeFlags || n) {
          ((n = M.T), (M.T = null));
          var r = O.p;
          O.p = 2;
          var l = pu;
          pu |= 4;
          try {
            Bs(t, e);
            var a = md,
              i = rr(e.containerInfo),
              o = a.focusedElem,
              s = a.selectionRange;
            if (i !== o && o && o.ownerDocument && nr(o.ownerDocument.documentElement, o)) {
              if (null !== s && lr(o)) {
                var u = s.start,
                  c = s.end;
                if ((void 0 === c && (c = u), "selectionStart" in o))
                  ((o.selectionStart = u), (o.selectionEnd = Math.min(c, o.value.length)));
                else {
                  var d = o.ownerDocument || document,
                    f = (d && d.defaultView) || window;
                  if (f.getSelection) {
                    var p = f.getSelection(),
                      h = o.textContent.length,
                      m = Math.min(s.start, h),
                      g = void 0 === s.end ? m : Math.min(s.end, h);
                    !p.extend && m > g && ((i = g), (g = m), (m = i));
                    var y = tr(o, m),
                      v = tr(o, g);
                    if (
                      y &&
                      v &&
                      (1 !== p.rangeCount ||
                        p.anchorNode !== y.node ||
                        p.anchorOffset !== y.offset ||
                        p.focusNode !== v.node ||
                        p.focusOffset !== v.offset)
                    ) {
                      var b = d.createRange();
                      (b.setStart(y.node, y.offset),
                        p.removeAllRanges(),
                        m > g
                          ? (p.addRange(b), p.extend(v.node, v.offset))
                          : (b.setEnd(v.node, v.offset), p.addRange(b)));
                    }
                  }
                }
              }
              for (d = [], p = o; (p = p.parentNode);)
                1 === p.nodeType && d.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for ("function" == typeof o.focus && o.focus(), o = 0; o < d.length; o++) {
                var k = d[o];
                ((k.element.scrollLeft = k.left), (k.element.scrollTop = k.top));
              }
            }
            ((vf = !!hd), (md = hd = null));
          } finally {
            ((pu = l), (O.p = r), (M.T = n));
          }
        }
        ((e.current = t), (Du = 2));
      }
    }
    function yc() {
      if (2 === Du) {
        Du = 0;
        var e = Iu,
          t = Fu,
          n = !!(8772 & t.flags);
        if (8772 & t.subtreeFlags || n) {
          ((n = M.T), (M.T = null));
          var r = O.p;
          O.p = 2;
          var l = pu;
          pu |= 4;
          try {
            Ms(e, t.alternate, t);
          } finally {
            ((pu = l), (O.p = r), (M.T = n));
          }
        }
        Du = 3;
      }
    }
    function vc() {
      if (4 === Du || 3 === Du) {
        ((Du = 0), oe());
        var e = Iu,
          t = Fu,
          n = $u,
          r = Vu;
        10256 & t.subtreeFlags || 10256 & t.flags
          ? (Du = 5)
          : ((Du = 0), (Fu = Iu = null), bc(e, e.pendingLanes));
        var l = e.pendingLanes;
        if (
          (0 === l && (Ru = null),
          De(n),
          (t = t.stateNode),
          ve && "function" == typeof ve.onCommitFiberRoot)
        )
          try {
            ve.onCommitFiberRoot(ye, t, void 0, !(128 & ~t.current.flags));
          } catch {}
        if (null !== r) {
          ((t = M.T), (l = O.p), (O.p = 2), (M.T = null));
          try {
            for (var a = e.onRecoverableError, i = 0; i < r.length; i++) {
              var o = r[i];
              a(o.value, { componentStack: o.stack });
            }
          } finally {
            ((M.T = t), (O.p = l));
          }
        }
        (3 & $u && kc(),
          Oc(e),
          (l = e.pendingLanes),
          261930 & n && 42 & l ? (e === Bu ? Wu++ : ((Wu = 0), (Bu = e))) : (Wu = 0),
          Rc(0, !1));
      }
    }
    function bc(e, t) {
      0 === (e.pooledCacheLanes &= t) &&
        null != (t = e.pooledCache) &&
        ((e.pooledCache = null), $l(t));
    }
    function kc() {
      return (gc(), yc(), vc(), wc());
    }
    function wc() {
      if (5 !== Du) return !1;
      var e = Iu,
        t = Uu;
      Uu = 0;
      var n = De($u),
        r = M.T,
        l = O.p;
      try {
        ((O.p = 32 > n ? 32 : n), (M.T = null), (n = Hu), (Hu = null));
        var i = Iu,
          o = $u;
        if (((Du = 0), (Fu = Iu = null), ($u = 0), 6 & pu)) throw Error(a(331));
        var s = pu;
        if (
          ((pu |= 4),
          su(i.current),
          eu(i, i.current, o, n),
          (pu = s),
          Rc(0, !1),
          ve && "function" == typeof ve.onPostCommitFiberRoot)
        )
          try {
            ve.onPostCommitFiberRoot(ye, i);
          } catch {}
        return !0;
      } finally {
        ((O.p = l), (M.T = r), bc(e, t));
      }
    }
    function xc(e, t, n) {
      ((t = Gr(n, t)), null !== (e = ba(e, (t = _o(e.stateNode, t, 2)), 2)) && (Pe(e, 2), Oc(e)));
    }
    function Sc(e, t, n) {
      if (3 === e.tag) xc(e, e, n);
      else
        for (; null !== t;) {
          if (3 === t.tag) {
            xc(t, e, n);
            break;
          }
          if (1 === t.tag) {
            var r = t.stateNode;
            if (
              "function" == typeof t.type.getDerivedStateFromError ||
              ("function" == typeof r.componentDidCatch && (null === Ru || !Ru.has(r)))
            ) {
              ((e = Gr(n, e)),
                null !== (r = ba(t, (n = zo(2)), 2)) && (Lo(n, r, t, e), Pe(r, 2), Oc(r)));
              break;
            }
          }
          t = t.return;
        }
    }
    function jc(e, t, n) {
      var r = e.pingCache;
      if (null === r) {
        r = e.pingCache = new fu();
        var l = new Set();
        r.set(t, l);
      } else void 0 === (l = r.get(t)) && ((l = new Set()), r.set(t, l));
      l.has(n) || ((wu = !0), l.add(n), (e = Cc.bind(null, e, t, n)), t.then(e, e));
    }
    function Cc(e, t, n) {
      var r = e.pingCache;
      (null !== r && r.delete(t),
        (e.pingedLanes |= e.suspendedLanes & n),
        (e.warmLanes &= ~n),
        hu === e &&
          (gu & n) === n &&
          (4 === Su || (3 === Su && (62914560 & gu) === gu && 300 > se() - Pu)
            ? !(2 & pu) && tc(e, 0)
            : (Eu |= n),
          Tu === gu && (Tu = 0)),
        Oc(e));
    }
    function Ec(e, t) {
      (0 === t && (t = ze()), null !== (e = Ar(e, t)) && (Pe(e, t), Oc(e)));
    }
    function Nc(e) {
      var t = e.memoizedState,
        n = 0;
      (null !== t && (n = t.retryLane), Ec(e, n));
    }
    function Tc(e, t) {
      var n = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var r = e.stateNode,
            l = e.memoizedState;
          null !== l && (n = l.retryLane);
          break;
        case 19:
          r = e.stateNode;
          break;
        case 22:
          r = e.stateNode._retryCache;
          break;
        default:
          throw Error(a(314));
      }
      (null !== r && r.delete(t), Ec(e, n));
    }
    var _c = null,
      zc = null,
      Lc = !1,
      Pc = !1,
      Ac = !1,
      Mc = 0;
    function Oc(e) {
      (e !== zc && null === e.next && (null === zc ? (_c = zc = e) : (zc = zc.next = e)),
        (Pc = !0),
        Lc ||
          ((Lc = !0),
          jd(function () {
            6 & pu ? le(ce, Dc) : Ic();
          })));
    }
    function Rc(e, t) {
      if (!Ac && Pc) {
        Ac = !0;
        do {
          for (var n = !1, r = _c; null !== r;) {
            if (!t)
              if (0 !== e) {
                var l = r.pendingLanes;
                if (0 === l) var a = 0;
                else {
                  var i = r.suspendedLanes,
                    o = r.pingedLanes;
                  ((a = (1 << (31 - ke(42 | e) + 1)) - 1),
                    (a = 201326741 & (a &= l & ~(i & ~o)) ? (201326741 & a) | 1 : a ? 2 | a : 0));
                }
                0 !== a && ((n = !0), Uc(r, a));
              } else
                ((a = gu),
                  !(
                    3 &
                    (a = Ne(
                      r,
                      r === hu ? a : 0,
                      null !== r.cancelPendingCommit || -1 !== r.timeoutHandle,
                    ))
                  ) ||
                    Te(r, a) ||
                    ((n = !0), Uc(r, a)));
            r = r.next;
          }
        } while (n);
        Ac = !1;
      }
    }
    function Dc() {
      Ic();
    }
    function Ic() {
      Pc = Lc = !1;
      var e = 0;
      0 !== Mc &&
        (function () {
          var e = window.event;
          return e && "popstate" === e.type ? e !== kd && ((kd = e), !0) : ((kd = null), !1);
        })() &&
        (e = Mc);
      for (var t = se(), n = null, r = _c; null !== r;) {
        var l = r.next,
          a = Fc(r, t);
        (0 === a
          ? ((r.next = null), null === n ? (_c = l) : (n.next = l), null === l && (zc = n))
          : ((n = r), (0 !== e || 3 & a) && (Pc = !0)),
          (r = l));
      }
      ((0 !== Du && 5 !== Du) || Rc(e, !1), 0 !== Mc && (Mc = 0));
    }
    function Fc(e, t) {
      for (
        var n = e.suspendedLanes,
          r = e.pingedLanes,
          l = e.expirationTimes,
          a = -62914561 & e.pendingLanes;
        0 < a;
      ) {
        var i = 31 - ke(a),
          o = 1 << i,
          s = l[i];
        (-1 === s
          ? (0 === (o & n) || 0 !== (o & r)) && (l[i] = _e(o, t))
          : s <= t && (e.expiredLanes |= o),
          (a &= ~o));
      }
      if (
        ((n = gu),
        (n = Ne(
          e,
          e === (t = hu) ? n : 0,
          null !== e.cancelPendingCommit || -1 !== e.timeoutHandle,
        )),
        (r = e.callbackNode),
        0 === n || (e === t && (2 === yu || 9 === yu)) || null !== e.cancelPendingCommit)
      )
        return (
          null !== r && null !== r && ae(r),
          (e.callbackNode = null),
          (e.callbackPriority = 0)
        );
      if (!(3 & n) || Te(e, n)) {
        if ((t = n & -n) === e.callbackPriority) return t;
        switch ((null !== r && ae(r), De(n))) {
          case 2:
          case 8:
            n = de;
            break;
          case 32:
          default:
            n = fe;
            break;
          case 268435456:
            n = he;
        }
        return (
          (r = $c.bind(null, e)),
          (n = le(n, r)),
          (e.callbackPriority = t),
          (e.callbackNode = n),
          t
        );
      }
      return (
        null !== r && null !== r && ae(r),
        (e.callbackPriority = 2),
        (e.callbackNode = null),
        2
      );
    }
    function $c(e, t) {
      if (0 !== Du && 5 !== Du) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
      var n = e.callbackNode;
      if (kc() && e.callbackNode !== n) return null;
      var r = gu;
      return 0 ===
        (r = Ne(e, e === hu ? r : 0, null !== e.cancelPendingCommit || -1 !== e.timeoutHandle))
        ? null
        : (Ku(e, r, t),
          Fc(e, se()),
          null != e.callbackNode && e.callbackNode === n ? $c.bind(null, e) : null);
    }
    function Uc(e, t) {
      if (kc()) return null;
      Ku(e, t, !0);
    }
    function Hc() {
      if (0 === Mc) {
        var e = Vl;
        (0 === e && ((e = Se), !(261888 & (Se <<= 1)) && (Se = 256)), (Mc = e));
      }
      return Mc;
    }
    function Vc(e) {
      return null == e || "symbol" == typeof e || "boolean" == typeof e
        ? null
        : "function" == typeof e
          ? e
          : Lt("" + e);
    }
    function Wc(e, t) {
      var n = t.ownerDocument.createElement("input");
      return (
        (n.name = t.name),
        (n.value = t.value),
        e.id && n.setAttribute("form", e.id),
        t.parentNode.insertBefore(n, t),
        (e = new FormData(e)),
        n.parentNode.removeChild(n),
        e
      );
    }
    for (var Bc = 0; Bc < jr.length; Bc++) {
      var qc = jr[Bc];
      Cr(qc.toLowerCase(), "on" + (qc[0].toUpperCase() + qc.slice(1)));
    }
    (Cr(gr, "onAnimationEnd"),
      Cr(yr, "onAnimationIteration"),
      Cr(vr, "onAnimationStart"),
      Cr("dblclick", "onDoubleClick"),
      Cr("focusin", "onFocus"),
      Cr("focusout", "onBlur"),
      Cr(br, "onTransitionRun"),
      Cr(kr, "onTransitionStart"),
      Cr(wr, "onTransitionCancel"),
      Cr(xr, "onTransitionEnd"),
      lt("onMouseEnter", ["mouseout", "mouseover"]),
      lt("onMouseLeave", ["mouseout", "mouseover"]),
      lt("onPointerEnter", ["pointerout", "pointerover"]),
      lt("onPointerLeave", ["pointerout", "pointerover"]),
      rt(
        "onChange",
        "change click focusin focusout input keydown keyup selectionchange".split(" "),
      ),
      rt(
        "onSelect",
        "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
          " ",
        ),
      ),
      rt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
      rt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
      rt(
        "onCompositionStart",
        "compositionstart focusout keydown keypress keyup mousedown".split(" "),
      ),
      rt(
        "onCompositionUpdate",
        "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
      ));
    var Qc =
        "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
          " ",
        ),
      Gc = new Set(
        "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Qc),
      );
    function Kc(e, t) {
      t = !!(4 & t);
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          l = r.event;
        r = r.listeners;
        e: {
          var a = void 0;
          if (t)
            for (var i = r.length - 1; 0 <= i; i--) {
              var o = r[i],
                s = o.instance,
                u = o.currentTarget;
              if (((o = o.listener), s !== a && l.isPropagationStopped())) break e;
              ((a = o), (l.currentTarget = u));
              try {
                a(l);
              } catch (e) {
                Er(e);
              }
              ((l.currentTarget = null), (a = s));
            }
          else
            for (i = 0; i < r.length; i++) {
              if (
                ((s = (o = r[i]).instance),
                (u = o.currentTarget),
                (o = o.listener),
                s !== a && l.isPropagationStopped())
              )
                break e;
              ((a = o), (l.currentTarget = u));
              try {
                a(l);
              } catch (e) {
                Er(e);
              }
              ((l.currentTarget = null), (a = s));
            }
        }
      }
    }
    function Yc(e, t) {
      var n = t[We];
      void 0 === n && (n = t[We] = new Set());
      var r = e + "__bubble";
      n.has(r) || (ed(t, e, 2, !1), n.add(r));
    }
    function Xc(e, t, n) {
      var r = 0;
      (t && (r |= 4), ed(n, e, r, t));
    }
    var Jc = "_reactListening" + Math.random().toString(36).slice(2);
    function Zc(e) {
      if (!e[Jc]) {
        ((e[Jc] = !0),
          tt.forEach(function (t) {
            "selectionchange" !== t && (Gc.has(t) || Xc(t, !1, e), Xc(t, !0, e));
          }));
        var t = 9 === e.nodeType ? e : e.ownerDocument;
        null === t || t[Jc] || ((t[Jc] = !0), Xc("selectionchange", !1, t));
      }
    }
    function ed(e, t, n, r) {
      switch (Cf(t)) {
        case 2:
          var l = bf;
          break;
        case 8:
          l = kf;
          break;
        default:
          l = wf;
      }
      ((n = l.bind(null, t, n, e)),
        (l = void 0),
        !Ht || ("touchstart" !== t && "touchmove" !== t && "wheel" !== t) || (l = !0),
        r
          ? void 0 === l
            ? e.addEventListener(t, n, !0)
            : e.addEventListener(t, n, { capture: !0, passive: l })
          : void 0 === l
            ? e.addEventListener(t, n, !1)
            : e.addEventListener(t, n, { passive: l }));
    }
    function td(e, t, n, r, l) {
      var a = r;
      if (!(1 & t || 2 & t || null === r))
        e: for (;;) {
          if (null === r) return;
          var i = r.tag;
          if (3 === i || 4 === i) {
            var o = r.stateNode.containerInfo;
            if (o === l) break;
            if (4 === i)
              for (i = r.return; null !== i;) {
                var u = i.tag;
                if ((3 === u || 4 === u) && i.stateNode.containerInfo === l) return;
                i = i.return;
              }
            for (; null !== o;) {
              if (null === (i = Ye(o))) return;
              if (5 === (u = i.tag) || 6 === u || 26 === u || 27 === u) {
                r = a = i;
                continue e;
              }
              o = o.parentNode;
            }
          }
          r = r.return;
        }
      Ft(function () {
        var r = a,
          l = Mt(n),
          i = [];
        e: {
          var o = Sr.get(e);
          if (void 0 !== o) {
            var u = nn,
              c = e;
            switch (e) {
              case "keypress":
                if (0 === Gt(n)) break e;
              case "keydown":
              case "keyup":
                u = vn;
                break;
              case "focusin":
                ((c = "focus"), (u = un));
                break;
              case "focusout":
                ((c = "blur"), (u = un));
                break;
              case "beforeblur":
              case "afterblur":
                u = un;
                break;
              case "click":
                if (2 === n.button) break e;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                u = on;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                u = sn;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                u = kn;
                break;
              case gr:
              case yr:
              case vr:
                u = cn;
                break;
              case xr:
                u = wn;
                break;
              case "scroll":
              case "scrollend":
                u = ln;
                break;
              case "wheel":
                u = xn;
                break;
              case "copy":
              case "cut":
              case "paste":
                u = dn;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                u = bn;
                break;
              case "toggle":
              case "beforetoggle":
                u = Sn;
            }
            var d = !!(4 & t),
              f = !d && ("scroll" === e || "scrollend" === e),
              p = d ? (null === o ? null : o + "Capture") : o;
            d = [];
            for (var h, m = r; null !== m;) {
              var g = m;
              if (
                ((h = g.stateNode),
                (5 !== (g = g.tag) && 26 !== g && 27 !== g) ||
                  null === h ||
                  null === p ||
                  (null != (g = $t(m, p)) && d.push(nd(m, g, h))),
                f)
              )
                break;
              m = m.return;
            }
            0 < d.length && ((o = new u(o, c, null, n, l)), i.push({ event: o, listeners: d }));
          }
        }
        if (!(7 & t)) {
          if (
            ((u = "mouseout" === e || "pointerout" === e),
            (!(o = "mouseover" === e || "pointerover" === e) ||
              n === At ||
              !(c = n.relatedTarget || n.fromElement) ||
              (!Ye(c) && !c[Ve])) &&
              (u || o) &&
              ((o =
                l.window === l
                  ? l
                  : (o = l.ownerDocument)
                    ? o.defaultView || o.parentWindow
                    : window),
              u
                ? ((u = r),
                  null !== (c = (c = n.relatedTarget || n.toElement) ? Ye(c) : null) &&
                    ((f = s(c)), (d = c.tag), c !== f || (5 !== d && 27 !== d && 6 !== d)) &&
                    (c = null))
                : ((u = null), (c = r)),
              u !== c))
          ) {
            if (
              ((d = on),
              (g = "onMouseLeave"),
              (p = "onMouseEnter"),
              (m = "mouse"),
              ("pointerout" === e || "pointerover" === e) &&
                ((d = bn), (g = "onPointerLeave"), (p = "onPointerEnter"), (m = "pointer")),
              (f = null == u ? o : Je(u)),
              (h = null == c ? o : Je(c)),
              ((o = new d(g, m + "leave", u, n, l)).target = f),
              (o.relatedTarget = h),
              (g = null),
              Ye(l) === r &&
                (((d = new d(p, m + "enter", c, n, l)).target = h), (d.relatedTarget = f), (g = d)),
              (f = g),
              u && c)
            )
              e: {
                for (d = ld, m = c, h = 0, g = p = u; g; g = d(g)) h++;
                g = 0;
                for (var y = m; y; y = d(y)) g++;
                for (; 0 < h - g;) ((p = d(p)), h--);
                for (; 0 < g - h;) ((m = d(m)), g--);
                for (; h--;) {
                  if (p === m || (null !== m && p === m.alternate)) {
                    d = p;
                    break e;
                  }
                  ((p = d(p)), (m = d(m)));
                }
                d = null;
              }
            else d = null;
            (null !== u && ad(i, o, u, d, !1), null !== c && null !== f && ad(i, f, c, d, !0));
          }
          if (
            "select" === (u = (o = r ? Je(r) : window).nodeName && o.nodeName.toLowerCase()) ||
            ("input" === u && "file" === o.type)
          )
            var v = Un;
          else if (On(o))
            if (Hn) v = Xn;
            else {
              v = Kn;
              var b = Gn;
            }
          else
            !(u = o.nodeName) ||
            "input" !== u.toLowerCase() ||
            ("checkbox" !== o.type && "radio" !== o.type)
              ? r && Tt(r.elementType) && (v = Un)
              : (v = Yn);
          switch (
            (v && (v = v(e, r))
              ? Rn(i, v, n, l)
              : (b && b(e, o, r),
                "focusout" === e &&
                  r &&
                  "number" === o.type &&
                  null != r.memoizedProps.value &&
                  kt(o, "number", o.value)),
            (b = r ? Je(r) : window),
            e)
          ) {
            case "focusin":
              (On(b) || "true" === b.contentEditable) && ((ir = b), (or = r), (sr = null));
              break;
            case "focusout":
              sr = or = ir = null;
              break;
            case "mousedown":
              ur = !0;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              ((ur = !1), cr(i, n, l));
              break;
            case "selectionchange":
              if (ar) break;
            case "keydown":
            case "keyup":
              cr(i, n, l);
          }
          var k;
          if (Cn)
            e: {
              switch (e) {
                case "compositionstart":
                  var w = "onCompositionStart";
                  break e;
                case "compositionend":
                  w = "onCompositionEnd";
                  break e;
                case "compositionupdate":
                  w = "onCompositionUpdate";
                  break e;
              }
              w = void 0;
            }
          else
            An
              ? Ln(e, n) && (w = "onCompositionEnd")
              : "keydown" === e && 229 === n.keyCode && (w = "onCompositionStart");
          (w &&
            (Tn &&
              "ko" !== n.locale &&
              (An || "onCompositionStart" !== w
                ? "onCompositionEnd" === w && An && (k = Qt())
                : ((Bt = "value" in (Wt = l) ? Wt.value : Wt.textContent), (An = !0))),
            0 < (b = rd(r, w)).length &&
              ((w = new fn(w, e, null, n, l)),
              i.push({ event: w, listeners: b }),
              k ? (w.data = k) : null !== (k = Pn(n)) && (w.data = k))),
            (k = Nn
              ? (function (e, t) {
                  switch (e) {
                    case "compositionend":
                      return Pn(t);
                    case "keypress":
                      return 32 === t.which ? ((zn = !0), _n) : null;
                    case "textInput":
                      return (e = t.data) === _n && zn ? null : e;
                    default:
                      return null;
                  }
                })(e, n)
              : (function (e, t) {
                  if (An)
                    return "compositionend" === e || (!Cn && Ln(e, t))
                      ? ((e = Qt()), (qt = Bt = Wt = null), (An = !1), e)
                      : null;
                  switch (e) {
                    case "paste":
                    default:
                      return null;
                    case "keypress":
                      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
                        if (t.char && 1 < t.char.length) return t.char;
                        if (t.which) return String.fromCharCode(t.which);
                      }
                      return null;
                    case "compositionend":
                      return Tn && "ko" !== t.locale ? null : t.data;
                  }
                })(e, n)) &&
              0 < (w = rd(r, "onBeforeInput")).length &&
              ((b = new fn("onBeforeInput", "beforeinput", null, n, l)),
              i.push({ event: b, listeners: w }),
              (b.data = k)),
            (function (e, t, n, r, l) {
              if ("submit" === t && n && n.stateNode === l) {
                var a = Vc((l[He] || null).action),
                  i = r.submitter;
                i &&
                  null !==
                    (t = (t = i[He] || null) ? Vc(t.formAction) : i.getAttribute("formAction")) &&
                  ((a = t), (i = null));
                var o = new nn("action", "action", null, r, l);
                e.push({
                  event: o,
                  listeners: [
                    {
                      instance: null,
                      listener: function () {
                        if (r.defaultPrevented) {
                          if (0 !== Mc) {
                            var e = i ? Wc(l, i) : new FormData(l);
                            eo(n, { pending: !0, data: e, method: l.method, action: a }, null, e);
                          }
                        } else
                          "function" == typeof a &&
                            (o.preventDefault(),
                            (e = i ? Wc(l, i) : new FormData(l)),
                            eo(n, { pending: !0, data: e, method: l.method, action: a }, a, e));
                      },
                      currentTarget: l,
                    },
                  ],
                });
              }
            })(i, e, r, n, l));
        }
        Kc(i, t);
      });
    }
    function nd(e, t, n) {
      return { instance: e, listener: t, currentTarget: n };
    }
    function rd(e, t) {
      for (var n = t + "Capture", r = []; null !== e;) {
        var l = e,
          a = l.stateNode;
        if (
          ((5 !== (l = l.tag) && 26 !== l && 27 !== l) ||
            null === a ||
            (null != (l = $t(e, n)) && r.unshift(nd(e, l, a)),
            null != (l = $t(e, t)) && r.push(nd(e, l, a))),
          3 === e.tag)
        )
          return r;
        e = e.return;
      }
      return [];
    }
    function ld(e) {
      if (null === e) return null;
      do {
        e = e.return;
      } while (e && 5 !== e.tag && 27 !== e.tag);
      return e || null;
    }
    function ad(e, t, n, r, l) {
      for (var a = t._reactName, i = []; null !== n && n !== r;) {
        var o = n,
          s = o.alternate,
          u = o.stateNode;
        if (((o = o.tag), null !== s && s === r)) break;
        ((5 !== o && 26 !== o && 27 !== o) ||
          null === u ||
          ((s = u),
          l
            ? null != (u = $t(n, a)) && i.unshift(nd(n, u, s))
            : l || (null != (u = $t(n, a)) && i.push(nd(n, u, s)))),
          (n = n.return));
      }
      0 !== i.length && e.push({ event: t, listeners: i });
    }
    var id = /\r\n?/g,
      od = /\u0000|\uFFFD/g;
    function sd(e) {
      return ("string" == typeof e ? e : "" + e).replace(id, "\n").replace(od, "");
    }
    function ud(e, t) {
      return ((t = sd(t)), sd(e) === t);
    }
    function cd(e, t, n, r, l, i) {
      switch (n) {
        case "children":
          "string" == typeof r
            ? "body" === t || ("textarea" === t && "" === r) || jt(e, r)
            : ("number" == typeof r || "bigint" == typeof r) && "body" !== t && jt(e, "" + r);
          break;
        case "className":
          ut(e, "class", r);
          break;
        case "tabIndex":
          ut(e, "tabindex", r);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          ut(e, n, r);
          break;
        case "style":
          Nt(e, r, i);
          break;
        case "data":
          if ("object" !== t) {
            ut(e, "data", r);
            break;
          }
        case "src":
        case "href":
          if ("" === r && ("a" !== t || "href" !== n)) {
            e.removeAttribute(n);
            break;
          }
          if (
            null == r ||
            "function" == typeof r ||
            "symbol" == typeof r ||
            "boolean" == typeof r
          ) {
            e.removeAttribute(n);
            break;
          }
          ((r = Lt("" + r)), e.setAttribute(n, r));
          break;
        case "action":
        case "formAction":
          if ("function" == typeof r) {
            e.setAttribute(
              n,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
            );
            break;
          }
          if (
            ("function" == typeof i &&
              ("formAction" === n
                ? ("input" !== t && cd(e, t, "name", l.name, l, null),
                  cd(e, t, "formEncType", l.formEncType, l, null),
                  cd(e, t, "formMethod", l.formMethod, l, null),
                  cd(e, t, "formTarget", l.formTarget, l, null))
                : (cd(e, t, "encType", l.encType, l, null),
                  cd(e, t, "method", l.method, l, null),
                  cd(e, t, "target", l.target, l, null))),
            null == r || "symbol" == typeof r || "boolean" == typeof r)
          ) {
            e.removeAttribute(n);
            break;
          }
          ((r = Lt("" + r)), e.setAttribute(n, r));
          break;
        case "onClick":
          null != r && (e.onclick = Pt);
          break;
        case "onScroll":
          null != r && Yc("scroll", e);
          break;
        case "onScrollEnd":
          null != r && Yc("scrollend", e);
          break;
        case "dangerouslySetInnerHTML":
          if (null != r) {
            if ("object" != typeof r || !("__html" in r)) throw Error(a(61));
            if (null != (n = r.__html)) {
              if (null != l.children) throw Error(a(60));
              e.innerHTML = n;
            }
          }
          break;
        case "multiple":
          e.multiple = r && "function" != typeof r && "symbol" != typeof r;
          break;
        case "muted":
          e.muted = r && "function" != typeof r && "symbol" != typeof r;
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
        case "autoFocus":
          break;
        case "xlinkHref":
          if (
            null == r ||
            "function" == typeof r ||
            "boolean" == typeof r ||
            "symbol" == typeof r
          ) {
            e.removeAttribute("xlink:href");
            break;
          }
          ((n = Lt("" + r)), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n));
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          null != r && "function" != typeof r && "symbol" != typeof r
            ? e.setAttribute(n, "" + r)
            : e.removeAttribute(n);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          r && "function" != typeof r && "symbol" != typeof r
            ? e.setAttribute(n, "")
            : e.removeAttribute(n);
          break;
        case "capture":
        case "download":
          !0 === r
            ? e.setAttribute(n, "")
            : !1 !== r && null != r && "function" != typeof r && "symbol" != typeof r
              ? e.setAttribute(n, r)
              : e.removeAttribute(n);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          null != r && "function" != typeof r && "symbol" != typeof r && !isNaN(r) && 1 <= r
            ? e.setAttribute(n, r)
            : e.removeAttribute(n);
          break;
        case "rowSpan":
        case "start":
          null == r || "function" == typeof r || "symbol" == typeof r || isNaN(r)
            ? e.removeAttribute(n)
            : e.setAttribute(n, r);
          break;
        case "popover":
          (Yc("beforetoggle", e), Yc("toggle", e), st(e, "popover", r));
          break;
        case "xlinkActuate":
          ct(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
          break;
        case "xlinkArcrole":
          ct(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
          break;
        case "xlinkRole":
          ct(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
          break;
        case "xlinkShow":
          ct(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
          break;
        case "xlinkTitle":
          ct(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
          break;
        case "xlinkType":
          ct(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
          break;
        case "xmlBase":
          ct(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
          break;
        case "xmlLang":
          ct(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
          break;
        case "xmlSpace":
          ct(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
          break;
        case "is":
          st(e, "is", r);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          (!(2 < n.length) || ("o" !== n[0] && "O" !== n[0]) || ("n" !== n[1] && "N" !== n[1])) &&
            st(e, (n = _t.get(n) || n), r);
      }
    }
    function dd(e, t, n, r, l, i) {
      switch (n) {
        case "style":
          Nt(e, r, i);
          break;
        case "dangerouslySetInnerHTML":
          if (null != r) {
            if ("object" != typeof r || !("__html" in r)) throw Error(a(61));
            if (null != (n = r.__html)) {
              if (null != l.children) throw Error(a(60));
              e.innerHTML = n;
            }
          }
          break;
        case "children":
          "string" == typeof r
            ? jt(e, r)
            : ("number" == typeof r || "bigint" == typeof r) && jt(e, "" + r);
          break;
        case "onScroll":
          null != r && Yc("scroll", e);
          break;
        case "onScrollEnd":
          null != r && Yc("scrollend", e);
          break;
        case "onClick":
          null != r && (e.onclick = Pt);
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
        case "innerText":
        case "textContent":
          break;
        default:
          nt.hasOwnProperty(n) ||
            ("o" !== n[0] ||
            "n" !== n[1] ||
            ((l = n.endsWith("Capture")),
            (t = n.slice(2, l ? n.length - 7 : void 0)),
            "function" == typeof (i = null == (i = e[He] || null) ? null : i[n]) &&
              e.removeEventListener(t, i, l),
            "function" != typeof r)
              ? n in e
                ? (e[n] = r)
                : !0 === r
                  ? e.setAttribute(n, "")
                  : st(e, n, r)
              : ("function" != typeof i &&
                  null !== i &&
                  (n in e ? (e[n] = null) : e.hasAttribute(n) && e.removeAttribute(n)),
                e.addEventListener(t, r, l)));
      }
    }
    function fd(e, t, n) {
      switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          (Yc("error", e), Yc("load", e));
          var r,
            l = !1,
            i = !1;
          for (r in n)
            if (n.hasOwnProperty(r)) {
              var o = n[r];
              if (null != o)
                switch (r) {
                  case "src":
                    l = !0;
                    break;
                  case "srcSet":
                    i = !0;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(a(137, t));
                  default:
                    cd(e, t, r, o, n, null);
                }
            }
          return (
            i && cd(e, t, "srcSet", n.srcSet, n, null),
            void (l && cd(e, t, "src", n.src, n, null))
          );
        case "input":
          Yc("invalid", e);
          var s = (r = o = i = null),
            u = null,
            c = null;
          for (l in n)
            if (n.hasOwnProperty(l)) {
              var d = n[l];
              if (null != d)
                switch (l) {
                  case "name":
                    i = d;
                    break;
                  case "type":
                    o = d;
                    break;
                  case "checked":
                    u = d;
                    break;
                  case "defaultChecked":
                    c = d;
                    break;
                  case "value":
                    r = d;
                    break;
                  case "defaultValue":
                    s = d;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (null != d) throw Error(a(137, t));
                    break;
                  default:
                    cd(e, t, l, d, n, null);
                }
            }
          return void bt(e, r, s, u, c, o, i, !1);
        case "select":
          for (i in (Yc("invalid", e), (l = o = r = null), n))
            if (n.hasOwnProperty(i) && null != (s = n[i]))
              switch (i) {
                case "value":
                  r = s;
                  break;
                case "defaultValue":
                  o = s;
                  break;
                case "multiple":
                  l = s;
                default:
                  cd(e, t, i, s, n, null);
              }
          return (
            (t = r),
            (n = o),
            (e.multiple = !!l),
            void (null == t ? null != n && wt(e, !!l, n, !0) : wt(e, !!l, t, !1))
          );
        case "textarea":
          for (o in (Yc("invalid", e), (r = i = l = null), n))
            if (n.hasOwnProperty(o) && null != (s = n[o]))
              switch (o) {
                case "value":
                  l = s;
                  break;
                case "defaultValue":
                  i = s;
                  break;
                case "children":
                  r = s;
                  break;
                case "dangerouslySetInnerHTML":
                  if (null != s) throw Error(a(91));
                  break;
                default:
                  cd(e, t, o, s, n, null);
              }
          return void St(e, l, i, r);
        case "option":
          for (u in n)
            if (n.hasOwnProperty(u) && null != (l = n[u]))
              if ("selected" === u)
                e.selected = l && "function" != typeof l && "symbol" != typeof l;
              else cd(e, t, u, l, n, null);
          return;
        case "dialog":
          (Yc("beforetoggle", e), Yc("toggle", e), Yc("cancel", e), Yc("close", e));
          break;
        case "iframe":
        case "object":
          Yc("load", e);
          break;
        case "video":
        case "audio":
          for (l = 0; l < Qc.length; l++) Yc(Qc[l], e);
          break;
        case "image":
          (Yc("error", e), Yc("load", e));
          break;
        case "details":
          Yc("toggle", e);
          break;
        case "embed":
        case "source":
        case "link":
          (Yc("error", e), Yc("load", e));
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (c in n)
            if (n.hasOwnProperty(c) && null != (l = n[c]))
              switch (c) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(a(137, t));
                default:
                  cd(e, t, c, l, n, null);
              }
          return;
        default:
          if (Tt(t)) {
            for (d in n) n.hasOwnProperty(d) && void 0 !== (l = n[d]) && dd(e, t, d, l, n, void 0);
            return;
          }
      }
      for (s in n) n.hasOwnProperty(s) && null != (l = n[s]) && cd(e, t, s, l, n, null);
    }
    function pd(e) {
      switch (e) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return !0;
        default:
          return !1;
      }
    }
    var hd = null,
      md = null;
    function gd(e) {
      return 9 === e.nodeType ? e : e.ownerDocument;
    }
    function yd(e) {
      switch (e) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function vd(e, t) {
      if (0 === e)
        switch (t) {
          case "svg":
            return 1;
          case "math":
            return 2;
          default:
            return 0;
        }
      return 1 === e && "foreignObject" === t ? 0 : e;
    }
    function bd(e, t) {
      return (
        "textarea" === e ||
        "noscript" === e ||
        "string" == typeof t.children ||
        "number" == typeof t.children ||
        "bigint" == typeof t.children ||
        ("object" == typeof t.dangerouslySetInnerHTML &&
          null !== t.dangerouslySetInnerHTML &&
          null != t.dangerouslySetInnerHTML.__html)
      );
    }
    var kd = null;
    var wd = "function" == typeof setTimeout ? setTimeout : void 0,
      xd = "function" == typeof clearTimeout ? clearTimeout : void 0,
      Sd = "function" == typeof Promise ? Promise : void 0,
      jd =
        "function" == typeof queueMicrotask
          ? queueMicrotask
          : void 0 === Sd
            ? wd
            : function (e) {
                return Sd.resolve(null).then(e).catch(Cd);
              };
    function Cd(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function Ed(e) {
      return "head" === e;
    }
    function Nd(e, t) {
      var n = t,
        r = 0;
      do {
        var l = n.nextSibling;
        if ((e.removeChild(n), l && 8 === l.nodeType))
          if ("/$" === (n = l.data) || "/&" === n) {
            if (0 === r) return (e.removeChild(l), void Vf(t));
            r--;
          } else if ("$" === n || "$?" === n || "$~" === n || "$!" === n || "&" === n) r++;
          else if ("html" === n) Id(e.ownerDocument.documentElement);
          else if ("head" === n) {
            Id((n = e.ownerDocument.head));
            for (var a = n.firstChild; a;) {
              var i = a.nextSibling,
                o = a.nodeName;
              (a[Ge] ||
                "SCRIPT" === o ||
                "STYLE" === o ||
                ("LINK" === o && "stylesheet" === a.rel.toLowerCase()) ||
                n.removeChild(a),
                (a = i));
            }
          } else "body" === n && Id(e.ownerDocument.body);
        n = l;
      } while (n);
      Vf(t);
    }
    function Td(e, t) {
      var n = e;
      e = 0;
      do {
        var r = n.nextSibling;
        if (
          (1 === n.nodeType
            ? t
              ? ((n._stashedDisplay = n.style.display), (n.style.display = "none"))
              : ((n.style.display = n._stashedDisplay || ""),
                "" === n.getAttribute("style") && n.removeAttribute("style"))
            : 3 === n.nodeType &&
              (t
                ? ((n._stashedText = n.nodeValue), (n.nodeValue = ""))
                : (n.nodeValue = n._stashedText || "")),
          r && 8 === r.nodeType)
        )
          if ("/$" === (n = r.data)) {
            if (0 === e) break;
            e--;
          } else ("$" !== n && "$?" !== n && "$~" !== n && "$!" !== n) || e++;
        n = r;
      } while (n);
    }
    function _d(e) {
      var t = e.firstChild;
      for (t && 10 === t.nodeType && (t = t.nextSibling); t;) {
        var n = t;
        switch (((t = t.nextSibling), n.nodeName)) {
          case "HTML":
          case "HEAD":
          case "BODY":
            (_d(n), Ke(n));
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if ("stylesheet" === n.rel.toLowerCase()) continue;
        }
        e.removeChild(n);
      }
    }
    function zd(e, t) {
      for (; 8 !== e.nodeType;)
        if (
          ((1 !== e.nodeType || "INPUT" !== e.nodeName || "hidden" !== e.type) && !t) ||
          null === (e = Ad(e.nextSibling))
        )
          return null;
      return e;
    }
    function Ld(e) {
      return "$?" === e.data || "$~" === e.data;
    }
    function Pd(e) {
      return "$!" === e.data || ("$?" === e.data && "loading" !== e.ownerDocument.readyState);
    }
    function Ad(e) {
      for (; null != e; e = e.nextSibling) {
        var t = e.nodeType;
        if (1 === t || 3 === t) break;
        if (8 === t) {
          if (
            "$" === (t = e.data) ||
            "$!" === t ||
            "$?" === t ||
            "$~" === t ||
            "&" === t ||
            "F!" === t ||
            "F" === t
          )
            break;
          if ("/$" === t || "/&" === t) return null;
        }
      }
      return e;
    }
    var Md = null;
    function Od(e) {
      e = e.nextSibling;
      for (var t = 0; e;) {
        if (8 === e.nodeType) {
          var n = e.data;
          if ("/$" === n || "/&" === n) {
            if (0 === t) return Ad(e.nextSibling);
            t--;
          } else ("$" !== n && "$!" !== n && "$?" !== n && "$~" !== n && "&" !== n) || t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function Rd(e) {
      e = e.previousSibling;
      for (var t = 0; e;) {
        if (8 === e.nodeType) {
          var n = e.data;
          if ("$" === n || "$!" === n || "$?" === n || "$~" === n || "&" === n) {
            if (0 === t) return e;
            t--;
          } else ("/$" !== n && "/&" !== n) || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function Dd(e, t, n) {
      switch (((t = gd(n)), e)) {
        case "html":
          if (!(e = t.documentElement)) throw Error(a(452));
          return e;
        case "head":
          if (!(e = t.head)) throw Error(a(453));
          return e;
        case "body":
          if (!(e = t.body)) throw Error(a(454));
          return e;
        default:
          throw Error(a(451));
      }
    }
    function Id(e) {
      for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
      Ke(e);
    }
    var Fd = new Map(),
      $d = new Set();
    function Ud(e) {
      return "function" == typeof e.getRootNode
        ? e.getRootNode()
        : 9 === e.nodeType
          ? e
          : e.ownerDocument;
    }
    var Hd = O.d;
    O.d = {
      f: function () {
        var e = Hd.f(),
          t = Zu();
        return e || t;
      },
      r: function (e) {
        var t = Xe(e);
        null !== t && 5 === t.tag && "form" === t.type ? no(t) : Hd.r(e);
      },
      D: function (e) {
        (Hd.D(e), Wd("dns-prefetch", e, null));
      },
      C: function (e, t) {
        (Hd.C(e, t), Wd("preconnect", e, t));
      },
      L: function (e, t, n) {
        Hd.L(e, t, n);
        var r = Vd;
        if (r && e && t) {
          var l = 'link[rel="preload"][as="' + yt(t) + '"]';
          "image" === t && n && n.imageSrcSet
            ? ((l += '[imagesrcset="' + yt(n.imageSrcSet) + '"]'),
              "string" == typeof n.imageSizes && (l += '[imagesizes="' + yt(n.imageSizes) + '"]'))
            : (l += '[href="' + yt(e) + '"]');
          var a = l;
          switch (t) {
            case "style":
              a = qd(e);
              break;
            case "script":
              a = Kd(e);
          }
          Fd.has(a) ||
            ((e = p(
              { rel: "preload", href: "image" === t && n && n.imageSrcSet ? void 0 : e, as: t },
              n,
            )),
            Fd.set(a, e),
            null !== r.querySelector(l) ||
              ("style" === t && r.querySelector(Qd(a))) ||
              ("script" === t && r.querySelector(Yd(a))) ||
              (fd((t = r.createElement("link")), "link", e), et(t), r.head.appendChild(t)));
        }
      },
      m: function (e, t) {
        Hd.m(e, t);
        var n = Vd;
        if (n && e) {
          var r = t && "string" == typeof t.as ? t.as : "script",
            l = 'link[rel="modulepreload"][as="' + yt(r) + '"][href="' + yt(e) + '"]',
            a = l;
          switch (r) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              a = Kd(e);
          }
          if (
            !Fd.has(a) &&
            ((e = p({ rel: "modulepreload", href: e }, t)),
            Fd.set(a, e),
            null === n.querySelector(l))
          ) {
            switch (r) {
              case "audioworklet":
              case "paintworklet":
              case "serviceworker":
              case "sharedworker":
              case "worker":
              case "script":
                if (n.querySelector(Yd(a))) return;
            }
            (fd((r = n.createElement("link")), "link", e), et(r), n.head.appendChild(r));
          }
        }
      },
      X: function (e, t) {
        Hd.X(e, t);
        var n = Vd;
        if (n && e) {
          var r = Ze(n).hoistableScripts,
            l = Kd(e),
            a = r.get(l);
          a ||
            ((a = n.querySelector(Yd(l))) ||
              ((e = p({ src: e, async: !0 }, t)),
              (t = Fd.get(l)) && ef(e, t),
              et((a = n.createElement("script"))),
              fd(a, "link", e),
              n.head.appendChild(a)),
            (a = { type: "script", instance: a, count: 1, state: null }),
            r.set(l, a));
        }
      },
      S: function (e, t, n) {
        Hd.S(e, t, n);
        var r = Vd;
        if (r && e) {
          var l = Ze(r).hoistableStyles,
            a = qd(e);
          t = t || "default";
          var i = l.get(a);
          if (!i) {
            var o = { loading: 0, preload: null };
            if ((i = r.querySelector(Qd(a)))) o.loading = 5;
            else {
              ((e = p({ rel: "stylesheet", href: e, "data-precedence": t }, n)),
                (n = Fd.get(a)) && Zd(e, n));
              var s = (i = r.createElement("link"));
              (et(s),
                fd(s, "link", e),
                (s._p = new Promise(function (e, t) {
                  ((s.onload = e), (s.onerror = t));
                })),
                s.addEventListener("load", function () {
                  o.loading |= 1;
                }),
                s.addEventListener("error", function () {
                  o.loading |= 2;
                }),
                (o.loading |= 4),
                Jd(i, t, r));
            }
            ((i = { type: "stylesheet", instance: i, count: 1, state: o }), l.set(a, i));
          }
        }
      },
      M: function (e, t) {
        Hd.M(e, t);
        var n = Vd;
        if (n && e) {
          var r = Ze(n).hoistableScripts,
            l = Kd(e),
            a = r.get(l);
          a ||
            ((a = n.querySelector(Yd(l))) ||
              ((e = p({ src: e, async: !0, type: "module" }, t)),
              (t = Fd.get(l)) && ef(e, t),
              et((a = n.createElement("script"))),
              fd(a, "link", e),
              n.head.appendChild(a)),
            (a = { type: "script", instance: a, count: 1, state: null }),
            r.set(l, a));
        }
      },
    };
    var Vd = typeof document > "u" ? null : document;
    function Wd(e, t, n) {
      var r = Vd;
      if (r && "string" == typeof t && t) {
        var l = yt(t);
        ((l = 'link[rel="' + e + '"][href="' + l + '"]'),
          "string" == typeof n && (l += '[crossorigin="' + n + '"]'),
          $d.has(l) ||
            ($d.add(l),
            (e = { rel: e, crossOrigin: n, href: t }),
            null === r.querySelector(l) &&
              (fd((t = r.createElement("link")), "link", e), et(t), r.head.appendChild(t))));
      }
    }
    function Bd(e, t, n, r) {
      var l = (l = q.current) ? Ud(l) : null;
      if (!l) throw Error(a(446));
      switch (e) {
        case "meta":
        case "title":
          return null;
        case "style":
          return "string" == typeof n.precedence && "string" == typeof n.href
            ? ((t = qd(n.href)),
              (r = (n = Ze(l).hoistableStyles).get(t)) ||
                ((r = { type: "style", instance: null, count: 0, state: null }), n.set(t, r)),
              r)
            : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if (
            "stylesheet" === n.rel &&
            "string" == typeof n.href &&
            "string" == typeof n.precedence
          ) {
            e = qd(n.href);
            var i = Ze(l).hoistableStyles,
              o = i.get(e);
            if (
              (o ||
                ((l = l.ownerDocument || l),
                (o = {
                  type: "stylesheet",
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                i.set(e, o),
                (i = l.querySelector(Qd(e))) && !i._p && ((o.instance = i), (o.state.loading = 5)),
                Fd.has(e) ||
                  ((n = {
                    rel: "preload",
                    as: "style",
                    href: n.href,
                    crossOrigin: n.crossOrigin,
                    integrity: n.integrity,
                    media: n.media,
                    hrefLang: n.hrefLang,
                    referrerPolicy: n.referrerPolicy,
                  }),
                  Fd.set(e, n),
                  i ||
                    (function (e, t, n, r) {
                      e.querySelector('link[rel="preload"][as="style"][' + t + "]")
                        ? (r.loading = 1)
                        : ((t = e.createElement("link")),
                          (r.preload = t),
                          t.addEventListener("load", function () {
                            return (r.loading |= 1);
                          }),
                          t.addEventListener("error", function () {
                            return (r.loading |= 2);
                          }),
                          fd(t, "link", n),
                          et(t),
                          e.head.appendChild(t));
                    })(l, e, n, o.state))),
              t && null === r)
            )
              throw Error(a(528, ""));
            return o;
          }
          if (t && null !== r) throw Error(a(529, ""));
          return null;
        case "script":
          return (
            (t = n.async),
            "string" == typeof (n = n.src) && t && "function" != typeof t && "symbol" != typeof t
              ? ((t = Kd(n)),
                (r = (n = Ze(l).hoistableScripts).get(t)) ||
                  ((r = { type: "script", instance: null, count: 0, state: null }), n.set(t, r)),
                r)
              : { type: "void", instance: null, count: 0, state: null }
          );
        default:
          throw Error(a(444, e));
      }
    }
    function qd(e) {
      return 'href="' + yt(e) + '"';
    }
    function Qd(e) {
      return 'link[rel="stylesheet"][' + e + "]";
    }
    function Gd(e) {
      return p({}, e, { "data-precedence": e.precedence, precedence: null });
    }
    function Kd(e) {
      return '[src="' + yt(e) + '"]';
    }
    function Yd(e) {
      return "script[async]" + e;
    }
    function Xd(e, t, n) {
      if ((t.count++, null === t.instance))
        switch (t.type) {
          case "style":
            var r = e.querySelector('style[data-href~="' + yt(n.href) + '"]');
            if (r) return ((t.instance = r), et(r), r);
            var l = p({}, n, {
              "data-href": n.href,
              "data-precedence": n.precedence,
              href: null,
              precedence: null,
            });
            return (
              et((r = (e.ownerDocument || e).createElement("style"))),
              fd(r, "style", l),
              Jd(r, n.precedence, e),
              (t.instance = r)
            );
          case "stylesheet":
            l = qd(n.href);
            var i = e.querySelector(Qd(l));
            if (i) return ((t.state.loading |= 4), (t.instance = i), et(i), i);
            ((r = Gd(n)),
              (l = Fd.get(l)) && Zd(r, l),
              et((i = (e.ownerDocument || e).createElement("link"))));
            var o = i;
            return (
              (o._p = new Promise(function (e, t) {
                ((o.onload = e), (o.onerror = t));
              })),
              fd(i, "link", r),
              (t.state.loading |= 4),
              Jd(i, n.precedence, e),
              (t.instance = i)
            );
          case "script":
            return (
              (i = Kd(n.src)),
              (l = e.querySelector(Yd(i)))
                ? ((t.instance = l), et(l), l)
                : ((r = n),
                  (l = Fd.get(i)) && ef((r = p({}, n)), l),
                  et((l = (e = e.ownerDocument || e).createElement("script"))),
                  fd(l, "link", r),
                  e.head.appendChild(l),
                  (t.instance = l))
            );
          case "void":
            return null;
          default:
            throw Error(a(443, t.type));
        }
      else
        "stylesheet" === t.type &&
          !(4 & t.state.loading) &&
          ((r = t.instance), (t.state.loading |= 4), Jd(r, n.precedence, e));
      return t.instance;
    }
    function Jd(e, t, n) {
      for (
        var r = n.querySelectorAll(
            'link[rel="stylesheet"][data-precedence],style[data-precedence]',
          ),
          l = r.length ? r[r.length - 1] : null,
          a = l,
          i = 0;
        i < r.length;
        i++
      ) {
        var o = r[i];
        if (o.dataset.precedence === t) a = o;
        else if (a !== l) break;
      }
      a
        ? a.parentNode.insertBefore(e, a.nextSibling)
        : (t = 9 === n.nodeType ? n.head : n).insertBefore(e, t.firstChild);
    }
    function Zd(e, t) {
      (e.crossOrigin ?? (e.crossOrigin = t.crossOrigin),
        e.referrerPolicy ?? (e.referrerPolicy = t.referrerPolicy),
        e.title ?? (e.title = t.title));
    }
    function ef(e, t) {
      (e.crossOrigin ?? (e.crossOrigin = t.crossOrigin),
        e.referrerPolicy ?? (e.referrerPolicy = t.referrerPolicy),
        e.integrity ?? (e.integrity = t.integrity));
    }
    var tf = null;
    function nf(e, t, n) {
      if (null === tf) {
        var r = new Map(),
          l = (tf = new Map());
        l.set(n, r);
      } else (r = (l = tf).get(n)) || ((r = new Map()), l.set(n, r));
      if (r.has(e)) return r;
      for (r.set(e, null), n = n.getElementsByTagName(e), l = 0; l < n.length; l++) {
        var a = n[l];
        if (
          !(a[Ge] || a[Ue] || ("link" === e && "stylesheet" === a.getAttribute("rel"))) &&
          "http://www.w3.org/2000/svg" !== a.namespaceURI
        ) {
          var i = a.getAttribute(t) || "";
          i = e + i;
          var o = r.get(i);
          o ? o.push(a) : r.set(i, [a]);
        }
      }
      return r;
    }
    function rf(e, t, n) {
      (e = e.ownerDocument || e).head.insertBefore(
        n,
        "title" === t ? e.querySelector("head > title") : null,
      );
    }
    function lf(e) {
      return !("stylesheet" === e.type && !(3 & e.state.loading));
    }
    var af = 0;
    function of() {
      if ((this.count--, 0 === this.count && (0 === this.imgCount || !this.waitingForImages)))
        if (this.stylesheets) uf(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          ((this.unsuspend = null), e());
        }
    }
    var sf = null;
    function uf(e, t) {
      ((e.stylesheets = null),
        null !== e.unsuspend &&
          (e.count++, (sf = new Map()), t.forEach(cf, e), (sf = null), of.call(e)));
    }
    function cf(e, t) {
      if (!(4 & t.state.loading)) {
        var n = sf.get(e);
        if (n) var r = n.get(null);
        else {
          ((n = new Map()), sf.set(e, n));
          for (
            var l = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0;
            a < l.length;
            a++
          ) {
            var i = l[a];
            ("LINK" === i.nodeName || "not all" !== i.getAttribute("media")) &&
              (n.set(i.dataset.precedence, i), (r = i));
          }
          r && n.set(null, r);
        }
        ((i = (l = t.instance).getAttribute("data-precedence")),
          (a = n.get(i) || r) === r && n.set(null, l),
          n.set(i, l),
          this.count++,
          (r = of.bind(this)),
          l.addEventListener("load", r),
          l.addEventListener("error", r),
          a
            ? a.parentNode.insertBefore(l, a.nextSibling)
            : (e = 9 === e.nodeType ? e.head : e).insertBefore(l, e.firstChild),
          (t.state.loading |= 4));
      }
    }
    var df = {
      $$typeof: w,
      Provider: null,
      Consumer: null,
      _currentValue: R,
      _currentValue2: R,
      _threadCount: 0,
    };
    function ff(e, t, n, r, l, a, i, o, s) {
      ((this.tag = 1),
        (this.containerInfo = e),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = Le(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = Le(0)),
        (this.hiddenUpdates = Le(null)),
        (this.identifierPrefix = r),
        (this.onUncaughtError = l),
        (this.onCaughtError = a),
        (this.onRecoverableError = i),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = s),
        (this.incompleteTransitions = new Map()));
    }
    function pf(e, t, n, r, l, a) {
      ((l = (function (e) {
        return e ? (e = Rr) : Rr;
      })(l)),
        null === r.context ? (r.context = l) : (r.pendingContext = l),
        ((r = va(t)).payload = { element: n }),
        null !== (a = void 0 === a ? null : a) && (r.callback = a),
        null !== (n = ba(e, r, t)) && (Gu(n, 0, t), ka(n, e, t)));
    }
    function hf(e, t) {
      if (null !== (e = e.memoizedState) && null !== e.dehydrated) {
        var n = e.retryLane;
        e.retryLane = 0 !== n && n < t ? n : t;
      }
    }
    function mf(e, t) {
      (hf(e, t), (e = e.alternate) && hf(e, t));
    }
    function gf(e) {
      if (13 === e.tag || 31 === e.tag) {
        var t = Ar(e, 67108864);
        (null !== t && Gu(t, 0, 67108864), mf(e, 67108864));
      }
    }
    function yf(e) {
      if (13 === e.tag || 31 === e.tag) {
        var t = qu(),
          n = Ar(e, (t = Re(t)));
        (null !== n && Gu(n, 0, t), mf(e, t));
      }
    }
    var vf = !0;
    function bf(e, t, n, r) {
      var l = M.T;
      M.T = null;
      var a = O.p;
      try {
        ((O.p = 2), wf(e, t, n, r));
      } finally {
        ((O.p = a), (M.T = l));
      }
    }
    function kf(e, t, n, r) {
      var l = M.T;
      M.T = null;
      var a = O.p;
      try {
        ((O.p = 8), wf(e, t, n, r));
      } finally {
        ((O.p = a), (M.T = l));
      }
    }
    function wf(e, t, n, r) {
      if (vf) {
        var l = xf(r);
        if (null === l) (td(e, t, r, Sf, n), Mf(e, r));
        else if (
          (function (e, t, n, r, l) {
            switch (t) {
              case "focusin":
                return ((Nf = Of(Nf, e, t, n, r, l)), !0);
              case "dragenter":
                return ((Tf = Of(Tf, e, t, n, r, l)), !0);
              case "mouseover":
                return ((_f = Of(_f, e, t, n, r, l)), !0);
              case "pointerover":
                var a = l.pointerId;
                return (zf.set(a, Of(zf.get(a) || null, e, t, n, r, l)), !0);
              case "gotpointercapture":
                return ((a = l.pointerId), Lf.set(a, Of(Lf.get(a) || null, e, t, n, r, l)), !0);
            }
            return !1;
          })(l, e, t, n, r)
        )
          r.stopPropagation();
        else if ((Mf(e, r), 4 & t && -1 < Af.indexOf(e))) {
          for (; null !== l;) {
            var a = Xe(l);
            if (null !== a)
              switch (a.tag) {
                case 3:
                  if ((a = a.stateNode).current.memoizedState.isDehydrated) {
                    var i = Ee(a.pendingLanes);
                    if (0 !== i) {
                      var o = a;
                      for (o.pendingLanes |= 2, o.entangledLanes |= 2; i;) {
                        var s = 1 << (31 - ke(i));
                        ((o.entanglements[1] |= s), (i &= ~s));
                      }
                      (Oc(a), !(6 & pu) && ((Mu = se() + 500), Rc(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  (null !== (o = Ar(a, 2)) && Gu(o, 0, 2), Zu(), mf(a, 2));
              }
            if ((null === (a = xf(r)) && td(e, t, r, Sf, n), a === l)) break;
            l = a;
          }
          null !== l && r.stopPropagation();
        } else td(e, t, r, null, n);
      }
    }
    function xf(e) {
      return jf((e = Mt(e)));
    }
    var Sf = null;
    function jf(e) {
      if (((Sf = null), null !== (e = Ye(e)))) {
        var t = s(e);
        if (null === t) e = null;
        else {
          var n = t.tag;
          if (13 === n) {
            if (null !== (e = u(t))) return e;
            e = null;
          } else if (31 === n) {
            if (null !== (e = c(t))) return e;
            e = null;
          } else if (3 === n) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return 3 === t.tag ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return ((Sf = e), null);
    }
    function Cf(e) {
      switch (e) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (ue()) {
            case ce:
              return 2;
            case de:
              return 8;
            case fe:
            case pe:
              return 32;
            case he:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Ef = !1,
      Nf = null,
      Tf = null,
      _f = null,
      zf = new Map(),
      Lf = new Map(),
      Pf = [],
      Af =
        "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
          " ",
        );
    function Mf(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Nf = null;
          break;
        case "dragenter":
        case "dragleave":
          Tf = null;
          break;
        case "mouseover":
        case "mouseout":
          _f = null;
          break;
        case "pointerover":
        case "pointerout":
          zf.delete(t.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Lf.delete(t.pointerId);
      }
    }
    function Of(e, t, n, r, l, a) {
      return null === e || e.nativeEvent !== a
        ? ((e = {
            blockedOn: t,
            domEventName: n,
            eventSystemFlags: r,
            nativeEvent: a,
            targetContainers: [l],
          }),
          null !== t && null !== (t = Xe(t)) && gf(t),
          e)
        : ((e.eventSystemFlags |= r),
          (t = e.targetContainers),
          null !== l && -1 === t.indexOf(l) && t.push(l),
          e);
    }
    function Rf(e) {
      var t = Ye(e.target);
      if (null !== t) {
        var n = s(t);
        if (null !== n)
          if (13 === (t = n.tag)) {
            if (null !== (t = u(n)))
              return (
                (e.blockedOn = t),
                void Fe(e.priority, function () {
                  yf(n);
                })
              );
          } else if (31 === t) {
            if (null !== (t = c(n)))
              return (
                (e.blockedOn = t),
                void Fe(e.priority, function () {
                  yf(n);
                })
              );
          } else if (3 === t && n.stateNode.current.memoizedState.isDehydrated)
            return void (e.blockedOn = 3 === n.tag ? n.stateNode.containerInfo : null);
      }
      e.blockedOn = null;
    }
    function Df(e) {
      if (null !== e.blockedOn) return !1;
      for (var t = e.targetContainers; 0 < t.length;) {
        var n = xf(e.nativeEvent);
        if (null !== n) return (null !== (t = Xe(n)) && gf(t), (e.blockedOn = n), !1);
        var r = new (n = e.nativeEvent).constructor(n.type, n);
        ((At = r), n.target.dispatchEvent(r), (At = null), t.shift());
      }
      return !0;
    }
    function If(e, t, n) {
      Df(e) && n.delete(t);
    }
    function Ff() {
      ((Ef = !1),
        null !== Nf && Df(Nf) && (Nf = null),
        null !== Tf && Df(Tf) && (Tf = null),
        null !== _f && Df(_f) && (_f = null),
        zf.forEach(If),
        Lf.forEach(If));
    }
    function $f(e, n) {
      e.blockedOn === n &&
        ((e.blockedOn = null),
        Ef || ((Ef = !0), t.unstable_scheduleCallback(t.unstable_NormalPriority, Ff)));
    }
    var Uf = null;
    function Hf(e) {
      Uf !== e &&
        ((Uf = e),
        t.unstable_scheduleCallback(t.unstable_NormalPriority, function () {
          Uf === e && (Uf = null);
          for (var t = 0; t < e.length; t += 3) {
            var n = e[t],
              r = e[t + 1],
              l = e[t + 2];
            if ("function" != typeof r) {
              if (null === jf(r || n)) continue;
              break;
            }
            var a = Xe(n);
            null !== a &&
              (e.splice(t, 3),
              (t -= 3),
              eo(a, { pending: !0, data: l, method: n.method, action: r }, r, l));
          }
        }));
    }
    function Vf(e) {
      function t(t) {
        return $f(t, e);
      }
      (null !== Nf && $f(Nf, e),
        null !== Tf && $f(Tf, e),
        null !== _f && $f(_f, e),
        zf.forEach(t),
        Lf.forEach(t));
      for (var n = 0; n < Pf.length; n++) {
        var r = Pf[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
      for (; 0 < Pf.length && null === (n = Pf[0]).blockedOn;)
        (Rf(n), null === n.blockedOn && Pf.shift());
      if (null != (n = (e.ownerDocument || e).$$reactFormReplay))
        for (r = 0; r < n.length; r += 3) {
          var l = n[r],
            a = n[r + 1],
            i = l[He] || null;
          if ("function" == typeof a) i || Hf(n);
          else if (i) {
            var o = null;
            if (a && a.hasAttribute("formAction")) {
              if (((l = a), (i = a[He] || null))) o = i.formAction;
              else if (null !== jf(l)) continue;
            } else o = i.action;
            ("function" == typeof o ? (n[r + 1] = o) : (n.splice(r, 3), (r -= 3)), Hf(n));
          }
        }
    }
    function Wf() {
      function e(e) {
        e.canIntercept &&
          "react-transition" === e.info &&
          e.intercept({
            handler: function () {
              return new Promise(function (e) {
                return (l = e);
              });
            },
            focusReset: "manual",
            scroll: "manual",
          });
      }
      function t() {
        (null !== l && (l(), (l = null)), r || setTimeout(n, 20));
      }
      function n() {
        if (!r && !navigation.transition) {
          var e = navigation.currentEntry;
          e &&
            null != e.url &&
            navigation.navigate(e.url, {
              state: e.getState(),
              info: "react-transition",
              history: "replace",
            });
        }
      }
      if ("object" == typeof navigation) {
        var r = !1,
          l = null;
        return (
          navigation.addEventListener("navigate", e),
          navigation.addEventListener("navigatesuccess", t),
          navigation.addEventListener("navigateerror", t),
          setTimeout(n, 100),
          function () {
            ((r = !0),
              navigation.removeEventListener("navigate", e),
              navigation.removeEventListener("navigatesuccess", t),
              navigation.removeEventListener("navigateerror", t),
              null !== l && (l(), (l = null)));
          }
        );
      }
    }
    function Bf(e) {
      this._internalRoot = e;
    }
    function qf(e) {
      this._internalRoot = e;
    }
    ((qf.prototype.render = Bf.prototype.render =
      function (e) {
        var t = this._internalRoot;
        if (null === t) throw Error(a(409));
        pf(t.current, qu(), e, t, null, null);
      }),
      (qf.prototype.unmount = Bf.prototype.unmount =
        function () {
          var e = this._internalRoot;
          if (null !== e) {
            this._internalRoot = null;
            var t = e.containerInfo;
            (pf(e.current, 2, null, e, null, null), Zu(), (t[Ve] = null));
          }
        }),
      (qf.prototype.unstable_scheduleHydration = function (e) {
        if (e) {
          var t = Ie();
          e = { blockedOn: null, target: e, priority: t };
          for (var n = 0; n < Pf.length && 0 !== t && t < Pf[n].priority; n++);
          (Pf.splice(n, 0, e), 0 === n && Rf(e));
        }
      }));
    var Qf = r.version;
    if ("19.2.6" !== Qf) throw Error(a(527, Qf, "19.2.6"));
    O.findDOMNode = function (e) {
      var t = e._reactInternals;
      if (void 0 === t)
        throw "function" == typeof e.render
          ? Error(a(188))
          : ((e = Object.keys(e).join(",")), Error(a(268, e)));
      return (
        (e = (function (e) {
          var t = e.alternate;
          if (!t) {
            if (null === (t = s(e))) throw Error(a(188));
            return t === e ? e : null;
          }
          for (var n = e, r = t; ;) {
            var l = n.return;
            if (null === l) break;
            var i = l.alternate;
            if (null === i) {
              if (null !== (r = l.return)) {
                n = r;
                continue;
              }
              break;
            }
            if (l.child === i.child) {
              for (i = l.child; i;) {
                if (i === n) return (d(l), e);
                if (i === r) return (d(l), t);
                i = i.sibling;
              }
              throw Error(a(188));
            }
            if (n.return !== r.return) ((n = l), (r = i));
            else {
              for (var o = !1, u = l.child; u;) {
                if (u === n) {
                  ((o = !0), (n = l), (r = i));
                  break;
                }
                if (u === r) {
                  ((o = !0), (r = l), (n = i));
                  break;
                }
                u = u.sibling;
              }
              if (!o) {
                for (u = i.child; u;) {
                  if (u === n) {
                    ((o = !0), (n = i), (r = l));
                    break;
                  }
                  if (u === r) {
                    ((o = !0), (r = i), (n = l));
                    break;
                  }
                  u = u.sibling;
                }
                if (!o) throw Error(a(189));
              }
            }
            if (n.alternate !== r) throw Error(a(190));
          }
          if (3 !== n.tag) throw Error(a(188));
          return n.stateNode.current === n ? e : t;
        })(t)),
        (e = null === (e = null === e ? null : f(e)) ? null : e.stateNode)
      );
    };
    var Gf = {
      bundleType: 0,
      version: "19.2.6",
      rendererPackageName: "react-dom",
      currentDispatcherRef: M,
      reconcilerVersion: "19.2.6",
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
      var Kf = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Kf.isDisabled && Kf.supportsFiber)
        try {
          ((ye = Kf.inject(Gf)), (ve = Kf));
        } catch {}
    }
    e.createRoot = function (e, t) {
      if (
        !(function (e) {
          return !(!e || (1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType));
        })(e)
      )
        throw Error(a(299));
      var n = !1,
        r = "",
        l = jo,
        i = Co,
        o = Eo;
      return (
        null != t &&
          (!0 === t.unstable_strictMode && (n = !0),
          void 0 !== t.identifierPrefix && (r = t.identifierPrefix),
          void 0 !== t.onUncaughtError && (l = t.onUncaughtError),
          void 0 !== t.onCaughtError && (i = t.onCaughtError),
          void 0 !== t.onRecoverableError && (o = t.onRecoverableError)),
        (t = (function (e, t, n, r, l, a, i, o, s, u, c, d) {
          return (
            (e = new ff(e, t, n, i, s, u, c, d, o)),
            (t = 1),
            !0 === a && (t |= 24),
            (a = Ir(3, null, null, t)),
            (e.current = a),
            (a.stateNode = e),
            (t = Fl()).refCount++,
            (e.pooledCache = t),
            t.refCount++,
            (a.memoizedState = { element: r, isDehydrated: n, cache: t }),
            ga(a),
            e
          );
        })(e, 1, !1, null, 0, n, r, null, l, i, o, Wf)),
        (e[Ve] = t.current),
        Zc(e),
        new Bf(t)
      );
    };
  }),
  c = e((e, t) => {
    ((function e() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        "function" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
        } catch (e) {
          console.error(e);
        }
    })(),
      (t.exports = s()));
  }),
  l = e((e) => {
    var t = Symbol.for("react.transitional.element"),
      n = Symbol.for("react.fragment");
    function r(e, n, r) {
      var l = null;
      if ((void 0 !== r && (l = "" + r), void 0 !== n.key && (l = "" + n.key), "key" in n))
        for (var a in ((r = {}), n)) "key" !== a && (r[a] = n[a]);
      else r = n;
      return (
        (n = r.ref),
        { $$typeof: t, type: e, key: l, ref: void 0 === n ? null : n, props: r }
      );
    }
    ((e.Fragment = n), (e.jsx = r), (e.jsxs = r));
  }),
  u = e((e, t) => {
    t.exports = l();
  }),
  d = c(),
  f = n(),
  p = u(),
  m = {
    generatedAt: "",
    total: 0,
    watchedCount: 0,
    eligibleWatchedCount: 0,
    recommendationsCount: 0,
    shows: [],
    watchedArchive: [],
  },
  h = { generatedAt: "", collections: [] },
  g = { generatedAt: "", total: 0, rule: "", source: "", rawCompletedDramaCount: 0, shows: [] },
  _ = ({ name: e, size: t = 20 }) =>
    (0, p.jsx)("svg", {
      width: t,
      height: t,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: {
        search: (0, p.jsxs)(p.Fragment, {
          children: [
            (0, p.jsx)("circle", { cx: "11", cy: "11", r: "7" }),
            (0, p.jsx)("path", { d: "m20 20-4-4" }),
          ],
        }),
        play: (0, p.jsx)("path", { d: "m8 5 11 7-11 7Z", fill: "currentColor", stroke: "none" }),
        info: (0, p.jsxs)(p.Fragment, {
          children: [
            (0, p.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
            (0, p.jsx)("path", { d: "M12 11v6M12 7.5h.01" }),
          ],
        }),
        plus: (0, p.jsx)("path", { d: "M12 5v14M5 12h14" }),
        check: (0, p.jsx)("path", { d: "m5 12 4 4L19 6" }),
        eye: (0, p.jsxs)(p.Fragment, {
          children: [
            (0, p.jsx)("path", { d: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" }),
            (0, p.jsx)("circle", { cx: "12", cy: "12", r: "2.5" }),
          ],
        }),
        close: (0, p.jsx)("path", { d: "m6 6 12 12M18 6 6 18" }),
        chevron: (0, p.jsx)("path", { d: "m9 18 6-6-6-6" }),
        down: (0, p.jsx)("path", { d: "m6 9 6 6 6-6" }),
        external: (0, p.jsxs)(p.Fragment, {
          children: [
            (0, p.jsx)("path", { d: "M14 5h5v5M19 5l-8 8" }),
            (0, p.jsx)("path", { d: "M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" }),
          ],
        }),
        menu: (0, p.jsx)("path", { d: "M4 7h16M4 12h16M4 17h16" }),
        spark: (0, p.jsx)("path", {
          d: "m12 2 1.5 5.2L19 9l-5.5 1.8L12 16l-1.5-5.2L5 9l5.5-1.8L12 2Z",
        }),
        clock: (0, p.jsxs)(p.Fragment, {
          children: [
            (0, p.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
            (0, p.jsx)("path", { d: "M12 7v5l3 2" }),
          ],
        }),
      }[e],
    }),
  v = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }),
  y = (e) =>
    e
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase(),
  b = (e) =>
    e.runtimeHours
      ? `${e.runtimeHours}h total`
      : e.kDramaArchive
        ? "Runtime varies"
        : "Runtime unavailable",
  x = (e) => !0 === e.kDramaArchive || "South Korea" === e.country || "Korean" === e.language;
var TOP_FIVE_COUNTRIES = ["United States", "United Kingdom", "South Korea", "Japan", "China"],
  TOP_FIVE_LANGUAGES = ["English", "Korean", "Japanese", "Chinese"],
  UNPLACED_COUNTRIES = ["", "International", "Unknown", "Various"],
  MIN_RUNTIME_HOURS = 4,
  MAX_RUNTIME_HOURS = 60,
  KDRAMA_MIN_YEAR = 2010,
  HANGUL_INITIALS = [
    "g",
    "kk",
    "n",
    "d",
    "tt",
    "r",
    "m",
    "b",
    "pp",
    "s",
    "ss",
    "",
    "j",
    "jj",
    "ch",
    "k",
    "t",
    "p",
    "h",
  ],
  HANGUL_MEDIALS = [
    "a",
    "ae",
    "ya",
    "yae",
    "eo",
    "e",
    "yeo",
    "ye",
    "o",
    "wa",
    "wae",
    "oe",
    "yo",
    "u",
    "wo",
    "we",
    "wi",
    "yu",
    "eu",
    "ui",
    "i",
  ],
  HANGUL_FINALS = [
    "",
    "k",
    "k",
    "ks",
    "n",
    "nj",
    "nh",
    "t",
    "l",
    "lk",
    "lm",
    "lp",
    "ls",
    "lt",
    "lp",
    "lh",
    "m",
    "p",
    "ps",
    "t",
    "t",
    "ng",
    "t",
    "t",
    "k",
    "t",
    "p",
    "h",
  ],
  PLOT_MATCH_MIN = 0.4,
  PLOT_MATCH_MARGIN = 1.3,
  TITLE_STOP_WORDS = [
    "of",
    "and",
    "in",
    "on",
    "to",
    "my",
    "is",
    "it",
    "that",
    "this",
    "with",
    "for",
    "you",
    "me",
    "we",
    "who",
    "s",
    "are",
    "be",
    "at",
    "by",
    "from",
    "i",
  ],
  EXCLUSIONS_STORAGE_KEY = "morningstar-exclusions",
  EXCLUSION_DEFAULTS = {
    outsideTopFive: !0,
    kdrama: !1,
    kdramaBefore2010: !0,
    underFourHours: !0,
    overSixtyHours: !0,
  },
  EXCLUSION_OPTIONS = [
    {
      id: "outsideTopFive",
      label: "Outside the top 5 countries",
      note: "Keeps USA, UK, Korea, Japan and China only",
    },
    { id: "kdrama", label: "K-dramas", note: "Hides every Korean series" },
    {
      id: "kdramaBefore2010",
      label: "K-dramas before 2010",
      note: "Older Korean series stay out",
    },
    {
      id: "underFourHours",
      label: "Under 4 hours total",
      note: `Skips anything below ${MIN_RUNTIME_HOURS} viewing hours`,
    },
    {
      id: "overSixtyHours",
      label: "Over 60 hours total",
      note: `Skips anything above ${MAX_RUNTIME_HOURS} viewing hours`,
    },
  ];
function isTopFiveOrigin(e) {
  return (
    TOP_FIVE_COUNTRIES.includes(e.country) ||
    (UNPLACED_COUNTRIES.includes(e.country || "") && TOP_FIVE_LANGUAGES.includes(e.language))
  );
}
function passesExclusions(e, t) {
  return !(
    (t.kdrama && x(e)) ||
    (t.outsideTopFive && !isTopFiveOrigin(e)) ||
    (t.kdramaBefore2010 && x(e) && "number" == typeof e.year && e.year < KDRAMA_MIN_YEAR) ||
    (t.underFourHours && e.runtimeHours && e.runtimeHours < MIN_RUNTIME_HOURS) ||
    (t.overSixtyHours && e.runtimeHours && e.runtimeHours > MAX_RUNTIME_HOURS)
  );
}
function countActiveExclusions(e) {
  return EXCLUSION_OPTIONS.filter((t) => !!e[t.id]).length;
}
function hasCustomExclusions(e) {
  return EXCLUSION_OPTIONS.some((t) => !!e[t.id] !== !!EXCLUSION_DEFAULTS[t.id]);
}
function readStoredExclusions() {
  try {
    let e = JSON.parse(localStorage.getItem(EXCLUSIONS_STORAGE_KEY) || "null");
    return e && "object" == typeof e ? { ...EXCLUSION_DEFAULTS, ...e } : { ...EXCLUSION_DEFAULTS };
  } catch {
    return { ...EXCLUSION_DEFAULTS };
  }
}
function normaliseTitleKey(e) {
  return (e || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\b(?:the|a|an)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function isLatinTitle(e) {
  return !!e && !/[^\p{Script=Latin}\p{N}\p{P}\p{S}\p{Zs}]/u.test(e);
}
function romaniseHangul(e) {
  let t = "";
  for (let n of e || "") {
    let e = n.codePointAt(0);
    if (e >= 44032 && e <= 55203) {
      let n = e - 44032;
      t +=
        HANGUL_INITIALS[Math.floor(n / 588)] +
        HANGUL_MEDIALS[Math.floor((n % 588) / 28)] +
        HANGUL_FINALS[n % 28];
    } else t += n;
  }
  return t;
}
function nativeTitleKey(e) {
  return e.originalTitle
    ? normaliseTitleKey(romaniseHangul(e.originalTitle)).replace(/ /g, "")
    : "";
}
function isSameNativeTitle(e, t) {
  let n = nativeTitleKey(e),
    r = nativeTitleKey(t);
  return (
    !!n &&
    !!r &&
    n.length > 3 &&
    r.length > 3 &&
    "number" == typeof e.year &&
    "number" == typeof t.year &&
    Math.abs(e.year - t.year) <= 1 &&
    titleSimilarity(n, r) >= 0.65
  );
}
function plotTokens(e) {
  return (e || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((e) => e.length > 3);
}
function buildPlotScorer(e) {
  let documentFrequency = new Map();
  for (let t of e)
    for (let e of new Set(plotTokens(t.shortPlot)))
      documentFrequency.set(e, (documentFrequency.get(e) || 0) + 1);
  let corpusSize = Math.max(e.length, 1),
    unseenWeight = Math.log(corpusSize + 1);
  return (e) => {
    let termCounts = new Map();
    for (let t of plotTokens(e)) termCounts.set(t, (termCounts.get(t) || 0) + 1);
    let magnitude = 0;
    for (let [term, count] of termCounts) {
      let weight =
        count *
        (documentFrequency.has(term)
          ? Math.log(corpusSize / (documentFrequency.get(term) + 1))
          : unseenWeight);
      (termCounts.set(term, weight), (magnitude += weight * weight));
    }
    magnitude = Math.sqrt(magnitude) || 1;
    for (let [term, weight] of termCounts) termCounts.set(term, weight / magnitude);
    return termCounts;
  };
}
function plotSimilarity(e, t) {
  let n = 0;
  for (let [r, l] of e) {
    let e = t.get(r);
    e && (n += l * e);
  }
  return n;
}
function showTitleKeys(e) {
  let t = new Set();
  for (let n of [e.title, e.originalTitle]) {
    let r = normaliseTitleKey(n);
    r && t.add(r);
  }
  return [...t];
}
function isSameSeries(e, t) {
  if (e.imdbId && t.imdbId) return e.imdbId === t.imdbId;
  if ("number" != typeof e.year || "number" != typeof t.year) return !1;
  let n = e.country || "",
    r = t.country || "",
    l = UNPLACED_COUNTRIES.includes(n) || UNPLACED_COUNTRIES.includes(r),
    a = Math.abs(e.year - t.year);
  return (
    !(a > 1) &&
    !(a > 0 && !l) &&
    !(e.episodes && t.episodes && Math.abs(e.episodes - t.episodes) > 2) &&
    (n === r || l || (!!e.language && e.language === t.language))
  );
}
function titleBigrams(e) {
  let t = e.replace(/ /g, ""),
    n = new Set();
  for (let e = 0; e < t.length - 1; e += 1) n.add(t.slice(e, e + 2));
  return n;
}
function titleSimilarity(e, t) {
  let n = titleBigrams(e),
    r = titleBigrams(t);
  if (!n.size || !r.size) return 0;
  let l = 0;
  for (let e of n) r.has(e) && (l += 1);
  return (2 * l) / (n.size + r.size);
}
function titleTokens(e) {
  return new Set(
    normaliseTitleKey(e)
      .split(" ")
      .filter((e) => e && !TITLE_STOP_WORDS.includes(e)),
  );
}
function sharesDistinctiveTokens(e, t) {
  let n = titleTokens(e),
    r = titleTokens(t),
    l = Math.min(n.size, r.size),
    a = 0;
  for (let e of n) r.has(e) && (a += 1);
  return l >= 2 && a >= 2 && a / l >= 0.7;
}
function sameEpisodeShape(e, t) {
  return e.episodeRuntime && t.episodeRuntime
    ? Math.abs(e.episodeRuntime - t.episodeRuntime) <=
        0.2 * Math.max(e.episodeRuntime, t.episodeRuntime)
    : !!e.runtimeHours &&
        !!t.runtimeHours &&
        Math.abs(e.runtimeHours - t.runtimeHours) <=
          0.25 * Math.max(e.runtimeHours, t.runtimeHours);
}
function episodeCountsCompatible(e, t) {
  if (!e.episodes || !t.episodes) return !0;
  let n = Math.max(e.episodes, t.episodes),
    r = Math.min(e.episodes, t.episodes);
  return n - r <= 1 || (Math.abs(n - 2 * r) <= 1 && sameEpisodeShape(e, t));
}
function isSameTranslatedSeries(e, t) {
  return (
    e.year === t.year &&
    (e.country || "") === (t.country || "") &&
    episodeCountsCompatible(e, t) &&
    (titleSimilarity(normaliseTitleKey(e.title), normaliseTitleKey(t.title)) >= 0.65 ||
      sharesDistinctiveTokens(e.title, t.title))
  );
}
function seriesRecordScore(e) {
  let t = 0;
  return (
    e.rank && (t += 8),
    !0 !== e.kDramaArchive && (t += 10),
    isLatinTitle(e.title) && (t += 3),
    e.imdbRating && (t += 2),
    e.image && (t += 1),
    e.shortPlot && (t += 1),
    e.runtimeHours && (t += 1),
    t
  );
}
function mergeSeriesGroup(e) {
  if (1 === e.length) return e[0];
  let t = [...e].sort((e, t) => seriesRecordScore(t) - seriesRecordScore(e)),
    n = { ...t[0] },
    r = new Set(t[0].aliasIds || []);
  for (let e of t.slice(1)) {
    (r.add(e.id), (e.aliasIds || []).forEach((e) => r.add(e)));
    for (let t of Object.keys(e))
      (null == n[t] || "" === n[t] || (Array.isArray(n[t]) && !n[t].length)) && (n[t] = e[t]);
    ((n.watched = !!n.watched || !!e.watched),
      !0 === e.kDramaArchive && (n.kDramaArchive = !0),
      UNPLACED_COUNTRIES.includes(n.country || "") &&
        !UNPLACED_COUNTRIES.includes(e.country || "") &&
        (n.country = e.country),
      (n.genres = [...new Set([...(n.genres || []), ...(e.genres || [])])]),
      !n.originalTitle &&
        e.title !== n.title &&
        !isLatinTitle(e.title) &&
        (n.originalTitle = e.title));
  }
  return ((n.aliasIds = [...r].filter((e) => e !== n.id)), preferNativeOriginalTitle(n, t));
}
function preferNativeOriginalTitle(e, t) {
  let n = [],
    r = [];
  for (let e of t) e.originalTitle && (isLatinTitle(e.originalTitle) ? r : n).push(e.originalTitle);
  n.length && ((e.romanisedTitle = r.find((t) => t !== e.title) || ""), (e.originalTitle = n[0]));
  let l = new Set();
  for (let n of t)
    for (let t of [n.title, n.originalTitle])
      t &&
        t !== e.title &&
        t !== e.originalTitle &&
        t !== e.romanisedTitle &&
        isLatinTitle(t) &&
        l.add(t);
  return (l.size && (e.alternativeTitles = [...l]), e);
}
function archiveYearIndex(e) {
  let t = new Map();
  for (let n of e.values())
    !0 === n.kDramaArchive &&
      "number" == typeof n.year &&
      (t.get(n.year) || t.set(n.year, []).get(n.year)).push(n);
  return t;
}
function archiveCandidates(e, t) {
  return [...(e.get(t - 1) || []), ...(e.get(t) || []), ...(e.get(t + 1) || [])];
}
function crossSourceMatchScore(e, t, n) {
  if (digitsConflict(e, t)) return 0;
  let r = 0;
  if (isSameTranslatedSeries(e, t)) {
    let n = titleSimilarity(normaliseTitleKey(e.title), normaliseTitleKey(t.title));
    r = Math.max(r, Math.max(n, sharesDistinctiveTokens(e.title, t.title) ? 0.7 : 0));
  }
  return (
    isSameNativeTitle(e, t) &&
      (r = Math.max(r, titleSimilarity(nativeTitleKey(e), nativeTitleKey(t)))),
    n && (r = Math.max(r, n)),
    r
  );
}
function digitsConflict(e, t) {
  let n = `${e.title} ${e.originalTitle || ""}`.match(/\d+/g) || [],
    r = `${t.title} ${romaniseHangul(t.originalTitle || "")}`.match(/\d+/g) || [];
  return !!n.length && !!r.length && n.sort().join(",") !== r.sort().join(",");
}
function matchCrossSourceRecords(e, t, n) {
  let r = [],
    l = [];
  for (let n of e.values())
    !0 === n.kDramaArchive ? l.push(n) : x(n) && "number" == typeof n.year && !t(n) && r.push(n);
  if (!r.length || !l.length) return [];
  let a = buildPlotScorer(l),
    i = new Map(),
    o = (e) => (i.has(e.id) || i.set(e.id, a(e.shortPlot || "")), i.get(e.id)),
    s = [];
  for (let e of r) {
    let t = null,
      r = 0,
      l = 0,
      a = 0;
    for (let i of archiveCandidates(n, e.year)) {
      let n = 0;
      (e.shortPlot &&
        i.shortPlot &&
        episodeCountsCompatible(e, i) &&
        (n = plotSimilarity(o(e), o(i))),
        n > l ? ((a = l), (l = n)) : n > a && (a = n));
      let s = crossSourceMatchScore(e, i, n >= PLOT_MATCH_MIN ? n : 0);
      s > r && ((r = s), (t = i));
    }
    t &&
      r > 0 &&
      (r >= 0.65 || (l >= PLOT_MATCH_MIN && l >= a * PLOT_MATCH_MARGIN)) &&
      s.push({ catalogue: e, archive: t, score: r });
  }
  s.sort((e, t) => t.score - e.score);
  let u = new Set(),
    d = new Set(),
    c = [];
  for (let { catalogue: e, archive: t } of s)
    u.has(e.id) || d.has(t.id) || (u.add(e.id), d.add(t.id), c.push([e.id, t.id]));
  return c;
}
function buildMergedCatalogue(e) {
  let t = new Map();
  for (let n of e) {
    let e = t.get(n.id);
    t.set(n.id, e ? mergeSeriesGroup([e, n]) : { ...n });
  }
  let n = new Map();
  for (let e of t.values())
    for (let t of showTitleKeys(e)) (n.get(t) || n.set(t, []).get(t)).push(e);
  let r = new Map(),
    l = (e) => (r.get(e) === e ? e : (r.set(e, l(r.get(e))), r.get(e))),
    i = (e, t) => {
      let n = l(e),
        a = l(t);
      n !== a && r.set(a, n);
    };
  for (let e of t.keys()) r.set(e, e);
  for (let e of n.values())
    for (let t = 0; t < e.length; t += 1)
      for (let n = t + 1; n < e.length; n += 1) isSameSeries(e[t], e[n]) && i(e[t].id, e[n].id);
  let o = archiveYearIndex(t),
    s = new Set();
  for (let e of t.values()) !0 === e.kDramaArchive && s.add(l(e.id));
  for (let [e, n] of matchCrossSourceRecords(t, (e) => s.has(l(e.id)), o)) i(e, n);
  let a = new Map();
  for (let e of t.values()) {
    let t = l(e.id);
    (a.get(t) || a.set(t, []).get(t)).push(e);
  }
  return [...a.values()].map(mergeSeriesGroup);
}
function hasShowId(e, t) {
  return !!e && (e.has(t.id) || !!t.aliasIds?.some((t) => e.has(t)));
}
function randomSeed() {
  if (globalThis.crypto?.getRandomValues) {
    let e = new Uint32Array(1);
    return (globalThis.crypto.getRandomValues(e), e[0] || 1);
  }
  return (Date.now() ^ Math.floor(4294967296 * Math.random())) >>> 0;
}
function ee(e, t) {
  let n = (2654435769 ^ t) >>> 0;
  for (let t = 0; t < e.length; t += 1) n = Math.imul(n ^ e.charCodeAt(t), 16777619);
  return (
    (n += n << 13),
    (n ^= n >>> 7),
    (n += n << 3),
    (n ^= n >>> 17),
    (n += n << 5),
    (n >>> 0) / 4294967296
  );
}
function S(e, t) {
  return [...e].sort((e, n) => ee(e.id, t) - ee(n.id, t));
}
function C(e) {
  let t = `For the TV series "${e.title}" (${e.year}), answer only these two questions without spoilers: 1) Does it have a happy or satisfying ending? 2) Does it include romance, and how prominent is the romance? Do not reveal plot twists, deaths, pairings, or ending details. If the title is ambiguous, use the year and country (${e.country}) to identify it.`;
  return `https://chatgpt.com/?q=${encodeURIComponent(t)}`;
}
function te(e) {
  let t = `${e.title} (${e.year ?? "year unknown"}, ${e.country})`;
  return `https://chatgpt.com/?q=${encodeURIComponent(t)}`;
}
function ne({ show: e, entry: t, onOpen: n, inList: r, isWatched: l, onToggleList: a }) {
  return (0, p.jsxs)("article", {
    className: "show-card",
    onClick: n,
    tabIndex: 0,
    role: "button",
    onKeyDown: (e) => "Enter" === e.key && n(),
    "aria-label": `Open ${e.title}`,
    children: [
      (0, p.jsxs)("div", {
        className: "poster-shell",
        children: [
          (0, p.jsx)("div", {
            className: "poster-fallback poster-error-fallback",
            children: (0, p.jsx)("span", { children: e.title }),
          }),
          e.image
            ? (0, p.jsx)("img", {
                src: e.image,
                alt: `${e.title} poster`,
                loading: "lazy",
                decoding: "async",
                onError: (e) => {
                  e.currentTarget.style.display = "none";
                },
              })
            : null,
          (0, p.jsx)("div", { className: "poster-shade" }),
          t
            ? (0, p.jsx)("span", {
                className: "curslick-grid-position",
                children: `#${String(t.position).padStart(2, "0")}`,
              })
            : null,
          l
            ? (0, p.jsxs)("span", {
                className: "watched-badge",
                children: [(0, p.jsx)(_, { name: "check", size: 13 }), " Watched"],
              })
            : e.genres.includes("Post-Apocalyptic")
              ? (0, p.jsxs)("span", {
                  className: "apocalypse-badge",
                  children: [(0, p.jsx)(_, { name: "spark", size: 12 }), " Post-Apocalyptic"],
                })
              : e.genres.includes("Modern AAA")
                ? (0, p.jsxs)("span", {
                    className: "aaa-badge",
                    children: [(0, p.jsx)(_, { name: "spark", size: 12 }), " Modern AAA"],
                  })
                : null,
          !l && e.rank && e.rank <= 20
            ? (0, p.jsxs)("span", { className: "top-badge", children: ["TOP ", e.rank] })
            : null,
          (0, p.jsx)("button", {
            className: "list-button " + (r ? "active" : ""),
            onClick: (e) => {
              (e.stopPropagation(), a());
            },
            "aria-label": r ? `Remove ${e.title} from My List` : `Add ${e.title} to My List`,
            children: (0, p.jsx)(_, { name: r ? "check" : "plus", size: 18 }),
          }),
          (0, p.jsxs)("div", {
            className: "card-reveal",
            children: [
              (0, p.jsxs)("div", {
                className: "reveal-row",
                children: [
                  (0, p.jsx)("span", {
                    className: "mini-play",
                    children: (0, p.jsx)(_, { name: "play", size: 14 }),
                  }),
                  (0, p.jsx)("strong", {
                    children: e.imdbRating
                      ? `${e.imdbRating.toFixed(1)} IMDb`
                      : e.animeScore
                        ? `${e.animeScore.toFixed(1)} AniList`
                        : "Ranked series",
                  }),
                ],
              }),
              (0, p.jsxs)("span", {
                children: [e.episodes, " eps · ", b(e), " · ", e.year ?? "—"],
              }),
            ],
          }),
        ],
      }),
      (0, p.jsxs)("div", {
        className: "card-copy",
        children: [
          t
            ? (0, p.jsxs)("p", {
                className: "card-context",
                children: [t.label, " · Curslick #", String(t.position).padStart(2, "0")],
              })
            : null,
          (0, p.jsx)("div", {
            className: "card-title-row",
            children: (0, p.jsx)("h3", { children: e.title }),
          }),
          e.originalTitle && e.originalTitle !== e.title
            ? (0, p.jsx)("p", { className: "card-original-title", children: e.originalTitle })
            : null,
          (0, p.jsxs)("p", {
            className: "card-meta",
            children: [e.year, " · ", b(e), " · ", e.format],
          }),
          (0, p.jsx)("p", {
            className: "card-plot",
            children: e.shortPlot || "Plot summary unavailable.",
          }),
          (0, p.jsxs)("div", {
            className: "chatgpt-links",
            children: [
              (0, p.jsxs)("a", {
                className: "ask-chatgpt-link",
                href: C(e),
                target: "_blank",
                rel: "noreferrer",
                onClick: (e) => e.stopPropagation(),
                onKeyDown: (e) => e.stopPropagation(),
                children: [(0, p.jsx)(_, { name: "spark", size: 12 }), " Ending & romance"],
              }),
              (0, p.jsxs)("a", {
                className: "ask-chatgpt-link simple-chatgpt-link",
                href: te(e),
                target: "_blank",
                rel: "noreferrer",
                onClick: (e) => e.stopPropagation(),
                onKeyDown: (e) => e.stopPropagation(),
                children: [
                  (0, p.jsx)(_, { name: "external", size: 11 }),
                  " Title · year · country",
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function re({ show: e, entry: t, onOpen: n, inList: r, isWatched: l, onToggleList: a }) {
  return (0, p.jsxs)("article", {
    className: "curslick-story-card",
    children: [
      (0, p.jsxs)("button", {
        className: "curslick-poster",
        onClick: n,
        "aria-label": `Open ${e.title}`,
        children: [
          (0, p.jsx)("span", {
            className: "poster-fallback poster-error-fallback",
            children: e.title,
          }),
          e.image
            ? (0, p.jsx)("img", {
                src: e.image,
                alt: `${e.title} poster`,
                loading: "lazy",
                decoding: "async",
                onError: (e) => {
                  e.currentTarget.style.display = "none";
                },
              })
            : null,
          (0, p.jsx)("span", {
            className: "curslick-position",
            children: String(t.position).padStart(2, "0"),
          }),
          l
            ? (0, p.jsxs)("span", {
                className: "curslick-watched",
                children: [(0, p.jsx)(_, { name: "check", size: 12 }), " Watched"],
              })
            : null,
        ],
      }),
      (0, p.jsxs)("div", {
        className: "curslick-story-copy",
        children: [
          (0, p.jsxs)("div", {
            className: "curslick-story-topline",
            children: [
              (0, p.jsx)("span", { children: t.label }),
              (0, p.jsxs)("span", { children: [e.country, " · ", b(e)] }),
            ],
          }),
          (0, p.jsx)("p", { className: "curslick-fit", children: t.matchTags.join(" · ") }),
          (0, p.jsxs)("button", {
            className: "curslick-title",
            onClick: n,
            children: [
              (0, p.jsx)("h2", { children: e.title }),
              (0, p.jsx)(_, { name: "chevron", size: 20 }),
            ],
          }),
          e.originalTitle && e.originalTitle !== e.title
            ? (0, p.jsx)("p", { className: "curslick-original-title", children: e.originalTitle })
            : null,
          (0, p.jsxs)("p", {
            className: "curslick-meta",
            children: [
              e.year,
              e.endYear && e.endYear !== e.year ? `–${e.endYear}` : "",
              " · ",
              e.episodes,
              " episodes · ",
              e.format,
              e.imdbRating
                ? ` · ${e.imdbRating.toFixed(1)} IMDb`
                : e.animeScore
                  ? ` · ${e.animeScore.toFixed(1)} AniList`
                  : "",
            ],
          }),
          (0, p.jsx)("p", {
            className: "curslick-plot",
            children: e.shortPlot || "Plot summary unavailable.",
          }),
          (0, p.jsxs)("div", {
            className: "curslick-why",
            children: [
              (0, p.jsx)("p", { children: "Why it belongs" }),
              (0, p.jsx)("strong", { children: t.why }),
              (0, p.jsx)("span", {
                children: t.placementNote || [
                  "Placed #",
                  t.position,
                  " by premise similarity, not by the global quality rank.",
                ],
              }),
            ],
          }),
          (0, p.jsxs)("div", {
            className: "curslick-story-actions",
            children: [
              (0, p.jsxs)("button", {
                onClick: n,
                children: [(0, p.jsx)(_, { name: "info", size: 16 }), " Explore series"],
              }),
              (0, p.jsxs)("a", {
                href: C(e),
                target: "_blank",
                rel: "noreferrer",
                children: [(0, p.jsx)(_, { name: "spark", size: 15 }), " Ending & romance"],
              }),
              (0, p.jsxs)("a", {
                className: "simple-chatgpt-link",
                href: te(e),
                target: "_blank",
                rel: "noreferrer",
                children: [
                  (0, p.jsx)(_, { name: "external", size: 14 }),
                  " Title · year · country",
                ],
              }),
              (0, p.jsxs)("button", {
                className: "curslick-list-button " + (r ? "active" : ""),
                onClick: a,
                "aria-label": r ? `Remove ${e.title} from My List` : `Add ${e.title} to My List`,
                children: [
                  (0, p.jsx)(_, { name: r ? "check" : "plus", size: 16 }),
                  r ? "In My List" : "My List",
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function w({ title: e, eyebrow: t, shows: n, list: r, watched: l, onOpen: a, onToggleList: i }) {
  let o = `rail-${e.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    s = (e) =>
      document
        .getElementById(o)
        ?.scrollBy({ left: e * Math.min(0.82 * window.innerWidth, 1100), behavior: "smooth" });
  return n.length
    ? (0, p.jsxs)("section", {
        className: "rail-section",
        children: [
          (0, p.jsxs)("div", {
            className: "section-heading",
            children: [
              (0, p.jsxs)("div", {
                children: [
                  t ? (0, p.jsx)("p", { children: t }) : null,
                  (0, p.jsx)("h2", { children: e }),
                ],
              }),
              (0, p.jsxs)("span", { children: [n.length, " picks"] }),
            ],
          }),
          (0, p.jsxs)("div", {
            className: "rail-wrap",
            children: [
              (0, p.jsx)("button", {
                className: "rail-arrow left",
                onClick: () => s(-1),
                "aria-label": `Scroll ${e} left`,
                children: (0, p.jsx)(_, { name: "chevron", size: 28 }),
              }),
              (0, p.jsx)("div", {
                className: "show-rail",
                id: o,
                children: n.map((e) =>
                  (0, p.jsx)(
                    ne,
                    {
                      show: e,
                      onOpen: () => a(e),
                      inList: hasShowId(r, e),
                      isWatched: !!e.watched || hasShowId(l, e),
                      onToggleList: () => i(e.id),
                    },
                    e.id,
                  ),
                ),
              }),
              (0, p.jsx)("button", {
                className: "rail-arrow right",
                onClick: () => s(1),
                "aria-label": `Scroll ${e} right`,
                children: (0, p.jsx)(_, { name: "chevron", size: 28 }),
              }),
            ],
          }),
        ],
      })
    : null;
}
function ie({
  show: e,
  inList: t,
  isWatched: n,
  onClose: r,
  onToggleList: l,
  onToggleWatched: a,
  curslickEntry: i,
}) {
  let [o, s] = (0, f.useState)(!1);
  return (
    (0, f.useEffect)(() => {
      let e = (e) => "Escape" === e.key && r();
      return (
        document.body.classList.add("modal-open"),
        window.addEventListener("keydown", e),
        () => {
          (document.body.classList.remove("modal-open"), window.removeEventListener("keydown", e));
        }
      );
    }, [r]),
    (0, p.jsx)("div", {
      className: "modal-backdrop",
      onMouseDown: (e) => e.target === e.currentTarget && r(),
      role: "presentation",
      children: (0, p.jsxs)("article", {
        className: "detail-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": `${e.title} details`,
        children: [
          (0, p.jsx)("button", {
            className: "modal-close",
            onClick: r,
            "aria-label": "Close details",
            children: (0, p.jsx)(_, { name: "close" }),
          }),
          (0, p.jsxs)("div", {
            className: "modal-hero",
            children: [
              e.image
                ? (0, p.jsxs)(p.Fragment, {
                    children: [
                      (0, p.jsx)("img", { className: "modal-backdrop-art", src: e.image, alt: "" }),
                      (0, p.jsx)("div", {
                        className: "modal-poster-wrap",
                        children: (0, p.jsx)("img", {
                          className: "modal-full-poster",
                          src: e.image,
                          alt: `${e.title} full cover`,
                        }),
                      }),
                    ],
                  })
                : (0, p.jsx)("div", { className: "modal-fallback" }),
              (0, p.jsx)("div", { className: "modal-hero-shade" }),
              (0, p.jsxs)("div", {
                className: "modal-title",
                children: [
                  (0, p.jsx)("p", {
                    className: "modal-kicker",
                    children: e.archiveException
                      ? "PERSONAL WATCHED-HISTORY ARCHIVE"
                      : i
                        ? `CURSLICK #${String(i.position).padStart(2, "0")} · ${i.label.toUpperCase()}`
                        : e.curslickExclusive
                          ? "CURSLICK · EDITORIAL EXCLUSIVE"
                          : e.kDramaArchive && !e.catalogueMember
                            ? "K-DRAMA ARCHIVE"
                            : `MORNINGSTAR RANK #${e.rank ?? "—"}`,
                  }),
                  (0, p.jsx)("div", {
                    className: "modal-heading-row",
                    children: (0, p.jsx)("h2", { children: e.title }),
                  }),
                  e.originalTitle && e.originalTitle !== e.title
                    ? (0, p.jsx)("p", { className: "original-title", children: e.originalTitle })
                    : null,
                  e.alternativeTitles?.length
                    ? (0, p.jsxs)("p", {
                        className: "alternative-titles",
                        children: ["Also known as ", e.alternativeTitles.join(" · ")],
                      })
                    : null,
                  (0, p.jsxs)("div", {
                    className: "modal-actions",
                    children: [
                      (0, p.jsxs)("a", {
                        href: e.imdbUrl,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "primary-action",
                        children: [
                          (0, p.jsx)(_, { name: "external", size: 17 }),
                          " ",
                          e.imdbId ? "IMDb" : "Find on IMDb",
                        ],
                      }),
                      (0, p.jsxs)("a", {
                        href: C(e),
                        target: "_blank",
                        rel: "noreferrer",
                        className: "chatgpt-action",
                        children: [(0, p.jsx)(_, { name: "spark", size: 17 }), " Ending & romance"],
                      }),
                      (0, p.jsxs)("a", {
                        href: te(e),
                        target: "_blank",
                        rel: "noreferrer",
                        className: "chatgpt-action simple-chatgpt-action",
                        children: [
                          (0, p.jsx)(_, { name: "external", size: 15 }),
                          " Title · year · country",
                        ],
                      }),
                      (0, p.jsx)("button", {
                        onClick: l,
                        className: "round-action",
                        "aria-label": t ? "Remove from My List" : "Add to My List",
                        children: (0, p.jsx)(_, { name: t ? "check" : "plus" }),
                      }),
                      (0, p.jsx)("button", {
                        onClick: e.watched ? void 0 : a,
                        disabled: e.watched,
                        className: "round-action " + (n ? "selected" : ""),
                        "aria-label": e.watched
                          ? "Imported watched title"
                          : n
                            ? "Mark unwatched"
                            : "Mark watched",
                        children: (0, p.jsx)(_, { name: "eye" }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, p.jsxs)("div", {
            className: "modal-body",
            children: [
              (0, p.jsxs)("div", {
                className: "modal-main",
                children: [
                  (0, p.jsxs)("div", {
                    className: "fact-line",
                    children: [
                      e.imdbRating
                        ? (0, p.jsxs)("span", {
                            className: "rating-text",
                            children: [e.imdbRating.toFixed(1), " IMDb"],
                          })
                        : null,
                      n
                        ? (0, p.jsxs)("span", {
                            className: "history-label",
                            children: [(0, p.jsx)(_, { name: "check", size: 14 }), " Watched"],
                          })
                        : null,
                      (0, p.jsxs)("span", {
                        children: [
                          e.year,
                          e.endYear && e.endYear !== e.year ? `–${e.endYear}` : "",
                        ],
                      }),
                      (0, p.jsx)("span", {
                        children: e.episodes
                          ? `${e.episodes} episodes`
                          : "Episode count unavailable",
                      }),
                      (0, p.jsx)("span", { children: b(e) }),
                      e.status ? (0, p.jsx)("span", { children: e.status }) : null,
                    ],
                  }),
                  (0, p.jsxs)("button", {
                    className: "plot-expander " + (o ? "expanded" : ""),
                    onClick: () => s((e) => !e),
                    "aria-expanded": o,
                    children: [
                      (0, p.jsx)("span", {
                        className: "plot-label",
                        children: o ? "Detailed plot" : "Short plot",
                      }),
                      (0, p.jsx)("span", {
                        className: "plot-copy",
                        children: o ? e.longPlot : e.shortPlot,
                      }),
                      (0, p.jsxs)("small", {
                        children: [
                          o ? "Show short description" : "Open detailed description",
                          " ",
                          (0, p.jsx)(_, { name: "chevron", size: 13 }),
                        ],
                      }),
                    ],
                  }),
                  i
                    ? (0, p.jsxs)("section", {
                        className: "curslick-detail-context",
                        children: [
                          (0, p.jsxs)("div", {
                            children: [
                              (0, p.jsx)(_, { name: "spark", size: 17 }),
                              (0, p.jsxs)("p", {
                                children: [
                                  "Curslick placement · #",
                                  String(i.position).padStart(2, "0"),
                                ],
                              }),
                            ],
                          }),
                          (0, p.jsx)("h3", { children: "Why it belongs" }),
                          (0, p.jsx)("p", { children: i.why }),
                          (0, p.jsx)("span", { children: i.matchTags.join(" · ") }),
                        ],
                      })
                    : null,
                  (0, p.jsxs)("div", {
                    className: "chatgpt-question-box",
                    children: [
                      (0, p.jsxs)("div", {
                        className: "chatgpt-question-copy",
                        children: [
                          (0, p.jsx)(_, { name: "spark", size: 20 }),
                          (0, p.jsxs)("div", {
                            children: [
                              (0, p.jsx)("b", { children: "Unsure about the ending or romance?" }),
                              (0, p.jsx)("p", {
                                children:
                                  "ChatGPT opens with this exact series and both spoiler-free questions already prepared.",
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, p.jsxs)("a", {
                        href: C(e),
                        target: "_blank",
                        rel: "noreferrer",
                        children: [
                          "Ask about ",
                          e.title,
                          " ",
                          (0, p.jsx)(_, { name: "external", size: 15 }),
                        ],
                      }),
                    ],
                  }),
                  (0, p.jsxs)("div", {
                    className:
                      "eligibility-note " +
                      (e.archiveException ||
                      e.curslickExclusive ||
                      (e.kDramaArchive && !e.catalogueMember)
                        ? "exception"
                        : ""),
                    children: [
                      (0, p.jsx)(_, {
                        name:
                          e.archiveException || (e.kDramaArchive && !e.catalogueMember)
                            ? "eye"
                            : "check",
                        size: 16,
                      }),
                      (0, p.jsx)("p", {
                        children: e.archiveException
                          ? "This is preserved from your imported watched history, so it may sit outside the ranked catalogue’s 2010+, ended, and 6–60-hour rules."
                          : e.curslickExclusive
                            ? `This Curslick editorial exclusive is a completed ${e.episodes}-episode series from ${e.year}–${e.endYear}, with an estimated ${e.runtimeHours}-hour run.`
                            : e.kDramaArchive && !e.catalogueMember
                              ? "This is a completed scripted entry in the broad K-Drama Archive. The archive includes older and shorter Korean series, while excluding reality, talk shows, one-off specials and soap-style runs above 60 episodes."
                              : `Verified for the ranked catalogue: season one began in ${e.year}, the series is ended, and its estimated complete runtime is ${e.runtimeHours} hours.`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, p.jsxs)("aside", {
                className: "modal-aside",
                children: [
                  (0, p.jsxs)("p", {
                    children: [(0, p.jsx)("span", { children: "Country" }), e.country],
                  }),
                  (0, p.jsxs)("p", {
                    children: [(0, p.jsx)("span", { children: "Language" }), e.language],
                  }),
                  (0, p.jsxs)("p", {
                    children: [(0, p.jsx)("span", { children: "Format" }), e.format],
                  }),
                  (0, p.jsxs)("p", {
                    children: [
                      (0, p.jsx)("span", { children: "Genres & tags" }),
                      e.genres.join(", "),
                    ],
                  }),
                  e.episodeRuntime
                    ? (0, p.jsxs)("p", {
                        children: [
                          (0, p.jsx)("span", { children: "Typical episode" }),
                          e.episodeRuntime,
                          " minutes",
                        ],
                      })
                    : null,
                  e.imdbVotes
                    ? (0, p.jsxs)("p", {
                        children: [
                          (0, p.jsx)("span", { children: "IMDb votes" }),
                          v.format(e.imdbVotes),
                        ],
                      })
                    : null,
                  e.sourceUrl
                    ? (0, p.jsxs)("p", {
                        children: [
                          (0, p.jsx)("span", { children: "Synopsis source" }),
                          (0, p.jsxs)("a", {
                            href: e.sourceUrl,
                            target: "_blank",
                            rel: "noreferrer",
                            children: [
                              e.sourceName || "Source",
                              " ",
                              (0, p.jsx)(_, { name: "external", size: 12 }),
                            ],
                          }),
                        ],
                      })
                    : null,
                ],
              }),
            ],
          }),
        ],
      }),
    })
  );
}
function ae({ years: e, selected: t, onToggle: n, onClear: r }) {
  return (0, p.jsxs)("details", {
    className: "multi-filter",
    children: [
      (0, p.jsxs)("summary", {
        children: [
          (0, p.jsxs)("span", {
            children: [
              (0, p.jsx)("small", { children: "Years" }),
              t.size ? `${t.size} selected` : "All years",
            ],
          }),
          (0, p.jsx)(_, { name: "down", size: 15 }),
        ],
      }),
      (0, p.jsxs)("div", {
        className: "filter-popover year-popover",
        children: [
          (0, p.jsxs)("div", {
            className: "popover-head",
            children: [
              (0, p.jsxs)("div", {
                children: [
                  (0, p.jsx)("b", { children: "Choose multiple years" }),
                  (0, p.jsx)("small", { children: "No selection means every year." }),
                ],
              }),
              t.size ? (0, p.jsx)("button", { onClick: r, children: "Clear" }) : null,
            ],
          }),
          (0, p.jsx)("div", {
            className: "choice-grid years-grid",
            children: e.map((e) =>
              (0, p.jsxs)(
                "label",
                {
                  className: t.has(e) ? "chosen" : "",
                  children: [
                    (0, p.jsx)("input", {
                      type: "checkbox",
                      checked: t.has(e),
                      onChange: () => n(e),
                    }),
                    (0, p.jsx)("span", {
                      className: "box",
                      children: (0, p.jsx)(_, { name: "check", size: 12 }),
                    }),
                    e,
                  ],
                },
                e,
              ),
            ),
          }),
        ],
      }),
    ],
  });
}
function oe({ genres: e, selected: t, mode: n, onMode: r, onToggle: l, onClear: a }) {
  return (0, p.jsxs)("details", {
    className: "multi-filter genre-filter",
    children: [
      (0, p.jsxs)("summary", {
        children: [
          (0, p.jsxs)("span", {
            children: [
              (0, p.jsxs)("small", { children: ["Genres · ", n.toUpperCase()] }),
              t.size ? `${t.size} selected` : "All genres",
            ],
          }),
          (0, p.jsx)(_, { name: "down", size: 15 }),
        ],
      }),
      (0, p.jsxs)("div", {
        className: "filter-popover genre-popover",
        children: [
          (0, p.jsxs)("div", {
            className: "popover-head",
            children: [
              (0, p.jsxs)("div", {
                children: [
                  (0, p.jsx)("b", { children: "How should genres match?" }),
                  (0, p.jsx)("small", {
                    children: "Choose one mode, then as many genres as you like.",
                  }),
                ],
              }),
              t.size ? (0, p.jsx)("button", { onClick: a, children: "Clear" }) : null,
            ],
          }),
          (0, p.jsxs)("div", {
            className: "genre-mode",
            "aria-label": "Genre matching mode",
            children: [
              (0, p.jsxs)("button", {
                className: "any" === n ? "active" : "",
                onClick: () => r("any"),
                "aria-pressed": "any" === n,
                children: [
                  (0, p.jsx)("b", { children: "ANY" }),
                  (0, p.jsx)("span", { children: "At least one selected genre" }),
                ],
              }),
              (0, p.jsxs)("button", {
                className: "all" === n ? "active" : "",
                onClick: () => r("all"),
                "aria-pressed": "all" === n,
                children: [
                  (0, p.jsx)("b", { children: "ALL" }),
                  (0, p.jsx)("span", { children: "Every selected genre" }),
                ],
              }),
            ],
          }),
          (0, p.jsx)("div", {
            className: "choice-grid genre-grid",
            children: e.map((e) =>
              (0, p.jsxs)(
                "label",
                {
                  className: `${t.has(e) ? "chosen" : ""} ${"Modern AAA" === e ? "aaa-choice" : ""}`,
                  children: [
                    (0, p.jsx)("input", {
                      type: "checkbox",
                      checked: t.has(e),
                      onChange: () => l(e),
                    }),
                    (0, p.jsx)("span", {
                      className: "box",
                      children: (0, p.jsx)(_, { name: "check", size: 12 }),
                    }),
                    e,
                  ],
                },
                e,
              ),
            ),
          }),
        ],
      }),
    ],
  });
}
function ExclusionControls({
  exclusions: e,
  onToggle: t,
  onReset: n,
  hiddenCount: r,
  kDramaCount: a,
}) {
  let l = hasCustomExclusions(e),
    i = (t) =>
      e[t.id]
        ? t.note
        : "kdrama" === t.id && a
          ? `${a.toLocaleString()} Korean titles included`
          : "Currently included";
  return (0, p.jsxs)("section", {
    className: "exclusion-controls",
    "aria-label": "Exclusions",
    children: [
      (0, p.jsxs)("div", {
        className: "exclusion-heading",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("b", { children: "Exclusions" }),
              (0, p.jsx)("small", {
                children: r
                  ? `${r.toLocaleString()} titles hidden by these exclusions`
                  : "Nothing is being hidden right now",
              }),
            ],
          }),
          l
            ? (0, p.jsx)("button", {
                type: "button",
                onClick: n,
                children: "Back to defaults",
              })
            : null,
        ],
      }),
      (0, p.jsx)("div", {
        className: "exclusion-grid",
        children: EXCLUSION_OPTIONS.map((n) =>
          (0, p.jsxs)(
            "label",
            {
              className: "exclusion-chip " + (e[n.id] ? "active" : ""),
              children: [
                (0, p.jsx)("input", {
                  type: "checkbox",
                  checked: !!e[n.id],
                  onChange: () => t(n.id),
                }),
                (0, p.jsx)("span", {
                  className: "exclusion-box",
                  children: (0, p.jsx)(_, { name: "close", size: 12 }),
                }),
                (0, p.jsxs)("span", {
                  className: "exclusion-copy",
                  children: [
                    (0, p.jsx)("b", { children: n.label }),
                    (0, p.jsx)("small", { children: i(n) }),
                  ],
                }),
              ],
            },
            n.id,
          ),
        ),
      }),
    ],
  });
}
function ViewControls({ viewMode: e, onViewMode: t, gridColumns: n, onGridColumns: r }) {
  let l = [
    { id: "grid", label: "Grid" },
    { id: "list", label: "List" },
    { id: "detailed", label: "Detailed + plot" },
  ];
  return (0, p.jsxs)("section", {
    className: "display-controls",
    "aria-label": "Choose how series are displayed",
    children: [
      (0, p.jsxs)("div", {
        className: "display-heading",
        children: [
          (0, p.jsx)("b", { children: "Display" }),
          (0, p.jsx)("small", { children: "Choose cards, a compact list, or a list with plots." }),
        ],
      }),
      (0, p.jsx)("div", {
        className: "view-mode-switch",
        role: "group",
        children: l.map((n) =>
          (0, p.jsx)(
            "button",
            {
              type: "button",
              className: e === n.id ? "active" : "",
              onClick: () => t(n.id),
              "aria-pressed": e === n.id,
              children: n.label,
            },
            n.id,
          ),
        ),
      }),
      "grid" === e
        ? (0, p.jsxs)("label", {
            className: "column-control",
            children: [
              (0, p.jsx)("span", { children: "Cards per row" }),
              (0, p.jsx)("select", {
                value: n,
                onChange: (e) => r(e.target.value),
                children: [
                  (0, p.jsx)("option", { value: "auto", children: "Auto" }),
                  [2, 3, 4, 5, 6, 7, 8].map((e) =>
                    (0, p.jsx)("option", { value: String(e), children: `${e} per row` }, e),
                  ),
                ],
              }),
            ],
          })
        : null,
    ],
  });
}
function se({
  years: e,
  selectedYears: t,
  onToggleYear: n,
  onClearYears: r,
  genres: l,
  selectedGenres: a,
  genreMode: i,
  onGenreMode: o,
  onToggleGenre: s,
  onClearGenres: u,
  countries: c,
  country: d,
  onCountry: h,
  formats: m,
  format: g,
  onFormat: y,
  sort: v,
  onSort: b,
  includeWatched: k,
  onIncludeWatched: w,
  watchedCount: x,
  kDramaCount: C,
  onSpin: E,
  curslick: N,
  viewMode: T,
  onViewMode: z,
  gridColumns: L,
  onGridColumns: P,
  exclusions: S,
  onToggleExclusion: j,
  onResetExclusions: A,
  excludedCount: M,
}) {
  let [O, R] = (0, f.useState)(() => window.matchMedia("(max-width: 820px)").matches),
    D =
      t.size +
      a.size +
      ("All countries" !== d ? 1 : 0) +
      ("All formats" !== g ? 1 : 0) +
      ("rank" !== v ? 1 : 0) +
      (k ? 1 : 0) +
      countActiveExclusions(S);
  return (0, p.jsxs)("div", {
    className: `filter-dock ${O ? "collapsed" : ""} ${N ? "curslick-filter-dock" : ""}`,
    children: [
      (0, p.jsxs)("button", {
        type: "button",
        className: "filter-dock-toggle",
        onClick: () => R((e) => !e),
        "aria-expanded": !O,
        children: [
          (0, p.jsxs)("span", {
            children: [
              (0, p.jsx)("b", { children: "Filters & display" }),
              (0, p.jsx)("small", {
                children: O
                  ? "Expand here without returning to the top"
                  : "Collapse to a slim bar while browsing",
              }),
            ],
          }),
          (0, p.jsxs)("span", {
            children: [D ? `${D} active` : "All titles", (0, p.jsx)(_, { name: "down", size: 16 })],
          }),
        ],
      }),
      (0, p.jsxs)("div", {
        className: "filter-dock-panel",
        hidden: O,
        children: [
          (0, p.jsx)(ExclusionControls, {
            exclusions: S,
            onToggle: j,
            onReset: A,
            hiddenCount: M,
            kDramaCount: C,
          }),
          (0, p.jsx)(ViewControls, {
            viewMode: T,
            onViewMode: z,
            gridColumns: L,
            onGridColumns: P,
          }),
          (0, p.jsxs)("section", {
            className: "filter-bar " + (N ? "curslick-filter" : ""),
            "aria-label": N ? "Curslick collection filters" : "Catalogue filters",
            children: [
              (0, p.jsx)(ae, { years: e, selected: t, onToggle: n, onClear: r }),
              (0, p.jsx)(oe, {
                genres: l,
                selected: a,
                mode: i,
                onMode: o,
                onToggle: s,
                onClear: u,
              }),
              (0, p.jsxs)("label", {
                children: [
                  (0, p.jsx)("span", { children: "Country" }),
                  (0, p.jsx)("select", {
                    value: d,
                    onChange: (e) => h(e.target.value),
                    children: c.map((e) => (0, p.jsx)("option", { children: e }, e)),
                  }),
                ],
              }),
              (0, p.jsxs)("label", {
                children: [
                  (0, p.jsx)("span", { children: "Format" }),
                  (0, p.jsx)("select", {
                    value: g,
                    onChange: (e) => y(e.target.value),
                    children: m.map((e) => (0, p.jsx)("option", { children: e }, e)),
                  }),
                ],
              }),
              (0, p.jsxs)("label", {
                children: [
                  (0, p.jsx)("span", { children: "Sort" }),
                  (0, p.jsxs)("select", {
                    value: v,
                    onChange: (e) => b(e.target.value),
                    children: [
                      (0, p.jsx)("option", {
                        value: "rank",
                        children: N ? "Curslick closeness" : "Quality rank",
                      }),
                      (0, p.jsx)("option", { value: "rating", children: "IMDb rating" }),
                      (0, p.jsx)("option", { value: "newest", children: "Newest first" }),
                      (0, p.jsx)("option", {
                        value: "shortest",
                        children: "Shortest total runtime",
                      }),
                      (0, p.jsx)("option", { value: "random", children: "Random order" }),
                    ],
                  }),
                  "random" === v && E
                    ? (0, p.jsxs)("button", {
                        className: "spin-button",
                        onClick: E,
                        type: "button",
                        children: [(0, p.jsx)(_, { name: "spark", size: 13 }), " Spin results"],
                      })
                    : null,
                ],
              }),
              (0, p.jsxs)("label", {
                className: "watched-control " + (k ? "active" : ""),
                children: [
                  (0, p.jsx)("input", {
                    type: "checkbox",
                    checked: k,
                    onChange: (e) => w(e.target.checked),
                  }),
                  (0, p.jsx)("span", {
                    className: "watched-box",
                    children: (0, p.jsx)(_, { name: "check", size: 14 }),
                  }),
                  (0, p.jsxs)("span", {
                    children: [
                      (0, p.jsx)("b", { children: "Include watched" }),
                      (0, p.jsx)("small", {
                        children: k ? `${x} history titles visible` : "Hidden by default",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function ce({ collections: e, knownShows: t, onOpenCollection: n }) {
  let r = (e) => e.show || t.get(e.showId || "");
  return (0, p.jsxs)("main", {
    className: "clk-hub page-shell",
    children: [
      (0, p.jsxs)("section", {
        className: "clk-hub-hero",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("p", {
                className: "eyebrow",
                children: "CURSLICK · THE MORNINGSTAR EXPERIENCE LAYER",
              }),
              (0, p.jsx)("h1", { children: "Choosing what to watch should feel better." }),
              (0, p.jsx)("p", {
                children:
                  "Curslick is bigger than any one list. It is Morningstar's growing home for researched “what should I watch next?” paths, spoiler-safe reasoning, mood-led discovery and practical viewing guides. Every collection opens as its own article and still keeps the catalogue's search, filters, My List, watched marks and complete series pages.",
              }),
            ],
          }),
          (0, p.jsxs)("aside", {
            children: [
              (0, p.jsx)("span", { children: String(e.length).padStart(2, "0") }),
              (0, p.jsxs)("p", {
                children: ["live collections", (0, p.jsx)("br", {}), "one growing experience"],
              }),
            ],
          }),
        ],
      }),
      (0, p.jsxs)("section", {
        className: "clk-principles",
        "aria-label": "What Curslick adds",
        children: [
          (0, p.jsxs)("article", {
            children: [
              (0, p.jsx)(_, { name: "spark", size: 18 }),
              (0, p.jsx)("p", { children: "Research-ranked" }),
              (0, p.jsx)("span", {
                children:
                  "Closeness is explained title by title, not reduced to a generic genre match.",
              }),
            ],
          }),
          (0, p.jsxs)("article", {
            children: [
              (0, p.jsx)(_, { name: "search", size: 18 }),
              (0, p.jsx)("p", { children: "Fully explorable" }),
              (0, p.jsx)("span", {
                children:
                  "Search the reasons, combine filters, open any series and keep your own list.",
              }),
            ],
          }),
          (0, p.jsxs)("article", {
            children: [
              (0, p.jsx)(_, { name: "eye", size: 18 }),
              (0, p.jsx)("p", { children: "Spoiler-safe" }),
              (0, p.jsx)("span", {
                children:
                  "The article tells you why a pick fits without exposing twists, deaths or endings.",
              }),
            ],
          }),
        ],
      }),
      (0, p.jsxs)("div", {
        className: "clk-library-heading",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("p", { className: "eyebrow", children: "OPEN A COLLECTION" }),
              (0, p.jsx)("h2", { children: "Current Curslick paths" }),
            ],
          }),
          (0, p.jsx)("p", {
            children:
              "Each path begins with one film or feeling and moves from the closest television match outward.",
          }),
        ],
      }),
      (0, p.jsx)("section", {
        className: "clk-collection-grid",
        children: e.map((e) => {
          let t = e.entries
            .slice(0, 3)
            .map(r)
            .filter((e) => !!e);
          return (0, p.jsxs)(
            "article",
            {
              className: "clk-collection-card",
              children: [
                (0, p.jsxs)("button", {
                  className: "clk-collection-visual",
                  onClick: () => n(e.id),
                  "aria-label": `Open ${e.title}`,
                  children: [
                    (0, p.jsx)("span", { className: "clk-issue-number", children: e.number }),
                    (0, p.jsx)("div", {
                      children: t.map((e) =>
                        e.image
                          ? (0, p.jsx)("img", { src: e.image, alt: "", loading: "lazy" }, e.id)
                          : null,
                      ),
                    }),
                  ],
                }),
                (0, p.jsxs)("div", {
                  className: "clk-collection-copy",
                  children: [
                    (0, p.jsxs)("p", {
                      children: [
                        e.entries.length,
                        " ranked picks · starts from ",
                        e.referenceTitle,
                        " (",
                        e.referenceYear,
                        ")",
                      ],
                    }),
                    (0, p.jsxs)("button", {
                      onClick: () => n(e.id),
                      children: [
                        (0, p.jsx)("h2", { children: e.title }),
                        (0, p.jsx)(_, { name: "chevron", size: 23 }),
                      ],
                    }),
                    (0, p.jsx)("span", { children: e.summary }),
                    (0, p.jsxs)("button", {
                      className: "clk-open-button",
                      onClick: () => n(e.id),
                      children: ["Enter collection ", (0, p.jsx)(_, { name: "chevron", size: 16 })],
                    }),
                  ],
                }),
              ],
            },
            e.id,
          );
        }),
      }),
    ],
  });
}
function le({
  collection: e,
  collections: t,
  onBack: n,
  onSelectCollection: r,
  shows: l,
  entries: a,
  list: i,
  watched: o,
  onOpen: s,
  onToggleList: u,
  years: c,
  selectedYears: d,
  onToggleYear: f,
  onClearYears: h,
  genres: m,
  selectedGenres: g,
  genreMode: y,
  onGenreMode: v,
  onToggleGenre: b,
  onClearGenres: k,
  countries: w,
  country: x,
  onCountry: S,
  formats: j,
  format: C,
  onFormat: E,
  sort: N,
  onSort: T,
  includeWatched: z,
  onIncludeWatched: L,
  watchedCount: P,
  onSpin: A,
  onReset: M,
  viewMode: O,
  onViewMode: R,
  gridColumns: D,
  onGridColumns: I,
  exclusions: F,
  onToggleExclusion: $,
  onResetExclusions: U,
  excludedCount: H,
  kDramaCount: V,
}) {
  return e
    ? (0, p.jsxs)("main", {
        className: "curslick-view page-shell",
        children: [
          (0, p.jsxs)("button", {
            className: "clk-back",
            onClick: n,
            children: [(0, p.jsx)(_, { name: "chevron", size: 16 }), " All Curslick collections"],
          }),
          (0, p.jsxs)("section", {
            className: "curslick-hero",
            children: [
              (0, p.jsxs)("div", {
                className: "curslick-hero-copy",
                children: [
                  (0, p.jsxs)("p", {
                    className: "eyebrow",
                    children: ["CURSLICK · COLLECTION ", e.number, " · EDITORIAL DISCOVERY"],
                  }),
                  (0, p.jsxs)("p", {
                    className: "curslick-overline",
                    children: [
                      "Starting point: ",
                      (0, p.jsx)("em", { children: e.referenceTitle }),
                      " (",
                      e.referenceYear,
                      ")",
                    ],
                  }),
                  (0, p.jsx)("h1", { children: e.title }),
                  (0, p.jsx)("p", { children: e.summary }),
                ],
              }),
              (0, p.jsxs)("aside", {
                className: "curslick-hero-aside",
                children: [
                  (0, p.jsx)("span", { children: e.entries.length }),
                  (0, p.jsxs)("p", {
                    children: [
                      "ranked routes",
                      (0, p.jsx)("br", {}),
                      "from closest premise to adjacent feeling",
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, p.jsxs)("nav", {
            className: "curslick-library",
            "aria-label": "Curslick editorial collections",
            children: [
              (0, p.jsx)("p", { children: "OTHER CURSLICK PATHS" }),
              (0, p.jsx)("div", {
                children: t.map((t) =>
                  (0, p.jsxs)(
                    "button",
                    {
                      className: t.id === e.id ? "active" : "",
                      onClick: () => r(t.id),
                      children: [
                        (0, p.jsx)("span", { children: t.number }),
                        (0, p.jsx)("b", { children: t.shortTitle }),
                        (0, p.jsxs)("small", { children: [t.entries.length, " picks"] }),
                      ],
                    },
                    t.id,
                  ),
                ),
              }),
            ],
          }),
          (0, p.jsxs)("section", {
            className: "curslick-editorial-grid",
            children: [
              (0, p.jsxs)("article", {
                children: [
                  (0, p.jsx)("p", { children: "What I matched" }),
                  (0, p.jsx)("h2", { children: "The shared experience, not just a genre." }),
                  (0, p.jsx)("span", { children: e.matchingStandard }),
                ],
              }),
              (0, p.jsxs)("article", {
                children: [
                  (0, p.jsx)("p", { children: "How to read this list" }),
                  (0, p.jsx)("h2", { children: "Similarity first; quality still matters." }),
                  (0, p.jsx)("span", { children: e.researchNote }),
                ],
              }),
            ],
          }),
          (0, p.jsxs)("section", {
            className: "curslick-research-strip",
            children: [
              (0, p.jsxs)("div", {
                children: [
                  (0, p.jsx)(_, { name: "spark", size: 19 }),
                  (0, p.jsxs)("p", {
                    children: [
                      (0, p.jsx)("b", { children: "Research trail" }),
                      (0, p.jsx)("span", {
                        children: "Open the premise sources behind this Curslick path.",
                      }),
                    ],
                  }),
                ],
              }),
              (0, p.jsx)("div", {
                className: "curslick-source-links",
                children: e.sources.map((e) =>
                  (0, p.jsxs)(
                    "a",
                    {
                      href: e.url,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [e.label, " ", (0, p.jsx)(_, { name: "external", size: 13 })],
                    },
                    e.url,
                  ),
                ),
              }),
            ],
          }),
          (0, p.jsxs)("div", {
            className: "curslick-results-heading",
            children: [
              (0, p.jsxs)("div", {
                children: [
                  (0, p.jsx)("p", { className: "eyebrow", children: "THE RANKED PATH" }),
                  (0, p.jsxs)("h2", { children: [l.length, " result", 1 === l.length ? "" : "s"] }),
                ],
              }),
              (0, p.jsx)("p", {
                children: z
                  ? "Your watched titles are shown and clearly marked."
                  : "Watched titles stay out of the way until you choose to include them.",
              }),
            ],
          }),
          (0, p.jsx)(se, {
            years: c,
            selectedYears: d,
            onToggleYear: f,
            onClearYears: h,
            genres: m,
            selectedGenres: g,
            genreMode: y,
            onGenreMode: v,
            onToggleGenre: b,
            onClearGenres: k,
            countries: w,
            country: x,
            onCountry: S,
            formats: j,
            format: C,
            onFormat: E,
            sort: N,
            onSort: T,
            includeWatched: z,
            onIncludeWatched: L,
            watchedCount: P,
            onSpin: A,
            curslick: !0,
            viewMode: O,
            onViewMode: R,
            gridColumns: D,
            onGridColumns: I,
            exclusions: F,
            onToggleExclusion: $,
            onResetExclusions: U,
            excludedCount: H,
            kDramaCount: V,
          }),
          l.length
            ? "detailed" === O
              ? (0, p.jsx)("section", {
                  className: "curslick-story-list view-detailed",
                  children: l.map((e) => {
                    let t = a.get(e.id);
                    return t
                      ? (0, p.jsx)(
                          re,
                          {
                            show: e,
                            entry: t,
                            onOpen: () => s(e),
                            inList: hasShowId(i, e),
                            isWatched: !!e.watched || hasShowId(o, e),
                            onToggleList: () => u(e.id),
                          },
                          e.id,
                        )
                      : null;
                  }),
                })
              : (0, p.jsx)("section", {
                  className: `show-grid curslick-card-grid view-${O} ${"auto" !== D ? "custom-columns" : ""}`,
                  style: "auto" !== D ? { "--grid-columns": D } : void 0,
                  children: l.map((e) => {
                    let t = a.get(e.id);
                    return t
                      ? (0, p.jsx)(
                          ne,
                          {
                            show: e,
                            entry: t,
                            onOpen: () => s(e),
                            inList: hasShowId(i, e),
                            isWatched: !!e.watched || hasShowId(o, e),
                            onToggleList: () => u(e.id),
                          },
                          e.id,
                        )
                      : null;
                  }),
                })
            : (0, p.jsxs)("section", {
                className: "empty-state",
                children: [
                  (0, p.jsx)("div", { children: (0, p.jsx)(_, { name: "search", size: 34 }) }),
                  (0, p.jsx)("h2", { children: "No Curslick picks match those choices." }),
                  (0, p.jsx)("p", {
                    children: "Try another year, genre combination, country or format.",
                  }),
                  (0, p.jsx)("button", { onClick: M, children: "Clear filters" }),
                ],
              }),
        ],
      })
    : (0, p.jsxs)("main", {
        className: "empty-state page-shell",
        children: [
          (0, p.jsx)("div", { children: (0, p.jsx)(_, { name: "spark", size: 34 }) }),
          (0, p.jsx)("h2", { children: "Curslick is being prepared." }),
          (0, p.jsx)("p", { children: "The first editorial collection will appear here shortly." }),
        ],
      });
}
function ue({ catalogue: e, kDramaArchive: t }) {
  return (0, p.jsxs)("main", {
    className: "method-view page-shell",
    children: [
      (0, p.jsxs)("div", {
        className: "method-hero",
        children: [
          (0, p.jsx)("p", { className: "eyebrow", children: "THE MORNINGSTAR CATALOGUE STANDARD" }),
          (0, p.jsx)("h1", { children: "Quality first. Rules you can audit." }),
          (0, p.jsx)("p", {
            children:
              "Every ranked title is scripted fiction or animation, began in 2010 or later, has finished its run, and takes an estimated 6–60 hours to complete. Documentaries, reality, talk shows, soaps, Indian-origin productions and every other unscripted format are excluded.",
          }),
        ],
      }),
      (0, p.jsxs)("div", {
        className: "method-grid",
        children: [
          (0, p.jsxs)("article", {
            children: [
              (0, p.jsx)("span", { children: "01" }),
              (0, p.jsxs)("h2", { children: [e.total.toLocaleString(), " titles"] }),
              (0, p.jsxs)("p", {
                children: [
                  "The ranked catalogue contains 5,000 core titles plus a researched Post-Apocalyptic supplement, chosen from ",
                  (e.candidateCount || 0).toLocaleString(),
                  " qualifying candidates using rating strength and audience depth.",
                ],
              }),
            ],
          }),
          (0, p.jsxs)("article", {
            children: [
              (0, p.jsx)("span", { children: "02" }),
              (0, p.jsx)("h2", { children: "Ended only" }),
              (0, p.jsx)("p", {
                children:
                  "TVmaze status must be Ended. Running, in-development and status-unknown titles are removed from the ranked list.",
              }),
            ],
          }),
          (0, p.jsxs)("article", {
            children: [
              (0, p.jsx)("span", { children: "03" }),
              (0, p.jsx)("h2", { children: "2010 onward" }),
              (0, p.jsx)("p", {
                children:
                  "The year filter uses the season-one premiere year. Every ranked title starts between 2010 and 2026.",
              }),
            ],
          }),
          (0, p.jsxs)("article", {
            children: [
              (0, p.jsx)("span", { children: "04" }),
              (0, p.jsx)("h2", { children: "6–60 hours" }),
              (0, p.jsx)("p", {
                children:
                  "Total viewing time is estimated as episode count × typical episode runtime. Every ranked result falls inside the inclusive 6–60-hour window.",
              }),
            ],
          }),
        ],
      }),
      (0, p.jsxs)("section", {
        className: "method-panel chatgpt-method",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("p", {
                className: "eyebrow",
                children: "SPOILER-FREE ANSWERS, ON DEMAND",
              }),
              (0, p.jsx)("h2", { children: "Ask when you need to know." }),
            ],
          }),
          (0, p.jsx)("p", {
            children:
              "Every series has a direct ChatGPT link with its title, year and country already supplied. The prepared prompt asks whether the ending is happy or satisfying and whether romance is present—while explicitly forbidding plot twists, deaths, pairings and ending details.",
          }),
          (0, p.jsxs)("a", {
            href: "https://chatgpt.com/",
            target: "_blank",
            rel: "noreferrer",
            children: ["Open ChatGPT ", (0, p.jsx)(_, { name: "external", size: 14 })],
          }),
        ],
      }),
      (0, p.jsxs)("section", {
        className: "method-panel aaa-method",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("p", { className: "eyebrow", children: "EDITORIAL GENRE" }),
              (0, p.jsx)("h2", { children: "What “Modern AAA” means." }),
            ],
          }),
          (0, p.jsx)("p", {
            children:
              "Modern AAA is a country-neutral quality tag, not a language or traditional genre. It marks 700 standout series from 2015 onward with an IMDb rating of at least 7.2, meaningful audience depth, and the strongest combined quality signal in this catalogue. It spans live action, Asian drama, anime and animation.",
          }),
        ],
      }),
      (0, p.jsxs)("section", {
        className: "method-panel kdrama-method",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("p", { className: "eyebrow", children: "COMPREHENSIVE ARCHIVE" }),
              (0, p.jsx)("h2", { children: "How the K-Drama shelf differs." }),
            ],
          }),
          (0, p.jsxs)("p", {
            children: [
              "The ",
              t.total.toLocaleString(),
              "-title K-Drama Archive is available through one catalogue switch rather than a separate menu tab. It uses MyDramaList's completed South Korean drama index, removes one-off specials and runs above 60 episodes to keep out soap-style daily serials, and excludes reality, talk, documentary and film formats at source. Korean titles are now part of Browse by default; the Exclusions panel keeps everything before 2010 out and can hide the whole shelf again in one tap. Where a Korean title also exists in the ranked catalogue the two records are merged into one card, so a title never appears twice under its English and original names.",
            ],
          }),
        ],
      }),
      (0, p.jsxs)("section", {
        className: "method-panel apocalypse-method",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("p", { className: "eyebrow", children: "NEW EDITORIAL GENRE" }),
              (0, p.jsx)("h2", { children: "Post-Apocalyptic, researched worldwide." }),
            ],
          }),
          (0, p.jsxs)("p", {
            children: [
              e.postApocalypticResearch
                ? `${e.postApocalypticResearch.existingTagged + e.postApocalypticResearch.additions} titles are tagged Post-Apocalyptic, including ${e.postApocalypticResearch.additions} newly researched additions.`
                : "The Post-Apocalyptic genre is being prepared.",
              " It covers survival after civilization-scale collapse, contagion, ecological disaster, nuclear or industrial catastrophe, and anime or international stories built around the aftermath. It is a thematic tag, so you can combine it with Action, Sci-Fi, Horror, Drama or any other genre in ALL mode.",
            ],
          }),
        ],
      }),
      (0, p.jsxs)("section", {
        className: "sources-panel",
        children: [
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("p", { className: "eyebrow", children: "DATA & YOUR HISTORY" }),
              (0, p.jsxs)("h2", {
                children: [
                  e.total.toLocaleString(),
                  " ranked series. ",
                  e.watchedCount,
                  " memories preserved.",
                ],
              }),
            ],
          }),
          (0, p.jsxs)("p", {
            children: [
              "IMDb provides title identifiers, audience ratings, vote counts and episode relationships. TVmaze provides premiere dates, ended status, typical runtime, posters and plot summaries. The Post-Apocalyptic editorial pass was cross-checked against global category and genre lists, IMDb’s post-apocalyptic index and specialist zombie-TV guides. Your ",
              e.watchedCount,
              " eligible imported watched titles form a separate personal-history archive: they stay hidden by default and become available when “Include watched” is switched on.",
            ],
          }),
          (0, p.jsxs)("div", {
            className: "source-links",
            children: [
              (0, p.jsxs)("a", {
                href: "https://www.imdb.com/",
                target: "_blank",
                rel: "noreferrer",
                children: ["IMDb ", (0, p.jsx)(_, { name: "external", size: 14 })],
              }),
              (0, p.jsxs)("a", {
                href: "https://www.tvmaze.com/",
                target: "_blank",
                rel: "noreferrer",
                children: ["TVmaze ", (0, p.jsx)(_, { name: "external", size: 14 })],
              }),
              (0, p.jsxs)("a", {
                href:
                  t.source ||
                  "https://mydramalist.com/search?adv=titles&ty=68&co=3&st=3&so=popular",
                target: "_blank",
                rel: "noreferrer",
                children: [
                  "MyDramaList K-Drama index ",
                  (0, p.jsx)(_, { name: "external", size: 14 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function T() {
  let [e, t] = (0, f.useState)(m),
    [n, r] = (0, f.useState)(h),
    [l, a] = (0, f.useState)(g),
    [i, o] = (0, f.useState)(""),
    [s, u] = (0, f.useState)(!0),
    [c, d] = (0, f.useState)("home"),
    [v, k] = (0, f.useState)(null),
    [j, E] = (0, f.useState)(""),
    [N, T] = (0, f.useState)(!1),
    [z, L] = (0, f.useState)(!1),
    [P, A] = (0, f.useState)(new Set()),
    [M, O] = (0, f.useState)(new Set()),
    [R, D] = (0, f.useState)(!1),
    [$, U] = (0, f.useState)(new Set()),
    [H, V] = (0, f.useState)(new Set()),
    [W, B] = (0, f.useState)("any"),
    [q, Q] = (0, f.useState)("All countries"),
    [G, K] = (0, f.useState)("All formats"),
    [Y, X] = (0, f.useState)("rank"),
    [J, Z] = (0, f.useState)(randomSeed),
    [re, ae] = (0, f.useState)(randomSeed),
    [oe, de] = (0, f.useState)(72),
    [fe, pe] = (0, f.useState)(() => {
      let e = { catalogue: "grid", curslick: "detailed" };
      try {
        let t = JSON.parse(localStorage.getItem("morningstar-view-modes") || "null");
        return t && "object" == typeof t ? { ...e, ...t } : e;
      } catch {
        return e;
      }
    }),
    [he, me] = (0, f.useState)(() => localStorage.getItem("morningstar-grid-columns") || "auto"),
    [exclusions, setExclusions] = (0, f.useState)(readStoredExclusions);
  ((0, f.useEffect)(() => {
    let e = window.__MORNINGSTAR_DATA__;
    e
      ? queueMicrotask(() => {
          (t(e.catalogue), r(e.curslick), a(e.kDramaArchive), u(!1));
        })
      : Promise.all([
          fetch("/catalog.json").then((e) => {
            if (!e.ok) throw Error("Catalogue unavailable");
            return e.json();
          }),
          fetch("/curslick.json").then((e) => {
            if (!e.ok) throw Error("Curslick unavailable");
            return e.json();
          }),
          fetch("/kdrama-archive.json").then((e) => {
            if (!e.ok) throw Error("K-Drama archive unavailable");
            return e.json();
          }),
        ])
          .then(([e, n, l]) => {
            (t(e), r(n), a(l));
          })
          .finally(() => u(!1));
    let n = requestAnimationFrame(() => {
      try {
        (A(
          new Set(
            JSON.parse(
              localStorage.getItem("morningstar-list") ||
                localStorage.getItem("happily-list") ||
                "[]",
            ),
          ),
        ),
          O(
            new Set(
              JSON.parse(
                localStorage.getItem("morningstar-watched") ||
                  localStorage.getItem("happily-watched") ||
                  "[]",
              ),
            ),
          ));
      } catch {}
    });
    return () => cancelAnimationFrame(n);
  }, []),
    (0, f.useEffect)(() => {
      (localStorage.setItem("morningstar-view-modes", JSON.stringify(fe)),
        localStorage.setItem("morningstar-grid-columns", he));
    }, [fe, he]),
    (0, f.useEffect)(() => {
      localStorage.setItem(EXCLUSIONS_STORAGE_KEY, JSON.stringify(exclusions));
    }, [exclusions]));
  let toggleExclusion = (e) => setExclusions((t) => ({ ...t, [e]: !t[e] })),
    resetExclusions = () => setExclusions({ ...EXCLUSION_DEFAULTS });
  let ge = "curslick" === c ? "curslick" : "catalogue",
    ye = fe[ge] || ("curslick" === ge ? "detailed" : "grid"),
    ve = (e) => pe((t) => ({ ...t, [ge]: e })),
    be = (e, t, n, r) => {
      let l = new Set(n),
        a = "string" == typeof r ? Ee.get(r) : r,
        i = a ? [a.id, ...(a.aliasIds || [])] : ["string" == typeof r ? r : r.id];
      (i.some((e) => l.has(e)) ? i.forEach((e) => l.delete(e)) : l.add(i[0]),
        t(l),
        localStorage.setItem(e, JSON.stringify([...l])));
    },
    ke = (e) =>
      U((t) => {
        let n = new Set(t);
        return (n.has(e) ? n.delete(e) : n.add(e), n);
      }),
    we = (e) =>
      V((t) => {
        let n = new Set(t);
        return (n.has(e) ? n.delete(e) : n.add(e), n);
      }),
    xe = (0, f.useCallback)((e) => !!e.watched || hasShowId(M, e), [M]),
    Xe = (0, f.useCallback)((e) => hasShowId(P, e), [P]),
    Se = (0, f.useMemo)(() => n.collections.find((e) => e.id === i), [n.collections, i]),
    je = (0, f.useMemo)(
      () =>
        n.collections.flatMap((e) =>
          e.entries.flatMap((e) => (e.show ? [{ ...e.show, curslickExclusive: !0 }] : [])),
        ),
      [n.collections],
    ),
    Ce = (0, f.useMemo)(
      () =>
        buildMergedCatalogue([
          ...e.shows.map((e) => ({ ...e, mainCatalogue: !0 })),
          ...l.shows,
          ...e.watchedArchive,
          ...je,
        ]),
      [e.shows, e.watchedArchive, l.shows, je],
    ),
    Ee = (0, f.useMemo)(() => {
      let e = new Map();
      for (let t of Ce) {
        e.set(t.id, t);
        for (let n of t.aliasIds || []) e.has(n) || e.set(n, t);
      }
      return e;
    }, [Ce]),
    Ne = (0, f.useMemo)(
      () =>
        (Se?.entries || [])
          .map((e) => {
            let t = e.show
              ? Ee.get(e.show.id) || { ...e.show, curslickExclusive: !0 }
              : Ee.get(e.showId || "");
            return t ? { show: t, entry: e } : null;
          })
          .filter((e) => !!e),
      [Se, Ee],
    ),
    Te = (0, f.useMemo)(() => new Map(Ne.map(({ show: e, entry: t }) => [e.id, t])), [Ne]),
    curslickExcludedCount = Ne.filter(({ show: e }) => !passesExclusions(e, exclusions)).length,
    _e = (0, f.useMemo)(() => Ce.filter((e) => passesExclusions(e, exclusions)), [Ce, exclusions]),
    excludedCount = Ce.length - _e.length,
    ze = (0, f.useMemo)(() => Ce.filter(x).length, [Ce]),
    Le = "curslick" === c ? Ne.map(({ show: e }) => e) : _e,
    Pe = (0, f.useMemo)(
      () =>
        [...new Set(Le.map((e) => e.year).filter((e) => "number" == typeof e))].sort(
          (e, t) => t - e,
        ),
      [Le],
    ),
    Ae = (0, f.useMemo)(
      () =>
        [...new Set(Le.flatMap((e) => e.genres))].sort((e, t) =>
          "Modern AAA" === e ? -1 : "Modern AAA" === t ? 1 : e.localeCompare(t),
        ),
      [Le],
    ),
    Me = (0, f.useMemo)(
      () => ["All countries", ...[...new Set(Le.map((e) => e.country).filter(Boolean))].sort()],
      [Le],
    ),
    Oe = (0, f.useMemo)(
      () => ["All formats", ...[...new Set(Le.map((e) => e.format).filter(Boolean))].sort()],
      [Le],
    ),
    Re = (0, f.useMemo)(() => {
      if ("curslick" === c) {
        let e = Ne.map(({ show: e }) => e).filter((e) => passesExclusions(e, exclusions));
        return R ? e : e.filter((e) => !xe(e));
      }
      if ("my-list" === c) {
        let e = Ce.filter(Xe);
        return R ? e : e.filter((e) => !xe(e));
      }
      return R ? _e : _e.filter((e) => !xe(e));
    }, [Ce, _e, Ne, R, xe, Xe, c, exclusions]),
    De = (0, f.useMemo)(() => {
      let e = y(j.trim()).split(/\s+/).filter(Boolean),
        t = e.includes("watched"),
        n = e.filter((e) => "watched" !== e),
        r = Re.filter((e) => {
          if (("my-list" === c && !Xe(e)) || (t && !xe(e))) return !1;
          let r = xe(e) ? "watched already seen completed" : "unseen new not seen",
            l = Te.get(e.id),
            a =
              "curslick" === c
                ? `${l?.label || ""} ${l?.matchTags.join(" ") || ""} ${l?.why || ""}`
                : "",
            i = y(
              `${e.title} ${e.originalTitle || ""} ${e.romanisedTitle || ""} ${(e.alternativeTitles || []).join(" ")} ${e.country} ${e.language} ${e.format} ${e.status || ""} ${e.genres.join(" ")} ${e.shortPlot || ""} ${e.longPlot || ""} ${r} ${a}`,
            );
          if (
            (n.length && !n.every((e) => i.includes(e))) ||
            ($.size && (!e.year || !$.has(e.year)))
          )
            return !1;
          if (H.size) {
            let t = [...H].map((t) => e.genres.includes(t));
            if ("any" === W ? !t.some(Boolean) : !t.every(Boolean)) return !1;
          }
          return !(
            ("All countries" !== q && e.country !== q) ||
            ("All formats" !== G && e.format !== G)
          );
        });
      return (
        (r = [...r].sort((e, t) =>
          "rank" === Y && "curslick" === c
            ? (Te.get(e.id)?.position || 9999) - (Te.get(t.id)?.position || 9999)
            : "random" === Y
              ? ee(e.id, J) - ee(t.id, J)
              : "rating" === Y
                ? (t.imdbRating || 0) - (e.imdbRating || 0) || t.imdbVotes - e.imdbVotes
                : "newest" === Y
                  ? (t.year || 0) - (e.year || 0) || (e.rank || 99999) - (t.rank || 99999)
                  : ("shortest" === Y && (e.runtimeHours || 999) - (t.runtimeHours || 999)) ||
                    (e.rank || 99999) - (t.rank || 99999) ||
                    (t.qualityScore || 0) - (e.qualityScore || 0),
        )),
        r
      );
    }, [Re, j, $, H, W, q, G, Y, J, c, Xe, xe, Te]);
  (0, f.useEffect)(() => {
    let e = requestAnimationFrame(() => de(72));
    return () => cancelAnimationFrame(e);
  }, [j, $, H, W, q, G, Y, J, c, R, exclusions]);
  let Ie = (0, f.useMemo)(
      () =>
        _e
          .filter((e) => e.mainCatalogue && (R || !xe(e)))
          .sort((e, t) => (e.rank || 99999) - (t.rank || 99999)),
      [_e, R, xe],
    ),
    Fe = (0, f.useMemo)(() => (re ? S(Ie, re) : Ie), [Ie, re]),
    $e = re
      ? Fe[0]
      : Fe.find((e) => "Arcane: League of Legends" === e.title) ||
        Fe.find((e) => e.featured) ||
        Fe[0],
    Ue = (0, f.useMemo)(() => {
      let t = Fe,
        n = [
          { title: "The top 20", eyebrow: "ENDED · 2010+ · 6–60 HOURS", shows: t.slice(0, 20) },
          {
            title: "Modern AAA",
            eyebrow: "GLOBAL CRAFT · SCALE · QUALITY",
            shows: t.filter((e) => e.genres.includes("Modern AAA")).slice(0, 18),
          },
          {
            title: "Prestige drama",
            eyebrow: "SERIOUS · ACCLAIMED · COMPLETE",
            shows: t
              .filter((e) => e.genres.includes("Drama") && (e.imdbRating || 0) >= 8)
              .slice(0, 18),
          },
          {
            title: "Sci-fi & fantasy",
            eyebrow: "OTHER WORLDS · COMPLETE STORIES",
            shows: t
              .filter((e) => e.genres.some((e) => ["Science-Fiction", "Fantasy"].includes(e)))
              .slice(0, 18),
          },
          {
            title: "Post-Apocalyptic",
            eyebrow: "COLLAPSE · SURVIVAL · AFTERMATH",
            shows: t.filter((e) => e.genres.includes("Post-Apocalyptic")).slice(0, 18),
          },
          {
            title: "Crime & thrillers",
            eyebrow: "MYSTERY · TENSION · CONSEQUENCES",
            shows: t
              .filter((e) => e.genres.some((e) => ["Crime", "Thriller", "Mystery"].includes(e)))
              .slice(0, 18),
          },
          {
            title: "World television",
            eyebrow: "EVERY LANGUAGE · AROUND THE WORLD",
            shows: t
              .filter(
                (e) => !["United States", "United Kingdom", "International"].includes(e.country),
              )
              .slice(0, 18),
          },
          {
            title: "Anime & animation",
            eyebrow: "JAPANESE ANIME · GLOBAL ANIMATION",
            shows: t.filter((e) => ["Anime", "Animation"].includes(e.format)).slice(0, 18),
          },
          {
            title: "Great in under 12 hours",
            eyebrow: "A COMPLETE STORY · ONE WEEKEND",
            shows: t.filter((e) => e.runtimeHours && e.runtimeHours <= 12).slice(0, 18),
          },
        ];
      return (
        R &&
          n.push({
            title: "Your watched history",
            eyebrow: `${e.watchedCount} IMPORTED MEMORIES`,
            shows: e.watchedArchive.slice(0, 18),
          }),
        n
      );
    }, [Fe, R, e.watchedArchive, e.watchedCount]),
    He = (e) => {
      (X(e), "random" === e && Z(randomSeed()));
    },
    Ve = () => Z(randomSeed()),
    We = () => {
      (ae(randomSeed()), window.scrollTo({ top: 0, behavior: "smooth" }));
    },
    Be = (e) => {
      (d(e),
        "curslick" === e && o(""),
        E(""),
        U(new Set()),
        V(new Set()),
        Q("All countries"),
        K("All formats"),
        X("rank"),
        Z(randomSeed()),
        L(!1),
        window.scrollTo({ top: 0, behavior: "smooth" }));
    },
    qe = () => {
      (E(""), U(new Set()), V(new Set()), Q("All countries"), K("All formats"));
    },
    Qe = "browse" === c || "my-list" === c,
    Ge = _e.length,
    Ke = e.generatedAt
      ? new Date(e.generatedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "10 Aug 2026";
  return (0, p.jsxs)("div", {
    className: "site-root",
    children: [
      (0, p.jsxs)("header", {
        className: "site-header",
        children: [
          (0, p.jsx)("button", {
            className: "mobile-menu",
            onClick: () => L(!z),
            "aria-label": "Open navigation",
            children: (0, p.jsx)(_, { name: "menu" }),
          }),
          (0, p.jsxs)("button", {
            className: "wordmark",
            onClick: () => Be("home"),
            "aria-label": "Morningstar home",
            children: [
              (0, p.jsx)("span", { children: "M" }),
              "ORNINGSTAR",
              (0, p.jsx)("i", { children: "." }),
            ],
          }),
          (0, p.jsxs)("nav", {
            className: z ? "open" : "",
            children: [
              (0, p.jsx)("button", {
                className: "home" === c ? "active" : "",
                onClick: () => Be("home"),
                children: "Home",
              }),
              (0, p.jsxs)("button", {
                className: "browse" === c ? "active" : "",
                onClick: () => Be("browse"),
                children: [
                  "Browse ",
                  (0, p.jsxs)("span", { children: [Math.round(Ge / 1e3), "K+"] }),
                ],
              }),
              (0, p.jsxs)("button", {
                className: "curslick" === c ? "active" : "",
                onClick: () => Be("curslick"),
                children: ["Curslick ", (0, p.jsx)("span", { children: n.collections.length })],
              }),
              (0, p.jsx)("button", {
                className: "my-list" === c ? "active" : "",
                onClick: () => Be("my-list"),
                children: "My List",
              }),
              (0, p.jsx)("button", {
                className: "method" === c ? "active" : "",
                onClick: () => Be("method"),
                children: "Method",
              }),
            ],
          }),
          (0, p.jsxs)("div", {
            className: "header-search " + (N ? "open" : ""),
            children: [
              (0, p.jsx)(_, { name: "search" }),
              (0, p.jsx)("input", {
                value: j,
                onChange: (e) => {
                  let t = e.target.value;
                  (E(t), t && ("curslick" !== c || !Se) && d("browse"));
                },
                placeholder: "Title, any plot word, genre…",
                "aria-label": "Search titles and every plot word",
              }),
              (0, p.jsx)("button", { onClick: () => T(!N), "aria-label": "Toggle search" }),
            ],
          }),
          (0, p.jsxs)("button", {
            className: "history-toggle " + (R ? "active" : ""),
            onClick: () => D((e) => !e),
            "aria-pressed": R,
            children: [
              (0, p.jsx)(_, { name: R ? "check" : "eye", size: 16 }),
              (0, p.jsx)("span", { children: R ? "Watched shown" : "Watched hidden" }),
              (0, p.jsx)("b", { children: e.watchedCount }),
            ],
          }),
        ],
      }),
      s
        ? (0, p.jsxs)("main", {
            className: "loading-screen",
            children: [
              (0, p.jsx)("div", { className: "loading-mark", children: "M" }),
              (0, p.jsx)("p", { children: "Opening Morningstar…" }),
            ],
          })
        : "method" === c
          ? (0, p.jsx)(ue, { catalogue: e, kDramaArchive: l })
          : "curslick" === c
            ? Se
              ? (0, p.jsx)(le, {
                  collection: Se,
                  collections: n.collections,
                  onBack: () => {
                    (o(""), qe(), X("rank"), Z(0), window.scrollTo({ top: 0, behavior: "smooth" }));
                  },
                  onSelectCollection: (e) => {
                    (o(e),
                      U(new Set()),
                      V(new Set()),
                      Q("All countries"),
                      K("All formats"),
                      X("rank"),
                      Z(0),
                      window.scrollTo({ top: 0, behavior: "smooth" }));
                  },
                  shows: De,
                  entries: Te,
                  list: P,
                  watched: M,
                  onOpen: k,
                  onToggleList: (e) => be("morningstar-list", A, P, e),
                  years: Pe,
                  selectedYears: $,
                  onToggleYear: ke,
                  onClearYears: () => U(new Set()),
                  genres: Ae,
                  selectedGenres: H,
                  genreMode: W,
                  onGenreMode: B,
                  onToggleGenre: we,
                  onClearGenres: () => V(new Set()),
                  countries: Me,
                  country: q,
                  onCountry: Q,
                  formats: Oe,
                  format: G,
                  onFormat: K,
                  sort: Y,
                  onSort: He,
                  includeWatched: R,
                  onIncludeWatched: D,
                  watchedCount: e.watchedCount,
                  onSpin: Ve,
                  onReset: qe,
                  exclusions: exclusions,
                  onToggleExclusion: toggleExclusion,
                  onResetExclusions: resetExclusions,
                  excludedCount: curslickExcludedCount,
                  kDramaCount: ze,
                  viewMode: ye,
                  onViewMode: ve,
                  gridColumns: he,
                  onGridColumns: me,
                })
              : (0, p.jsx)(ce, {
                  collections: n.collections,
                  knownShows: Ee,
                  onOpenCollection: (e) => {
                    (o(e), window.scrollTo({ top: 0, behavior: "smooth" }));
                  },
                })
            : (0, p.jsxs)(p.Fragment, {
                children: [
                  "home" === c && $e
                    ? (0, p.jsxs)("section", {
                        className: "hero",
                        children: [
                          $e.image
                            ? (0, p.jsx)("img", { className: "hero-art", src: $e.image, alt: "" })
                            : null,
                          (0, p.jsx)("div", { className: "hero-vignette" }),
                          (0, p.jsxs)("div", {
                            className: "hero-content",
                            children: [
                              (0, p.jsxs)("p", {
                                className: "hero-overline",
                                children: [
                                  (0, p.jsx)("span", { children: "M" }),
                                  " MODERN AAA · COMPLETED",
                                ],
                              }),
                              (0, p.jsx)("div", {
                                className: "hero-title-row",
                                children: (0, p.jsx)("h1", { children: $e.title }),
                              }),
                              (0, p.jsxs)("div", {
                                className: "hero-meta",
                                children: [
                                  (0, p.jsxs)("b", {
                                    children: [$e.imdbRating?.toFixed(1), " IMDb"],
                                  }),
                                  (0, p.jsxs)("b", { children: ["Rank #", $e.rank] }),
                                  (0, p.jsx)("b", { children: $e.year }),
                                  (0, p.jsxs)("b", { children: [$e.episodes, " episodes"] }),
                                  (0, p.jsx)("b", { children: b($e) }),
                                ],
                              }),
                              (0, p.jsxs)("button", {
                                className: "hero-plot-button",
                                onClick: () => k($e),
                                children: [
                                  (0, p.jsx)("span", { children: $e.shortPlot }),
                                  (0, p.jsxs)("small", {
                                    children: [
                                      "Open detailed plot ",
                                      (0, p.jsx)(_, { name: "chevron", size: 13 }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, p.jsxs)("div", {
                                className: "hero-actions",
                                children: [
                                  (0, p.jsxs)("button", {
                                    className: "hero-play",
                                    onClick: () => k($e),
                                    children: [(0, p.jsx)(_, { name: "play" }), " Explore"],
                                  }),
                                  (0, p.jsxs)("button", {
                                    className: "hero-info",
                                    onClick: () => k($e),
                                    children: [(0, p.jsx)(_, { name: "info" }), " More info"],
                                  }),
                                  (0, p.jsxs)("a", {
                                    className: "hero-chatgpt",
                                    href: C($e),
                                    target: "_blank",
                                    rel: "noreferrer",
                                    children: [
                                      (0, p.jsx)(_, { name: "spark", size: 18 }),
                                      " Ending & romance",
                                    ],
                                  }),
                                  (0, p.jsxs)("a", {
                                    className: "hero-chatgpt simple-chatgpt-action",
                                    href: te($e),
                                    target: "_blank",
                                    rel: "noreferrer",
                                    children: [
                                      (0, p.jsx)(_, { name: "external", size: 15 }),
                                      " Title · year · country",
                                    ],
                                  }),
                                  (0, p.jsxs)("button", {
                                    className: "hero-refresh",
                                    onClick: We,
                                    children: [
                                      (0, p.jsx)(_, { name: "spark", size: 16 }),
                                      " Refresh home",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, p.jsxs)("div", {
                            className: "hero-stats",
                            children: [
                              (0, p.jsxs)("span", {
                                children: [
                                  (0, p.jsx)("strong", { children: e.total.toLocaleString() }),
                                  " ranked titles",
                                ],
                              }),
                              (0, p.jsxs)("span", {
                                children: [
                                  (0, p.jsx)("strong", { children: n.collections.length }),
                                  " Curslick paths",
                                ],
                              }),
                              (0, p.jsxs)("span", {
                                children: [
                                  (0, p.jsx)("strong", { children: Ge.toLocaleString() }),
                                  " searchable",
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                    : null,
                  "home" === c
                    ? (0, p.jsxs)("main", {
                        className: "home-rails",
                        children: [
                          (0, p.jsxs)("div", {
                            className: "promise-strip",
                            children: [
                              (0, p.jsxs)("span", {
                                children: [
                                  (0, p.jsx)(_, { name: "check", size: 15 }),
                                  " ",
                                  e.total.toLocaleString(),
                                  " ranked titles",
                                ],
                              }),
                              (0, p.jsxs)("span", {
                                children: [
                                  (0, p.jsx)(_, { name: "check", size: 15 }),
                                  " Top 5 countries only by default",
                                ],
                              }),
                              (0, p.jsxs)("span", {
                                children: [
                                  (0, p.jsx)(_, { name: "check", size: 15 }),
                                  " No documentary or reality",
                                ],
                              }),
                              (0, p.jsxs)("span", {
                                children: [
                                  (0, p.jsx)(_, { name: "check", size: 15 }),
                                  " Watched hidden by default",
                                ],
                              }),
                              (0, p.jsxs)("span", {
                                children: [
                                  (0, p.jsx)(_, { name: "check", size: 15 }),
                                  " Curslick experience paths",
                                ],
                              }),
                              (0, p.jsxs)("button", {
                                onClick: We,
                                className: "home-refresh-button",
                                children: [
                                  (0, p.jsx)(_, { name: "spark", size: 14 }),
                                  " Refresh home",
                                ],
                              }),
                              (0, p.jsxs)("button", {
                                onClick: () => Be("method"),
                                children: [
                                  "Read the method ",
                                  (0, p.jsx)(_, { name: "chevron", size: 14 }),
                                ],
                              }),
                            ],
                          }),
                          Ue.map((e) =>
                            (0, p.jsx)(
                              w,
                              {
                                ...e,
                                list: P,
                                watched: M,
                                onOpen: k,
                                onToggleList: (e) => be("morningstar-list", A, P, e),
                              },
                              e.title,
                            ),
                          ),
                          (0, p.jsxs)("section", {
                            className: "curslick-cta",
                            children: [
                              (0, p.jsxs)("div", {
                                children: [
                                  (0, p.jsxs)("p", {
                                    children: [
                                      "CURSLICK · THE EXPERIENCE LAYER · ",
                                      n.collections.length,
                                      " COLLECTIONS",
                                    ],
                                  }),
                                  (0, p.jsxs)("h2", {
                                    children: [
                                      "From ",
                                      (0, p.jsx)("em", { children: "Run Hide Fight" }),
                                      " tension to ",
                                      (0, p.jsx)("em", { children: "The Bodyguard" }),
                                      " romance.",
                                    ],
                                  }),
                                  (0, p.jsx)("span", {
                                    children:
                                      "Curslick opens as its own hub. Enter each research-ranked article separately, then use the same filters and full series pages.",
                                  }),
                                ],
                              }),
                              (0, p.jsxs)("button", {
                                onClick: () => Be("curslick"),
                                children: ["Open Curslick ", (0, p.jsx)(_, { name: "chevron" })],
                              }),
                            ],
                          }),
                        ],
                      })
                    : null,
                  Qe
                    ? (0, p.jsxs)("main", {
                        className: "browse-view page-shell",
                        children: [
                          (0, p.jsxs)("div", {
                            className: "browse-title",
                            children: [
                              (0, p.jsxs)("div", {
                                children: [
                                  (0, p.jsx)("p", {
                                    className: "eyebrow",
                                    children:
                                      "my-list" === c
                                        ? "SAVED FOR LATER"
                                        : `${Ge.toLocaleString()} SEARCHABLE SERIES · RANKED CATALOGUE + ARCHIVES + CURSLICK`,
                                  }),
                                  (0, p.jsx)("h1", {
                                    children: "my-list" === c ? "My List" : "Browse everything",
                                  }),
                                ],
                              }),
                              (0, p.jsxs)("p", {
                                children: [
                                  De.length.toLocaleString(),
                                  " result",
                                  1 === De.length ? "" : "s",
                                  R ? " · watched included" : " · watched hidden",
                                ],
                              }),
                            ],
                          }),
                          (0, p.jsx)(se, {
                            years: Pe,
                            selectedYears: $,
                            onToggleYear: ke,
                            onClearYears: () => U(new Set()),
                            genres: Ae,
                            selectedGenres: H,
                            genreMode: W,
                            onGenreMode: B,
                            onToggleGenre: we,
                            onClearGenres: () => V(new Set()),
                            countries: Me,
                            country: q,
                            onCountry: Q,
                            formats: Oe,
                            format: G,
                            onFormat: K,
                            sort: Y,
                            onSort: He,
                            includeWatched: R,
                            onIncludeWatched: D,
                            watchedCount: e.watchedCount,
                            kDramaCount: ze,
                            exclusions: exclusions,
                            onToggleExclusion: toggleExclusion,
                            onResetExclusions: resetExclusions,
                            excludedCount: excludedCount,
                            onSpin: Ve,
                            viewMode: ye,
                            onViewMode: ve,
                            gridColumns: he,
                            onGridColumns: me,
                          }),
                          De.length
                            ? (0, p.jsxs)(p.Fragment, {
                                children: [
                                  (0, p.jsx)("section", {
                                    className: `show-grid view-${ye} ${"auto" !== he ? "custom-columns" : ""}`,
                                    style: "auto" !== he ? { "--grid-columns": he } : void 0,
                                    children: De.slice(0, oe).map((e) =>
                                      (0, p.jsx)(
                                        ne,
                                        {
                                          show: e,
                                          onOpen: () => k(e),
                                          inList: Xe(e),
                                          isWatched: xe(e),
                                          onToggleList: () => be("morningstar-list", A, P, e.id),
                                        },
                                        e.id,
                                      ),
                                    ),
                                  }),
                                  oe < De.length
                                    ? (0, p.jsxs)("button", {
                                        className: "load-more",
                                        onClick: () => de((e) => e + 72),
                                        children: [
                                          "Show 72 more ",
                                          (0, p.jsxs)("span", {
                                            children: [
                                              (De.length - oe).toLocaleString(),
                                              " remaining",
                                            ],
                                          }),
                                        ],
                                      })
                                    : null,
                                ],
                              })
                            : (0, p.jsxs)("section", {
                                className: "empty-state",
                                children: [
                                  (0, p.jsx)("div", {
                                    children: (0, p.jsx)(_, { name: "search", size: 34 }),
                                  }),
                                  (0, p.jsx)("h2", { children: "No series match those choices." }),
                                  (0, p.jsx)("p", {
                                    children:
                                      "Try another plot word, year combination, genre mode, country or format.",
                                  }),
                                  (0, p.jsx)("button", { onClick: qe, children: "Clear filters" }),
                                ],
                              }),
                        ],
                      })
                    : null,
                ],
              }),
      (0, p.jsxs)("footer", {
        children: [
          (0, p.jsxs)("button", {
            className: "footer-mark",
            onClick: () => Be("home"),
            children: [
              (0, p.jsx)("span", { children: "M" }),
              "ORNINGSTAR",
              (0, p.jsx)("i", { children: "." }),
            ],
          }),
          (0, p.jsxs)("p", {
            children: [
              Ge.toLocaleString(),
              " searchable series across the ranked catalogue, optional K-dramas and Curslick.",
            ],
          }),
          (0, p.jsxs)("div", {
            children: [
              (0, p.jsx)("button", { onClick: () => Be("method"), children: "Method" }),
              (0, p.jsx)("button", { onClick: () => Be("curslick"), children: "Curslick" }),
              (0, p.jsx)("button", { onClick: () => Be("browse"), children: "Browse" }),
              (0, p.jsx)("button", {
                onClick: () => {
                  let e = JSON.stringify(
                      {
                        app: "Morningstar",
                        schemaVersion: 1,
                        exportedAt: new Date().toISOString(),
                        myList: [...P],
                        extraWatched: [...M],
                      },
                      null,
                      2,
                    ),
                    t = URL.createObjectURL(new Blob([e], { type: "application/json" })),
                    n = document.createElement("a");
                  ((n.href = t),
                    (n.download = `Morningstar-personal-data-${new Date().toISOString().slice(0, 10)}.json`),
                    document.body.appendChild(n),
                    n.click(),
                    n.remove(),
                    window.setTimeout(() => URL.revokeObjectURL(t), 0));
                },
                children: "Back up My List",
              }),
              (0, p.jsxs)("label", {
                className: "footer-import",
                children: [
                  "Restore backup",
                  (0, p.jsx)("input", {
                    type: "file",
                    accept: "application/json,.json",
                    onChange: async (e) => {
                      let t = e.target.files?.[0];
                      if (((e.target.value = ""), t))
                        try {
                          let e = JSON.parse(await t.text());
                          if (
                            "Morningstar" !== e.app ||
                            !Array.isArray(e.myList) ||
                            !Array.isArray(e.extraWatched)
                          )
                            throw Error("Invalid backup");
                          let n = new Set(e.myList.filter((e) => "string" == typeof e)),
                            r = new Set(e.extraWatched.filter((e) => "string" == typeof e));
                          (A(n),
                            O(r),
                            localStorage.setItem("morningstar-list", JSON.stringify([...n])),
                            localStorage.setItem("morningstar-watched", JSON.stringify([...r])),
                            window.alert(
                              `Morningstar restored ${n.size} My List titles and ${r.size} extra watched marks.`,
                            ));
                        } catch {
                          window.alert(
                            "That file is not a valid Morningstar personal-data backup.",
                          );
                        }
                    },
                  }),
                ],
              }),
              (0, p.jsxs)("span", { children: ["Updated ", Ke] }),
            ],
          }),
        ],
      }),
      v
        ? (0, p.jsx)(
            ie,
            {
              show: v,
              inList: Xe(v),
              isWatched: xe(v),
              onClose: () => k(null),
              onToggleList: () => be("morningstar-list", A, P, v.id),
              onToggleWatched: () => be("morningstar-watched", O, M, v.id),
              curslickEntry: "curslick" === c ? Te.get(v.id) : void 0,
            },
            v.id,
          )
        : null,
    ],
  });
}
var E = document.getElementById("root");
if (!E) throw Error("Morningstar could not find its application root.");
(0, d.createRoot)(E).render((0, p.jsx)(f.StrictMode, { children: (0, p.jsx)(T, {}) }));
