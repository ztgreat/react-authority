import { checkPermissions } from './CheckPermissions.js';

const target = 'ok';
const error = 'error';

describe('Sysuser CheckPermissions', () => {
  it('Correct string Permission authentication', () => {
    expect(checkPermissions('user', 'user', target, error)).toEqual('ok');
  });
  it('Correct string Permission authentication', () => {
    expect(checkPermissions('user', 'NULL', target, error)).toEqual('error');
  });
  it('authority is undefined , return ok', () => {
    expect(checkPermissions(null, 'NULL', target, error)).toEqual('ok');
  });
  it('currentAuthority is undefined , return error', () => {
    expect(checkPermissions('admin', null, target, error)).toEqual('error');
  });
  it('Wrong string Permission authentication', () => {
    expect(checkPermissions('admin', 'user', target, error)).toEqual('error');
  });
  it('Correct Array Permission authentication', () => {
    expect(checkPermissions(['user', 'admin'], 'user', target, error)).toEqual('ok');
  });
  it('Wrong Array Permission authentication,currentAuthority error', () => {
    expect(checkPermissions(['user', 'admin'], 'user,admin', target, error)).toEqual('error');
  });
  it('Wrong Array Permission authentication', () => {
    expect(checkPermissions(['user', 'admin'], 'guest', target, error)).toEqual('error');
  });
  it('Wrong Function Permission authentication', () => {
    expect(checkPermissions(() => false, 'guest', target, error)).toEqual('error');
  });
  it('Correct Function Permission authentication', () => {
    expect(checkPermissions(() => true, 'guest', target, error)).toEqual('ok');
  });
});
