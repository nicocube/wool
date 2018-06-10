/*
 * Copyright 2017 Nicolas Lochet Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

module.exports = function (logger, debug, port) {
  'use strict'

  var bankai = require('bankai/http')
    , http = require('http')
    , path = require('path')

    , clientPath = path.join(__dirname, 'client.js')
    , compiler = bankai(clientPath, {
      html: { favicon: 'favicon.ico' },
      js: {debug: debug}
    })

    , extract = function(t,a) {
      return a.reduce(function(p,c){ if (c in t && t[c]) p[c] = t[c]; return p },{})
    }
    , makeHttpLog = function(req, res, start) {
      return function() {
        var q = {
          req: extract(req, ['httpVersion', 'method', 'url', 'headers', 'body', 'remoteAddress']),
          res: extract(res, ['statusCode', '_header', '_headers'])
        }
        logger.info(q, '%s %s - %s in %dms', req.method, req.url, res.statusCode, Date.now() - start)
      }
    }

  var server = http.createServer(function (req, res) {
    var log = makeHttpLog(req, res, Date.now())

    compiler(req, res, function () {
      res.statusCode = 404
      res.end('not found')
    })

  }).listen(port)

  return server
}

