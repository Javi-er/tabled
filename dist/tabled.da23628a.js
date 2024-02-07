// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/tabled.ts":[function(require,module,exports) {
"use strict";

var Tabled = /** @class */function () {
  /**
   * Augment the table if it meets the necessary requirements.
   *
   * @param {Element} table
   */
  function Tabled(table, index, options) {
    var _this = this;
    if (this.checkConditions(table)) {
      // Set up attributes
      table.classList.add('tabled');
      // Add the wrapper
      this.wrap(table);
      var wrapper = this.getWrapper(table);
      wrapper.setAttribute('id', 'tabled-n' + index);
      // Identify and adjust columns that could need a large width
      this.adjustColumnsWidth(table);
      // Add navigation controls.
      this.addTableControls(table);
      // Identify and set the initial state for the tables
      this.applyFade(table);
      // On table scrolling, add or remove the left / right fading
      wrapper.addEventListener('scroll', function (e) {
        _this.applyFade(table);
      });
      // Initialize a resize observer for changing the table status
      new ResizeObserver(function () {
        _this.applyFade(table);
      }).observe(wrapper);
    } else if (options.failClass) {
      table.classList.add(options.failClass);
    }
  }
  /**
   *  Returns the wrapper of the table.
   *
   * @param {HTMLTableElement} table
   * @returns HTMLDivElement
   */
  Tabled.prototype.getWrapper = function (table) {
    return table.parentNode;
  };
  /**
   *  Returns the container of the table.
   *
   * @param {HTMLTableElement} table
   * @returns HTMLDivElement
   */
  Tabled.prototype.getContainer = function (table) {
    return table.parentNode.parentNode;
  };
  /**
   * Adjust column widths for cells that can have plenty of content by looking
   * at the cell height.
   *
   * @param {HTMLTableElement} table
   * @param {Integer} characterThreshold
   * @param {String} columnWidthLarge
   */
  Tabled.prototype.adjustColumnsWidth = function (table, characterThresholdLarge, characterThresholdSmall, columnLarge, columnSmall) {
    if (characterThresholdLarge === void 0) {
      characterThresholdLarge = 50;
    }
    if (characterThresholdSmall === void 0) {
      characterThresholdSmall = 8;
    }
    if (columnLarge === void 0) {
      columnLarge = "tabled__column--large";
    }
    if (columnSmall === void 0) {
      columnSmall = "tabled__column--small";
    }
    for (var _i = 0, _a = table.rows; _i < _a.length; _i++) {
      var row = _a[_i];
      Array.from(row.cells).forEach(function (cell, index) {
        // Check if there are cells that are taller than the threshold
        if (cell.innerText.length > characterThresholdLarge) {
          cell.classList.add(columnLarge);
        } else if (cell.innerText.length <= characterThresholdSmall) {
          cell.classList.add(columnSmall);
        }
      });
    }
  };
  /**
   * Wraps an element with another.
   *
   * @param {HTMLTableElement} table
   */
  Tabled.prototype.wrap = function (table) {
    // Wrap the table in the scrollable div
    var wrapper = document.createElement('div');
    wrapper.classList.add('tabled--wrapper');
    wrapper.setAttribute('tabindex', '0');
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
    // Wrap in another div for containing navigation and fading.
    var container = document.createElement('div');
    container.classList.add('tabled--container');
    wrapper.parentNode.insertBefore(container, wrapper);
    container.appendChild(wrapper);
  };
  /**
  * Applies a fading effect on the edges according to the scrollbar position.
  *
  * @param {HTMLTableElement} table
  */
  Tabled.prototype.applyFade = function (table) {
    var wrapper = this.getWrapper(table),
      container = wrapper.parentNode;
    // Left fading
    if (wrapper.scrollLeft > 1) {
      container.classList.add('tabled--fade-left');
      container.querySelector('.tabled--previous').removeAttribute('disabled');
    } else {
      container.classList.remove('tabled--fade-left');
      container.querySelector('.tabled--previous').setAttribute('disabled', 'disabled');
    }
    // Right fading
    var width = wrapper.offsetWidth,
      scrollWidth = wrapper.scrollWidth;
    // If there is less than a pixel of difference between the table
    if (scrollWidth - wrapper.scrollLeft - width < 1) {
      container.classList.remove('tabled--fade-right');
      container.querySelector('.tabled--next').setAttribute('disabled', 'disabled');
    } else {
      container.classList.add('tabled--fade-right');
      container.querySelector('.tabled--next').removeAttribute('disabled');
    }
  };
  /**
   * Scroll the table in the specified direction.
   *
   * @param {HTMLTableElement} table
   * @param {string} direction ["previous", "next"]
   */
  Tabled.prototype.move = function (table, direction) {
    if (direction === void 0) {
      direction = "previous";
    }
    var wrapper = this.getWrapper(table);
    // Get the container's left position
    var containerLeft = wrapper.parentNode.getBoundingClientRect().left;
    // The first row defines the columns, but in the case that the first row
    // has only one column, use the second row instead.
    var columns = table.rows[0].cells > 1 ? table.rows[0].cells : table.rows[1].cells;
    var currentLeft = 0;
    var scrollToPosition = 0;
    // Loop through all the columns in the table and find the next or prev
    // column based on the position of each columns in the container.
    if (direction == "next") {
      for (var i = 0; i < columns.length; i++) {
        var columnLeft = columns[i].getBoundingClientRect().left;
        currentLeft = columnLeft - containerLeft;
        if (currentLeft > 1) {
          scrollToPosition = columns[i].offsetLeft;
          break;
        }
      }
    } else if (direction == "previous") {
      for (var i = columns.length - 1; i > 0; i--) {
        // Get the left position of each column
        var columnLeft = columns[i].getBoundingClientRect().left;
        currentLeft = columnLeft - containerLeft;
        if (currentLeft <= 0) {
          scrollToPosition = columns[i].offsetLeft;
          break;
        }
      }
    }
    // Scroll to the identified position
    wrapper.scrollTo({
      left: scrollToPosition,
      top: 0,
      behavior: 'smooth'
    });
  };
  /**
   * Creates and attaches the table navigation.
   *
   * @param {HTMLTableElement} table
   */
  Tabled.prototype.addTableControls = function (table) {
    var _this = this;
    // Set up the navigation.
    ['next', 'previous'].forEach(function (direction) {
      var button = document.createElement('button');
      button.classList.add('tabled--' + direction);
      button.setAttribute("aria-label", direction + " table column");
      button.setAttribute("aria-controls", _this.getWrapper(table).getAttribute('id'));
      button.setAttribute("disabled", "disabled");
      button.setAttribute("type", "button");
      button.addEventListener('click', function (e) {
        _this.move(table, direction);
      });
      _this.getContainer(table).prepend(button);
    });
    // Tweak the caption.
    var caption = table.querySelector('caption');
    if (caption) {
      caption.classList.add('visually-hidden');
      var captionDiv = document.createElement('div');
      captionDiv.classList.add('table-caption');
      captionDiv.innerHTML = caption.innerText;
      captionDiv.setAttribute('aria-hidden', true);
      this.getContainer(table).appendChild(captionDiv);
    }
  };
  /**
   * Validates if a table meets the necessary conditions for this plugin.
   *
   * @param {HTMLTableElement} table
   * @returns boolean
   */
  Tabled.prototype.checkConditions = function (table) {
    var pass = true;
    // Don't initialize under the following conditions.
    // If a table has another table inside.
    if (table.querySelector('table')) {
      pass = false;
    }
    ;
    // If a table is contained in another table.
    var result = document.evaluate("ancestor::table", table, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (result) {
      pass = false;
    }
    ;
    // If the table doesn't have a tbody element as a direct descendant.
    if (!table.querySelector('table > tbody')) {
      pass = false;
    }
    ;
    return pass;
  };
  return Tabled;
}();
},{}],"../../../.nvm/versions/node/v20.11.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57534" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v20.11.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/tabled.ts"], null)
//# sourceMappingURL=/tabled.da23628a.js.map