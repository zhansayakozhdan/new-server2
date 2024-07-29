export const headerLinks = [
    {
      label: 'Главная',
      route: '/',
    },
    {
      label: 'Умный поиск',
      route: '/search',
    },
    {
      label: 'О нас',
      route: '#/about',
    },
  ]
  
  export const eventDefaultValues = {
    title: '',
    description: '',
    location: '',
    imageUrl: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: '',
    price: '',
    isFree: false,
    url: '',
  }