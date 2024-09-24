import { AnyFunction } from '@src/@types/anyFunction.js';
import logger from '@utils/logger.mjs';

interface IMeasurePerformanceOptions {
  functionName?: string;
}

const measurePerformance = <FunctionType extends AnyFunction>(
  callback: (
    ...args: Parameters<FunctionType>
  ) => ReturnType<FunctionType> | Promise<ReturnType<FunctionType>>,
  options?: IMeasurePerformanceOptions,
): ((
  ...args: Parameters<FunctionType>
) => ReturnType<FunctionType> | Promise<ReturnType<FunctionType>>) => {
  return function (...args: Parameters<FunctionType>) {
    const start = performance.now();

    const measure = () => {
      const end = performance.now();
      logger.info(`Function performance measurement:`, {
        functionName: options?.functionName,
        timeTakenMs: end - start,
      });
    };
    let result;
    try {
      result = callback(...args);
    } catch (e) {
      measure();
      throw e;
    }

    if (result instanceof Promise) {
      return result.finally(() => {
        measure();
      });
    }
    measure();
    return result;
  };
};

export default measurePerformance;
