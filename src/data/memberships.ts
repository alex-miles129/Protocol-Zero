export interface Membership {
  id: string;
  name: string;
  price: number;
  badgeIcon: string; // SVG path or component identifier
}

export const memberships: Membership[] = [
  {
    id: 'bronze',
    name: 'Bronze Membership',
    price: 1,
    badgeIcon: 'bronze',
  },
  {
    id: 'silver',
    name: 'Silver Membership',
    price: 723.89,
    badgeIcon: 'silver',
  },
  {
    id: 'gold',
    name: 'Gold Membership',
    price: 1033.87,
    badgeIcon: 'gold',
  },
  {
    id: 'platinum',
    name: 'Platinum Membership',
    price: 1551.70,
    badgeIcon: 'platinum',
  },
  {
    id: 'diamond',
    name: 'Diamond Membership',
    price: 2069.53,
    badgeIcon: 'diamond',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Membership',
    price: 5178.30,
    badgeIcon: 'ultimate',
  },
  {
    id: 'supreme',
    name: 'Supreme Membership',
    price: 10348.42,
    badgeIcon: 'supreme',
  },
];
