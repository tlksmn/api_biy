export enum AuthRoute {
  path = 'auth',
  signIn = 'sign-in',
  signUp = 'sign-up',
  signOut = 'sign-out',
  me = 'me',
}
export enum SellerRoute {
  path = 'seller',
  add = 'add',
  update = 'update',
  getList = 'list',
  byId = ':sellerId',
  reintegrate = 'reintegrate',
  delete = 'delete',
}

export enum ProductRoute {
  path = 'product',
  update = 'update',
  getList = 'list',
}

export enum PointConfigRoute {
  path = 'point-config',
  update = 'update',
}

export enum RivalConfigRoute {
  path = 'rival-config',
  update = 'update',
}

export enum EventRoute {
  addSeller = 'add-seller',
  updateSeller = 'update-seller',
  reintegrateSeller = 'reintegrate-seller',
}

export enum FileRoute {
  path = 'file',
  xml = 'xml',
  xlsx = 'xlsx',
}

export enum ExtensionRoute {
  path = 'ext',
  list = 'list',
  activate = 'activate',
  update = 'update',
}

export enum AdminRoute {
  path = 'admin',
  list = 'list',
  update = 'update',
}
