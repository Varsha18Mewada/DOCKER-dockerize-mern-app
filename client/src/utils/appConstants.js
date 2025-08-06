export const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const nameRegex = /^[A-Z][a-zA-Z0-9-' ]{1,}$/;

export const ratingData = [
  {
    key: '★',
    value: 1,
  },
  {
    key: '★★',
    value: 2,
  },
  {
    key: '★★★',
    value: 3,
  },
  {
    key: '★★★★',
    value: 4,
  },
  {
    key: '★★★★★',
    value: 5,
  },
];

export const cookingTimeData = [
  {
    key: '<= 30 min',
    value: 30,
  },
  {
    key: '<= 60 min',
    value: 60,
  },
  {
    key: 'More than 60 min',
    value: 61,
  },
];
