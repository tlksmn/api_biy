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
}
