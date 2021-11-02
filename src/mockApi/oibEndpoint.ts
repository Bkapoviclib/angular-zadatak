import {
  RequestInfo,
  ResponseOptions,
  STATUS,
} from 'angular-in-memory-web-api';
import { isOibValid } from '../app/validators/asyncOibValidator';

export function postToOibValidator(request: RequestInfo, data: any): any {
  let res = isOibValid(data);
  const options: ResponseOptions = {
    body: { res },
    status: STATUS.OK,
    headers: request.headers,
    url: request.url,
  };
  return options;
}
