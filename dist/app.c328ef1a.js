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
})({"app.js":[function(require,module,exports) {
var tileDisplay = document.querySelector('.tile-container');
var keyboard = document.querySelector('.key-container');
var messageDisplay = document.querySelector('.message-container');
var wordle;

var getWordle = function getWordle() {
  fetch('/word').then(function (response) {
    return response.json();
  }).then(function (json) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var currDay = Math.round(Date.now() / day) % json.length;
    wordle = '$' + json[currDay];
    console.log(wordle);
  }).catch(function (err) {
    return console.log(err);
  });
};

getWordle();
var keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '«'];
var guessRows = [['$', '', '', '', ''], ['$', '', '', '', ''], ['$', '', '', '', ''], ['$', '', '', '', ''], ['$', '', '', '', ''], ['$', '', '', '', '']];
var final_Rows = [['b', 'b', 'b', 'b', 'b'], ['b', 'b', 'b', 'b', 'b'], ['b', 'b', 'b', 'b', 'b'], ['b', 'b', 'b', 'b', 'b'], ['b', 'b', 'b', 'b', 'b'], ['b', 'b', 'b', 'b', 'b']];
var currentRow = 0;
var currentTile = 1;
var isGameOver = false;
guessRows.forEach(function (guessRow, guessRowIndex) {
  var rowElement = document.createElement('div');
  rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
  guessRow.forEach(function (_guess, guessIndex) {
    var tileElement = document.createElement('div');
    tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
    tileElement.classList.add('tile');
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});
keys.forEach(function (key) {
  var buttonElement = document.createElement('button');
  buttonElement.textContent = key;
  buttonElement.setAttribute('id', key);
  buttonElement.addEventListener('click', function () {
    return handleClick(key);
  });
  keyboard.append(buttonElement);
});
document.addEventListener('keydown', function (event) {
  if (event.key.toUpperCase() === 'BACKSPACE') {
    handleClick('«');
  } else if (keys.includes(event.key.toUpperCase())) {
    handleClick(event.key.toUpperCase());
  }
});

var handleClick = function handleClick(letter) {
  if (!isGameOver) {
    if (letter === '«' || letter === 'BACKSPACE') {
      deleteLetter();
      return;
    }

    if (letter === 'ENTER') {
      checkRow();
      return;
    }

    addLetter(letter);
  }
};

var addLetter = function addLetter(letter) {
  if (currentTile === 1) {
    var tile = document.getElementById('guessRow-' + currentRow + '-tile-' + 0);
    tile.textContent = '$';
    guessRows[currentRow][currentTile] = '$';
    tile.setAttribute('data', '$');
  }

  if (currentTile < 5 && currentRow < 6) {
    var _tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);

    _tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;

    _tile.setAttribute('data', letter);

    currentTile++;
  }
};

var deleteLetter = function deleteLetter() {
  if (currentTile > 1) {
    currentTile--;
    var tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
  }
};

var checkRow = function checkRow() {
  var guess = guessRows[currentRow].join('').substring(1);

  if (currentTile > 4) {
    fetch("/check/?word=".concat(guess)).then(function (response) {
      return response.json();
    }).then(function (json) {
      if (json == 'Symbol not found') {
        showMessage('Symbol not in list');
        return;
      } else {
        flipTile();

        if (wordle == '$' + guess) {
          winMessage("$$$");
          isGameOver = true;
          return;
        } else {
          if (currentRow >= 5) {
            isGameOver = true;
            loseMessage('Game Over');
            return;
          }

          if (currentRow < 5) {
            currentRow++;
            currentTile = 1;
          }
        }
      }
    }).catch(function (err) {
      return console.log(err);
    });
  }
};

var showMessage = function showMessage(message) {
  var messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(function () {
    return messageDisplay.removeChild(messageElement);
  }, 10000);
};

var loseMessage = function loseMessage(message) {
  var outerDiv = document.createElement('div');
  var innerDiv = document.createElement('div');
  var onclickDiv = document.createElement('button');
  var str_cont = "Bankrupt... \n" + (currentRow + 1) + "/" + "6 \n";

  for (var g = 0; g <= currentRow; g++) {
    for (var j = 0; j < 5; j++) {
      if (final_Rows[g][j] === 'b') {
        str_cont += '⬛ ';
      } else if (final_Rows[g][j] === 'bl') {
        str_cont += '🟦 ';
      } else {
        str_cont += '🟩 ';
      }
    }

    str_cont += '\n';
  }

  innerDiv.textContent = str_cont;
  onclickDiv.textContent = "Copy to clipboard";
  outerDiv.appendChild(innerDiv);
  outerDiv.appendChild(onclickDiv);
  outerDiv.style.justifyContent = 'center';
  innerDiv.style.justifyContent = 'center';
  innerDiv.style.textAlign = 'center';
  innerDiv.style.top = '20%';
  onclickDiv.style.textAlign = 'center';
  outerDiv.style.whiteSpace = "pre-wrap";
  innerDiv.style.whiteSpace = "pre-wrap";
  onclickDiv.style.whiteSpace = 'pre-wrap';
  outerDiv.style.textAlign = 'center';
  innerDiv.style.fontSize = 'x-large';
  outerDiv.style.textAlign = 'x-large';
  onclickDiv.style.textAlign = 'x-large';
  innerDiv.style.color = "#000000";
  onclickDiv.style.color = "#000000";
  outerDiv.style.zIndex = '1000';
  outerDiv.style.height = '30%';
  outerDiv.style.width = '40%';
  outerDiv.style.position = 'fixed';
  outerDiv.style.left = '30%';
  outerDiv.style.top = '35%';
  outerDiv.style.overflow = 'auto';
  outerDiv.style.outlineColor = "#FF0000";
  outerDiv.style.backgroundColor = 'rgba(255,255,255,0.85)';

  onclickDiv.onclick = function copy() {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = str_cont;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  outerDiv.style.display = 'block';
  setTimeout(function () {
    return messageDisplay.append(outerDiv);
  }, 3000);
};

var winMessage = function winMessage(message) {
  var outerDiv = document.createElement('div');
  var innerDiv = document.createElement('div');
  var onclickDiv = document.createElement('button');
  var closeDiv = document.createElement('button');
  var str_cont = "Stockle ... \n" + (currentRow + 1) + "/" + "6 \n";

  for (var g = 0; g <= currentRow; g++) {
    for (var j = 0; j < 5; j++) {
      if (final_Rows[g][j] === 'b') {
        str_cont += '⬛ ';
      } else if (final_Rows[g][j] === 'bl') {
        str_cont += '🟦 ';
      } else {
        str_cont += '🟩 ';
      }
    }

    str_cont += '\n';
  }

  closeDiv.style.position = 'absolute';
  closeDiv.style.backgroundColor = 'red';
  closeDiv.style.color = 'white';
  closeDiv.style.top = '-10px';
  closeDiv.style.right = '-10px';
  innerDiv.textContent = str_cont;
  onclickDiv.textContent = "Copy to clipboard";
  outerDiv.appendChild(innerDiv);
  outerDiv.appendChild(onclickDiv);
  outerDiv.appendChild(closeDiv);
  outerDiv.style.justifyContent = 'center';
  innerDiv.style.justifyContent = 'center';
  innerDiv.style.textAlign = 'center';
  innerDiv.style.top = '20%';
  onclickDiv.style.textAlign = 'center';
  outerDiv.style.whiteSpace = "pre-wrap";
  innerDiv.style.whiteSpace = "pre-wrap";
  onclickDiv.style.whiteSpace = 'pre-wrap';
  outerDiv.style.textAlign = 'center';
  innerDiv.style.fontSize = 'x-large';
  outerDiv.style.textAlign = 'x-large';
  onclickDiv.style.textAlign = 'x-large';
  innerDiv.style.color = "#000000";
  onclickDiv.style.color = "#000000";
  outerDiv.style.zIndex = '1000';
  outerDiv.style.height = '30%';
  outerDiv.style.width = '40%';
  outerDiv.style.position = 'fixed';
  outerDiv.style.left = '30%';
  outerDiv.style.top = '35%';
  outerDiv.style.overflow = 'auto';
  outerDiv.style.outlineColor = "#FF0000";
  outerDiv.style.backgroundColor = 'rgba(255,255,255,0.85)';

  onclickDiv.onclick = function copy() {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = str_cont;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  closeDiv.onclick = function close() {
    messageDisplay.removeChild(outerDiv);
  };

  outerDiv.style.display = 'block';
  setTimeout(function () {
    return messageDisplay.append(outerDiv);
  }, 3000);
};

var addColorToKey = function addColorToKey(keyLetter, color) {
  if (keyLetter !== '$') {
    var key = document.getElementById(keyLetter);
    key.classList.add(color);
  }
};

var flipTile = function flipTile() {
  var rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
  var checkWordle = wordle;
  var guess = [];
  rowTiles.forEach(function (tile) {
    guess.push({
      letter: tile.getAttribute('data'),
      color: 'grey-overlay'
    });
  });
  guess.forEach(function (guess, index) {
    if (guess.letter == wordle[index]) {
      guess.color = 'green-overlay';
      final_Rows[currentRow][index] = 'g';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });
  guess.forEach(function (guess, index) {
    if (checkWordle.includes(guess.letter)) {
      final_Rows[currentRow][index] = 'bl';
      guess.color = 'yellow-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  });
  rowTiles.forEach(function (tile, index) {
    setTimeout(function () {
      tile.classList.add('flip');
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50484" + '/');

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
      }); // Enable HMR for CSS by default.

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
  overlay.id = OVERLAY_ID; // html encode message and stack trace

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
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map