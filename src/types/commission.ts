export enum HouseType {
  APT = 'APT',
  OneRoom = 'OneRoom',
  House = 'House',
  Toilet = 'Toilet',
}

export enum CleanType {
  Normal = 'Normal',
  Special = 'Special'
}

export interface Commission {
  commissionId: number;
  memberNick: string;
  size: number | null;
  houseType: HouseType | '';
  cleanType: CleanType | '';
  addressId: number;
  image?: string;
  desiredDate: string;
  significant: string;
}
