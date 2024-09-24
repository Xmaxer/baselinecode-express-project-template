import { AnyFunction } from '@src/@types/anyFunction.js';
import measurePerformance from '@utils/wrappers/measurePerformance/measurePerformance.mjs';

const measurePerformanceAll = <T extends AnyFunction>(
  obj: Record<string, T>,
): Record<string, T> => {
  return Object.entries(obj).reduce((previousValue, [keyName, fn]) => {
    return {
      ...previousValue,
      [keyName]: measurePerformance(fn, { functionName: keyName }),
    };
  }, {});
};

export default measurePerformanceAll;
