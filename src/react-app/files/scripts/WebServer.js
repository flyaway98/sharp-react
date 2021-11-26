const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const glob = require('glob');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const querystring = require('query-string');
const { argv } = require('argvs');
class CreateServer {
    constructor(config = {}) {
        const defaultConfig = {
            hostname: 'localhost',
            port: 3000,
            publicPath: '',
            buildPath: 'build',
            proxys: [{
                path: '/api',
                target: 'http://xxx.com/',
                changeOrigin: true
            }],
            openPage: ''
        };
        this.mockFolder = path.resolve(process.cwd(),'mock');
        this.mockDataRule = {};
        const fileWatcher = chokidar.watch(this.mockFolder, { ignoreInitial: true });
        fileWatcher.on('all', (event, file) => {
            console.log(chalk.yellow(`[${event}] ${file}, reload mock file`));
            this._createMock();
        });
        this.config = { ...defaultConfig, ...config };
        this._init();
        this.started = false;
    }
    _init() {
        const app = express();
        app.use(bodyParser.json());
        this.server = app;
        this._createMock();
        this._registerProxy();
    }
    _createMock(){
        const files = glob.sync(path.join(this.mockFolder,'**/*.js'));
        for(let file of files){
            delete require.cache[file];
            try {
                let mockFile = require(file);
                Object.keys(mockFile).forEach(url => {
                  this.mockDataRule[url.toLowerCase()] = mockFile[url];
                });
              } catch (e) {
                console.log(chalk.red(`error from ${file}: \n${e.message}`));
              }        
        }
    }
    _registerProxy() {
        const onProxyReq = (proxyReq, req, res) => {
            const {
                path: apiPath, query, method
            } = req;
            if (argv.mock) {
                const mockObj = this.mockDataRule[apiPath.toLowerCase()];
                let mockData = null;
                if (mockObj) {
                    console.log(chalk.blue(`${apiPath}use mock data\n`));
                    if (typeof (mockObj) === 'function') {
                        mockData = mockObj(method, query, req.body);
                    } else {
                        try {
                            JSON.stringify(mockObj);
                            mockData = mockObj;
                        } catch (e) {}
                    }
                }
                if (mockData) {
                    mockData.dataSource = 'by mock';
                    res.send(mockData);
                    return;
                }
            }
            const contentType = proxyReq.getHeader('Content-Type');
            const writeBody = bodyData => {
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            };
            // http-proxy-bugfix
            if (req.body && Object.keys(req.body).length > 0 && contentType && (contentType.indexOf('application/json') > -1 || contentType.indexOf('application/x-www-form-urlencoded') > -1)) {
                const bodyData = contentType.indexOf('application/json') > -1 ? JSON.stringify(req.body) : querystring.stringify(req.body);
                writeBody(bodyData);
            }
        };
        this.config.proxys.forEach(config => {
            const middlewareConfig = {}, exceptKey = ['path'];
            Object.keys(config).forEach(key => {
                if (exceptKey.indexOf(key) === -1)middlewareConfig[key] = config[key];
            });
            middlewareConfig.onProxyReq = onProxyReq;
            this.server.use(config.path, createProxyMiddleware({
                ...middlewareConfig
            }));
        });
    }

    _setStaticFile() {
        const { buildPath, publicPath } = this.config;
        this.server.use('/', express.static(buildPath));
        if (publicPath && !publicPath.startsWith('http') && publicPath !== '/') {
            this.server.use(publicPath, express.static(buildPath));
        }
        this.server.use('/**', (req, res) => {
            res.sendFile(`${buildPath}/index.html`, { maxAge: 0 });
        });
    }
    
    getConfig() {
        return this.config;
    }
    startByWebpack(compiler) {
        this.server.use('/**', (req, res, next) => {
            const filename = path.join(compiler.outputPath, 'index.html');
            compiler.outputFileSystem.readFile(filename, (err, result) => {
                if (err) {
                    return next();
                }
                res.set('content-type', 'text/html');
                res.send(result);
                res.end();
            });
        });
        compiler.hooks.done.tap("start server", () => { 
            if(!this.started)this.start(true);
        }) 
    }

    start(isMemeryFileSystem = false) {
        const { hostname, port: defaultPort, openPage } = this.config;
        if (!isMemeryFileSystem) this._setStaticFile();
        choosePort(hostname, defaultPort).then(newPort => {
            const host = `http://${hostname}:${newPort}`;
            const openUrl = `${host}/${openPage}`;
            if (!newPort) {
                clearConsole();
                console.log(chalk.red('No available ports'));
                process.exit(1);
            }
            this.server.listen(newPort, hostname, () => {
                this.started = true;
                console.log(chalk.green(`Server started,at:${host}`));
                console.log('\n');
                openBrowser(openUrl);
            });
        }).catch(e => { console.log(chalk.blue(e.message)); });
    }

    use(middleware) {
        return this.server.use(middleware);
    }
}

module.exports = CreateServer;
