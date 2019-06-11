interface Settings {
  [key: string]: {
    width: number,
    height: number
  }
}

export default {
  thumbnail: {
    width: 300,
    height: 200
  },

  mobile: {
    width: 650,
    height: 1000
  },

  desktop: {
    width: 1000,
    height: 1500
  },

  retina: {
    width: 2000,
    height: 3000
  }
} as Settings;
