export enum HouseType {
  O = 'O',
  A = 'A',
  H = 'H',
  T = 'T'
}

export enum CleanType {
  일반 = '일반',
  특수 = '특수'
}

export interface Commission {
  commissionId: number;
  memberNick: string;
  size: number;
  houseType: HouseType;
  cleanType: CleanType;
  addressId: number;
  image: string;
  desiredDate: string;
  significant: string;
}
