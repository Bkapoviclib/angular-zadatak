import { RequestInfo } from 'angular-in-memory-web-api';
import { postToLogin } from './loginEndpoint';
import { postToOibValidator } from './oibEndpoint';

export function checkEndpoint(request: RequestInfo): any {
  //Podatci iz requesta
  const endpoint: string = request.collectionName;
  const data: any = request.utils.getJsonBody(request.req);

  //poziva funkcije koje vraćaju options objekt koji služi za konstrukciju reponsea
  switch (endpoint) {
    case 'login':
      return postToLogin(request, data);

    case 'oibValidator':
      return postToOibValidator(request, data);

    default:
      return undefined;
  }
}
