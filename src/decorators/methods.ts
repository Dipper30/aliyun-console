import { ProcessEnv } from '@/types/store-action';
import { getEnv } from '@/utils';

/**
 * 输出api请求的返回结果
 * @param target 方法原型 Function.prototype
 * @param propertyName 方法名 === 'logdata'
 * @param propertyDescriptor 方法描述符 === Object.getOwnPropertyDescriptor(Function.prototype, 'logdata')
 * @returns propertyDescriptor
 */
export function logApiResult(

  target: any,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor,
): PropertyDescriptor {
  if (getEnv() === ProcessEnv.PRODUCTION) {
    return propertyDescriptor;
  }
  const method = propertyDescriptor.value;
  propertyDescriptor.value = async function(...args: any[]) {
    // 将方法参数列表转换为字符串
    const params = args.map((a) => JSON.stringify(a)).join();
    // 调用 method 并获取其返回值
    const result = await method.apply(this, args);
    // eslint-disable-next-line no-console
    console.log(`call ${propertyName} (${params}) `, result);
    // 返回调用函数的结果
    return result;
  };
  return propertyDescriptor;
}
