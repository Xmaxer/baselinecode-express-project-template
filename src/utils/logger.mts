import { pino, TransportSingleOptions } from 'pino';

import Environment from '@utils/environment.mjs';

const transportTargets: Array<TransportSingleOptions> = [];

if (Environment.NODE_ENV === 'local') {
  transportTargets.push({
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  });
}

const logger = pino({
  transport: {
    targets: transportTargets,
  },
  mixin() {
    return { appName: 'ardra-auth-api' };
  },
  hooks: {
    logMethod(args, method, level) {
      if (args.length >= 2) {
        const arg1 = args.shift();
        const arg2 = args.shift();
        return method.apply(this, [arg2, arg1, ...args]);
      }
      return method.apply(this, args);
    },
  },
});

export default logger;
