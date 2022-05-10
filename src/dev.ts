import express from 'express';
import {serve, build} from 'esbuild';
import path from "path";
import process from 'process'
import portfinder from 'portfinder'
import {createServer} from 'http';
import {createWebSocketServer} from './server'
import {style} from './styles';
import { getAppData } from './appData';
import { getRoutes } from './routes';

import {
    DEFAULT_ENTRY_POINT,
    DEFAULT_OUTDIR,
    DEFAULT_PLATFORM,
    DEFAULT_PORT,
    DEFAULT_HOST,
    DEFAULT_BUILD_PORT
} from './constants';

export const dev = async () => {
    const port = await portfinder.getPortPromise({
        port: DEFAULT_PORT,
    });
    // const build_port = await portfinder.getPortPromise({
    //     port: DEFAULT_BUILD_PORT,
    // });
    const cwd = process.cwd();
    const app = express();


    const esbuildOutput = path.resolve(cwd, DEFAULT_OUTDIR);

    // <link href="/${DEFAULT_OUTDIR}/index.css" rel="stylesheet"/>
    app.get('/', (_req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>hello</title>
        </head>
        <body>
            <div id="root">
                <span>loading...</span>
            </div>
            <script src="/${DEFAULT_OUTDIR}/index.js"></script>
            <script src="/moon/client.js"></script>
        </body>
        </html>
        `);
    });

    app.use(`/${DEFAULT_OUTDIR}`, express.static(esbuildOutput));
    app.use(`/moon`, express.static(path.resolve(__dirname, 'client')));

    const moonServer = createServer(app);

    const ws = createWebSocketServer(moonServer);

    function sendMessage(type: string, data?: any) {
        ws.send(JSON.stringify({type, data}));
    }

    moonServer.listen(port, async () => {
            console.log(`App listening at http://${DEFAULT_HOST}:${port}`)
            try {
                // const devServe = await serve({
                //     port: build_port,
                //     host: DEFAULT_HOST,
                //     servedir: DEFAULT_OUTDIR,
                //     onRequest: (args: ServeOnRequestArgs) => {
                //         // {
                //         //     method: 'GET',
                //         //     path: '/index.js',
                //         //     remoteAddress: '127.0.0.1:55868',
                //         //     status: 200,
                //         //     timeInMS: 30
                //         // }
                //         if (args.timeInMS) {
                //             console.log(
                //                 `${args.method}: ${args.path} ${args.timeInMS} ms`
                //             );
                //         }
                //     },
                // }, {
                //     format: 'iife',
                //     logLevel: 'error',
                //     outdir: DEFAULT_OUTDIR,
                //     platform: DEFAULT_PLATFORM,
                //     bundle: true,
                //     define: {
                //         'process.env.NODE_ENV': JSON.stringify('development'),
                //     },
                //     entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
                // });
                // process.on('SIGINT', () => {
                //     devServe.stop();
                //     process.exit(0);
                // });
                // process.on('SIGTERM', () => {
                //     devServe.stop();
                //     process.exit(1);
                // });

                // 获取项目元信息
                const appData = await getAppData({
                    cwd
                });

                console.log(appData)
                // 获取 routes 配置
                const routes = await getRoutes({ appData });

                console.log(JSON.stringify(routes))


                await build({
                        format: 'iife',
                        logLevel: 'error',
                        outdir: esbuildOutput,
                        platform: DEFAULT_PLATFORM,
                        bundle: true,
                        watch: {
                            onRebuild: (err, res) => {
                                if (err) {
                                    console.error(JSON.stringify(err));
                                    return;
                                }
                                sendMessage('reload')
                            }
                        },
                        define: {
                            'process.env.NODE_ENV': JSON.stringify('development'),
                        },
                        external: ['esbuild'],
                        plugins: [style()],
                        entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
                    }
                )
            } catch
                (e) {
                console.log(e);
                process.exit(1);
            }
        }
    );

}
