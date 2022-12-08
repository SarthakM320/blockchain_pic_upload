//https://polygon-mumbai.g.alchemy.com/v2/qcYEtkOOgslq5LaGhjZApWgR8-4S0l7I

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity : '0.8.0',
  networks: {
    polygon:{
      url:'https://polygon-mumbai.g.alchemy.com/v2/qcYEtkOOgslq5LaGhjZApWgR8-4S0l7I',
      accounts: ['4494601945164a09f29d7ac6439361d012e57c66b6e8e61927e9dfc6ebaaa88c']
    }
  }
}