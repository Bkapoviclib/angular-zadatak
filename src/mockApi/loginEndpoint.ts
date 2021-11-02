import {
  RequestInfo,
  ResponseOptions,
  STATUS,
} from 'angular-in-memory-web-api';

export function postToLogin(request: RequestInfo, data: any): any {
  let dbRef: any = request.utils.getDb();

  let res: boolean;
  dbRef.userData.some(
    (user: any) =>
      (user.username == data.username && user.lozinka == data.lozinka) ||
      (data.username == 'admin' && data.lozinka == 'admin')
  )
    ? (res = true)
    : (res = false);
  console.log(res);

  //Body responsa vraća boolean
  const options: ResponseOptions = {
    body: { res },
    status: STATUS.OK,
    headers: request.headers,
    url: request.url,
  };

  return options;
}
