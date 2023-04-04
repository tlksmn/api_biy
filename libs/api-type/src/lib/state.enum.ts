export enum StateE {
  ARCHIVE = 'ARCHIVE',
  PROCESSING = 'PROCESSING',
  EXPIRING = 'EXPIRING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE', // not work in request of all products only status
  DELIVERY = 'DELIVERY', // only for product delivery in global
}
